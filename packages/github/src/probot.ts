import * as probot from 'probot';
import * as getGithubConfig from 'probot-config';
import {buildSchema, Source} from 'graphql';
import {Change, CriticalityLevel} from '@graphql-inspector/core';

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

    try {
      if (!result) {
        throw new Error(`No result :(`);
      }

      if (result.data) {
        return result.data.repository.object.text;
      }

      return (result as any).repository.object.text;
    } catch (error) {
      console.log(result);
      console.error(error);
      throw new Error(`Failed to load '${file.path}' (ref: ${file.ref})`);
    }
  };
}

export interface SchemaPointer {
  ref: string;
  path: string;
}

export default function handleProbot(app: probot.Application) {
  app.on('check_run', async (context) => {
    const ref = context.payload.check_run.head_sha;
    const action = context.payload.action;
    const {owner, repo} = context.repo();

    await handleAction({context, owner, repo, ref, action});
  });

  app.on('check_suite', async (context) => {
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

  const sources = {
    old: new Source(await loadFile(oldPointer)),
    new: new Source(await loadFile(newPointer)),
  };
  const schemas = {
    old: buildSchema(sources.old),
    new: buildSchema(sources.new),
  };

  context.log.info(`Both schemas built - ${id}`);

  const actions: Array<Promise<ActionResult>> = [];

  if (config.diff) {
    actions.push(
      diff({
        path: config.schema.path,
        schemas,
        sources,
      }),
    );
  }

  const results = await Promise.all(actions);

  context.log.info(`Actions (${actions.length}) are ready - ${id}`);

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
      `Thank you for using [GraphQL Inspector](https://graphql-inspector.com/). If you like it, [consider supporting the project](https://github.com/sponsors/kamilkisiela).`,
    ].join('\n'),
  );

  const title =
    conclusion === CheckConclusion.Failure
      ? 'Something is wrong with your schema'
      : 'Everything looks good';

  context.log.info(`Sending annotations (${annotations.length})`);

  await check.annotations({
    url,
    context,
    title,
    summary: summary.join('\n'),
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
    const yamlConfig: Config | undefined = await loadGithubConfig(
      identifier + '.yaml',
    );
    const ymlConfig: Config | undefined = await loadGithubConfig(
      identifier + '.yml',
    );

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

  function loadGithubConfig(identifier: string) {
    const loader: any = getGithubConfig;

    if (typeof loader !== 'function' && typeof loader.default !== 'undefined') {
      loader.default(context, identifier);
    }

    return loader(context, identifier);
  }
}

function bolderize(msg: string): string {
  const findSingleQuotes = /\'([^']+)\'/gim;
  const findDoubleQuotes = /\"([^"]+)\"/gim;

  return msg
    .replace(findSingleQuotes, (_: string, value: string) => `**${value}**`)
    .replace(findDoubleQuotes, (_: string, value: string) => `**${value}**`);
}
