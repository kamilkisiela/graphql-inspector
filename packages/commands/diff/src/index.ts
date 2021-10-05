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
  UsageHandler,
} from '@graphql-inspector/core';
import {bolderize, Logger, symbols} from '@graphql-inspector/logger';
import {existsSync, readFileSync} from 'fs';
// import {GraphQLSchema} from 'graphql';
import {GraphQLSchema, Source} from 'graphql';
import {getLocationByPath} from '../../../core/src/utils/location';
import {GitLabCodeClimateIssueType, IssueType, Severity} from './gitlab-types';
import {createHash} from 'crypto';

export {CommandFactory};

export async function handler(input: {
  oldSchema: GraphQLSchema;
  newSchema: GraphQLSchema;
  schemaPath: string;
  onComplete?: string;
  onUsage?: string;
  rules?: Array<string | number>;
  format: string;
}) {
  const rules = (input.rules ?? [])
    .filter(isString)
    .map((name): Rule => {
      const rule = resolveRule(name);

      if (!rule) {
        throw new Error(`\Rule '${name}' does not exist!\n`);
      }

      return rule;
    })
    .filter((f) => f);

  const changes = await diffSchema(input.oldSchema, input.newSchema, rules, {
    checkUsage: input.onUsage ? resolveUsageHandler(input.onUsage) : undefined,
  });

  // Logger.log('Output type: ' + input.format);
  if (input.format === 'plain') {
    handlePlainFormat(changes);
  } else if (input.format === 'gitlab') {
    handleGitLabFormat(changes, input.schemaPath);
  } else {
    throw new Error(`Output format ${input.format} is not supported`);
  }
}

function handlePlainFormat(changes: Array<Change>, onCompleteX?: string) {
  const onComplete = onCompleteX
    ? resolveCompletionHandler(onCompleteX)
    : failOnBreakingChanges;

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

function handleGitLabFormat(changes: Array<Change>, schemaPath: string) {
  const gitlab: Array<GitLabCodeClimateIssueType> = [];
  for (let change of changes) {
    if (!change.path) {
      throw Error(`Path undefined for change ${change}`);
    }
    const loc = change.path
      ? getLocationByPath({
          path: change.path,
          source: new Source(readFileSync(schemaPath).toString(), schemaPath),
        })
      : {line: 1, column: 1};
    loc.column;
    gitlab.push({
      type: 'issue',
      check_name: change.type,
      categories: [
        change.criticality.level === CriticalityLevel.Breaking
          ? IssueType.COMPATIBILITY
          : IssueType.BUG_RISK,
      ],
      description: change.message + '\n' + change.criticality.reason || '',
      location: {
        path: schemaPath,
        positions: {
          begin: {
            line: loc.line,
            column: loc.column,
          },
          end: {
            line: loc.line,
          },
        },
      },
      severity: Severity.INFO,
      fingerprint: createHash('md5')
        .update(
          change.criticality.level + ':' + change.type + ':' + change.message,
        )
        .digest('hex'),
    });
  }
  console.log(JSON.stringify(gitlab));
}

export default createCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
    onComplete?: string;
    format: string;
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
          onUsage: {
            describe: 'Checks usage of schema',
            type: 'string',
          },
          format: {
            alias: 'f',
            describe: 'Set the output format',
            choices: ['plain', 'gitlab'],
          },
        })
        .default('format', 'plain');
    },
    async handler(args) {
      try {
        const oldSchemaPointer = args.oldSchema;
        const newSchemaPointer = args.newSchema;
        const apolloFederation = args.federation || false;
        const aws = args.aws || false;
        const method = args.method?.toUpperCase() || 'POST';
        const {headers, leftHeaders, rightHeaders, token} =
          parseGlobalArgs(args);

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
            headers: oldSchemaHeaders,
            token,
            method,
          },
          apolloFederation,
          aws,
        );
        const newSchema = await loaders.loadSchema(
          newSchemaPointer,
          {
            headers: newSchemaHeaders,
            token,
            method,
          },
          apolloFederation,
          aws,
        );

        await handler({
          oldSchema,
          newSchema,
          schemaPath: newSchemaPointer,
          rules: args.rule,
          onComplete: args.onComplete,
          format: args.format,
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

function resolveUsageHandler(name: string): UsageHandler | never {
  const filepath = ensureAbsolute(name);

  try {
    require.resolve(filepath);
  } catch (error) {
    throw new Error(`UsageHandler '${name}' does not exist!`);
  }

  const mod = require(filepath);

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
