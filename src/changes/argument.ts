import { GraphQLArgument, GraphQLObjectType, GraphQLField } from 'graphql';

import { Change, CriticalityLevel } from './change';
import { safeChangeForInputValue } from '../utils/graphql';

export function fieldArgumentDescriptionChanged(
  type: GraphQLObjectType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Description for argument '${newArg.name}' on field '${
      type.name
    }.${field.name}' changed from '${oldArg.description}' to '${
      newArg.description
    }'`,
    path: [type.name, field.name, oldArg.name].join('.'),
  };
}

export function fieldArgumentDefaultChanged(
  type: GraphQLObjectType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
    },
    message:
      typeof newArg.defaultValue === 'undefined'
        ? `Default value '${newArg.defaultValue}' was added to argument '${
            newArg.name
          }' on field '${type.name}.${field.name}'`
        : `Default value for argument '${newArg.name}' on field '${type.name}.${
            field.name
          }' changed from '${oldArg.defaultValue}' to '${newArg.defaultValue}'`,
    path: [type.name, field.name, oldArg.name].join('.'),
  };
}

export function fieldArgumentTypeChanged(
  type: GraphQLObjectType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: safeChangeForInputValue(oldArg.type, newArg.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason: `Changing an input field from non-null to null is considered non-breaking.`,
        }
      : {
          level: CriticalityLevel.Breaking,
          reason: `Changing the type of a field's argument can cause existing queries that use this argument to error.`,
        },
    message: `Type for argument '${newArg.name}' on field '${type.name}.${
      field.name
    }' changed from '${oldArg.type}' to '${newArg.type}'`,
    path: [type.name, field.name, oldArg.name].join('.'),
  };
}
