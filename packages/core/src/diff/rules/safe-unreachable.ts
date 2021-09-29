import {CriticalityLevel} from './../changes/change';
import {Rule} from './types';
import {parsePath} from '../../utils/path';
import {getReachableTypes} from '../../utils/graphql';

export const safeUnreachable: Rule = ({changes, oldSchema}) => {
  const reachable = getReachableTypes(oldSchema);

  return changes.map((change) => {
    if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
      const [typeName] = parsePath(change.path);

      if (!reachable.has(typeName)) {
        return {
          ...change,
          criticality: {
            ...change.criticality,
            level: CriticalityLevel.NonBreaking,
          },
          message: "Unreachable from root"
        };
      }
    }

    return change;
  });
};
