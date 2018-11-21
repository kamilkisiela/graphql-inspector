import chalk from 'chalk';
import {GraphQLNamedType} from 'graphql';
import indent = require('indent-string');

import {loadSchema} from '../loaders/schema';
import {Renderer, ConsoleRenderer} from '../render';
import {similar as findSimilar} from '../../similar';
import {getTypePrefix} from '../../utils/graphql';

export async function similar(
  schemaPointer: string,
  name: string | undefined,
  threshold: number | undefined,
  options: {
    require: string[];
    renderer?: Renderer;
  },
) {
  const renderer = options.renderer || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const found = findSimilar(schema, name, threshold);

    if (!Object.keys(found).length) {
      renderer.emit('No similar types found');
    } else {
      for (const typeName in found) {
        if (found.hasOwnProperty(typeName)) {
          const matches = found[typeName];

          const prefix = getTypePrefix(schema.getType(
            typeName,
          ) as GraphQLNamedType);
          const sourceType = chalk.bold(typeName);
          const percentage = chalk.grey(
            `(${formatRating(matches.bestMatch.rating)}%)`,
          );
          const name = chalk.bold(matches.bestMatch.target.typeId);

          renderer.success(`${prefix} ${sourceType}`);
          renderer.emit(indent(`Best match ${percentage}: ${name}`, 2));

          matches.ratings.forEach(match => {
            const percentage = chalk.grey(`(${formatRating(match.rating)}%)`);
            const name = chalk.bold(match.target.typeId);

            renderer.emit(indent(`${percentage}: ${name}`, 2));
          });
        }
      }
      renderer.emit();
    }
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}

function formatRating(ratio: number): number {
  return Math.floor(ratio * 100);
}
