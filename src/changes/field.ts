import {
  GraphQLObjectType,
  GraphQLField,
  GraphQLArgument,
  isNonNullType,
  GraphQLInterfaceType,
} from 'graphql';

import {Change, CriticalityLevel} from './change';
import {safeChangeForField} from '../utils/graphql';

export function fieldRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: field.deprecationReason
        ? `Removing a deprecated field is a breaking change. Before removing it, you may want to look at the field's usage to see the impact of removing the field.`
        : `Removing a field is a breaking change. It is preferable to deprecate the field before removing it.`,
    },
    message: `Field '${field.name}' was removed from object type '${
      type.name
    }'`,
    path: [type.name, field.name].join('.'),
  };
}

export function fieldAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Field '${field.name}' was added to object type '${type.name}'`,
    path: [type.name, field.name].join('.'),
  };
}

export function fieldDescriptionChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Field '${type.name}.${oldField.name}' description changed from '${
      oldField.description
    }' to '${newField.description}'`,
    path: [type.name, oldField.name].join('.'),
  };
}

export function fieldDeprecationReasonChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Deprecation reason on field '${type.name}.${
      newField.name
    }' has changed from '${oldField.deprecationReason}' to '${
      newField.deprecationReason
    }'`,
    path: [type.name, oldField.name].join('.'),
  };
}

export function fieldTypeChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any, any>,
  newField: GraphQLField<any, any, any>,
): Change {
  return {
    criticality: {
      level: safeChangeForField(oldField.type, newField.type)
        ? CriticalityLevel.NonBreaking
        : CriticalityLevel.Breaking,
    },
    message: `Field '${type}.${oldField.name}' changed type from '${
      oldField.type
    }' to '${newField.type}'`,
    path: [type.name, oldField.name].join('.'),
  };
}

export function fieldArgumentAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change {
  return {
    criticality: isNonNullType(arg.type)
      ? {
          level: CriticalityLevel.Breaking,
          reason: `Adding a required argument to an existing field is a breaking change because it will cause existing uses of this field to error.`,
        }
      : {
          level: CriticalityLevel.NonBreaking,
        },
    message: `Argument '${arg.name}: ${arg.type}' added to field '${
      type.name
    }.${field.name}'`,
    path: [type.name, field.name, arg.name].join('.'),
  };
}

export function fieldArgumentRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Removing a field argument is a breaking change because it will cause existing queries that use this argument to error.`,
    },
    message: `Argument '${arg.name}: ${arg.type}' was removed from field '${
      type.name
    }.${field.name}'`,
    path: [type.name, field.name, arg.name].join('.'),
  };
}
