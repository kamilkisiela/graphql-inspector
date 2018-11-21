import chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import * as isValidPath from 'is-valid-path';

import {loadSchema} from '../loaders/schema';
import {loadDocuments} from '../loaders/documents';
import {Renderer, ConsoleRenderer} from '../render';
import {coverage as calculateCoverage} from '../../coverage';
import {getTypePrefix} from '../../utils/graphql';
import {writeFileSync} from 'fs';
import {ensureAbsolute} from '../../utils/fs';

export async function coverage(
  documentsPointer: string,
  schemaPointer: string,
  options?: {
    write?: string;
    silent?: boolean;
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();
  const silent = options && options.silent === true;
  const writePath = options && options.write;
  const shouldWrite = typeof writePath !== 'undefined';

  try {
    const schema = await loadSchema(schemaPointer);
    const documents = await loadDocuments(documentsPointer);
    const coverage = calculateCoverage(schema, documents);

    if (!silent) {
      renderer.emit(chalk.bold.greenBright('\nSchema coverage\n'));

      for (const typeName in coverage) {
        if (coverage.hasOwnProperty(typeName)) {
          const typeCoverage = coverage[typeName];

          renderer.emit(
            getTypePrefix(typeCoverage.type),
            chalk.bold(`${typeName}`),
            chalk.italic('{'),
          );

          for (const childName in typeCoverage.children) {
            if (typeCoverage.children.hasOwnProperty(childName)) {
              const childCoverage = typeCoverage.children[childName];

              if (childCoverage.hits) {
                renderer.emit(
                  `  ${childName}`,
                  chalk.italic.grey(`x ${childCoverage.hits}`),
                );
              } else {
                renderer.emit(
                  chalk.redBright(`  ${childName}`),
                  chalk.italic.grey('x 0'),
                );
              }
            }
          }

          renderer.emit(chalk.italic('}\n'));
        }
      }
    }

    if (shouldWrite) {
      if (typeof writePath !== 'string' || !isValidPath(writePath)) {
        throw new Error(`--write is not valid file path: ${writePath}`);
      }

      const absPath = ensureAbsolute(writePath);

      writeFileSync(absPath, JSON.stringify(coverage, null, 2), {
        encoding: 'utf-8',
      });

      renderer.emit(chalk.bold.greenBright('\nAvailable at'), absPath, '\n')
    }
  } catch (e) {
    console.log(e);
    renderer.emit(logSymbols.error, chalk.redBright(e));
    process.exit(1);
  }

  process.exit(0);
}
