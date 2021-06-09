import {defineCommand} from '@graphql-cli/common';
import {
  GlobalArgs,
  parseGlobalArgs,
  createInspectorExtension,
  loaders,
} from '@graphql-inspector/graphql-cli-common';
import {handler} from '@graphql-inspector/coverage-command';

export default defineCommand<
  {},
  {
    project?: string;
    schema?: string;
    documents?: string;
    write?: string;
    silent?: boolean;
  } & GlobalArgs
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
      const silent = args.silent;
      const {headers, token} = await parseGlobalArgs(args);

      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [createInspectorExtension('coverage')],
      });

      if (args.documents && args.schema) {
        const {loadDocuments, loadSchema} = api.useLoaders({loaders});
        const schema = await loadSchema(args.schema!, {
          headers,
          token,
        });
        const documents = await loadDocuments(args.documents!, {
          headers,
          token,
        });

        return handler({schema, documents, silent, writePath});
      }

      const project = config.getProject(args.project);
      const schema = await project.getSchema();
      const documents = await project.getDocuments();

      return handler({schema, documents, silent, writePath});
    },
  };
});
