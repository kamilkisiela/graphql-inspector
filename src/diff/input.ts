import {GraphQLInputObjectType, GraphQLInputField} from 'graphql';
import {Change} from '../changes/change';
import {diffArrays, unionArrays} from '../utils/arrays';
import {
  inputFieldAdded,
  inputFieldRemoved,
  inputFieldDescriptionChanged,
  inputFieldDefaultValueChanged,
} from '../changes/input';

export function changesInInputObject(
  oldInput: GraphQLInputObjectType,
  newInput: GraphQLInputObjectType,
): Change[] {
  const changes: Change[] = [];
  const oldFields = oldInput.getFields();
  const newFields = newInput.getFields();
  const oldNames = Object.keys(oldFields).map(name => oldFields[name].name);
  const newNames = Object.keys(newFields).map(name => newFields[name].name);

  const added = diffArrays(newNames, oldNames).map(name => newFields[name]);
  const removed = diffArrays(oldNames, newNames).map(name => oldFields[name]);
  const common = unionArrays(oldNames, newNames).map(name => ({
    inOld: oldFields[name],
    inNew: newFields[name],
  }));

  common.forEach(({inOld, inNew}) => {
    changes.push(...changesInInputField(oldInput, inOld, inNew));
  });

  changes.push(...added.map(field => inputFieldAdded(newInput, field)));
  changes.push(...removed.map(field => inputFieldRemoved(oldInput, field)));

  return changes;
}

function changesInInputField(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
): Change[] {
  const changes: Change[] = [];

  if (oldField.description !== newField.description) {
    changes.push(inputFieldDescriptionChanged(input, oldField, newField));
  }

  if (oldField.defaultValue !== newField.defaultValue) {
    changes.push(inputFieldDefaultValueChanged(input, oldField, newField));
  }

  if (oldField.type.toString() !== newField.type.toString()) {
    changes.push(inputFieldDefaultValueChanged(input, oldField, newField));
  }

  // TODO: diff directives

  return changes;
}
