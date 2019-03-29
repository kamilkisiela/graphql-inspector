// import { findDangerousChanges } from 'graphql';

import {Change} from '../src/diff/changes/change';

export function findChangesByPath(changes: Change[], path: string) {
  return changes.filter(c => c.path === path);
}

export function findFirstChangeByPath(changes: Change[], path: string) {
  return findChangesByPath(changes, path)[0];
}
