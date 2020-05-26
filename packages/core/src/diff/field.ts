import {
  GraphQLField,
  GraphQLObjectType,
  GraphQLArgument,
  GraphQLInterfaceType,
} from 'graphql';

import {isNotEqual, isVoid} from './common/compare';
import {Change} from './changes/change';
import {
  fieldDescriptionChanged,
  fieldDescriptionAdded,
  fieldDescriptionRemoved,
  fieldDeprecationAdded,
  fieldDeprecationRemoved,
  fieldDeprecationReasonChanged,
  fieldDeprecationReasonAdded,
  fieldDeprecationReasonRemoved,
  fieldTypeChanged,
  fieldArgumentAdded,
  fieldArgumentRemoved,
} from './changes/field';
import {changesInArgument} from './argument';
import {unionArrays, diffArrays} from '../utils/arrays';

export function changesInField(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldField.description, newField.description)) {
    if (isVoid(oldField.description)) {
      changes.push(fieldDescriptionAdded(type, newField));
    } else if (isVoid(newField.description)) {
      changes.push(fieldDescriptionRemoved(type, oldField));
    } else {
      changes.push(fieldDescriptionChanged(type, oldField, newField));
    }
  }

  if (isNotEqual(oldField.isDeprecated, newField.isDeprecated)) {
    if (newField.isDeprecated) {
      changes.push(fieldDeprecationAdded(type, newField));
    } else {
      changes.push(fieldDeprecationRemoved(type, oldField));
    }
  }

  if (isNotEqual(oldField.deprecationReason, newField.deprecationReason)) {
    if (isVoid(oldField.deprecationReason)) {
      changes.push(fieldDeprecationReasonAdded(type, newField));
    } else if (isVoid(newField.deprecationReason)) {
      changes.push(fieldDeprecationReasonRemoved(type, oldField));
    } else {
      changes.push(fieldDeprecationReasonChanged(type, oldField, newField));
    }
  }

  if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
    changes.push(fieldTypeChanged(type, oldField, newField));
  }

  const oldArgs = oldField.args;
  const newArgs = newField.args;
  const oldNames = oldArgs.map((a) => a.name);
  const newNames = newArgs.map((a) => a.name);

  const added = diffArrays(newNames, oldNames).map(
    (name) => newArgs.find((a) => a.name === name) as GraphQLArgument,
  );
  const removed = diffArrays(oldNames, newNames).map(
    (name) => oldArgs.find((a) => a.name === name) as GraphQLArgument,
  );
  const common = unionArrays(oldNames, newNames).map((name) => ({
    inOld: oldArgs.find((a) => a.name === name) as GraphQLArgument,
    inNew: newArgs.find((a) => a.name === name) as GraphQLArgument,
  }));

  common.forEach(({inOld, inNew}) => {
    changes.push(...changesInArgument(type, oldField, inOld, inNew));
  });

  changes.push(...added.map((arg) => fieldArgumentAdded(type, newField, arg)));
  changes.push(
    ...removed.map((arg) => fieldArgumentRemoved(type, oldField, arg)),
  );

  return changes;
}
