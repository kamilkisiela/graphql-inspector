export function equal<T>(a: T, b: T): boolean {
  return a === b || (!a && !b);
}

export function notEqual<T>(a: T, b: T): boolean {
  return !equal(a, b);
}
