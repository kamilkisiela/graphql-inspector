import { parsePath } from '../../utils/path.js';
import { Change, CriticalityLevel } from '../changes/change.js';
import { Rule } from './types.js';

interface Meta {
  change: Change;
}

export type UsageHandler = (
  input: Array<{ type: string; field?: string; argument?: string; meta: Meta }>,
) => Promise<boolean[]>;

export interface ConsiderUsageConfig {
  /**
   * Checks if it's safe to introduce a breaking change on a field
   *
   * Because the function is async and resolves to a boolean value
   * you can add pretty much anything here, many different conditions or
   * even any source of data.
   *
   * In the CLI we use a GraphQL endpoint with a query
   * that checks the usage and returns stats like:
   * min/max count and min/max percentage
   * So we know when to allow for a breaking change.
   *
   * Because it returns a boolean,
   * we can't attach any data or even customize a message of an api change.
   * This is the first iteration, we're going to improve it soon.
   *
   * true - NON_BREAKING
   * false - BREAKING
   */
  checkUsage?: UsageHandler;
}

export const considerUsage: Rule<ConsiderUsageConfig> = async ({ changes, config }) => {
  if (!config) {
    throw new Error(`considerUsage rule is missing config`);
  }

  const collectedBreakingField: Array<{
    type: string;
    field: string;
    argument?: string;
    meta: Meta;
  }> = [];

  for (const change of changes) {
    if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
      const [typeName, fieldName, argumentName] = parsePath(change.path);

      collectedBreakingField.push({
        type: typeName,
        field: fieldName,
        argument: argumentName,
        meta: {
          change,
        },
      });
    }
  }

  // True if safe to break, false otherwise
  const usageList = await config.checkUsage!(collectedBreakingField);

  // turns an array of booleans into an array of `Type.Field` strings
  // includes only those that are safe to break the api
  const suppressedPaths = collectedBreakingField
    .filter((_, i) => usageList[i] === true)
    .map(({ type, field, argument }) => [type, field, argument].filter(Boolean).join('.'));

  return changes.map(change => {
    // Turns those "safe to break" changes into "dangerous"
    if (
      change.criticality.level === CriticalityLevel.Breaking &&
      change.path &&
      suppressedPaths.some(p => change.path!.startsWith(p))
    ) {
      return {
        ...change,
        criticality: {
          ...change.criticality,
          level: CriticalityLevel.Dangerous,
          isSafeBasedOnUsage: true,
        },
        message: `${change.message} (non-breaking based on usage)`,
      };
    }

    return change;
  });
};
