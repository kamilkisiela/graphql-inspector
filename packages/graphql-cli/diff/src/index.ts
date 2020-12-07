import {defineCommand} from '@graphql-cli/common';
import {
  GlobalArgs,
  parseGlobalArgs,
  createInspectorExtension,
  loaders,
} from '@graphql-inspector/graphql-cli-common';
import {handler} from '@graphql-inspector/diff-command';
import {GraphQLSchema} from 'graphql';
import {GraphQLProjectConfig} from 'graphql-config';

interface ExtensionConfig {
  baseSchema: string;
  rule: string[];
}

export default defineCommand<
  {},
  {
    source?: string;
    target?: string;
    rule?: Array<string | number>;
    onComplete?: string;
  } & GlobalArgs
>((api) => {
  return {
    command: 'diff [source] [target]',
    describe: 'Compare two GraphQL Schemas',
    builder(yargs) {
      return yargs
        .positional('source', {
          describe: 'Point to a source schema (or project)',
          type: 'string',
        })
        .positional('target', {
          describe: 'Point to a target schema (or project)',
          type: 'string',
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
        extensions: [createInspectorExtension('diff')],
      });

      const {loadSchema} = api.useLoaders({loaders});

      let baseSchema: GraphQLSchema;
      let newSchema: GraphQLSchema;

      const project = config.getProject(args.source);

      if (!args.target) {
        // Case 1: <no args>
        //    Base schema - `diff` extension
        //    New schema - default project
        // Case 2: <source>
        //    Base schema - `diff` extension
        //    New schema - named project

        baseSchema = await resolveBaseSchema(project);
        newSchema = await project.getSchema();
      } else {
        // Case 3: <source> <target>
        //    Base schema - `project` or `pointer`
        //    New schema - `project` or `pointer`
        baseSchema = await resolveSchema(args.source!);
        newSchema = await resolveSchema(args.target!);
      }

      function resolveBaseSchema(project: GraphQLProjectConfig) {
        const diffConfig = project.extension<ExtensionConfig>('diff');

        return project.loadSchema(diffConfig.baseSchema);
      }

      function resolveSchema(pointer: string) {
        return !!config.projects[pointer]
          ? config.getProject(pointer).getSchema()
          : loadSchema(pointer, {
              headers,
              token,
            });
      }

      const rules = resolveRules(project);

      function resolveRules(project: GraphQLProjectConfig): (string | number)[] | undefined {
        const diffConfig = project.extension<ExtensionConfig>('diff');

        // prefer cli over graphql config?
        if (args.rule) {
          return args.rule;
        } else if (diffConfig.rule) {
          return diffConfig.rule
        }
      }

      return handler({
        oldSchema: baseSchema,
        newSchema,
        rules,
        onComplete: args.onComplete,
      });
    },
  };
});
