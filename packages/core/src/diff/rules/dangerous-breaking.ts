import { CriticalityLevel } from '../changes/change.js';
import { Rule } from './types.js';

export const dangerousBreaking: Rule = ({ changes }) => {
  return changes.map(change => {
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
