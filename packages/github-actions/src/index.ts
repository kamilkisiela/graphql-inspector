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
      await tools.github.checks.create(
        tools.context.repo({
          name: 'GraphQL Inspector',
          head_sha: tools.context.sha,
          conclusion: conclusion,
          completed_at: new Date().toISOString(),
          output: {
            title,
            summary,
            annotations: annotations,
          },
        }),
      );

      // Fail
      if (conclusion === CheckConclusion.Failure) {
        tools.log.fatal(title);
        return tools.exit.failure(title);
      }

      // Success or Neutral
      tools.log.success(title);
      return tools.exit.success(title);
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
