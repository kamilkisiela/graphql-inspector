import {ApolloServer} from 'apollo-server';
import opn = require('opn');
import {loadSchema} from '@graphql-inspector/load';

import {Renderer, ConsoleRenderer} from '../render';

export async function serve(
  schemaPointer: string,
  options: {
    renderer?: Renderer;
    require?: string[];
    headers?: Record<string, string>;
  },
) {
  const renderer = options.renderer || new ConsoleRenderer();
  const schema = await loadSchema(schemaPointer);
  const PORT = process.env.PORT || '4000';
  const app = new ApolloServer({
    cors: true,
    mocks: true,
    playground: true,
    schema,
  });

  try {
    const {url} = await app.listen(PORT);

    renderer.success(`Serving the GraphQL API on ${url}`);

    await opn(url);
  } catch (e) {
    renderer.error(e.message || e);
  }
}
