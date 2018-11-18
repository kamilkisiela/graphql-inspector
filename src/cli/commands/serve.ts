import * as logSymbols from 'log-symbols';
import chalk from 'chalk';
import {ApolloServer} from 'apollo-server';
import opn = require('opn');

import {loadSchema} from '../loaders/schema';
import {Renderer, ConsoleRenderer} from '../render';

export async function serve(
  schemaPointer: string,
  options?: {
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();
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

    renderer.emit(
      chalk.greenBright(
        logSymbols.success,
        `Serving the GraphQL API on ${url}`,
      ),
    );

    await opn(url);
  } catch (e) {
    renderer.emit(chalk.redBright(logSymbols.error, e.message || e));
  }
}
