import { isObjectType, isInterfaceType, isEnumType } from 'graphql';

import { CriticalityLevel, ChangeType } from './../changes/change';
import { Rule } from './types';
import { parsePath } from '../../utils/path';
import { isDeprecated } from '../../utils/isDeprecated';

export const suppressRemovalOfDeprecatedField: Rule = ({
  changes,
  oldSchema,
}) => {
  return changes.map((change) => {
    if (
      change.type === ChangeType.FieldRemoved &&
      change.criticality.level === CriticalityLevel.Breaking &&
      change.path
    ) {
      const [typeName, fieldName] = parsePath(change.path);
      const type = oldSchema.getType(typeName);

      if (isObjectType(type) || isInterfaceType(type)) {
        const field = type.getFields()[fieldName];

        if (isDeprecated(field)) {
          return {
            ...change,
            criticality: {
              ...change.criticality,
              level: CriticalityLevel.Dangerous,
            },
          };
        }
      }
    }

    if (
      change.type === ChangeType.EnumValueRemoved &&
      change.criticality.level === CriticalityLevel.Breaking &&
      change.path
    ) {
      const [enumName, enumItem] = parsePath(change.path);
      const type = oldSchema.getType(enumName);

      if (isEnumType(type)) {
        const item = type.getValue(enumItem);

        if (item && isDeprecated(item)) {
          return {
            ...change,
            criticality: {
              ...change.criticality,
              level: CriticalityLevel.Dangerous,
            },
          };
        }
      }
    }

    return change;
  });
};
