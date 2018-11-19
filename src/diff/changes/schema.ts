import {GraphQLSchema} from 'graphql';

import {Change, CriticalityLevel, ChangeType} from './change';

export function schemaQueryTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change {
  const oldName = (oldSchema.getQueryType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getQueryType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaQueryTypeChanged,
    message: `Schema query root has changed from '${oldName}' to '${newName}'`,
  };
}
export function schemaMutationTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change {
  const oldName =
    (oldSchema.getMutationType() || ({} as any)).name || 'unknown';
  const newName =
    (newSchema.getMutationType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaMutationTypeChanged,
    message: `Schema mutation root has changed from '${oldName}' to '${newName}'`,
  };
}
export function schemaSubscriptionTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change {
  const oldName =
    (oldSchema.getSubscriptionType() || ({} as any)).name || 'unknown';
  const newName =
    (newSchema.getSubscriptionType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaSubscriptionTypeChanged,
    message: `Schema subscription root has changed from '${oldName}' to '${newName}'`,
  };
}
