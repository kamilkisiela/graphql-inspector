import * as express from 'express';
import {ApolloServer} from 'apollo-server-express';

import {schema} from './schema';

export async function serve(config: {port: number; path?: string}) {
  const app = express();

  apply(app, {
    path: config.path,
  });

  return listen(app, config.port);
}

export function apply(
  app: express.Application,
  config: {
    path?: string;
  },
) {
  const path = config.path || '/graphql';
  const apollo = new ApolloServer({
    schema,
    mocks: true,
    introspection: true,
  });

  apollo.applyMiddleware({
    app,
    path,
  });
}

function listen(app: express.Application, port: number): Promise<void> {
  return new Promise<void>(resolve => {
    app.listen(port, () => {
      resolve();
    });
  });
}
