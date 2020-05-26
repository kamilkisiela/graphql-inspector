import {GraphQLInputObjectType, GraphQLInputField} from 'graphql';

import {isNotEqual, isVoid} from './common/compare';
import {Change} from './changes/change';
import {diffArrays, unionArrays} from '../utils/arrays';
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
  const oldNames = Object.keys(oldFields).map((name) => oldFields[name].name);
  const newNames = Object.keys(newFields).map((name) => newFields[name].name);

  const added = diffArrays(newNames, oldNames).map((name) => newFields[name]);
  const removed = diffArrays(oldNames, newNames).map((name) => oldFields[name]);
  const common = unionArrays(oldNames, newNames).map((name) => ({
    inOld: oldFields[name],
    inNew: newFields[name],
  }));

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

  // TODO: diff directives

  return changes;
}
