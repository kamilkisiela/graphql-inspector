export function diffArrays(a: string[], b: string[]): string[] {
  return a.filter((c) => !b.some((d) => d === c));
}

export function unionArrays(a: string[], b: string[]): string[] {
  return a.filter((c) => b.some((d) => d === c));
}
