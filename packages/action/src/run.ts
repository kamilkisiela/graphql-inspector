import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { extname,resolve } from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  CheckConclusion,
  createSummary,
  diff,
  printSchemaFromEndpoint,
  produceSchema,
} from '@graphql-inspector/github';
import { buildClientSchema, buildSchema, GraphQLSchema, printSchema,Source } from 'graphql';
import { batch } from './utils';

type OctokitInstance = ReturnType<typeof github.getOctokit>;
const CHECK_NAME = 'GraphQL Inspector';

function getCurrentCommitSha() {
  const sha = execSync(`git rev-parse HEAD`).toString().trim();

  try {
    const msg = execSync(`git show ${sha} -s --format=%s`).toString().trim();
    const PR_MSG = /Merge (\w+) into \w+/i;

    if (PR_MSG.test(msg)) {
      const result = PR_MSG.exec(msg);

      if (result) {
        return result[1];
      }
    }
  } catch (e) {
    //
  }

  return sha;
}

async function getAssociatedPullRequest(octokit: OctokitInstance, commitSha: string) {
  const result = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
    ...github.context.repo,
    commit_sha: commitSha,
    mediaType: {
      format: 'json',
      previews: ['groot'],
    }
  })
  return result.data.length > 0 ? result.data[0] : null
}

export async function run() {
  core.info(`GraphQL Inspector started`);

  // env
  let ref = process.env.GITHUB_SHA!;
  const commitSha = getCurrentCommitSha();

  core.info(`Ref: ${ref}`);
  core.info(`Commit SHA: ${commitSha}`);

  const token = core.getInput('github-token', { required: true });
  const checkName = core.getInput('name') || CHECK_NAME;

  let workspace = process.env.GITHUB_WORKSPACE;

  if (!workspace) {
    return core.setFailed(
      'Failed to resolve workspace directory. GITHUB_WORKSPACE is missing',
    );
  }

  const useMerge = castToBoolean(core.getInput('experimental_merge'), true);
  const useAnnotations = castToBoolean(core.getInput('annotations'));
  const failOnBreaking = castToBoolean(core.getInput('fail-on-breaking'));
  const endpoint: string = core.getInput('endpoint');
  const approveLabel: string =
    core.getInput('approve-label') || 'approved-breaking-change';

  const octokit = github.getOctokit(token);

  // repo
  const { owner, repo } = github.context.repo;

  // pull request
  const pullRequest = await getAssociatedPullRequest(octokit, commitSha)

  core.info(`Creating a check named "${checkName}"`);

  const check = await octokit.checks.create({
    owner,
    repo,
    name: checkName,
    head_sha: commitSha,
    status: 'in_progress',
  });

  const checkId = check.data.id;

  core.info(`Check ID: ${checkId}`);

  const schemaPointer = core.getInput('schema', { required: true });

  const loadFile = fileLoader({
    octokit,
    owner,
    repo,
  });

  if (!schemaPointer) {
    core.error('No `schema` variable');
    return core.setFailed('Failed to find `schema` variable');
  }

  let [schemaRef, schemaPath] = schemaPointer.split(':');

  if (useMerge && pullRequest?.state == 'open') {
    ref = `refs/pull/${pullRequest.number}/merge`;
    workspace = undefined;
    core.info(`EXPERIMENTAL - Using Pull Request ${ref}`);

    const baseRef = pullRequest.base?.ref;

    if (baseRef) {
      schemaRef = baseRef;
      core.info(`EXPERIMENTAL - Using ${baseRef} as base schema ref`);
    }
  }

  if (endpoint) {
    schemaPath = schemaPointer;
  }

  const isNewSchemaUrl = endpoint && schemaPath.startsWith('http');

  const [oldFile, newFile] = await Promise.all([
    endpoint
      ? printSchemaFromEndpoint(endpoint)
      : loadFile({
          ref: schemaRef,
          path: schemaPath,
        }),
    isNewSchemaUrl
      ? printSchemaFromEndpoint(schemaPath)
      : loadFile({
          path: schemaPath,
          ref,
          workspace,
        }),
  ]);

  core.info('Got both sources');

  let oldSchema: GraphQLSchema;
  let newSchema: GraphQLSchema;
  let sources: { new: Source; old: Source };

  if (extname(schemaPath.toLowerCase()) === ".json") {
    oldSchema = endpoint ? buildSchema(oldFile) : buildClientSchema(JSON.parse(oldFile));
    newSchema = buildClientSchema(JSON.parse(newFile));

    sources = {
      old: new Source(
        printSchema(oldSchema),
        endpoint || `${schemaRef}:${schemaPath}`,
      ),
      new: new Source(printSchema(newSchema), schemaPath),
    };
  } else {
    sources = {
      old: new Source(oldFile, endpoint || `${schemaRef}:${schemaPath}`),
      new: new Source(newFile, schemaPath),
    };

    oldSchema = produceSchema(sources.old);
    newSchema = produceSchema(sources.new);
  }

  const schemas = {
    old: oldSchema,
    new: newSchema,
  };

  core.info(`Built both schemas`);

  core.info(`Start comparing schemas`);

  const action = await diff({
    path: schemaPath,
    schemas,
    sources,
  });

  let conclusion = action.conclusion;
  let annotations = action.annotations || [];
  const changes = action.changes || [];

  core.setOutput('changes', String(changes.length || 0));
  core.info(`Changes: ${changes.length || 0}`);

  const hasApprovedBreakingChangeLabel = pullRequest?.labels?.some(
    (label: any) => label.name === approveLabel,
  );

  // Force Success when failOnBreaking is disabled
  if (
    (failOnBreaking === false || hasApprovedBreakingChangeLabel) &&
    conclusion === CheckConclusion.Failure
  ) {
    core.info('FailOnBreaking disabled. Forcing SUCCESS');
    conclusion = CheckConclusion.Success;
  }

  if (useAnnotations === false || isNewSchemaUrl) {
    core.info(`Anotations are disabled. Skipping annotations...`);
    annotations = [];
  }

  const summary = createSummary(changes, 100, false);

  const title =
    conclusion === CheckConclusion.Failure
      ? 'Something is wrong with your schema'
      : 'Everything looks good';

  core.info(`Conclusion: ${conclusion}`);

  try {
    return await updateCheckRun(octokit, checkId, {
      conclusion,
      output: { title, summary, annotations },
    });
  } catch (e: any) {
    // Error
    core.error(e.message || e);

    const title = 'Invalid config. Failed to add annotation';

    await updateCheckRun(octokit, checkId, {
      conclusion: CheckConclusion.Failure,
      output: { title, summary: title, annotations: [] },
    });

    return core.setFailed(title);
  }
}

