import { GraphQLSchema } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  SchemaMutationTypeChanged,
  SchemaQueryTypeChanged,
  SchemaSubscriptionTypeChanged,
} from './change';

function buildSchemaQueryTypeChangedMessage(args: SchemaQueryTypeChanged['meta']): string {
  return `Schema query root has changed from '${args.oldQueryTypeName}' to '${args.newQueryTypeName}'`;
}

export function schemaQueryTypeChangedFromMeta(args: SchemaQueryTypeChanged) {
  return {
    type: ChangeType.SchemaQueryTypeChanged,
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: buildSchemaQueryTypeChangedMessage(args.meta),
    meta: args.meta,
  } as const;
}

export function schemaQueryTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaQueryTypeChanged> {
  const oldName = (oldSchema.getQueryType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getQueryType() || ({} as any)).name || 'unknown';

  return schemaQueryTypeChangedFromMeta({
    type: ChangeType.SchemaQueryTypeChanged,
    meta: {
      oldQueryTypeName: oldName,
      newQueryTypeName: newName,
    },
  });
}

function buildSchemaMutationTypeChangedMessage(args: SchemaMutationTypeChanged['meta']): string {
  return `Schema mutation root has changed from '${args.oldMutationTypeName}' to '${args.newMutationTypeName}'`;
}

export function schemaMutationTypeChangedFromMeta(args: SchemaMutationTypeChanged) {
  return {
    type: ChangeType.SchemaMutationTypeChanged,
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: buildSchemaMutationTypeChangedMessage(args.meta),
    meta: args.meta,
  } as const;
}

export function schemaMutationTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaMutationTypeChanged> {
  const oldName = (oldSchema.getMutationType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getMutationType() || ({} as any)).name || 'unknown';

  return schemaMutationTypeChangedFromMeta({
    type: ChangeType.SchemaMutationTypeChanged,
    meta: {
      newMutationTypeName: newName,
      oldMutationTypeName: oldName,
    },
  });
}

function buildSchemaSubscriptionTypeChangedMessage(
  args: SchemaSubscriptionTypeChanged['meta'],
): string {
  return `Schema subscription root has changed from '${args.oldSubscriptionTypeName}' to '${args.newSubscriptionTypeName}'`;
}

export function schemaSubscriptionTypeChangedFromMeta(args: SchemaSubscriptionTypeChanged) {
  return {
    type: ChangeType.SchemaSubscriptionTypeChanged,
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: buildSchemaSubscriptionTypeChangedMessage(args.meta),
    meta: args.meta,
  } as const;
}

export function schemaSubscriptionTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaSubscriptionTypeChanged> {
  const oldName = (oldSchema.getSubscriptionType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getSubscriptionType() || ({} as any)).name || 'unknown';

  return schemaSubscriptionTypeChangedFromMeta({
    type: ChangeType.SchemaSubscriptionTypeChanged,
    meta: {
      newSubscriptionTypeName: newName,
      oldSubscriptionTypeName: oldName,
    },
  });
}
