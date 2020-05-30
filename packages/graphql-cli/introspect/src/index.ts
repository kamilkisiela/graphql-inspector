import {defineCommand} from '@graphql-cli/common';
import {loaders} from '@graphql-cli/loaders';
import {handler} from '@graphql-inspector/similar-command';

export default defineCommand<
  {},
  {
    project?: string;
    name?: string;
    threshold?: number;
    write?: string;
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

      return handler({schema, writePath, type, threshold});
    },
  };
});
