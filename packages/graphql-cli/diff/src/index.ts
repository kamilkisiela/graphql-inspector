import {defineCommand} from '@graphql-cli/common';
import {
  GlobalArgs,
  parseGlobalArgs,
  InspectorExtension,
  loaders,
} from '@graphql-inspector/graphql-cli-common';
import {handler} from '@graphql-inspector/diff-command';

export default defineCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
    rule?: Array<string | number>;
    onComplete?: string;
  } & GlobalArgs
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
      const {headers, token} = parseGlobalArgs(args);
      const config = await api.useConfig({
        rootDir: args.config || process.cwd(),
        extensions: [InspectorExtension],
      });

      function resolveSchema(pointer: string) {
        return !!config.projects[pointer]
          ? config.getProject(pointer).getSchema()
          : loadSchema(pointer, {
              headers,
              token,
            });
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
