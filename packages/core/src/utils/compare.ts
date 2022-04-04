export function keyMap<T>(
  list: readonly T[],
  keyFn: (item: T) => string,
): Record<string, T> {
  return list.reduce((map, item) => {
    map[keyFn(item)] = item;
    return map;
  }, Object.create(null));
}

export function isEqual<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (var index = 0; index < a.length; index++) {
      if (!isEqual(a[index], b[index])) {
        return false;
      }
    }

    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aRecord = a as Record<string, unknown>;
    const bRecord = b as Record<string, unknown>;

    const aKeys: string[] = Object.keys(aRecord);
    const bKeys: string[] = Object.keys(bRecord);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!isEqual(aRecord[key], bRecord[key])) {
        return false;
      }
    }
    
    return true
  }

  return a === b || (!a && !b);
}

export function isNotEqual<T>(a: T, b: T): boolean {
  return !isEqual(a, b);
}

export function isVoid<T>(a: T): boolean {
  return typeof a === 'undefined' || a === null;
}

export function diffArrays<T>(
  a: T[] | readonly T[],
  b: T[] | readonly T[],
): T[] {
  return a.filter((c) => !b.some((d) => d === c));
}

export function unionArrays<T>(
  a: T[] | readonly T[],
  b: T[] | readonly T[],
): T[] {
  return a.filter((c) => b.some((d) => d === c));
}

export function compareLists<T extends { name: string }>(
  oldList: readonly T[],
  newList: readonly T[],
  callbacks?: {
    onAdded?(t: T): void;
    onRemoved?(t: T): void;
    onMutual?(t: { newVersion: T; oldVersion: T }): void;
  },
) {
  const oldMap = keyMap(oldList, ({ name }) => name);
  const newMap = keyMap(newList, ({ name }) => name);

  const added: T[] = [];
  const removed: T[] = [];
  const mutual: Array<{ newVersion: T; oldVersion: T }> = [];

  for (const oldItem of oldList) {
    const newItem = newMap[oldItem.name];
    if (newItem === undefined) {
      removed.push(oldItem);
    } else {
      mutual.push({
        newVersion: newItem,
        oldVersion: oldItem,
      });
    }
  }

  for (const newItem of newList) {
    if (oldMap[newItem.name] === undefined) {
      added.push(newItem);
    }
  }

  if (callbacks) {
    if (callbacks.onAdded) {
      added.forEach(callbacks.onAdded);
    }
    if (callbacks.onRemoved) {
      removed.forEach(callbacks.onRemoved);
    }
    if (callbacks.onMutual) {
      mutual.forEach(callbacks.onMutual);
    }
  }

  return {
    added,
    removed,
    mutual,
  };
}
