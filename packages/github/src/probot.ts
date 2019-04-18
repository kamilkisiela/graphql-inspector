import * as probot from 'probot';
import * as getGithubConfig from 'probot-config';
import {buildSchema} from 'graphql';

import {CheckConclusion, ActionResult, Annotation} from './types';
import {diff} from './diff';
import * as check from './check-runs';

export interface Config {
  diff?: boolean;
  // similar?: boolean;
  // coverage?: boolean;
  schema: SchemaPointer;
}

interface FileInfo {
  ref: string;
  path: string;
}

function fileLoader({
  context,
  owner,
  repo,
}: {
  context: probot.Context;
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

  return async function loadFile(file: FileInfo): Promise<string> {
    const result = await context.github.graphql(query, {
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

export interface SchemaPointer {
  ref: string;
  path: string;
}

export default function handleProbot(app: probot.Application) {
  app.on('check_run', async context => {
    const ref = context.payload.check_run.head_sha;
    const action = context.payload.action;
    const {owner, repo} = context.repo();

    await handleAction({context, owner, repo, ref, action});
  });

  app.on('check_suite', async context => {
    const ref = context.payload.check_suite.head_sha;
    const action = context.payload.action;
    const {owner, repo} = context.repo();

    await handleAction({context, owner, repo, ref, action});
  });
}

export async function handleAction({
  context,
  owner,
  repo,
  ref,
  action,
}: {
  context: probot.Context;
  owner: string;
  repo: string;
  ref: string;
  action: string;
}) {
  if (['requested', 'rerequested', 'gh-action'].indexOf(action) === -1) {
    return;
  }

  const id = `${owner}/${repo}#${ref}`;

  context.log.info(`GraphQL Inspector started (action: ${action}) - ${id}`);

  const loadFile = fileLoader({
    context,
    owner,
    repo,
  });

  const url = await check.start({
    context,
    owner,
    repo,
    sha: ref,
  });

  const config = await loadConfig();

  if (!config) {
    context.log.error(`No config file - ${id}`);
    await check.complete({
      url,
      context,
      conclusion: CheckConclusion.Failure,
    });
    return;
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

  context.log.info(`Both schemas built - ${id}`);

  const actions: Array<Promise<ActionResult>> = [];

  if (config.diff) {
    actions.push(
      diff({
        path: config.schema.path,
        schemas,
      }),
    );
  }

  const results = await Promise.all(actions);

  context.log.info(`Actions (${actions.length}) are ready - ${id}`);

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

  context.log.info(`Sending annotations (${annotations.length})`);

  await check.annotations({
    url,
    context,
    title,
    summary,
    annotations,
  });

  context.log.info(`Finishing check (${conclusion})`);

  await check.complete({
    url,
    context,
    conclusion,
  });

  context.log.info(`Completed`);

  async function loadConfig(): Promise<Config | undefined> {
    const identifier = 'graphql-inspector';
    const yamlConfig = await getGithubConfig(context, identifier + '.yaml');
    const ymlConfig = await getGithubConfig(context, identifier + '.yml');

    if (yamlConfig || ymlConfig) {
      return yamlConfig || ymlConfig;
    } else {
      const pkg = JSON.parse(
        await loadFile({
          ref,
          path: 'package.json',
        }),
      );

      if (pkg[identifier]) {
        return pkg[identifier];
      }
    }
  }
}
