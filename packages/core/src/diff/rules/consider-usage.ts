import {CriticalityLevel} from './../changes/change';
import {Rule} from './types';
import {parsePath} from '../common/path';

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
   * min/max count and min/max precentage
   * So we know when to allow for a breaking change.
   *
   * Because it returns a boolean,
   * we can't attach any data or even customize a message of an api change.
   * This is the first iteration, we're going to improve it soon.
   *
   * @param input Object
   */
  checkUsage?(input: {type: string; field: string}): Promise<boolean>;
}

export const considerUsage: Rule<ConsiderUsageConfig> = async ({
  changes,
  config,
}) => {
  if (!config) {
    throw new Error(`considerUsage rule is missing config`);
  }

  // An array of [type, field]
  const collectedBreakingField: [string, string][] = [];

  changes.forEach(change => {
    if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
      const [typeName, fieldName] = parsePath(change.path);

      collectedBreakingField.push([typeName, fieldName]);
    }
  });

  // True if safe to break, false otherwise
  const usageList = await Promise.all(
    collectedBreakingField.map(([type, field]) =>
      config.checkUsage!({
        type,
        field,
      }),
    ),
  );

  // turns an array of booleans into an array of `Type.Field` strings
  // includes only those that are safe to break the api
  const suppressedPaths = collectedBreakingField
    .filter((_, i) => usageList[i] === true)
    .map(([type, field]) => `${type}.${field}`);

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
        },
        message: `${change.message} (no longer breaking)`,
      };
    }

    return change;
  });
};
