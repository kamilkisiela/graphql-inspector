import {GraphQLObjectType, GraphQLInterfaceType} from 'graphql';

import {Change} from './changes/change';
import {
  objectTypeInterfaceAdded,
  objectTypeInterfaceRemoved,
} from './changes/object';
import {fieldRemoved, fieldAdded} from './changes/field';
import {changesInField} from './field';
import {diffArrays, unionArrays} from '../utils/arrays';

export function changesInObject(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const changes: Change[] = [];

  // Interfaces
  changes.push(...addedInterfaces(oldType, newType));
  changes.push(...removedInterfaces(oldType, newType));
  // Fields
  changes.push(...addedFields(oldType, newType));
  changes.push(...removedFields(oldType, newType));

  changedFields(oldType, newType).forEach(({inOld, inNew}) => {
    changes.push(...changesInField(oldType, inOld, inNew));
  });

  return changes;
}

function addedInterfaces(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const oldInterfaces = oldType.getInterfaces();
  const newInterfaces = newType.getInterfaces();
  const oldNames = oldInterfaces.map((i) => i.name);
  const newNames = newInterfaces.map((i) => i.name);

  return diffArrays(newNames, oldNames)
    .map(
      (name) =>
        newInterfaces.find((i) => i.name === name) as GraphQLInterfaceType,
    )
    .map((i) => objectTypeInterfaceAdded(i, newType));
}

function removedInterfaces(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const oldInterfaces = oldType.getInterfaces();
  const newInterfaces = newType.getInterfaces();
  const oldNames = oldInterfaces.map((i) => i.name);
  const newNames = newInterfaces.map((i) => i.name);

  return diffArrays(oldNames, newNames)
    .map(
      (name) =>
        oldInterfaces.find((i) => i.name === name) as GraphQLInterfaceType,
    )
    .map((i) => objectTypeInterfaceRemoved(i, newType));
}

function addedFields(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const oldFields = oldType.getFields();
  const newFields = newType.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return diffArrays(newNames, oldNames)
    .map((name) => newFields[name])
    .map((f) => fieldAdded(newType, f));
}

function removedFields(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const oldFields = oldType.getFields();
  const newFields = newType.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return diffArrays(oldNames, newNames)
    .map((name) => oldFields[name])
    .map((f) => fieldRemoved(oldType, f));
}

function changedFields(oldType: GraphQLObjectType, newType: GraphQLObjectType) {
  const oldFields = oldType.getFields();
  const newFields = newType.getFields();
  const oldNames = Object.keys(oldFields);
  const newNames = Object.keys(newFields);

  return unionArrays(oldNames, newNames).map((name) => ({
    inOld: oldFields[name],
    inNew: newFields[name],
  }));
}
