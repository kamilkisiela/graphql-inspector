import {GraphQLInputObjectType, GraphQLInputField} from 'graphql';

import {diffArrays, isNotEqual, isVoid} from '../utils/compare';
import {compareLists} from '../utils/compare';
import {
  inputFieldAdded,
  inputFieldRemoved,
  inputFieldDescriptionChanged,
  inputFieldDescriptionAdded,
  inputFieldDescriptionRemoved,
  inputFieldDefaultValueChanged,
  inputFieldTypeChanged,
} from './changes/input';
import {AddChange} from './schema';

export function changesInInputObject(
  oldInput: GraphQLInputObjectType,
  newInput: GraphQLInputObjectType,
  addChange: AddChange,
) {
  const oldFields = oldInput.getFields();
  const newFields = newInput.getFields();

  compareLists(Object.values(oldFields), Object.values(newFields), {
    onAdded(field) {
      addChange(inputFieldAdded(newInput, field));
    },
    onRemoved(field) {
      addChange(inputFieldRemoved(oldInput, field));
    },
    onMutual(field) {
      changesInInputField(
        oldInput,
        field.oldVersion,
        field.newVersion,
        addChange,
      );
    },
  });
}

export function addedInInputObject(
  inputObject: GraphQLInputObjectType,
  addChange: AddChange,
) {
  const fields = Object.values(inputObject.getFields());

  fields.forEach((field) => addedInInputField(inputObject, field, addChange));
}

function changesInInputField(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
  addChange: AddChange,
) {
  if (isNotEqual(oldField.description, newField.description)) {
    if (isVoid(oldField.description)) {
      addChange(inputFieldDescriptionAdded(input, newField));
    } else if (isVoid(newField.description)) {
      addChange(inputFieldDescriptionRemoved(input, oldField));
    } else {
      addChange(inputFieldDescriptionChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.defaultValue, newField.defaultValue)) {
    if (
      Array.isArray(oldField.defaultValue) &&
      Array.isArray(newField.defaultValue)
    ) {
      if (diffArrays(oldField.defaultValue, newField.defaultValue).length > 0) {
        addChange(inputFieldDefaultValueChanged(input, oldField, newField));
      }
    } else if (
      JSON.stringify(oldField.defaultValue) !==
      JSON.stringify(newField.defaultValue)
    ) {
      addChange(inputFieldDefaultValueChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
    addChange(inputFieldTypeChanged(input, oldField, newField));
  }
}

function addedInInputField(
  inputObject: GraphQLInputObjectType,
  field: GraphQLInputField,
  addChange: AddChange,
) {
  addChange(inputFieldAdded(inputObject, field));

  if (!isVoid(field.description)) {
    addChange(inputFieldDescriptionAdded(inputObject, field));
  }

  if (!isVoid(field.defaultValue)) {
    // TODO: addChange(inputFieldDefaultValueAdded(input, field))
  }
}