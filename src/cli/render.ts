import * as logSymbols from 'log-symbols';
import chalk from 'chalk';

import {Change, CriticalityLevel} from '../changes/change';

export function getSymbol(level: CriticalityLevel): string {
  const symbols = {
    [CriticalityLevel.Dangerous]: logSymbols.warning,
    [CriticalityLevel.Breaking]: logSymbols.error,
    [CriticalityLevel.NonBreaking]: logSymbols.success,
  };

  return symbols[level];
}

export function renderChange(change: Change): string[] {
  return [getSymbol(change.criticality.level), bolderize(change.message)];
}

export function bolderize(msg: string): string {
  const findQuotes = /\'([^']+)\'/gim;

  return msg.replace(findQuotes, (_: string, value: string) =>
    chalk.bold(value),
  );
}

export interface Renderer {
  emit(...msgs: string[]): void;
}

export class ConsoleRenderer implements Renderer {
  emit(...msgs: string[]) {
    console.log(...msgs);
  }
}
