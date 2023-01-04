import { CommandFactory, createCommand, GlobalArgs, parseGlobalArgs } from '@graphql-inspector/commands';
import { Logger } from '@graphql-inspector/logger';
import { createServer } from '@graphql-yoga/node';
import open from 'open';
import { fake } from './fake';

export { CommandFactory };

export default createCommand<
  {},
  {
    schema: string;
    port: number;
  } & GlobalArgs
>(api => {
  const { loaders } = api;

  return {
    command: 'serve <schema>',
    describe: 'Runs server with fake data based on schema',
    builder(yargs) {
      return yargs
        .positional('schema', {
          describe: 'Point to a schema',
          type: 'string',
          demandOption: true,
        })
        .options({
          port: {
            alias: 'p',
            describe: 'Port',
            type: 'number',
            default: 4000,
          },
        });
    },
    async handler(args) {
      const { headers, token } = parseGlobalArgs(args);
      const apolloFederation = args.federation || false;
      const aws = args.aws || false;
      const method = args.method?.toUpperCase() || 'POST';

      const schema = await loaders.loadSchema(
        args.schema,
        {
          headers,
          token,
          method,
        },
        apolloFederation,
        aws
      );

      const port = args.port;

      try {
        fake(schema);

        const server = createServer({
          schema,
          port,
          cors: true,
          logging: false,
        });

        await server.start();
        const url = `http://localhost:${port}`;
        Logger.success(`GraphQL API:    ${url}`);
        await open(url);

        const shutdown = () => {
          server.stop();
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