function fileLoader({
  octokit,
  owner,
  repo,
}: {
  octokit: OctokitInstance;
  owner: string;
  repo: string;
}) {
  const query = /* GraphQL */ `
    query GetFile($repo: String!, $owner: String!, $expression: String!) {
      repository(name: $repo, owner: $owner) {
        object(expression: $expression) {
          ... on Blob {
            isTruncated
            oid
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
      return readFileSync(resolve(file.workspace, file.path), 'utf8');
    }
    const result: any = await octokit.graphql(query, {
      repo,
      owner,
      expression: `${file.ref}:${file.path}`,
    });
    core.info(`Query ${file.ref}:${file.path} from ${owner}/${repo}`);

    try {
      if (result?.repository?.object?.oid && result?.repository?.object?.isTruncated) {
        const oid = result?.repository?.object?.oid
        const getBlobResponse = await octokit.git.getBlob({
          owner,
          repo,
          file_sha: oid,
        });

        if(getBlobResponse?.data?.content) {
          return Buffer.from(getBlobResponse?.data?.content, 'base64').toString('utf-8')
        }

        throw new Error('getBlobResponse.data.content is null');
      }

      if (
        result?.repository?.object?.text
      ) {
        if(result?.repository?.object?.isTruncated === false) {
          return result.repository.object.text;
        }

        throw new Error('result.repository.object.text is truncated and oid is null');
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
  Pick<
    NonNullable<Parameters<OctokitInstance['checks']['update']>[0]>,
    'conclusion' | 'output'
  >
>;

async function updateCheckRun(
  octokit: OctokitInstance,
  checkId: number,
  { conclusion, output }: UpdateCheckRunOptions | any,
) {
  core.info(`Updating check: ${checkId}`);

  const { title, summary, annotations = [] } = output;
  const batches = batch(annotations, 50);

  core.info(`annotations to be sent: ${annotations.length}`);

  await octokit.checks.update({
    check_run_id: checkId,
    completed_at: new Date().toISOString(),
    status: 'completed',
    ...github.context.repo,
    conclusion,
    output: {
      title,
      summary,
    },
  });

  try {
    await Promise.all(
      batches.map(async (chunk) => {
        await octokit.checks.update({
          check_run_id: checkId,
          ...github.context.repo,
          output: {
            title,
            summary,
            annotations: chunk,
          },
        } as any);
        core.info(`annotations sent (${chunk.length})`);
      }),
    );
  } catch (error) {
    core.error(`failed to send annotations: ${error}`);
    throw error;
  }

  // Fail
  if (conclusion === CheckConclusion.Failure) {
    return core.setFailed(output.title!);
  }

  // Success or Neutral
}

/**
 * Treats non-falsy value as true
 */
function castToBoolean(
  value: string | boolean,
  defaultValue?: boolean,
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true' || value === 'false') {
    return value === 'true';
  }

  if (typeof defaultValue === 'boolean') {
    return defaultValue;
  }

  return true;
}
