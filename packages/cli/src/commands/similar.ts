import chalk from 'chalk';
import {GraphQLNamedType} from 'graphql';
import indent = require('indent-string');
import {similar as findSimilar, getTypePrefix} from '@graphql-inspector/core';
import {loadSchema} from '@graphql-inspector/load';
import * as figures from 'figures';

import {Renderer, ConsoleRenderer} from '../render';

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
          const name = matches.bestMatch.target.typeId;

          renderer.emit('');
          renderer.emit(`${prefix} ${sourceType}`);
          renderer.emit(printResult(name, matches.bestMatch.rating));

          matches.ratings.forEach(match => {
            renderer.emit(printResult(match.target.typeId, match.rating));
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

function printResult(name: string, rating: number): string {
  const percentage = chalk.grey(`(${formatRating(rating)}%)`);

  return indent(`${printScale(rating)} ${percentage} ${name}`, 0);
}

function printScale(ratio: number): string {
  const percentage = Math.floor(ratio * 100);
  const levels = [0, 30, 50, 70, 90];

  return levels
    .map(level => percentage >= level)
    .map(enabled => (enabled ? figures.bullet : chalk.gray(figures.bullet)))
    .join('');
}

function formatRating(ratio: number): number {
  return Math.floor(ratio * 100);
}
