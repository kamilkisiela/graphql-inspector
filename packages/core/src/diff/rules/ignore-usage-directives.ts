import { ChangeType } from '../changes/change.js';
import { Rule } from './types.js';

interface IgnoreDirectivesConfig {
  ignoredDirectives: string[];
}

export const ignoreDirectives: Rule<IgnoreDirectivesConfig> = ({ changes, config }) => {
  if (!config?.ignoredDirectives?.length) {
    return changes;
  }
  const ignoredDirectiveSet = new Set(config.ignoredDirectives);

  const filteredChanges = changes.filter(change => {
    if (change.type === ChangeType && change.path) {
      const directiveName = change.path.split('.')[1];
      return !ignoredDirectiveSet.has(directiveName);
    }

    return true;
  });

  return filteredChanges;
};
