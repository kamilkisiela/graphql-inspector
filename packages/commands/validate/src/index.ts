import {
  createCommand,
  GlobalArgs,
  parseGlobalArgs,
  CommandFactory,
} from '@graphql-inspector/commands';
import {Logger, bolderize, chalk} from '@graphql-inspector/logger';
import {
  validate as validateDocuments,
  InvalidDocument,
} from '@graphql-inspector/core';
import {Source as DocumentSource} from '@graphql-tools/utils';
import {Source, print, GraphQLSchema} from 'graphql';

export {CommandFactory};

export function handler({
  schema,
  documents,
  strictFragments,
  maxDepth,
  apollo,
  keepClientFields,
  failOnDeprecated,
}: {
  schema: GraphQLSchema;
  documents: DocumentSource[];
  failOnDeprecated: boolean;
  strictFragments: boolean;
  apollo: boolean;
  keepClientFields: boolean;
  maxDepth?: number;
}) {
  const invalidDocuments = validateDocuments(
    schema,
    documents.map((doc) => new Source(print(doc.document!), doc.location)),
    {
      strictFragments,
      maxDepth,
      apollo,
      keepClientFields,
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
    } else if (!failOnDeprecated) {
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
          renderDeprecatedUsageInDocument(doc, failOnDeprecated).forEach(
            (line) => {
              Logger.log(line);
            },
          );
        }
      });
    }

    if (errorsCount || (deprecated && failOnDeprecated)) {
      process.exit(1);
    }
  }
}

export default createCommand<
  {},
  {
    schema: string;
    documents: string;
    deprecated: boolean;
    noStrictFragments: boolean;
    apollo: boolean;
    keepClientFields: boolean;
    maxDepth?: number;
  } & GlobalArgs
>((api) => {
  const {loaders} = api;

  return {
    command: 'validate <documents> <schema>',
    describe: 'Validate Fragments and Operations',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
          demandOption: true,
        })
        .positional('documents', {
          describe: 'Point to docuents',
          type: 'string',
          demandOption: true,
        })
        .options({
          deprecated: {
            alias: 'd',
            describe: 'Fail on deprecated usage',
            type: 'boolean',
            default: false,
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
      const {headers, token} = await parseGlobalArgs(args);
      const apollo = args.apollo || false;
      const aws = args.aws || false;
      const apolloFederation = args.federation || false;
      const method = args.method?.toUpperCase() || 'POST';
      const maxDepth = args.maxDepth || undefined;
      const strictFragments = !args.noStrictFragments;
      const keepClientFields = args.keepClientFields || false;
      const failOnDeprecated = args.deprecated;

      const schema = await loaders.loadSchema(
        args.schema,
        {
          headers,
          token,
          method,
        },
        apolloFederation,
        aws,
      );
      const documents = await loaders.loadDocuments(args.documents);

      return handler({
        schema,
        documents,
        apollo,
        maxDepth,
        strictFragments,
        keepClientFields,
        failOnDeprecated,
      });
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
