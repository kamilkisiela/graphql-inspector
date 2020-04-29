import {
  createCommand,
  GlobalArgs,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import {Logger} from '@graphql-inspector/logger';
import open from 'open';
import express from 'express';
import graphql from 'express-graphql';
import cors from 'cors';
import {fake} from './fake';

export default createCommand<
  {},
  {
    schema?: string;
    port: number;
  } & GlobalArgs
>((api) => {
  const {loaders, pickPointers} = api;

  return {
    command: 'serve [schema]',
    describe: 'Compare two GraphQL Schemas',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
        })
        .options({
          port: {
            alias: 'p',
            describe: 'Port',
            type: 'number',
            default: 4000,
          },
          c: {
            alias: 'config',
            describe: 'Use GraphQL Config to find schema and documents',
            type: 'boolean',
          },
        });
    },
    async handler(args) {
      const {headers, token} = parseGlobalArgs(args);
      const pointer = await pickPointers(args, {
        schema: true,
        documents: false,
      });

      const schema = await loaders.loadSchema(pointer.schema!, {
        headers,
        token,
      });

      const port = args.port;

      try {
        const app = express();

        fake(schema);

        app.get('/test', (_, res) => {
          res.send('yes').status(200);
        });

        app.use(
          cors(),
          graphql({
            schema,
            graphiql: true,
          }),
        );

        const server = app.listen(port);
        const url = `http://localhost:${port}`;
        Logger.success(`GraphQL API:    ${url}`);
        await open(url);

        const shutdown = () => {
          server.close();
          process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
      } catch (e) {
        Logger.error(e.message || e);
      }
    },
  };
});
