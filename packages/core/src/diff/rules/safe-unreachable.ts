import { getReachableTypes } from '../../utils/graphql';
import { parsePath } from '../../utils/path';
import { CriticalityLevel } from './../changes/change';
import { Rule } from './types';

export const safeUnreachable: Rule = ({ changes, oldSchema }) => {
  const reachable = getReachableTypes(oldSchema);

  return changes.map(change => {
    if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
      const [typeName] = parsePath(change.path);

      if (!reachable.has(typeName)) {
        return {
          ...change,
          criticality: {
            ...change.criticality,
            level: CriticalityLevel.NonBreaking,
          },
          message: 'Unreachable from root',
        };
      }
    }

    return change;
  });
};
