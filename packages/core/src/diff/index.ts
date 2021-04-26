import {GraphQLSchema} from 'graphql';

import {diffSchema} from './schema';
import {Change} from './changes/change';
import {Rule} from './rules/types';
import * as rules from './rules';

export * from './rules/types';
export const DiffRule = rules;

export * from './onComplete/types';

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
