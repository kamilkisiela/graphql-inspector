import {GraphQLSchema} from 'graphql';

import {diffSchema, DiffSchemaOptions} from './schema';
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
  options?: DiffSchemaOptions
): Change[] {
  const changes = diffSchema(oldSchema, newSchema, options);

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
