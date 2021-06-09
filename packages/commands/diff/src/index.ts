import {
  CommandFactory,
  createCommand,
  ensureAbsolute,
  GlobalArgs,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import {
  Change,
  CompletionArgs,
  CompletionHandler,
  CriticalityLevel,
  diff as diffSchema,
  DiffRule,
  Rule,
} from '@graphql-inspector/core';
import {bolderize, Logger, symbols} from '@graphql-inspector/logger';
import {existsSync} from 'fs';
import {GraphQLSchema} from 'graphql';

export {CommandFactory};

export function handler(input: {
  oldSchema: GraphQLSchema;
  newSchema: GraphQLSchema;
  onComplete?: string;
  rules?: Array<string | number>;
}) {
  const onComplete = input.onComplete
    ? resolveCompletionHandler(input.onComplete)
    : failOnBreakingChanges;

  const rules = input.rules
    ? input.rules
        .filter(isString)
        .map((name): Rule => {
          const rule = resolveRule(name);

          if (!rule) {
            throw new Error(`\Rule '${name}' does not exist!\n`);
          }

          return rule;
        })
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

  onComplete({breakingChanges, dangerousChanges, nonBreakingChanges});
}

export default createCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
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
        const aws = args.aws || false;
        const method = args.method?.toUpperCase() || 'POST';
        const {headers, leftHeaders, rightHeaders, token} =
          await parseGlobalArgs(args);

        const oldSchemaHeaders = {
          ...(headers ?? {}),
          ...(leftHeaders ?? {}),
        };
        const newSchemaHeaders = {
          ...(headers ?? {}),
          ...(rightHeaders ?? {}),
        };

        const oldSchema = await loaders.loadSchema(
          oldSchemaPointer,
          {
            oldSchemaHeaders,
            token,
            method,
          },
          apolloFederation,
          aws,
        );
        const newSchema = await loaders.loadSchema(
          newSchemaPointer,
          {
            newSchemaHeaders,
            token,
            method,
          },
          apolloFederation,
          aws,
        );

        handler({
          oldSchema,
          newSchema,
          rules: args.rule,
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

async function resolveRule(name: string): Promise<Rule | undefined> {
  const filepath = ensureAbsolute(name);
  if (existsSync(filepath)) {
    return import(filepath);
  }

  return DiffRule[name as keyof typeof DiffRule];
}

async function resolveCompletionHandler(name: string): CompletionHandler | never {
  const filepath = ensureAbsolute(name);

  try {
    require.resolve(filepath);
  } catch (error) {
    throw new Error(`CompletionHandler '${name}' does not exist!`);
  }

  const mod = await import(filepath);

  return mod?.default || mod;
}

function failOnBreakingChanges({breakingChanges}: CompletionArgs) {
  const breakingCount = breakingChanges.length;

  if (breakingCount) {
    Logger.error(
      `Detected ${breakingCount} breaking change${
        breakingCount > 1 ? 's' : ''
      }`,
    );
    process.exit(1);
  } else {
    Logger.success('No breaking changes detected');
  }
}

function isString(val: any): val is string {
  return typeof val === 'string';
}
