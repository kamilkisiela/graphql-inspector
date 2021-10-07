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
  const onComplete = resolveOnComplete(
    input.onComplete,
    input.format === 'plain' ? failOnBreakingChanges : undefined,
  );

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

  if (input.format === 'plain') {
    handlePlainFormat(changes);
  } else if (input.format === 'gitlab') {
    handleGitLabFormat(changes, input.schemaPath);
  } else {
    throw new Error(`Output format ${input.format} is not supported`);
  }

  onComplete(changes);
}

function resolveOnComplete(
  onCompleteName?: string,
  fallback?: (args: CompletionArgs) => void,
): (changes: Array<Change>) => void {
  const onComplete = onCompleteName
    ? resolveCompletionHandler(onCompleteName)
    : fallback;

  if (!onComplete) {
    return (_) => {};
  }

  return (changes: Array<Change>) => {
    const breakingChanges = filterChangesByCriticality(
      changes,
      CriticalityLevel.Breaking,
    );
    const dangerousChanges = filterChangesByCriticality(
      changes,
      CriticalityLevel.Dangerous,
    );
    const nonBreakingChanges = filterChangesByCriticality(
      changes,
      CriticalityLevel.NonBreaking,
    );
    onComplete({breakingChanges, dangerousChanges, nonBreakingChanges});
  };
}

function handlePlainFormat(changes: Array<Change>) {
  if (changes.length === 0) {
    Logger.success('No changes detected');
    return;
  }

  Logger.log(
    `\nDetected the following changes (${changes.length}) between schemas:\n`,
  );

  const breakingChanges = filterChangesByCriticality(
    changes,
    CriticalityLevel.Breaking,
  );
  const dangerousChanges = filterChangesByCriticality(
    changes,
    CriticalityLevel.Dangerous,
  );
  const nonBreakingChanges = filterChangesByCriticality(
    changes,
    CriticalityLevel.NonBreaking,
  );

  if (breakingChanges.length) {
    reportPlainBreakingChanges(breakingChanges);
  }

  if (dangerousChanges.length) {
    reportPlainDangerousChanges(dangerousChanges);
  }

  if (nonBreakingChanges.length) {
    reportPlainNonBreakingChanges(nonBreakingChanges);
  }
}

function filterChangesByCriticality(
  changes: Array<Change>,
  criticalityLevel: CriticalityLevel,
): Array<Change> {
  return changes.filter(
    (change) => change.criticality.level === criticalityLevel,
  );
}

function handleGitLabFormat(changes: Array<Change>, newSchemaSource: string) {
  const gitlab: Array<GitLabCodeClimateIssueType> = [];
  for (let change of changes) {
    if (!change.path) {
      throw Error(`Path undefined for change ${change}`);
    }
    const loc = getLocationByPath({
      path: change.path,
      source: new Source(
        readFileSync(newSchemaSource).toString(),
        newSchemaSource,
      ),
    });
    let severity: Severity;
    if (change.criticality.level === CriticalityLevel.NonBreaking) {
      severity = Severity.INFO;
    } else if (change.criticality.level === CriticalityLevel.Dangerous) {
      severity = Severity.MAJOR;
    } else if (change.criticality.level === CriticalityLevel.Breaking) {
      severity = Severity.CRITICAL;
    } else {
      throw new Error(
        `Could not map criticality ${change.criticality.level} to GitLab severity mapping (change: ${change})`,
      );
    }
    let description: string;
    if (change.message && change.criticality.reason) {
      description = change.message + '. ' + change.criticality.reason;
    } else if (change.message) {
      description = change.message;
    } else if (change.criticality.reason) {
      description = change.criticality.reason;
    } else {
      throw new Error(`No description could be deferred for change ${change}`);
    }
    loc.column;
    gitlab.push({
      type: 'issue',
      check_name: change.type,
      categories: [
        change.criticality.level === CriticalityLevel.Breaking
          ? IssueType.COMPATIBILITY
          : IssueType.BUG_RISK,
      ],
      description: description || '',
      location: {
        path: newSchemaSource,
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
      severity: severity,
      fingerprint: createHash('md5')
        .update(
          change.criticality.level + ':' + change.type + ':' + change.message,
        )
        .digest('hex'),
    });
  }
  Logger.raw(JSON.stringify(gitlab));
}

export default createCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
    onComplete?: string;
    format?: string;
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
          format: args.format || 'plain',
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

function reportPlainBreakingChanges(changes: Change[]) {
  const label = symbols.error;
  const sorted = sortChanges(changes);

  sorted.forEach((change) => {
    Logger.log(`${label}  ${bolderize(change.message)}`);
  });
}

function reportPlainDangerousChanges(changes: Change[]) {
  const label = symbols.warning;
  const sorted = sortChanges(changes);

  sorted.forEach((change) => {
    Logger.log(`${label}  ${bolderize(change.message)}`);
  });
}

function reportPlainNonBreakingChanges(changes: Change[]) {
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
