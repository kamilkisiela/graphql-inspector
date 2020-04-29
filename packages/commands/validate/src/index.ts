import {
  createCommand,
  GlobalArgs,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import {Logger, bolderize, chalk} from '@graphql-inspector/logger';
import {
  validate as validateDocuments,
  InvalidDocument,
} from '@graphql-inspector/core';
import {Source, print} from 'graphql';

export default createCommand<
  {},
  {
    schema?: string;
    documents?: string;
    deprecated?: boolean;
    noStrictFragments: boolean;
    apollo?: boolean;
    keepClientFields?: boolean;
    maxDepth?: number;
  } & GlobalArgs
>((api) => {
  return {
    command: 'validate [documents] [schema]',
    describe: 'Validate Fragments and Operations',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
        })
        .positional('documents', {
          describe: 'Point to docuents',
          type: 'string',
        })
        .options({
          d: {
            alias: 'deprecated',
            describe: 'Fail on deprecated usage',
            type: 'boolean',
            default: false,
          },
          c: {
            alias: 'config',
            describe: 'Use GraphQL Config to find schema and documents',
            type: 'boolean',
          },
          noStrictFragments: {
            describe: 'Do not fail on duplicated fragment names',
            type: 'boolean',
            default: false,
          },
          maxDepth: {
            describe: 'Fail on deep operations',
            type: 'number',
          },
          apollo: {
            describe: 'Support Apollo directives',
            type: 'boolean',
            default: false,
          },
          keepClientFields: {
            describe:
              'Keeps the fields with @client, but removes @client directive from them',
            type: 'boolean',
            default: false,
          },
        });
    },
    async handler(args) {
      const {loaders, pickPointers} = api;
      const {headers, token} = parseGlobalArgs(args);
      const pointer = await pickPointers(args, {
        schema: true,
        documents: true,
      });

      const schema = await loaders.loadSchema(pointer.schema!, {
        headers,
        token,
      });
      const documents = await loaders.loadDocuments(pointer.documents!);

      const invalidDocuments = validateDocuments(
        schema,
        documents.map((doc) => new Source(print(doc.document!), doc.location)),
        {
          strictFragments: !args.noStrictFragments,
          maxDepth: args.maxDepth || undefined,
          apollo: args.apollo || false,
          keepClientFields: args.keepClientFields || false,
        },
      );

      if (!invalidDocuments.length) {
        Logger.success('All documents are valid');
      } else {
        const errorsCount = countErrors(invalidDocuments);
        const deprecated = countDeprecated(invalidDocuments);

        if (errorsCount) {
          Logger.log(
            `\nDetected ${errorsCount} invalid document${
              errorsCount > 1 ? 's' : ''
            }:\n`,
          );

          invalidDocuments.forEach((doc) => {
            if (doc.errors.length) {
              renderInvalidDocument(doc).forEach((line) => {
                Logger.log(line);
              });
            }
          });
        } else if (!args.deprecated) {
          Logger.success('All documents are valid');
        }

        if (deprecated) {
          Logger.info(
            `\nDetected ${deprecated} document${
              deprecated > 1 ? 's' : ''
            } with deprecated fields:\n`,
          );

          invalidDocuments.forEach((doc) => {
            if (doc.deprecated.length) {
              renderDeprecatedUsageInDocument(doc, args.deprecated).forEach(
                (line) => {
                  Logger.log(line);
                },
              );
            }
          });
        }

        if (errorsCount || (deprecated && args.deprecated)) {
          process.exit(1);
        }
      }
    },
  };
});

function countErrors(invalidDocuments: InvalidDocument[]): number {
  if (invalidDocuments.length) {
    return invalidDocuments.filter((doc) => doc.errors && doc.errors.length)
      .length;
  }

  return 0;
}

function countDeprecated(invalidDocuments: InvalidDocument[]): number {
  if (invalidDocuments.length) {
    return invalidDocuments.filter(
      (doc) => doc.deprecated && doc.deprecated.length,
    ).length;
  }

  return 0;
}

function renderInvalidDocument(invalidDoc: InvalidDocument): string[] {
  const errors = invalidDoc.errors
    .map((e) => ` - ${bolderize(e.message)}`)
    .join('\n');

  return [
    chalk.redBright('error'),
    `in ${invalidDoc.source.name}:\n\n`,
    errors,
    '\n\n',
  ];
}

function renderDeprecatedUsageInDocument(
  invalidDoc: InvalidDocument,
  isCritical = false,
): string[] {
  const deprecated = invalidDoc.deprecated
    .map((e) => ` - ${bolderize(e.message)}`)
    .join('\n');

  return [
    isCritical ? chalk.redBright('error') : chalk.yellowBright('warn'),
    `in ${invalidDoc.source.name}:\n\n`,
    deprecated,
    '\n\n',
  ];
}
