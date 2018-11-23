import * as isValidPath from 'is-valid-path';
import {ensureAbsolute} from './fs';

export function pipe(...middlewares: any[]) {
  return (value: any) => {
    return middlewares.reduce((val, fn) => fn(val), value);
  };
}

export function useRequire(options: any) {
  if (options.require) {
    options.require.forEach((mod: any) =>
      require(isValidPath(mod) ? ensureAbsolute(mod) : mod),
    );
  }
  return options;
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
  return pipe(
    normalizeRequire,
    useRequire,
  )(options);
}
