import {
  GraphQLInputObjectType,
  GraphQLInputField,
  isNonNullType,
} from 'graphql';

import { Change, CriticalityLevel, ChangeType } from './change';
import { isDeprecated } from '../../utils/isDeprecated';
import { safeChangeForInputValue } from '../../utils/graphql';
import { safeString } from '../../utils/string';

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
    type: ChangeType.InputFieldRemoved,
    message: `Input field '${field.name}' ${
      isDeprecated(field) ? '(deprecated) ' : ''
    }was removed from input object type '${input.name}'`,
    path: [input.name, field.name].join('.'),
  };
}

export function inputFieldAdded(
  input: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change {
  return {
    criticality: isNonNullType(field.type)
      ? {
          level: CriticalityLevel.Breaking,
          reason:
            'Adding a required input field to an existing input object type is a breaking change because it will cause existing uses of this input object type to error.',
        }
      : {
          level: CriticalityLevel.Dangerous,
        },
    type: ChangeType.InputFieldAdded,
    message: `Input field '${field.name}' was added to input object type '${input.name}'`,
    path: [input.name, field.name].join('.'),
  };
}

export function inputFieldDescriptionAdded(
  type: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.InputFieldDescriptionAdded,
    message: `Input field '${type.name}.${field.name}' has description '${field.description}'`,
    path: [type.name, field.name].join('.'),
  };
}

export function inputFieldDescriptionRemoved(
  type: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.InputFieldDescriptionRemoved,
    message: `Description was removed from input field '${type.name}.${field.name}'`,
    path: [type.name, field.name].join('.'),
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
    type: ChangeType.InputFieldDescriptionChanged,
    message: `Input field '${input.name}.${oldField.name}' description changed from '${oldField.description}' to '${newField.description}'`,
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
    type: ChangeType.InputFieldDefaultValueChanged,
    message: `Input field '${input.name}.${oldField.name}' default value changed from '${safeString(oldField.defaultValue)}' to '${safeString(newField.defaultValue)}'`,
    path: [input.name, oldField.name].join('.'),
  };
}

export function inputFieldTypeChanged(
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
    type: ChangeType.InputFieldTypeChanged,
    message: `Input field '${input.name}.${
      oldField.name
    }' changed type from '${oldField.type.toString()}' to '${newField.type.toString()}'`,
    path: [input.name, oldField.name].join('.'),
  };
}
