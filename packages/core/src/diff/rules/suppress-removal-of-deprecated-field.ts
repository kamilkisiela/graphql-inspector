import {isObjectType, isInterfaceType} from 'graphql';

import {CriticalityLevel, ChangeType} from './../changes/change';
import {Rule} from './types';
import {parsePath} from '../common/path';

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

        if (field.isDeprecated) {
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
