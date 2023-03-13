import { GraphQLInputField, GraphQLInputObjectType, isNonNullType } from 'graphql';
import { safeChangeForInputValue } from '../../utils/graphql';
import { isDeprecated } from '../../utils/is-deprecated';
import { safeString } from '../../utils/string';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  InputFieldAdded,
  InputFieldDefaultValueChanged,
  InputFieldDescriptionAdded,
  InputFieldDescriptionChanged,
  InputFieldDescriptionRemoved,
  InputFieldRemoved,
  InputFieldTypeChanged,
} from './change';

function buildInputFieldRemovedMessage(args: InputFieldRemoved) {
  return `Input field '${args.meta.removedFieldName}' ${
    args.meta.isInputFieldDeprecated ? '(deprecated) ' : ''
  }was removed from input object type '${args.meta.inputName}'`;
}

export function inputFieldRemoved(
  input: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change<ChangeType.InputFieldRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing an input field will cause existing queries that use this input field to error.',
    },
    type: ChangeType.InputFieldRemoved,
    get message() {
      return buildInputFieldRemovedMessage(this);
    },
    path: [input.name, field.name].join('.'),
    meta: {
      inputName: input.name,
      removedFieldName: field.name,
      isInputFieldDeprecated: isDeprecated(field),
    },
  };
}

export function buildInputFieldAddedMessage(args: InputFieldAdded) {
  return `Input field '${args.meta.addedInputFieldName}' was added to input object type '${args.meta.inputName}'`;
}

export function inputFieldAdded(
  input: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change<ChangeType.InputFieldAdded> {
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
    get message() {
      return buildInputFieldAddedMessage(this);
    },
    path: [input.name, field.name].join('.'),
    meta: {
      inputName: input.name,
      addedInputFieldName: field.name,
    },
  };
}

function buildInputFieldDescriptionAddedMessage(args: InputFieldDescriptionAdded) {
  return `Input field '${args.meta.inputName}.${args.meta.inputFieldName}' has description '${args.meta.addedInputFieldDescription}'`;
}

export function inputFieldDescriptionAdded(
  type: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change<ChangeType.InputFieldDescriptionAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.InputFieldDescriptionAdded,
    get message() {
      return buildInputFieldDescriptionAddedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      inputName: type.name,
      inputFieldName: field.name,
      addedInputFieldDescription: safeString(field.description),
    },
  };
}

function buildInputFieldDescriptionRemovedMessage(args: InputFieldDescriptionRemoved) {
  return `Description was removed from input field '${args.meta.inputName}.${args.meta.inputFieldName}'`;
}

export function inputFieldDescriptionRemoved(
  type: GraphQLInputObjectType,
  field: GraphQLInputField,
): Change<ChangeType.InputFieldDescriptionRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.InputFieldDescriptionRemoved,
    get message() {
      return buildInputFieldDescriptionRemovedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      inputName: type.name,
      inputFieldName: field.name,
    },
  };
}

function buildInputFieldDescriptionChangedMessage(args: InputFieldDescriptionChanged) {
  return `Input field '${args.meta.inputName}.${args.meta.inputFieldName}' description changed from '${args.meta.oldInputFieldDescription}' to '${args.meta.newInputFieldDescription}'`;
}

export function inputFieldDescriptionChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change<ChangeType.InputFieldDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.InputFieldDescriptionChanged,
    get message() {
      return buildInputFieldDescriptionChangedMessage(this);
    },
    path: [input.name, oldField.name].join('.'),
    meta: {
      inputName: input.name,
      inputFieldName: oldField.name,
      oldInputFieldDescription: oldField.description ?? '',
      newInputFieldDescription: newField.description ?? '',
    },
  };
}

function buildInputFieldDefaultValueChangedMessage(args: InputFieldDefaultValueChanged) {
  return `Input field '${args.meta.inputName}.${args.meta.inputFieldName}' default value changed from '${args.meta.oldDefaultValue}' to '${args.meta.newDefaultValue}'`;
}

export function inputFieldDefaultValueChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change<ChangeType.InputFieldDefaultValueChanged> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behavior of a field if it was never provided.',
    },
    type: ChangeType.InputFieldDefaultValueChanged,
    get message() {
      return buildInputFieldDefaultValueChangedMessage(this);
    },
    path: [input.name, oldField.name].join('.'),
    meta: {
      inputName: input.name,
      inputFieldName: oldField.name,
      newDefaultValue: newField.defaultValue ? safeString(newField.defaultValue) : undefined,
      oldDefaultValue: oldField.defaultValue ? safeString(oldField.defaultValue) : undefined,
    },
  };
}

function buildInputFieldTypeChangedMessage(args: InputFieldTypeChanged) {
  return `Input field '${args.meta.inputName}.${args.meta.inputFieldName}' changed type from '${args.meta.oldInputFieldType}' to '${args.meta.newInputFieldType}'`;
}

export function inputFieldTypeChanged(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change<ChangeType.InputFieldTypeChanged> {
  return {
    criticality: safeChangeForInputValue(oldField.type, newField.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason: 'Changing an input field from non-null to null is considered non-breaking.',
        }
      : {
          level: CriticalityLevel.Breaking,
          reason:
            'Changing the type of an input field can cause existing queries that use this field to error.',
        },
    type: ChangeType.InputFieldTypeChanged,
    get message() {
      return buildInputFieldTypeChangedMessage(this);
    },
    path: [input.name, oldField.name].join('.'),
    meta: {
      inputName: input.name,
      inputFieldName: oldField.name,
      oldInputFieldType: oldField.type.toString(),
      newInputFieldType: newField.type.toString(),
    },
  };
}
