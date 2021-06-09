import {defineCommand} from '@graphql-cli/common';
import {
  GlobalArgs,
  parseGlobalArgs,
  createInspectorExtension,
  loaders,
} from '@graphql-inspector/graphql-cli-common';
import {handler} from '@graphql-inspector/similar-command';

export default defineCommand<
  {},
  {
    project?: string;
    name?: string;
    threshold?: number;
    write?: string;
  } & GlobalArgs
>((api) => {
  return {
    command: 'similar [project]',
    describe: 'Find similar types in a schema',
    builder(yargs) {
      return yargs
        .positional('project', {
          describe: 'Point to a project or schema',
          type: 'string',
        })
        .options({
          name: {
            alias: 'n',
            describe: 'Name of a type',
            type: 'string',
          },
          threshold: {
            alias: 't',
            describe: 'Threshold of similarity ratio',
            type: 'number',
          },
          write: {
            alias: 'w',
            describe: 'Write a file with stats',
            type: 'string',
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
        });
    },
    async handler(args) {
      const writePath = args.write;
      const type = args.name;
      const threshold = args.threshold;
      const {headers, token} = await parseGlobalArgs(args);

      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [createInspectorExtension('similar')],
      });

      const project = config.projects[args.project || 'default'];
      const {loadSchema} = api.useLoaders({loaders});

      const schema = await (project.getSchema() ||
        loadSchema(args.project!, {
          headers,
          token,
        }));

      return handler({schema, writePath, threshold, type});
    },
  };
});
