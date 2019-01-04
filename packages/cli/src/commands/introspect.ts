import {loadSchema} from '@graphql-inspector/load';
import {writeFileSync} from 'fs';
import {resolve, extname} from 'path';

import {Renderer, ConsoleRenderer} from '../render';
import {introspectionFromSchema, printSchema} from 'graphql';

export async function introspect(
  schemaPointer: string,
  options: {
    write?: string;
    require: string[];
    renderer?: Renderer;
  },
) {
  const output = options.write || 'graphql.schema.json';
  const renderer = options.renderer || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const introspection = introspectionFromSchema(schema);
    const filepath = resolve(process.cwd(), output);
    let content: string;

    switch (extname(output.toLowerCase())) {
      case '.graphql':
      case '.gql':
        content = printSchema(schema, {
          commentDescriptions: true,
        });
        break;
      case '.json':
        content = JSON.stringify(introspection, null, 2);
        break;
      default:
        throw new Error('Only .graphql, .gql and .json files are supported');
    }

    writeFileSync(output, content!, {
      encoding: 'utf-8',
    });

    renderer.success(`Saved to ${filepath}`);
    process.exit(0);
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}
