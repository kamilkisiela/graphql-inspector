import {GraphQLInterfaceType} from 'graphql';

import {Change} from './changes/change';
import {fieldRemoved, fieldAdded} from './changes/field';
import {changesInField} from './field';
import {diffArrays, unionArrays} from '../utils/arrays';

export function changesInInterface(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
): Change[] {
  const changes: Change[] = [];

  changes.push(...addedFields(oldInterface, newInterface));
  changes.push(...removedFields(oldInterface, newInterface));
  changedFields(oldInterface, newInterface).forEach(({inOld, inNew}) => {
    changes.push(...changesInField(oldInterface, inOld, inNew));
  });

  return changes;
}

function addedFields(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
): Change[] {
  const oldFields = oldInterface.getFields();
  const newFields = newInterface.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return diffArrays(newNames, oldNames)
    .map((name) => newFields[name])
    .map((f) => fieldAdded(newInterface, f));
}

function removedFields(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
): Change[] {
  const oldFields = oldInterface.getFields();
  const newFields = newInterface.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return diffArrays(oldNames, newNames)
    .map((name) => oldFields[name])
    .map((f) => fieldRemoved(oldInterface, f));
}

function changedFields(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
) {
  const oldFields = oldInterface.getFields();
  const newFields = newInterface.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return unionArrays(oldNames, newNames).map((name) => ({
    inOld: oldFields[name],
    inNew: newFields[name],
  }));
}
