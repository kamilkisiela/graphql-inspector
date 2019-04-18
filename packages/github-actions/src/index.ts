#!/usr/bin/env node

import {Config, SchemaPointer} from '@graphql-inspector/github/dist/probot';
import {
  ActionResult,
  CheckConclusion,
  Annotation,
} from '@graphql-inspector/github/dist/types';
import {diff} from '@graphql-inspector/github/dist/diff';
import {buildSchema} from 'graphql';
import {safeLoad} from 'js-yaml';

import {Toolkit} from 'actions-toolkit';
import {ChecksUpdateParams} from '@octokit/rest';

const identifier = 'graphql-inspector';

Toolkit.run(
  async tools => {
    tools.log.info(`GraphQL Inspector started`);

    // env
    const ref = process.env.GITHUB_SHA!;

    // repo
    const {owner, repo} = tools.context.repo();

    const loadFile = fileLoader({
      tools,
      owner,
      repo,
    });

    // config
    const config = await loadConfig(tools, loadFile);

    if (!config) {
      tools.log.fatal(`No config file`);
      return tools.exit.failure('Failed to find any config file');
    }

    const oldPointer: SchemaPointer = config.schema;
    const newPointer: SchemaPointer = {
      path: oldPointer.path,
      ref,
    };

    const schemas = {
      old: buildSchema(await loadFile(oldPointer)),
      new: buildSchema(await loadFile(newPointer)),
    };

    tools.log.info(`Both schemas built`);

    const actions: Array<Promise<ActionResult>> = [];

    if (config.diff) {
      tools.log.info(`Start comparing schemas`);
      actions.push(
        diff({
          path: config.schema.path,
          schemas,
        }),
      );
    }

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
      await updateCheckRun(tools, {
        conclusion,
        output: {title, summary, annotations},
      });
    } catch (e) {
      // Error
      tools.log.fatal(new Error(e));
      return tools.exit.failure('Invalid config. Failed to add annotation');
    }
  },
  {event: ['pull_request', 'push']},
);

async function loadConfig(
  tools: Toolkit,
  loadFile: (file: {ref: string; path: string}) => Promise<string>,
): Promise<Config | undefined> {
  const base = '.github';
  const ref = process.env.GITHUB_SHA!;

  try {
    const text = await loadFile({ref, path: `${base}/${identifier}.yaml`});
    return safeLoad(text);
  } catch (e) {
    tools.log.info(`Failed to find .github/${identifier}.yaml file`);
  }

  try {
    const text = await loadFile({ref, path: `${base}/${identifier}.yml`});
    return safeLoad(text);
  } catch (e) {
    tools.log.info(`Failed to find .github/${identifier}.yml file`);
  }

  try {
    const pkg: any = tools.getPackageJSON();

    if (pkg[identifier]) {
      return pkg[identifier];
    }
  } catch (e) {
    tools.log.info(`Failed to find package.json`);
  }
}

function fileLoader({
  tools,
  owner,
  repo,
}: {
  tools: Toolkit;
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
    const result = await tools.github.graphql(query, {
      repo,
      owner,
      expression: `${file.ref}:${file.path}`,
    });

    if (result.data) {
      return result.data.repository.object.text;
    }

    return (result as any).repository.object.text;
  };
}

type UpdateCheckRunOptions = Required<
  Pick<ChecksUpdateParams, 'conclusion' | 'output'>
>;
async function updateCheckRun(
  tools: Toolkit,
  {conclusion, output}: UpdateCheckRunOptions,
) {
  const checkName = process.env.GITHUB_ACTION!;

  const response = await tools.github.checks.listForRef({
    check_name: checkName,
    status: 'in_progress' as 'in_progress',
    ref: tools.context.ref,
    ...tools.context.repo(),
  });

  const check = response.data.check_runs.find(
    check => check.name === checkName,
  )!;

  await tools.github.checks.update({
    check_run_id: check.id,
    completed_at: new Date().toISOString(),
    status: 'completed',
    ...tools.context.repo(),
    conclusion,
    output,
  });

  // Fail
  if (conclusion === CheckConclusion.Failure) {
    return tools.exit.failure(output.title);
  }

  // Success or Neutral
  return tools.exit.success(output.title);
}
