import { GraphQLObjectType, GraphQLField } from 'graphql';

import { Change, CriticalityLevel } from './change';
import { safeChangeForField } from '../utils/graphql';

export function fieldRemoved(
  type: GraphQLObjectType,
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
  type: GraphQLObjectType,
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
  type: GraphQLObjectType,
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
  type: GraphQLObjectType,
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
  type: GraphQLObjectType,
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
