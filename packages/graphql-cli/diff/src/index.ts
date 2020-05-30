import {defineCommand} from '@graphql-cli/common';
import {loaders} from '@graphql-cli/loaders';
import {handler} from '@graphql-inspector/diff-command';

export default defineCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
    onComplete?: string;
    config?: string;
  }
>((api) => {
  return {
    command: 'diff <oldSchema> <newSchema>',
    describe: 'Compare two GraphQL Schemas',
    builder(yargs) {
      return yargs
        .positional('oldSchema', {
          describe: 'Point to an old schema (or project)',
          type: 'string',
          demandOption: true,
        })
        .positional('newSchema', {
          describe: 'Point to a new schema (or project)',
          type: 'string',
          demandOption: true,
        })
        .options({
          rule: {
            describe: 'Add rules',
            array: true,
          },
          onComplete: {
            describe: 'Handle Completion',
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

      function resolveSchema(pointer: string) {
        return !!config.projects[pointer]
          ? config.getProject(pointer).getSchema()
          : loadSchema(pointer, {});
      }

      const {loadSchema} = api.useLoaders({loaders});

      const oldSchema = await resolveSchema(args.oldSchema);
      const newSchema = await resolveSchema(args.newSchema);

      return handler({
        oldSchema,
        newSchema,
        rules: args.rule,
        onComplete: args.onComplete,
      });
    },
  };
});
