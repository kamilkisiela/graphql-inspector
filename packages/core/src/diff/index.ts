import {GraphQLSchema} from 'graphql';

import {diffSchema} from './schema';
import {Change} from './changes/change';
import {Rule} from './rules/types';
import * as rules from './rules';

export * from './rules/types';
export const DiffRule = rules;

export function diff(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
  rules: Rule[] = [],
): Change[] {
  const changes = diffSchema(oldSchema, newSchema);

  return rules.reduce(
    (prev, rule) =>
      rule({
        changes: prev,
        oldSchema,
        newSchema,
      }),
    changes,
  );
}
