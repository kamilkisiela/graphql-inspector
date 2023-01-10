import { GraphQLSchema } from 'graphql';
import { Change } from './changes/change';
import * as rules from './rules';
import { Rule } from './rules/types';
import { diffSchema } from './schema';

export * from './rules/types';
export const DiffRule = rules;

export * from './onComplete/types';
export type { UsageHandler } from './rules/consider-usage';

export function diff(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
  rules: Rule[] = [],
  config?: rules.ConsiderUsageConfig,
): Promise<Change[]> {
  const changes = diffSchema(oldSchema, newSchema);

  return rules.reduce(async (prev, rule) => {
    const prevChanges = await prev;
    return rule({
      changes: prevChanges,
      oldSchema,
      newSchema,
      config,
    });
  }, Promise.resolve(changes));
}
