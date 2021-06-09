import {defineCommand} from '@graphql-cli/common';
import {
  GlobalArgs,
  parseGlobalArgs,
  createInspectorExtension,
  loaders,
} from '@graphql-inspector/graphql-cli-common';
import {handler} from '@graphql-inspector/introspect-command';

export default defineCommand<
  {},
  {
    project?: string;
    write?: string;
    comments?: boolean;
  } & GlobalArgs
>((api) => {
  const {loadSchema} = api.useLoaders({loaders});

  return {
    command: 'introspect [project]',
    describe: 'Introspect a schema',
    builder(yargs) {
      return yargs
        .positional('project', {
          describe: 'Point to a project or schema',
          type: 'string',
        })
        .options({
          write: {
            alias: 'w',
            describe: 'Write to a file',
            type: 'string',
          },
          comments: {
            describe: 'Use preceding comments as the description',
            type: 'boolean',
          },
          require: {
            alias: 'r',
            describe: 'Require modules',
            type: 'array',
          },
          token: {
            alias: 't',
            describe: 'Access Token',
            type: 'string',
          },
          header: {
            alias: 'h',
            describe: 'Http Header',
            type: 'array',
          },
          config: {
            alias: 'c',
            type: 'string',
            describe: 'Location of GraphQL Config',
          },
        })
        .default('w', 'graphql.schema.json');
    },
    async handler(args) {
      const {headers, token} = await parseGlobalArgs(args);
      const output = args.write!;
      const comments = args.comments || false;
      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [createInspectorExtension('introspect')],
      });

      const project = config.projects[args.project || 'default'];
      const schema = await (project
        ? project.getSchema()
        : loadSchema(args.project!, {
            headers,
            token,
          }));

      return handler({schema, output, comments});
    },
  };
});
