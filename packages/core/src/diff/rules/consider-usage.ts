import {CriticalityLevel} from './../changes/change';
import {Rule} from './types';
import {parsePath} from '../common/path';

export interface ConsiderUsageConfig {
  checkUsage?(input: {
    type: string;
    field: string;
  }): Promise<Array<{count: number; percentage: number}>>;
}

export const considerUsage: Rule<ConsiderUsageConfig> = async ({
  changes,
  config,
}) => {
  if (!config) {
    throw new Error(`considerUsage rule is missing config`);
  }

  const collectedFields: [string, string][] = [];

  changes.forEach(change => {
    if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
      const [typeName, fieldName] = parsePath(change.path);

      collectedFields.push([typeName, fieldName]);
    }
  });

  const usageList = await Promise.all(
    collectedFields.map(([type, field]) =>
      config.checkUsage!({
        type,
        field,
      }),
    ),
  );

  const suppressedPaths = collectedFields
    .filter((_, i) => usageList[i].length === 0)
    .map(([type, field]) => `${type}.${field}`);

  return changes.map(change => {
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
