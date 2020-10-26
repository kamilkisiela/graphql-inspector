import {
  createCommand,
  ensureAbsolute,
  parseGlobalArgs,
  GlobalArgs,
  CommandFactory,
} from '@graphql-inspector/commands';
import {symbols, Logger, bolderize} from '@graphql-inspector/logger';
import {
  diff as diffSchema,
  CriticalityLevel,
  Change,
  DiffRule,
  Rule,
  CompletionHandler,
  CompletionArgs,
} from '@graphql-inspector/core';
import {existsSync} from 'fs';
import {GraphQLSchema} from 'graphql';
import {mergeSchemas} from '@graphql-tools/merge';
import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import path from 'path';

export {CommandFactory};

export function handler(input: {
  oldSchema: GraphQLSchema;
  newSchema: GraphQLSchema;
  rules?: Array<string | number>;
  visual?: boolean;
  port?: number;
  onComplete?: string;
}) {
  const onComplete = input.onComplete
    ? resolveCompletionHandler(input.onComplete)
    : failOnBreakingChanges;

  const rules = input.rules
    ? input.rules
        .filter(isString)
        .map(
          (name): Rule => {
            const rule = resolveRule(name);

            if (!rule) {
              throw new Error(`\Rule '${name}' does not exist!\n`);
            }

            return rule;
          },
        )
        .filter((f) => f)
    : [];

  const changes = diffSchema(input.oldSchema, input.newSchema, rules);

  if (changes.length === 0) {
    Logger.success('No changes detected');
    return;
  }

  Logger.log(
    `\nDetected the following changes (${changes.length}) between schemas:\n`,
  );

  const breakingChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.Breaking,
  );
  const dangerousChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.Dangerous,
  );
  const nonBreakingChanges = changes.filter(
    (change) => change.criticality.level === CriticalityLevel.NonBreaking,
  );

  if (breakingChanges.length) {
    reportBreakingChanges(breakingChanges);
  }

  if (dangerousChanges.length) {
    reportDangerousChanges(dangerousChanges);
  }

  if (nonBreakingChanges.length) {
    reportNonBreakingChanges(nonBreakingChanges);
  }

  onComplete(
    {breakingChanges, dangerousChanges, nonBreakingChanges},
    input.visual,
  );

  if (input.visual) {
    const schema = mergeSchemas({
      schemas: [input.oldSchema, input.newSchema],
      onFieldTypeConflict: (_, right) => right,
    });

    const app = express();
    app.set('json spaces', 2);
    app.use('/graphql', graphqlHTTP({schema}));
    app.get('/changes', (_, res) => res.status(200).json(changes));
    app.use('/voyager', express.static(path.join(__dirname, 'static')));
    app.listen(input.port);

    Logger.log(`\nJSON Diff:\thttp://localhost:${input.port}/changes`);

    Logger.log(`Visual Diff:\thttp://localhost:${input.port}/voyager`);
  }
}

export default createCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
    visual?: boolean;
    port?: number;
    onComplete?: string;
  } & GlobalArgs
>((api) => {
  const {loaders} = api;

  return {
    command: 'diff <oldSchema> <newSchema>',
    describe: 'Compare two GraphQL Schemas',
    builder(yargs) {
      return yargs
        .positional('oldSchema', {
          describe: 'Point to an old schema',
          type: 'string',
          demandOption: true,
        })
        .positional('newSchema', {
          describe: 'Point to a new schema',
          type: 'string',
          demandOption: true,
        })
        .options({
          rule: {
            describe: 'Add rules',
            array: true,
          },
          visual: {
            describe: 'Enable visual diff',
            type: 'boolean',
          },
          port: {
            alias: 'p',
            describe: 'Port',
            type: 'number',
            default: 4000,
          },
          onComplete: {
            describe: 'Handle Completion',
            type: 'string',
          },
        });
    },
    async handler(args) {
      try {
        const oldSchemaPointer = args.oldSchema;
        const newSchemaPointer = args.newSchema;
        const apolloFederation = args.federation || false;
        const {headers, token} = parseGlobalArgs(args);

        const oldSchema = await loaders.loadSchema(
          oldSchemaPointer,
          {
            headers,
            token,
          },
          apolloFederation,
        );
        const newSchema = await loaders.loadSchema(
          newSchemaPointer,
          {
            headers,
            token,
          },
          apolloFederation,
        );

        handler({
          oldSchema,
          newSchema,
          rules: args.rule,
          visual: args.visual,
          port: args.port,
          onComplete: args.onComplete,
        });
      } catch (error) {
        Logger.error(error);
        throw error;
      }
    },
  };
});

function sortChanges(changes: Change[]) {
  return changes.slice().sort((a, b) => {
    const aPath = a.path || '';
    const bPath = b.path || '';

    if (aPath > bPath) {
      return 1;
    }

    if (bPath > aPath) {
      return -1;
    }

    return 0;
  });
}

function reportBreakingChanges(changes: Change[]) {
  const label = symbols.error;
  const sorted = sortChanges(changes);

  sorted.forEach((change) => {
    Logger.log(`${label}  ${bolderize(change.message)}`);
  });
}

function reportDangerousChanges(changes: Change[]) {
  const label = symbols.warning;
  const sorted = sortChanges(changes);

  sorted.forEach((change) => {
    Logger.log(`${label}  ${bolderize(change.message)}`);
  });
}

function reportNonBreakingChanges(changes: Change[]) {
  const label = symbols.success;
  const sorted = sortChanges(changes);

  sorted.forEach((change) => {
    Logger.log(`${label}  ${bolderize(change.message)}`);
  });
}

function resolveRule(name: string): Rule | undefined {
  const filepath = ensureAbsolute(name);
  if (existsSync(filepath)) {
    return require(filepath);
  }

  return DiffRule[name as keyof typeof DiffRule];
}

function resolveCompletionHandler(name: string): CompletionHandler | never {
  const filepath = ensureAbsolute(name);

  try {
    require.resolve(filepath);
  } catch (error) {
    throw new Error(`CompletionHandler '${name}' does not exist!`);
  }

  const mod = require(filepath);

  return mod?.default || mod;
}

function failOnBreakingChanges(
  {breakingChanges}: CompletionArgs,
  proceed?: boolean,
) {
  const breakingCount = breakingChanges.length;

  if (breakingCount) {
    Logger.error(
      `Detected ${breakingCount} breaking change${
        breakingCount > 1 ? 's' : ''
      }`,
    );
    if (!proceed) {
      process.exit(1);
    }
  } else {
    Logger.success('No breaking changes detected');
  }
}

function isString(val: any): val is string {
  return typeof val === 'string';
}
