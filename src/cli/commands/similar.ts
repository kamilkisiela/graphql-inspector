import chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import {GraphQLNamedType} from 'graphql';

import {loadSchema} from '../loaders/schema';
import {Renderer, ConsoleRenderer} from '../render';
import {similar as findSimilar} from '../../similar';
import {getTypePrefix} from '../../utils/graphql';

export async function similar(
  schemaPointer: string,
  name: string | undefined,
  threshold: number | undefined,
  options?: {
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const found = findSimilar(schema, name, threshold);

    if (!Object.keys(found).length) {
      renderer.emit('No similar types found');
    } else {
      for (const typeName in found) {
        if (found.hasOwnProperty(typeName)) {
          const matches = found[typeName];

          renderer.emit('\n');
          renderer.emit(
            logSymbols.success,
            chalk.greenBright(
              `${getTypePrefix(schema.getType(
                typeName,
              ) as GraphQLNamedType)} ${typeName}`,
            ),
          );
          renderer.emit(
            'Best match',
            `(${formatRating(matches.bestMatch.rating)}%):`,
            chalk.bold(`${matches.bestMatch.target.typeId}`),
          );

          matches.ratings.forEach(match => {
            renderer.emit(
              `(${formatRating(match.rating)}%):`,
              chalk.bold(`${match.target.typeId}`),
            );
          });
        }
      }
      renderer.emit('\n');
    }
  } catch (e) {
    renderer.emit(logSymbols.error, chalk.redBright(e.message || e));
    process.exit(1);
  }

  process.exit(0);
}

function formatRating(ratio: number): number {
  return Math.floor(ratio * 100);
}
