import {SchemaPointer} from '@graphql-inspector/github/dist/probot';
import {
  ActionResult,
  CheckConclusion,
  Annotation,
} from '@graphql-inspector/github/dist/types';
import {diff} from '@graphql-inspector/github/dist/diff';
import {buildSchema} from 'graphql';

import * as core from '@actions/core';
import * as github from '@actions/github';
import {ChecksUpdateParams} from '@octokit/rest';

const CHECK_NAME = 'GraphQL Inspector';

export async function run() {
  core.info(`GraphQL Inspector started`);

  // env
  const ref = process.env.GITHUB_SHA!;

  //
  // env:
  //   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  //
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return core.setFailed('Env GITHUB_TOKEN is missing');
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

  const oldPointer: SchemaPointer = {
    ref: schemaRef,
    path: schemaPath,
  };
  const newPointer: SchemaPointer = {
    path: oldPointer.path,
    ref,
  };

  const schemas = {
    old: buildSchema(await loadFile(oldPointer)),
    new: buildSchema(await loadFile(newPointer)),
  };

  core.info(`Both schemas built`);

  const actions: Array<Promise<ActionResult>> = [];

  core.info(`Start comparing schemas`);
  actions.push(
    diff({
      path: schemaPath,
      schemas,
    }),
  );

  const results = await Promise.all(actions);

  const conclusion = results.some(
    action => action.conclusion === CheckConclusion.Failure,
  )
    ? CheckConclusion.Failure
    : CheckConclusion.Success;

  const annotations = results.reduce<Annotation[]>((annotations, action) => {
    if (action.annotations) {
      return annotations.concat(action.annotations);
    }

    return annotations;
  }, []);

  const issueInfo = `Found ${annotations.length} issue${
    annotations.length > 1 ? 's' : ''
  }`;

  const {title, summary} =
    conclusion === CheckConclusion.Failure
      ? {
          title: `Something is wrong with your schema`,
          summary: issueInfo,
        }
      : {
          title: 'Everything looks good',
          summary: issueInfo,
        };

  try {
    await updateCheckRun(octokit, checkId, {
      conclusion,
      output: {title, summary, annotations},
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
  }): Promise<string> {
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
  Pick<ChecksUpdateParams, 'conclusion' | 'output'>
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
