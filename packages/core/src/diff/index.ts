import {GraphQLSchema} from 'graphql';

import {diffSchema} from './schema';
import {Change} from './changes/change';
import {Rule} from './rules/types';
import {Config} from './rules/config';
import * as rulesRegistry from './rules';

export const DiffRule = rulesRegistry;

export async function diff(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
  rules: Rule[] = [],
  config?: Config,
): Promise<Change[]> {
  const changes = diffSchema(oldSchema, newSchema);

  return rules.reduce(async (accPromise, rule) => {
    const prev = await accPromise;

    return rule({
      changes: prev,
      oldSchema,
      newSchema,
      config,
    });
  }, Promise.resolve(changes));
}
