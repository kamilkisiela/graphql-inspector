import {defineCommand} from '@graphql-cli/common';
import {loaders} from '@graphql-cli/loaders';
import {handler} from '@graphql-inspector/introspect-command';

export default defineCommand<
  {},
  {
    project?: string;
    write?: string;
    comments?: boolean;
    config?: string;
  }
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
          config: {
            alias: 'c',
            type: 'string',
            describe: 'Location of GraphQL Config',
          },
        })
        .default('w', 'graphql.schema.json');
    },
    async handler(args) {
      const output = args.write!;
      const comments = args.comments || false;
      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [
          (api) => {
            loaders.forEach((loader) => {
              api.loaders.schema.register(loader);
            });

            return {
              name: 'inspector',
            };
          },
        ],
      });

      const project = config.projects[args.project || 'default'];
      const schema = await (project
        ? project.getSchema()
        : loadSchema(args.project!, {}));

      return handler({schema, output, comments});
    },
  };
});
