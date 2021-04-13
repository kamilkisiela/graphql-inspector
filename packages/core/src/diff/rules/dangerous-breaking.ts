import {CriticalityLevel} from './../changes/change';
import {Rule} from './types';

export const dangerousBreaking: Rule = ({changes}) => {
  return changes.map((change) => {
    if (change.criticality.level === CriticalityLevel.Dangerous) {
      return {
        ...change,
        criticality: {
          ...change.criticality,
          level: CriticalityLevel.Breaking,
        },
      };
    }

    return change;
  });
};
