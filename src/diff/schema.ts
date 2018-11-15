import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInterfaceType,
} from 'graphql';

import { unionArrays, diffArrays } from '../utils/arrays';
import { Change } from '../changes/change';
import {
  schemaQueryTypeChanged,
  schemaMutationTypeChanged,
  schemaSubscriptionTypeChanged,
} from '../changes/schema';
import {
  typeRemoved,
  typeAdded,
  typeKindChanged,
  typeDescriptionChanged,
} from '../changes/type';
import { directiveRemoved, directiveAdded } from '../changes/directive';
import { changesInEnum } from './enum';
import { changesInUnion } from './union';

export function diff(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change[] {
  const changes: Change[] = [];

  const types = diffTypes(oldSchema, newSchema);
  const directives = diffDirectives(oldSchema, newSchema);

  // Added and removed types
  changes.push(...types.added.map(typeAdded));
  changes.push(...types.removed.map(typeRemoved));
  // Added and removed directives
  changes.push(...directives.added.map(directiveAdded));
  changes.push(...directives.removed.map(directiveRemoved));

  // Changes in Schema
  changes.push(...changesInSchema(oldSchema, newSchema));
  // Changes in Type
  types.common.forEach(({ inOld, inNew }) => {
    changes.push(...changesInType(inOld, inNew));
  });

  return changes;
}

function diffTypes(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): {
  added: GraphQLNamedType[];
  removed: GraphQLNamedType[];
  common: {
    inOld: GraphQLNamedType;
    inNew: GraphQLNamedType;
  }[];
} {
  const oldTypeMap = oldSchema.getTypeMap();
  const newTypeMap = newSchema.getTypeMap();
  const oldTypenames = Object.keys(oldTypeMap);
  const newTypenames = Object.keys(newTypeMap);

  const added = diffArrays(newTypenames, oldTypenames).map(
    name => newTypeMap[name],
  );
  const removed = diffArrays(oldTypenames, newTypenames).map(
    name => oldTypeMap[name],
  );
  const common = unionArrays(oldTypenames, newTypenames).map(name => ({
    inOld: oldTypeMap[name],
    inNew: newTypeMap[name],
  }));

  return {
    added,
    removed,
    common,
  };
}

function diffDirectives(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): {
  added: GraphQLDirective[];
  removed: GraphQLDirective[];
  common: {
    inOld: GraphQLDirective;
    inNew: GraphQLDirective;
  }[];
} {
  const oldDirectives = oldSchema.getDirectives();
  const newDirectives = newSchema.getDirectives();
  const oldNames = oldDirectives.map(d => d.name);
  const newNames = newDirectives.map(d => d.name);

  const added = diffArrays(newNames, oldNames).map(name =>
    oldDirectives.find(d => d.name === name),
  ) as GraphQLDirective[];
  const removed = diffArrays(oldNames, newNames).map(name =>
    oldDirectives.find(d => d.name === name),
  ) as GraphQLDirective[];
  const common = unionArrays(oldNames, newNames).map(name => ({
    inOld: oldDirectives.find(d => d.name === name) as GraphQLDirective,
    inNew: newDirectives.find(d => d.name === name) as GraphQLDirective,
  }));

  return {
    added,
    removed,
    common,
  };
}

function changesInSchema(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
): Change[] {
  const changes: Change[] = [];

  if (oldSchema.getQueryType() !== newSchema.getQueryType()) {
    changes.push(schemaQueryTypeChanged(oldSchema, newSchema));
  }

  if (oldSchema.getMutationType() !== newSchema.getMutationType()) {
    changes.push(schemaMutationTypeChanged(oldSchema, newSchema));
  }

  if (oldSchema.getSubscriptionType() !== newSchema.getSubscriptionType()) {
    changes.push(schemaSubscriptionTypeChanged(oldSchema, newSchema));
  }

  return changes;
}

function changesInType(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change[] {
  const changes: Change[] = [];

  if ((oldType as any).kind !== (newType as any).kind) {
    changes.push(typeKindChanged(oldType, newType));
  } else {
    if (oldType instanceof GraphQLEnumType) {
      changes.push(...changesInEnum(oldType, newType as GraphQLEnumType));
    } else if (oldType instanceof GraphQLUnionType) {
      changes.push(...changesInUnion(oldType, newType as GraphQLUnionType));
    } else if (oldType instanceof GraphQLInputObjectType) {
    } else if (oldType instanceof GraphQLObjectType) {
    } else if (oldType instanceof GraphQLInterfaceType) {
    }
  }

  if (oldType.description !== newType.description) {
    changes.push(typeDescriptionChanged(oldType, newType));
  }

  return changes;
}
