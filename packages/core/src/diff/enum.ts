import {GraphQLEnumType} from 'graphql';

import {isNotEqual, isVoid} from '../utils/compare';
import {
  enumValueRemoved,
  enumValueAdded,
  enumValueDescriptionChanged,
  enumValueDeprecationReasonChanged,
  enumValueDeprecationReasonAdded,
  enumValueDeprecationReasonRemoved,
} from './changes/enum';
import {Change} from './changes/change';
import {compareLists} from '../utils/compare';

export function changesInEnum(
  oldEnum: GraphQLEnumType,
  newEnum: GraphQLEnumType,
): Change[] {
  const changes: Change[] = [];

  const values = compareLists(oldEnum.getValues(), newEnum.getValues());

  changes.push(...values.added.map((v) => enumValueAdded(newEnum, v)));
  changes.push(...values.removed.map((v) => enumValueRemoved(oldEnum, v)));

  values.common.forEach(({inOld: oldValue, inNew: newValue}) => {
    if (isNotEqual(oldValue.description, newValue.description)) {
      changes.push(enumValueDescriptionChanged(newEnum, oldValue, newValue));
    }

    if (isNotEqual(oldValue.deprecationReason, newValue.deprecationReason)) {
      if (isVoid(oldValue.deprecationReason)) {
        changes.push(
          enumValueDeprecationReasonAdded(newEnum, oldValue, newValue),
        );
      } else if (isVoid(newValue.deprecationReason)) {
        changes.push(
          enumValueDeprecationReasonRemoved(newEnum, oldValue, newValue),
        );
      } else {
        changes.push(
          enumValueDeprecationReasonChanged(newEnum, oldValue, newValue),
        );
      }
    }
  });

  return changes;
}
