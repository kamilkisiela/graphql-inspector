import {
  GraphQLField,
  GraphQLObjectType,
  GraphQLArgument,
  isEqualType,
} from 'graphql';

import { Change } from '../changes/change';
import {
  fieldDescriptionChanged,
  fieldDeprecationReasonChanged,
  fieldTypeChanged,
  fieldArgumentAdded,
  fieldArgumentRemoved,
} from '../changes/field';
import { changesInArgument } from './argument';
import { unionArrays, diffArrays } from '../utils/arrays';

export function changesInField(
  type: GraphQLObjectType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change[] {
  const changes: Change[] = [];

  if (oldField.description !== newField.description) {
    changes.push(fieldDescriptionChanged(type, oldField, newField));
  }

  if (oldField.deprecationReason !== newField.deprecationReason) {
    changes.push(fieldDeprecationReasonChanged(type, oldField, newField));
  }

  if (!isEqualType(oldField.type, newField.type)) {
    changes.push(fieldTypeChanged(type, oldField, newField));
  }

  const oldArgs = oldField.args;
  const newArgs = newField.args;
  const oldNames = oldArgs.map(a => a.name);
  const newNames = newArgs.map(a => a.name);

  const added = diffArrays(newNames, oldNames).map(
    name => newArgs.find(a => a.name === name) as GraphQLArgument,
  );
  const removed = diffArrays(oldNames, newNames).map(
    name => oldArgs.find(a => a.name === name) as GraphQLArgument,
  );
  const common = unionArrays(oldNames, newNames).map(name => ({
    inOld: oldArgs.find(a => a.name === name) as GraphQLArgument,
    inNew: newArgs.find(a => a.name === name) as GraphQLArgument,
  }));

  common.forEach(({ inOld, inNew }) => {
    changes.push(...changesInArgument(type, oldField, inOld, inNew));
  });

  changes.push(...added.map(arg => fieldArgumentAdded(type, newField, arg)));
  changes.push(
    ...removed.map(arg => fieldArgumentRemoved(type, oldField, arg)),
  );

  return changes;
}
