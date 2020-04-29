import {
  createCommand,
  GlobalArgs,
  ensureAbsolute,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import {Logger, chalk} from '@graphql-inspector/logger';
import {
  coverage as calculateCoverage,
  SchemaCoverage,
  getTypePrefix,
} from '@graphql-inspector/core';
import {Source, print} from 'graphql';
import {extname} from 'path';
import {writeFileSync} from 'fs';

export default createCommand<
  {},
  {
    schema?: string;
    documents?: string;
    config?: boolean;
    write?: string;
    silent?: boolean;
  } & GlobalArgs
>((api) => {
  return {
    command: 'coverage [documents] [schema]',
    describe: 'Schema coverage based on documents',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
        })
        .positional('documents', {
          describe: 'Point to documents',
          type: 'string',
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
          c: {
            alias: 'config',
            describe: 'Use GraphQL Config to find schema and documents',
            type: 'boolean',
          },
        });
    },
    async handler(args) {
      const {loaders, pickPointers} = api;
      const writePath = args.write;
      const shouldWrite = typeof writePath !== 'undefined';
      const {headers, token} = parseGlobalArgs(args);

      const pointer = await pickPointers(args, {
        documents: true,
        schema: true,
      });

      const schema = await loaders.loadSchema(pointer.schema!, {
        token,
        headers,
      });
      const documents = await loaders.loadDocuments(pointer.documents!);
      const coverage = calculateCoverage(
        schema,
        documents.map((doc) => new Source(print(doc.document!), doc.location)),
      );

      if (args.silent !== true) {
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
