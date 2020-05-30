import {defineCommand} from '@graphql-cli/common';
import {loaders} from '@graphql-cli/loaders';
import {handler} from '@graphql-inspector/coverage-command';

export default defineCommand<
  {},
  {
    project?: string;
    schema?: string;
    documents?: string;
    write?: string;
    silent?: boolean;
    config?: string;
  }
>((api) => {
  return {
    command: 'coverage [project]',
    describe: 'Schema coverage based on documents',
    builder(yargs) {
      return yargs
        .positional('project', {
          describe: 'Point to a project',
          type: 'string',
        })
        .options({
          schema: {
            describe: 'Point to a schema',
            type: 'string',
          },
          documents: {
            describe: 'Point to operations and fragments',
            type: 'string',
          },
          write: {
            alias: 'w',
            describe: 'Write a file with coverage stats',
            type: 'string',
          },
          silent: {
            alias: 's',
            describe: 'Do not render any stats in the terminal',
            type: 'boolean',
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
      const silent = args.silent;
      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [
          (api) => {
            loaders.forEach((loader) => {
              api.loaders.schema.register(loader);
            });
            loaders.forEach((loader) => {
              api.loaders.documents.register(loader);
            });

            return {
              name: 'inspector',
            };
          },
        ],
      });

      if (args.documents && args.schema) {
        const {loadDocuments, loadSchema} = api.useLoaders({loaders});
        const schema = await loadSchema(args.schema!, {});
        const documents = await loadDocuments(args.documents!, {});

        return handler({schema, documents, silent, writePath});
      }

      const project = config.getProject(args.project);
      const schema = await project.getSchema();
      const documents = await project.getDocuments();

      return handler({schema, documents, silent, writePath});
    },
  };
});
