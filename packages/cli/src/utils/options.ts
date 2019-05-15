export function pipe(...middlewares: any[]) {
  return (value: any) => {
    return middlewares.reduce((val, fn) => fn(val), value);
  };
}

export function useRequire(options: any) {
  if (options.require) {
    options.require.forEach((mod: any) => require(mod));
  }
  return options;
}

function normalizeToken(options: any) {
  return {
    ...options,
    token: options.parent.token,
  };
}

function normalizeHeaders(options: any) {
  return {
    ...options,
    headers:
      typeof options.parent.header === 'undefined' ? {} : options.parent.header,
  };
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
    normalizeHeaders,
    normalizeRequire,
    useRequire,
    normalizeToken,
  )(options);
}
