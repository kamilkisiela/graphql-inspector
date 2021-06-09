import {
  createCommand,
  GlobalArgs,
  ensureAbsolute,
  parseGlobalArgs,
  CommandFactory,
} from '@graphql-inspector/commands';
import {Logger, chalk} from '@graphql-inspector/logger';
import {
  coverage as calculateCoverage,
  SchemaCoverage,
  getTypePrefix,
} from '@graphql-inspector/core';
import {Source as DocumentSource} from '@graphql-tools/utils';
import {Source, print, GraphQLSchema} from 'graphql';
import {extname} from 'path';
import {writeFileSync} from 'fs';

export {CommandFactory};

export function handler({
  schema,
  documents,
  silent,
  writePath,
}: {
  schema: GraphQLSchema;
  documents: DocumentSource[];
  silent?: boolean;
  writePath?: string;
}) {
  const shouldWrite = typeof writePath !== 'undefined';
  const coverage = calculateCoverage(
    schema,
    documents.map((doc) => new Source(print(doc.document!), doc.location)),
  );

  if (silent !== true) {
    renderCoverage(coverage);
  }

  if (shouldWrite) {
    if (typeof writePath !== 'string') {
      throw new Error(`--write is not valid file path: ${writePath}`);
    }

    const absPath = ensureAbsolute(writePath);
    const ext = extname(absPath).replace('.', '').toLocaleLowerCase();

    let output: string | undefined = undefined;

    if (ext === 'json') {
      output = outputJSON(coverage);
    }

    if (output) {
      writeFileSync(absPath, output, {
        encoding: 'utf-8',
      });

      Logger.success(`Available at ${absPath}\n`);
    } else {
      throw new Error(`Extension ${ext} is not supported`);
    }
  }
}

export default createCommand<
  {},
  {
    schema: string;
    documents: string;
    write?: string;
    silent?: boolean;
  } & GlobalArgs
>((api) => {
  const {loaders} = api;

  return {
    command: 'coverage <documents> <schema>',
    describe: 'Schema coverage based on documents',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
          demandOption: true,
        })
        .positional('documents', {
          describe: 'Point to documents',
          type: 'string',
          demandOption: true,
        })
        .options({
          w: {
            alias: 'write',
            describe: 'Write a file with coverage stats',
            type: 'string',
          },
          s: {
            alias: 'silent',
            describe: 'Do not render any stats in the terminal',
            type: 'boolean',
          },
        });
    },
    async handler(args) {
      const writePath = args.write;
      const silent = args.silent;
      const {headers, token} = await parseGlobalArgs(args);
      const apolloFederation = args.federation || false;
      const aws = args.aws || false;
      const method = args.method?.toUpperCase() || 'POST';

      const schema = await loaders.loadSchema(
        args.schema,
        {
          token,
          headers,
          method,
        },
        apolloFederation,
        aws,
      );
      const documents = await loaders.loadDocuments(args.documents);

      return handler({schema, documents, silent, writePath});
    },
  };
});

function outputJSON(coverage: SchemaCoverage): string {
  return JSON.stringify(coverage, null, 2);
}

function renderCoverage(coverage: SchemaCoverage) {
  Logger.info('Schema coverage based on documents:\n');

  for (const typeName in coverage.types) {
    if (coverage.types.hasOwnProperty(typeName)) {
      const typeCoverage = coverage.types[typeName];

      Logger.log(
        [
          chalk.grey(getTypePrefix(typeCoverage.type)),
          chalk.bold(`${typeName}`),
          chalk.grey('{'),
        ].join(' '),
      );

      for (const childName in typeCoverage.children) {
        if (typeCoverage.children.hasOwnProperty(childName)) {
          const childCoverage = typeCoverage.children[childName];

          if (childCoverage.hits) {
            Logger.log(
              [
                indent(childName, 2),
                chalk.italic.grey(`x ${childCoverage.hits}`),
              ].join(' '),
            );
          } else {
            Logger.log(
              [
                chalk.redBright(indent(childName, 2)),
                chalk.italic.grey('x 0'),
              ].join(' '),
            );
          }
        }
      }

      Logger.log(chalk.grey('}\n'));
    }
  }
}

function indent(line: string, space: number): string {
  return line.padStart(line.length + space, ' ');
}
