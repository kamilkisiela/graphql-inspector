import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLDirective,
  GraphQLObjectType,
  isEnumType,
  isUnionType,
  isInputObjectType,
  isObjectType,
  isInterfaceType,
  isScalarType,
} from 'graphql';

import {isNotEqual, isVoid} from './common/compare';
import {unionArrays, diffArrays} from '../utils/arrays';
import {isPrimitive} from '../utils/graphql';
import {Change} from './changes/change';
import {
  schemaQueryTypeChanged,
  schemaMutationTypeChanged,
  schemaSubscriptionTypeChanged,
} from './changes/schema';
import {
  typeRemoved,
  typeAdded,
  typeKindChanged,
  typeDescriptionChanged,
  typeDescriptionAdded,
  typeDescriptionRemoved,
} from './changes/type';
import {directiveRemoved, directiveAdded} from './changes/directive';
import {changesInEnum} from './enum';
import {changesInUnion} from './union';
import {changesInInputObject} from './input';
import {changesInObject} from './object';
import {changesInInterface} from './interface';
import {changesInDirective} from './directive';

export function diffSchema(
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
  // Changes in Directives
  directives.common.forEach(({inOld, inNew}) => {
    changes.push(...changesInDirective(inOld, inNew));
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
    (name) => !isPrimitive(name),
  );
  const newTypenames = Object.keys(newTypeMap).filter(
    (name) => !isPrimitive(name),
  );

  const added = diffArrays(newTypenames, oldTypenames).map(
    (name) => newTypeMap[name],
  );
  const removed = diffArrays(oldTypenames, newTypenames).map(
    (name) => oldTypeMap[name],
  );
  const common = unionArrays(oldTypenames, newTypenames).map((name) => ({
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
  const oldNames = oldDirectives.map((d) => d.name);
  const newNames = newDirectives.map((d) => d.name);

  const added = diffArrays(newNames, oldNames).map((name) =>
    newDirectives.find((d) => d.name === name),
  ) as GraphQLDirective[];
  const removed = diffArrays(oldNames, newNames).map((name) =>
    oldDirectives.find((d) => d.name === name),
  ) as GraphQLDirective[];
  const common = unionArrays(oldNames, newNames).map((name) => ({
    inOld: oldDirectives.find((d) => d.name === name) as GraphQLDirective,
    inNew: newDirectives.find((d) => d.name === name) as GraphQLDirective,
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

  if (isNotEqual(oldRoot.query, newRoot.query)) {
    changes.push(schemaQueryTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.mutation, newRoot.mutation)) {
    changes.push(schemaMutationTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.subscription, newRoot.subscription)) {
    changes.push(schemaSubscriptionTypeChanged(oldSchema, newSchema));
  }

  return changes;
}

function changesInType(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change[] {
  let changes: Change[] = [];

  if (isEnumType(oldType) && isEnumType(newType)) {
    changes = changesInEnum(oldType, newType);
  } else if (isUnionType(oldType) && isUnionType(newType)) {
    changes = changesInUnion(oldType, newType);
  } else if (isInputObjectType(oldType) && isInputObjectType(newType)) {
    changes = changesInInputObject(oldType, newType);
  } else if (isObjectType(oldType) && isObjectType(newType)) {
    changes = changesInObject(oldType, newType);
  } else if (isInterfaceType(oldType) && isInterfaceType(newType)) {
    changes = changesInInterface(oldType, newType);
  } else if (isScalarType(oldType) && isScalarType(newType)) {
    // what to do with scalar types?
  } else {
    changes = [typeKindChanged(oldType, newType)];
  }

  if (isNotEqual(oldType.description, newType.description)) {
    if (isVoid(oldType.description)) {
      changes.push(typeDescriptionAdded(newType));
    } else if (isVoid(newType.description)) {
      changes.push(typeDescriptionRemoved(oldType));
    } else {
      changes.push(typeDescriptionChanged(oldType, newType));
    }
  }

  return changes;
}
