import chalk from 'chalk';
import * as logSymbols from 'log-symbols';

import {loadSchema} from '../loaders/schema';
import {loadDocuments} from '../loaders/documents';
import {Renderer, ConsoleRenderer} from '../render';
import {coverage as calculateCoverage} from '../../coverage';
import {getTypePrefix} from '../../utils/graphql';

export async function coverage(
  documentsPointer: string,
  schemaPointer: string,
  options?: {
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const documents = await loadDocuments(documentsPointer);
    const coverage = calculateCoverage(schema, documents);

    renderer.emit(chalk.bold.greenBright('\nSchema coverage\n'));

    for (const typeName in coverage) {
      if (coverage.hasOwnProperty(typeName)) {
        const typeCoverage = coverage[typeName];

        renderer.emit(
          getTypePrefix(typeCoverage.type),
          chalk.bold(`${typeName}`),
          chalk.italic('{')
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
                chalk.redBright(`  ${childName}`), chalk.italic.grey('x 0')
              );
            }
          }
        }

        renderer.emit(chalk.italic('}\n'));
      }
    }
  } catch (e) {
    console.log(e);
    renderer.emit(logSymbols.error, chalk.redBright(e));
    process.exit(1);
  }

  process.exit(0);
}
