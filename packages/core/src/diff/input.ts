import {GraphQLInputObjectType, GraphQLInputField} from 'graphql';

import {diffArrays, isNotEqual, isVoid} from '../utils/compare';
import {Change} from './changes/change';
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

export function changesInInputObject(
  oldInput: GraphQLInputObjectType,
  newInput: GraphQLInputObjectType,
): Change[] {
  const changes: Change[] = [];
  const oldFields = oldInput.getFields();
  const newFields = newInput.getFields();

  const {added, removed, common} = compareLists(
    Object.values(oldFields),
    Object.values(newFields),
  );

  common.forEach(({inOld, inNew}) => {
    changes.push(...changesInInputField(oldInput, inOld, inNew));
  });

  changes.push(...added.map((field) => inputFieldAdded(newInput, field)));
  changes.push(...removed.map((field) => inputFieldRemoved(oldInput, field)));

  return changes;
}

function changesInInputField(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldField.description, newField.description)) {
    if (isVoid(oldField.description)) {
      changes.push(inputFieldDescriptionAdded(input, newField));
    } else if (isVoid(newField.description)) {
      changes.push(inputFieldDescriptionRemoved(input, oldField));
    } else {
      changes.push(inputFieldDescriptionChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.defaultValue, newField.defaultValue)) {
    if (
      Array.isArray(oldField.defaultValue) &&
      Array.isArray(newField.defaultValue)
    ) {
      if (diffArrays(oldField.defaultValue, newField.defaultValue).length > 0) {
        changes.push(inputFieldDefaultValueChanged(input, oldField, newField));
      }
    } else if (
      JSON.stringify(oldField.defaultValue) !==
      JSON.stringify(newField.defaultValue)
    ) {
      changes.push(inputFieldDefaultValueChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
    changes.push(inputFieldTypeChanged(input, oldField, newField));
  }

  return changes;
}
