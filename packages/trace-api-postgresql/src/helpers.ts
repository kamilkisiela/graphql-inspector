export function flatten<T>(list: T[][]): T[] {
  return Array.prototype.concat(...list);
}

export function unique<T>(list: T[]): T[] {
  return list.filter((val, i, all) => all.indexOf(val) === i);
}
