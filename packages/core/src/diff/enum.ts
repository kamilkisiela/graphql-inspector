import { GraphQLEnumType } from 'graphql';
import { compareLists, isNotEqual, isVoid } from '../utils/compare';
import {
  enumValueAdded,
  enumValueDeprecationReasonAdded,
  enumValueDeprecationReasonChanged,
  enumValueDeprecationReasonRemoved,
  enumValueDescriptionChanged,
  enumValueRemoved,
} from './changes/enum';
import { AddChange } from './schema';

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
          addChange(enumValueDeprecationReasonAdded(newEnum, oldValue, newValue));
        } else if (isVoid(newValue.deprecationReason)) {
          addChange(enumValueDeprecationReasonRemoved(newEnum, oldValue, newValue));
        } else {
          addChange(enumValueDeprecationReasonChanged(newEnum, oldValue, newValue));
        }
      }
    },
  });
}
