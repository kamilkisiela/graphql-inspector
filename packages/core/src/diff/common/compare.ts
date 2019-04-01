export function isEqual<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (var index = 0; index < a.length; index++) {
      if (a[index] !== b[index]) {
        return false;
      }
    }

    return true;
  }

  return a === b || (!a && !b);
}

export function isNotEqual<T>(a: T, b: T): boolean {
  return !isEqual(a, b);
}

export function isVoid<T>(a: T): boolean {
  return typeof a === 'undefined' || a === null;
}
