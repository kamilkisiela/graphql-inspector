import {
  createCommand,
  GlobalArgs,
  parseGlobalArgs,
} from '@graphql-inspector/commands';
import {Logger} from '@graphql-inspector/logger';
import {writeFileSync} from 'fs';
import {resolve, extname} from 'path';
import {introspectionFromSchema, printSchema} from 'graphql';

export default createCommand<
  {},
  {
    schema: string;
    write?: string;
    comments?: boolean;
  } & GlobalArgs
>((api) => {
  const {
    loaders,
    interceptPositional,
    interceptOptions,
    interceptArguments,
  } = api;

  return {
    command: 'introspect <schema>',
    describe: 'Introspect a schema',
    builder(yargs) {
      return yargs
        .positional(
          'schema',
          interceptPositional('schema', {
            describe: 'Point to a schema',
            type: 'string',
            demandOption: true,
          }),
        )
        .options(
          interceptOptions({
            w: {
              alias: 'write',
              describe: 'Write to a file',
              type: 'string',
            },
            comments: {
              describe: 'Use preceding comments as the description',
              type: 'boolean',
            },
          }),
        )
        .default('w', 'graphql.schema.json');
    },
    async handler(args) {
      interceptArguments(args);

      const {headers, token} = parseGlobalArgs(args);

      const schema = await loaders.loadSchema(args.schema, {
        token,
        headers,
      });
      const introspection = introspectionFromSchema(schema);
      const output = args.write!;
      const filepath = resolve(process.cwd(), output);
      let content: string;

      switch (extname(output.toLowerCase())) {
        case '.graphql':
        case '.gql':
        case '.gqls':
        case '.graphqls':
          content = printSchema(schema, {
            commentDescriptions: args.comments || false,
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

      Logger.success(`Saved to ${filepath}`);
    },
  };
});
