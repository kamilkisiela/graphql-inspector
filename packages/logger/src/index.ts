import { Console } from 'node:console';
import { Transform } from 'node:stream';
import chalk from 'chalk';
import * as env from 'std-env';

export { default as figures } from 'figures';
export { default as symbols } from 'log-symbols';
export { chalk };

export function bolderize(msg: string): string {
  const findSingleQuotes = /'([^']+)'/gim;
  const findDoubleQuotes = /"([^"]+)"/gim;

  return msg
    .replace(findSingleQuotes, (_: string, value: string) => chalk.bold(value))
    .replace(findDoubleQuotes, (_: string, value: string) => chalk.bold(value));
}

let mockedFn: ((msg: string) => void) | null = null;

const canBeFancy = env.hasTTY === true;
export interface Logger {
  success(msg: string): void;
  log(msg: string): void;
  info(msg: string): void;
  error(msg: string): void;
  warn(msg: string): void;
}

export const Logger = {
  success(msg: string) {
    emit('success', msg);
  },
  log(msg: string) {
    emit('log', msg);
  },
  table(
    input: {
      method: string;
      result: string;
    }[],
  ) {
    table(input);
  },
  info(msg: string) {
    emit('info', msg);
  },
  error(msg: string) {
    emit('error', msg);
  },
  warn(msg: string) {
    emit('warn', msg);
  },
};

export function mockLogger(fn: (msg: string) => void) {
  mockedFn = fn;
}

export function unmockLogger() {
  mockedFn = null;
}

function emit(type: 'success' | 'info' | 'log' | 'error' | 'warn', msg: string) {
  if (mockedFn) {
    return mockedFn(msg);
  }

  if (!canBeFancy) {
    return console.log(`[${type}]`, msg);
  }

  if (type === 'success') {
    emitSuccess(msg);
  } else if (type === 'error') {
    emitError(msg);
  } else if (type === 'info') {
    emitInfo(msg);
  } else if (type === 'warn') {
    emitWarn(msg);
  } else {
    console.log(msg);
  }
}

function table(
  input: {
    method: string;
    result: string;
  }[],
) {
  const ts = new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(input);
  const table = (ts.read() || '').toString();
  let result = '';
  for (const row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result);
}

function emitSuccess(msg: string) {
  console.log(chalk.green('success'), msg);
}

function emitError(msg: string) {
  console.log(chalk.red('error'), msg);
}

function emitInfo(msg: string) {
  console.log(chalk.blue('info'), msg);
}

function emitWarn(msg: string) {
  console.log(chalk.yellow('warning'), msg);
}
