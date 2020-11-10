import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLObjectType,
  isEnumType,
  isUnionType,
  isInputObjectType,
  isObjectType,
  isInterfaceType,
  isScalarType,
} from 'graphql';

import {compareLists, isNotEqual, isVoid} from '../utils/compare';
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
import {addedInEnum, changesInEnum} from './enum';
import {addedInUnion, changesInUnion} from './union';
import {addedInInputObject, changesInInputObject} from './input';
import {changesInObject, addedInObject} from './object';
import {changesInInterface, addedInInterface} from './interface';
import {changesInDirective} from './directive';

export type AddChange = (change: Change) => void;

export interface DiffSchemaOptions {
  full?: boolean;
}

export function diffSchema(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
  options?: DiffSchemaOptions,
): Change[] {
  const changes: Change[] = [];

  function addChange(change: Change) {
    changes.push(change);
  }

  changesInSchema(oldSchema, newSchema, addChange);

  compareLists(
    Object.values(oldSchema.getTypeMap()).filter((t) => !isPrimitive(t)),
    Object.values(newSchema.getTypeMap()).filter((t) => !isPrimitive(t)),
    {
      onAdded(type) {
        addChange(typeAdded(type));

        if (options?.full) {
          addedInType(type, addChange);
        }
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

function changesInSchema(
  oldSchema: GraphQLSchema,
  newSchema: GraphQLSchema,
  addChange: AddChange,
) {
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
    addChange(schemaQueryTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.mutation, newRoot.mutation)) {
    addChange(schemaMutationTypeChanged(oldSchema, newSchema));
  }

  if (isNotEqual(oldRoot.subscription, newRoot.subscription)) {
    addChange(schemaSubscriptionTypeChanged(oldSchema, newSchema));
  }
}

function addedInType(type: GraphQLNamedType, addChange: AddChange) {
  if (isEnumType(type)) {
    addedInEnum(type, addChange);
  } else if (isUnionType(type)) {
    addedInUnion(type, addChange);
  } else if (isInputObjectType(type)) {
    addedInInputObject(type, addChange);
  } else if (isObjectType(type)) {
    addedInObject(type, addChange);
  } else if (isInterfaceType(type)) {
    addedInInterface(type, addChange);
  }
}

function changesInType(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
  addChange: AddChange,
) {
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
