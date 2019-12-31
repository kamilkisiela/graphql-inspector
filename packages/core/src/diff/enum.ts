import {GraphQLEnumType, GraphQLEnumValue} from 'graphql';

import {isNotEqual} from './common/compare';
import {
  enumValueRemoved,
  enumValueAdded,
  enumValueDescriptionChanged,
  enumValueDeprecationReasonChanged,
} from './changes/enum';
import {Change} from './changes/change';
import {unionArrays, diffArrays} from '../utils/arrays';

export function changesInEnum(
  oldEnum: GraphQLEnumType,
  newEnum: GraphQLEnumType,
): Change[] {
  const changes: Change[] = [];
  const oldNames = oldEnum.getValues().map(v => v.name);
  const newNames = newEnum.getValues().map(v => v.name);

  const added = diffArrays(newNames, oldNames).map(
    name => newEnum.getValue(name) as GraphQLEnumValue,
  );
  const removed = diffArrays(oldNames, newNames).map(
    name => oldEnum.getValue(name) as GraphQLEnumValue,
  );
  const common = unionArrays(oldNames, newNames).map(name => ({
    oldValue: oldEnum.getValue(name) as GraphQLEnumValue,
    newValue: newEnum.getValue(name) as GraphQLEnumValue,
  }));

  changes.push(...added.map(v => enumValueAdded(newEnum, v)));
  changes.push(...removed.map(v => enumValueRemoved(oldEnum, v)));

  common.forEach(({oldValue, newValue}) => {
    if (isNotEqual(oldValue.description, newValue.description)) {
      changes.push(enumValueDescriptionChanged(newEnum, oldValue, newValue));
    }

    if (isNotEqual(oldValue.deprecationReason, newValue.deprecationReason)) {
      changes.push(
        enumValueDeprecationReasonChanged(newEnum, oldValue, newValue),
      );
    }
  });

  return changes;
}
