import * as isValidPath from 'is-valid-path';
import {ensureAbsolute} from '../../utils/fs';

export function pipe(...middlewares: any[]) {
  return (value: any) => {
    return middlewares.reduce((val, fn) => fn(val), value);
  };
}

export function useRequire(mods: string[]): void {
  mods.forEach(mod => require(isValidPath(mod) ? ensureAbsolute(mod) : mod));
}

function normalizeRequire(options: any) {
  if (typeof options.parent.require === 'undefined') {
    return {
      ...options,
      require: [],
    };
  }

  const normalized = Array.isArray(options.parent.require)
    ? options.parent.require
    : [options.parent.require];

  return {
    ...options,
    require: normalized,
  };
}

export function normalizeOptions(options: any) {
  return pipe(normalizeRequire)(options);
}
