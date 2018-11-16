import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  isEnumType,
  isUnionType,
  isInputObjectType,
  isObjectType,
  isInterfaceType,
  GraphQLInterfaceType,
} from 'graphql';

import {unionArrays, diffArrays} from '../utils/arrays';
import {isPrimitive} from '../utils/graphql';
import {Change} from '../changes/change';
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
import {directiveRemoved, directiveAdded} from '../changes/directive';
import {changesInEnum} from './enum';
import {changesInUnion} from './union';
import {changesInInputObject} from './input';
import {changesInObject} from './object';
import {changesInInterface} from './interface';

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
  types.common.forEach(({inOld, inNew}) => {
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
  const oldTypenames = Object.keys(oldTypeMap).filter(
    name => !isPrimitive(name),
  );
  const newTypenames = Object.keys(newTypeMap).filter(
    name => !isPrimitive(name),
  );

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
  const oldRoot = {
    query: (oldSchema.getQueryType() || ({} as GraphQLObjectType)).name,
    mutation: (oldSchema.getMutationType() || ({} as GraphQLObjectType)).name,
    subscription: (oldSchema.getSubscriptionType() || ({} as GraphQLObjectType))
      .name,
  };
  const newRoot = {
    query: (newSchema.getQueryType() || ({} as GraphQLObjectType)).name,
    mutation: (newSchema.getMutationType() || ({} as GraphQLObjectType)).name,
    subscription: (newSchema.getSubscriptionType() || ({} as GraphQLObjectType))
      .name,
  };

  if (oldRoot.query !== newRoot.query) {
    changes.push(schemaQueryTypeChanged(oldSchema, newSchema));
  }

  if (oldRoot.mutation !== newRoot.mutation) {
    changes.push(schemaMutationTypeChanged(oldSchema, newSchema));
  }

  if (oldRoot.subscription !== newRoot.subscription) {
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
    if (isEnumType(oldType)) {
      changes.push(...changesInEnum(oldType, newType as GraphQLEnumType));
    } else if (isUnionType(oldType)) {
      changes.push(...changesInUnion(oldType, newType as GraphQLUnionType));
    } else if (isInputObjectType(oldType)) {
      changes.push(
        ...changesInInputObject(oldType, newType as GraphQLInputObjectType),
      );
    } else if (isObjectType(oldType)) {
      changes.push(...changesInObject(oldType, newType as GraphQLObjectType));
    } else if (isInterfaceType(oldType)) {
      changes.push(
        ...changesInInterface(oldType, newType as GraphQLInterfaceType),
      );
    }
  }

  if (oldType.description !== newType.description) {
    changes.push(typeDescriptionChanged(oldType, newType));
  }

  return changes;
}
