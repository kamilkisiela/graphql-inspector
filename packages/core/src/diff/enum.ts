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
import {compareLists} from '../utils/compare';
import {AddChange} from './schema';

export function changesInEnum(
  oldEnum: GraphQLEnumType,
  newEnum: GraphQLEnumType,
  addChange: AddChange,
) {
  compareLists(oldEnum.getValues(), newEnum.getValues(), {
    onAdded(value) {
      addChange(enumValueAdded(newEnum, value));
    },
    onRemoved(value) {
      addChange(enumValueRemoved(oldEnum, value));
    },
    onMutual(value) {
      const oldValue = value.oldVersion;
      const newValue = value.newVersion;

      if (isNotEqual(oldValue.description, newValue.description)) {
        addChange(enumValueDescriptionChanged(newEnum, oldValue, newValue));
      }

      if (isNotEqual(oldValue.deprecationReason, newValue.deprecationReason)) {
        if (isVoid(oldValue.deprecationReason)) {
          addChange(enumValueDeprecationReasonAdded(newEnum, newValue));
        } else if (isVoid(newValue.deprecationReason)) {
          addChange(
            enumValueDeprecationReasonRemoved(newEnum, oldValue, newValue),
          );
        } else {
          addChange(
            enumValueDeprecationReasonChanged(newEnum, oldValue, newValue),
          );
        }
      }
    },
  });
}

export function addedInEnum(enumType: GraphQLEnumType, addChange: AddChange) {
  enumType.getValues().forEach((value) => {
    addChange(enumValueAdded(enumType, value));

    if (!isVoid(value.description)) {
      // TODO: addChange(enumValueDescriptionAdded)
    }

    if (!isVoid(value.deprecationReason)) {
      addChange(enumValueDeprecationReasonAdded(enumType, value));
    }
  });
}
