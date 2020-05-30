import {defineCommand} from '@graphql-cli/common';
import {loaders} from '@graphql-cli/loaders';
import {handler} from '@graphql-inspector/validate-command';

export default defineCommand<
  {},
  {
    project?: string;
    schema?: string;
    documents?: string;
    deprecated: boolean;
    noStrictFragments: boolean;
    apollo: boolean;
    keepClientFields: boolean;
    maxDepth?: number;
    config?: string;
  }
>((api) => {
  return {
    command: 'validate [project]',
    describe: 'Validate Fragments and Operations',
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
          deprecated: {
            alias: 'd',
            describe: 'Fail on deprecated usage',
            type: 'boolean',
            default: false,
          },
          noStrictFragments: {
            describe: 'Do not fail on duplicated fragment names',
            type: 'boolean',
            default: false,
          },
          maxDepth: {
            describe: 'Fail on deep operations',
            type: 'number',
          },
          apollo: {
            describe: 'Support Apollo directives',
            type: 'boolean',
            default: false,
          },
          keepClientFields: {
            describe:
              'Keeps the fields with @client, but removes @client directive from them',
            type: 'boolean',
            default: false,
          },
          config: {
            alias: 'c',
            type: 'string',
            describe: 'Location of GraphQL Config',
          },
        });
    },
    async handler(args) {
      const apollo = args.apollo || false;
      const maxDepth = args.maxDepth || undefined;
      const strictFragments = !args.noStrictFragments;
      const keepClientFields = args.keepClientFields || false;
      const failOnDeprecated = args.deprecated;

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

        return handler({
          schema,
          documents,
          apollo,
          maxDepth,
          strictFragments,
          keepClientFields,
          failOnDeprecated,
        });
      }

      const project = config.getProject(args.project);
      const schema = await project.getSchema();
      const documents = await project.getDocuments();

      return handler({
        schema,
        documents,
        apollo,
        maxDepth,
        strictFragments,
        keepClientFields,
        failOnDeprecated,
      });
    },
  };
});
