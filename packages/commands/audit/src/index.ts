import { createCommand, GlobalArgs } from '@graphql-inspector/commands';
import { countAliases, countDepth, countDirectives, calculateOperationComplexity } from '@graphql-inspector/core';
import type { CalculateOperationComplexityConfig } from '@graphql-inspector/core';
import { Source as DocumentSource } from '@graphql-tools/utils';
import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';
import { Logger, chalk } from '@graphql-inspector/logger';
import Table from 'cli-table3';

export default createCommand<
  {},
  {
    documents: string;
    detail: boolean;
    complexityScalarCost: number;
    complexityObjectCost: number;
    complexityDepthCostFactor: number;
  } & GlobalArgs
>(api => {
  return {
    command: 'audit <documents>',
    describe:
      'Audit Fragments and Operations for a better understanding of the depth, alias count, and directive count.',
    builder(yargs) {
      return yargs
        .positional('documents', {
          describe: 'Point to some documents',
          type: 'string',
          demandOption: true,
        })
        .options({
          detail: {
            alias: 'd',
            describe: 'Print an overview of all operations and their audit breakdown.',
            type: 'boolean',
            default: false,
          },
          complexityScalarCost: {
            describe: 'The cost per scalar for calculating the complexity score.',
            type: 'number',
            default: 1,
          },
          complexityObjectCost: {
            describe: 'The cost per object for calculating the complexity score.',
            type: 'number',
            default: 2,
          },
          complexityDepthCostFactor: {
            describe: 'The cost factor per introduced depth level for calculating the complexity score.',
            type: 'number',
            default: 1.5,
          },
        });
    },
    async handler(args) {
      const { loaders } = api;
      const ignore = args.ignore || [];
      const documents = await loaders.loadDocuments(args.documents, {
        ignore,
      });

      const complexityConfig: CalculateOperationComplexityConfig = {
        scalarCost: args.complexityScalarCost,
        objectCost: args.complexityObjectCost,
        depthCostFactor: args.complexityDepthCostFactor,
      };

      return handler({ documents, detail: args.detail, complexityConfig });
    },
  };
});

export function handler(args: {
  documents: DocumentSource[];
  detail: boolean;
  complexityConfig: CalculateOperationComplexityConfig;
}) {
  const fragments = new Map<string, FragmentDefinitionNode>();
  const operations = new Map<string, OperationDefinitionNode>();

  const getFragmentReference = (fragmentName: string) => fragments.get(fragmentName);

  for (const record of args.documents) {
    if (record.document) {
      for (const definition of record.document.definitions) {
        if (definition.kind === 'FragmentDefinition') {
          fragments.set(definition.name.value, definition);
        } else if (definition.kind === 'OperationDefinition') {
          if (definition.name) {
            operations.set(definition.name.value, definition);
          }
        }
      }
    }
  }

  let maxDepth = 0;
  let maxAliases = 0;
  let maxDirectives = 0;
  let maxComplexity = 0;

  const results: Array<[name: string, depth: number, aliases: number, directives: number, complexity: number]> = [];

  for (const [name, operation] of operations.entries()) {
    const depth = countDepth(operation, 0, getFragmentReference);
    const aliases = countAliases(operation, getFragmentReference);
    const directives = countDirectives(operation, getFragmentReference);
    const complexity = calculateOperationComplexity(operation, args.complexityConfig, getFragmentReference);
    results.push([name, depth, aliases, directives, complexity]);
    maxDepth = Math.max(maxDepth, depth);
    maxAliases = Math.max(maxAliases, aliases);
    maxDirectives = Math.max(maxDirectives, directives);
    maxComplexity = Math.max(maxComplexity, complexity);
  }

  if (args.detail) {
    const table = new Table({
      head: ['Operation Name', 'Depth', 'Aliases', 'Directives', 'Complexity Score'],
    });
    table.push(...results);
    Logger.log(table.toString());
  }

  Logger.log(`Maximum depth is ${chalk.bold(maxDepth)}`);
  Logger.log(`Maximum alias amount is ${chalk.bold(maxAliases)}`);
  Logger.log(`Maximum directive amount is ${chalk.bold(maxDirectives)}`);
  Logger.log(`Maximum complexity score is ${chalk.bold(maxComplexity)}`);
}
