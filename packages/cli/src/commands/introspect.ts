import {loadSchema} from '@graphql-inspector/load';
import {writeFileSync} from 'fs';
import {resolve} from 'path';

import {Renderer, ConsoleRenderer} from '../render';
import {introspectionFromSchema} from 'graphql';

export async function introspect(
  schemaPointer: string,
  options: {
    require: string[];
    renderer?: Renderer;
  },
) {
  const renderer = options.renderer || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const introspection = introspectionFromSchema(schema);
    const output = resolve(process.cwd(), 'graphql.schema.json');

    writeFileSync(output, JSON.stringify(introspection, null, 2), {
      encoding: 'utf-8',
    });

    renderer.success(`Saved to ${output}`);
    process.exit(0);
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}
