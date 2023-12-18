import { GraphQLEnumType, Kind } from 'graphql';
import { compareLists, isNotEqual, isVoid } from '../utils/compare.js';
import { directiveUsageAdded, directiveUsageRemoved } from './changes/directive-usage.js';
import {
  enumValueAdded,
  enumValueDeprecationReasonAdded,
  enumValueDeprecationReasonChanged,
  enumValueDeprecationReasonRemoved,
  enumValueDescriptionChanged,
  enumValueRemoved,
} from './changes/enum.js';
import { AddChange } from './schema.js';

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

      compareLists(oldValue.astNode?.directives || [], newValue.astNode?.directives || [], {
        onAdded(directive) {
          addChange(
            directiveUsageAdded(Kind.ENUM_VALUE_DEFINITION, directive, {
              type: newEnum,
              value: newValue,
            }),
          );
        },
        onRemoved(directive) {
          addChange(
            directiveUsageRemoved(Kind.ENUM_VALUE_DEFINITION, directive, {
              type: oldEnum,
              value: oldValue,
            }),
          );
        },
      });
    },
  });

  compareLists(oldEnum.astNode?.directives || [], newEnum.astNode?.directives || [], {
    onAdded(directive) {
      addChange(directiveUsageAdded(Kind.ENUM_TYPE_DEFINITION, directive, newEnum));
    },
    onRemoved(directive) {
      addChange(directiveUsageRemoved(Kind.ENUM_TYPE_DEFINITION, directive, newEnum));
    },
  });
}
