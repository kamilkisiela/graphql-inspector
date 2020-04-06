import {
  ActionResult,
  CheckConclusion,
  Annotation,
  diff,
} from '@graphql-inspector/github';
import {buildSchema, Source} from 'graphql';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';
import {Change, CriticalityLevel} from '@graphql-inspector/core';

const CHECK_NAME = 'GraphQL Inspector';

export async function run() {
  core.info(`GraphQL Inspector started`);

  // env
  const ref = process.env.GITHUB_SHA!;

  //
  // env:
  //   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  //
  const token = core.getInput('github-token') || process.env.GITHUB_TOKEN;

  if (!token) {
    return core.setFailed('Github Token is missing');
  }

  const workspace = process.env.GITHUB_WORKSPACE!;

  if (!workspace) {
    return core.setFailed(
      'Failed to resolve workspace directory. GITHUB_WORKSPACE is missing',
    );
  }

  const octokit = new github.GitHub(token);

  // repo
  const {owner, repo} = github.context.repo;

  const check = await octokit.checks.create({
    owner,
    repo,
    name: CHECK_NAME,
    head_sha: github.context.sha,
    status: 'in_progress',
  });
  const checkId = check.data.id;

  const loadFile = fileLoader({
    octokit,
    owner,
    repo,
  });

  const schemaPointer = core.getInput('schema', {required: true});

  if (!schemaPointer) {
    core.error('No `schema` variable');
    return core.setFailed('Failed to find `schema` variable');
  }

  const [schemaRef, schemaPath] = schemaPointer.split(':');

  const oldPointer = {
    ref: schemaRef,
    path: schemaPath,
  };
  const newPointer = {
    path: oldPointer.path,
    ref,
    workspace,
  };

  const sources = {
    old: new Source(await loadFile(oldPointer)),
    new: new Source(await loadFile(newPointer)),
  };
  const schemas = {
    old: buildSchema(sources.old),
    new: buildSchema(sources.new),
  };

  core.info(`Both schemas built`);

  const actions: Array<Promise<ActionResult>> = [];

  core.info(`Start comparing schemas`);
  actions.push(
    diff({
      path: schemaPath,
      schemas,
      sources,
    }),
  );

  const results = await Promise.all(actions);

  const conclusion = results.some(
    (action) => action.conclusion === CheckConclusion.Failure,
  )
    ? CheckConclusion.Failure
    : CheckConclusion.Success;

  const annotations = results.reduce<Annotation[]>((annotations, action) => {
    if (action.annotations) {
      return annotations.concat(action.annotations);
    }

    return annotations;
  }, []);

  const changes = results.reduce<Change[]>(
    (arr, annotation) =>
      annotation.changes ? arr.concat(annotation.changes) : arr,
    [],
  );

  core.setOutput('changes', `${changes.length || 0}`);

  const breakingChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.Breaking,
  );
  const dangerousChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.Dangerous,
  );
  const safeChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.NonBreaking,
  );

  const summary: string[] = [
    `# Found ${annotations.length} change${annotations.length > 1 ? 's' : ''}`,
    '',
    `Breaking: ${breakingChanges.length}`,
    `Dangerous: ${dangerousChanges.length}`,
    `Safe: ${safeChanges.length}`,
  ];

  function addChangesToSummary(type: string, changes: Change[]): void {
    summary.push(
      ...['', `## ${type} changes`].concat(
        changes.map((change) => ` - ${bolderize(change.message)}`),
      ),
    );
  }

  if (breakingChanges.length) {
    addChangesToSummary('Breaking', breakingChanges);
  }

  if (dangerousChanges.length) {
    addChangesToSummary('Dangerous', dangerousChanges);
  }

  if (safeChanges.length) {
    addChangesToSummary('Safe', safeChanges);
  }

  summary.push(
    [
      '',
      '___',
      `Thank you for using [GraphQL Inspector](https://graphql-inspector.com/)`,
    ].join('\n'),
  );

  const title =
    conclusion === CheckConclusion.Failure
      ? 'Something is wrong with your schema'
      : 'Everything looks good';

  try {
    await updateCheckRun(octokit, checkId, {
      conclusion,
      output: {title, summary: summary.join('\n'), annotations},
    });
  } catch (e) {
    // Error
    core.error(e.message || e);
    return core.setFailed('Invalid config. Failed to add annotation');
  }
}

function fileLoader({
  octokit,
  owner,
  repo,
}: {
  octokit: github.GitHub;
  owner: string;
  repo: string;
}) {
  const query = `
    query GetFile($repo: String!, $owner: String!, $expression: String!) {
      repository(name: $repo, owner: $owner) {
        object(expression: $expression) {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  return async function loadFile(file: {
    ref: string;
    path: string;
    workspace?: string;
  }): Promise<string> {
    if (file.workspace) {
      return readFileSync(resolve(file.workspace, file.path), {
        encoding: 'utf-8',
      });
    }

    const result = await octokit.graphql(query, {
      repo,
      owner,
      expression: `${file.ref}:${file.path}`,
    });
    core.info(`Query ${file.ref}:${file.path} from ${owner}/${repo}`);

    try {
      if (
        result &&
        result.repository &&
        result.repository.object &&
        result.repository.object.text
      ) {
        return result.repository.object.text;
      }

      throw new Error('result.repository.object.text is null');
    } catch (error) {
      console.log(result);
      console.error(error);
      throw new Error(`Failed to load '${file.path}' (ref: ${file.ref})`);
    }
  };
}

type UpdateCheckRunOptions = Required<
  Pick<Octokit.ChecksUpdateParams, 'conclusion' | 'output'>
>;
async function updateCheckRun(
  octokit: github.GitHub,
  checkId: number,
  {conclusion, output}: UpdateCheckRunOptions,
) {
  await octokit.checks.update({
    check_run_id: checkId,
    completed_at: new Date().toISOString(),
    status: 'completed',
    ...github.context.repo,
    conclusion,
    output,
  });

  // Fail
  if (conclusion === CheckConclusion.Failure) {
    return core.setFailed(output.title!);
  }

  // Success or Neutral
}

function bolderize(msg: string): string {
  const findSingleQuotes = /\'([^']+)\'/gim;
  const findDoubleQuotes = /\"([^"]+)\"/gim;

  return msg
    .replace(findSingleQuotes, (_: string, value: string) => `**${value}**`)
    .replace(findDoubleQuotes, (_: string, value: string) => `**${value}**`);
}
