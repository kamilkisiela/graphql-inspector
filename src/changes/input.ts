import {
  GraphQLInputObjectType,
  GraphQLInputField,
  GraphQLNonNull,
} from 'graphql';

import { Change, CriticalityLevel } from './change';
import { safeChangeForInputValue } from '../utils/graphql';

export function inputFieldRemoved(
  input: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing an input field will cause existing queries that use this input field to error.',
    },
    message: `Input field '${field.name}' was removed from Input object type '${
      input.name
    }'`,
    path: [input.name, field.name].join('.'),
  };
}

export function inputFieldAdded(
  input: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change {
  return {
    criticality:
      field.type instanceof GraphQLNonNull
        ? {
            level: CriticalityLevel.Breaking,
            reason:
              'Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.',
          }
        : {
            level: CriticalityLevel.NonBreaking,
          },
    message: `Member '${field.name}' was added to Union '${input.name}'`,
    path: [input.name, field.name].join('.'),
  };
}

export function inputFieldDescriptionChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Input field '${input.name}.${
      oldField.name
    }' description changed from '${oldField.description}' to '${
      newField.description
    }'`,
    path: [input.name, oldField.name].join('.'),
  };
}

export function inputFieldDefaultValueChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
    },
    message: `Input field '${input.name}.${
      oldField.name
    }' default value changed from '${oldField.defaultValue}' to '${
      newField.defaultValue
    }'`,
    path: [input.name, oldField.name].join('.'),
  };
}

export function ipnputFieldTypeChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change {
  return {
    criticality: safeChangeForInputValue(oldField.type, newField.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason:
            'Changing an input field from non-null to null is considered non-breaking.',
        }
      : {
          level: CriticalityLevel.Breaking,
          reason:
            'Changing the type of an input field can cause existing queries that use this field to error.',
        },
    message: `Input field '${input.name}.${oldField.name}' changed type from '${
      oldField.type
    }' to '${newField.type}'`,
    path: [input.name, oldField.name].join('.'),
  };
}
