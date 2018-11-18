import * as logSymbols from 'log-symbols';
import chalk from 'chalk';

import {Change, CriticalityLevel} from '../diff/changes/change';
import {InvalidDocument} from '../validate';

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
  const findSingleQuotes = /\'([^']+)\'/gim;
  const findDoubleQuotes = /\"([^"]+)\"/gim;

  return msg
    .replace(findSingleQuotes, (_: string, value: string) => chalk.bold(value))
    .replace(findDoubleQuotes, (_: string, value: string) => chalk.bold(value));
}

export function renderInvalidDocument(invalidDoc: InvalidDocument): string[] {
  const errors = invalidDoc.errors.map(e => ` - ${bolderize(e.message)}`).join('\n');

  return [
    logSymbols.error,
    chalk.redBright(bolderize(invalidDoc.source.name + ':\n\n')),
    errors,
    '\n\n',
  ];
}

export interface Renderer {
  emit(...msgs: string[]): void;
}

export class ConsoleRenderer implements Renderer {
  emit(...msgs: string[]) {
    console.log(...msgs);
  }
}
