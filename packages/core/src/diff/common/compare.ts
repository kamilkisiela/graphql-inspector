export function isEqual<T>(a: T, b: T): boolean {
  return a === b || (!a && !b);
}

export function isNotEqual<T>(a: T, b: T): boolean {
  return !isEqual(a, b);
}

export function isVoid<T>(a: T): boolean {
  return typeof a === 'undefined' || a === null;
}
