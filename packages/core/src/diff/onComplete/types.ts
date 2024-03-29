import { Change } from '../changes/change.js';

export type CompletionArgs = {
  breakingChanges: Change[];
  dangerousChanges: Change[];
  nonBreakingChanges: Change[];
};

export type CompletionHandler = (args: CompletionArgs) => void;
