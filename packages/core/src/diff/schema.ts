import {
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql';
import { compareLists, isNotEqual, isVoid } from '../utils/compare';
import { isPrimitive } from '../utils/graphql';
import { Change } from './changes/change';
import { directiveAdded, directiveRemoved } from './changes/directive';
import {
  schemaMutationTypeChanged,
  schemaQueryTypeChanged,
  schemaSubscriptionTypeChanged,
} from './changes/schema';
import {
  typeAdded,
  typeDescriptionAdded,
  typeDescriptionChanged,
  typeDescriptionRemoved,
  typeKindChanged,
  typeRemoved,
} from './changes/type';
import { changesInDirective } from './directive';
import { changesInEnum } from './enum';
import { changesInInputObject } from './input';
import { changesInInterface } from './interface';
import { changesInObject } from './object';
import { changesInUnion } from './union';

export type AddChange = (change: Change) => void;

export function diffSchema(oldSchema: GraphQLSchema, newSchema: GraphQLSchema): Change[] {
  const changes: Change[] = [];

  function addChange(change: Change) {
    changes.push(change);
  }

  changesInSchema(oldSchema, newSchema, addChange);

  compareLists(
    Object.values(oldSchema.getTypeMap()).filter(t => !isPrimitive(t)),
    Object.values(newSchema.getTypeMap()).filter(t => !isPrimitive(t)),
    {
      onAdded(type) {
        addChange(typeAdded(type));
      },
      onRemoved(type) {
        addChange(typeRemoved(type));
      },
      onMutual(type) {
        changesInType(type.oldVersion, type.newVersion, addChange);
      },
    },
  );

  compareLists(oldSchema.getDirectives(), newSchema.getDirectives(), {
    onAdded(directive) {
      addChange(directiveAdded(directive));
    },
    onRemoved(directive) {
      addChange(directiveRemoved(directive));
    },
    onMutual(directive) {
      changesInDirective(directive.oldVersion, directive.newVersion, addChange);
    },
  });

  return changes;
}

function changesInSchema(oldSchema: GraphQLSchema, newSchema: GraphQLSchema, addChange: AddChange) {
  const defaultNames = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription',
  };
  const oldRoot = {
    query: (oldSchema.getQueryType() || ({} as GraphQLObjectType)).name ?? defaultNames.query,
    mutation:
      (oldSchema.getMutationType() || ({} as GraphQLObjectType)).name ?? defaultNames.mutation,
    subscription:
      (oldSchema.getSubscriptionType() || ({} as GraphQLObjectType)).name ??
      defaultNames.subscription,
  };
  const newRoot = {
    query: (newSchema.getQueryType() || ({} as GraphQLObjectType)).name ?? defaultNames.query,
    mutation:
      (newSchema.getMutationType() || ({} as GraphQLObjectType)).name ?? defaultNames.mutation,
    subscription:
      (newSchema.getSubscriptionType() || ({} as GraphQLObjectType)).name ??
      defaultNames.subscription,
  };

  if (isNotEqual(oldRoot.query, newRoot.query)) {
    addChange(schemaQueryTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.mutation, newRoot.mutation)) {
    addChange(schemaMutationTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.subscription, newRoot.subscription)) {
    addChange(schemaSubscriptionTypeChanged(oldSchema, newSchema));
  }
}

function changesInType(oldType: GraphQLNamedType, newType: GraphQLNamedType, addChange: AddChange) {
  if (isEnumType(oldType) && isEnumType(newType)) {
    changesInEnum(oldType, newType, addChange);
  } else if (isUnionType(oldType) && isUnionType(newType)) {
    changesInUnion(oldType, newType, addChange);
  } else if (isInputObjectType(oldType) && isInputObjectType(newType)) {
    changesInInputObject(oldType, newType, addChange);
  } else if (isObjectType(oldType) && isObjectType(newType)) {
    changesInObject(oldType, newType, addChange);
  } else if (isInterfaceType(oldType) && isInterfaceType(newType)) {
    changesInInterface(oldType, newType, addChange);
  } else if (isScalarType(oldType) && isScalarType(newType)) {
    // what to do with scalar types?
  } else {
    addChange(typeKindChanged(oldType, newType));
  }

  if (isNotEqual(oldType.description, newType.description)) {
    if (isVoid(oldType.description)) {
      addChange(typeDescriptionAdded(newType));
    } else if (isVoid(newType.description)) {
      addChange(typeDescriptionRemoved(oldType));
    } else {
      addChange(typeDescriptionChanged(oldType, newType));
    }
  }
}
