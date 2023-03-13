import { GraphQLSchema } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  SchemaMutationTypeChanged,
  SchemaQueryTypeChanged,
  SchemaSubscriptionTypeChanged,
} from './change';

function buildSchemaQueryTypeChangedMessage(args: SchemaQueryTypeChanged): string {
  return `Schema query root has changed from '${args.meta.oldQueryTypeName}' to '${args.meta.newQueryTypeName}'`;
}

export function schemaQueryTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaQueryTypeChanged> {
  const oldName = (oldSchema.getQueryType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getQueryType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaQueryTypeChanged,
    get message() {
      return buildSchemaQueryTypeChangedMessage(this);
    },
    meta: {
      oldQueryTypeName: oldName,
      newQueryTypeName: newName,
    },
  };
}

function buildSchemaMutationTypeChangedMessage(args: SchemaMutationTypeChanged): string {
  return `Schema mutation root has changed from '${args.meta.oldMutationTypeName}' to '${args.meta.newMutationTypeName}'`;
}

export function schemaMutationTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaMutationTypeChanged> {
  const oldName = (oldSchema.getMutationType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getMutationType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaMutationTypeChanged,
    get message() {
      return buildSchemaMutationTypeChangedMessage(this);
    },
    meta: {
      newMutationTypeName: newName,
      oldMutationTypeName: oldName,
    },
  };
}

function buildSchemaSubscriptionTypeChangedMessage(args: SchemaSubscriptionTypeChanged): string {
  return `Schema subscription root has changed from '${args.meta.oldSubscriptionTypeName}' to '${args.meta.newSubscriptionTypeName}'`;
}

export function schemaSubscriptionTypeChanged(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change<ChangeType.SchemaSubscriptionTypeChanged> {
  const oldName = (oldSchema.getSubscriptionType() || ({} as any)).name || 'unknown';
  const newName = (newSchema.getSubscriptionType() || ({} as any)).name || 'unknown';

  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.SchemaSubscriptionTypeChanged,
    get message() {
      return buildSchemaSubscriptionTypeChangedMessage(this);
    },
    meta: {
      newSubscriptionTypeName: newName,
      oldSubscriptionTypeName: oldName,
    },
  };
}
