import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import open from 'open';
import {
  CommandFactory,
  createCommand,
  GlobalArgs,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import { Logger } from '@graphql-inspector/logger';
import { fake } from './fake.js';

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
      console.log('args', args);
      console.log('headers', headers);
      console.log('token', token);

      const apolloFederation = args.federation || false;
      console.log('apolloFederation', apolloFederation);

      const aws = args.aws || false;
      console.log('aws', aws);
      const method = args.method?.toUpperCase() || 'POST';
      console.log('method', method);

      const schema = await loaders.loadSchema(
        args.schema,
        {
          headers,
          token,
          method,
        },
        apolloFederation,
        aws,
      );

      const port = args.port;
      console.log('port', port);

      try {
        fake(schema);

        const yoga = createYoga({
          schema,
          logging: false,
        });
        console.log('yoga', yoga);

        const server = createServer(yoga);
        console.log('server', server);

        await new Promise<void>(resolve => server.listen(port, () => resolve()));
        console.log('port', port);

        const url = `http://localhost:${port}/graphql`;
        console.log('url', url);
        Logger.success(`GraphQL API:    ${url}`);

        await open(url);

        const shutdown = () => {
          server.close(() => {
            process.exit(0);
          });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
      } catch (e: any) {
        Logger.error(e.message || e);
      }
    },
  };
});
