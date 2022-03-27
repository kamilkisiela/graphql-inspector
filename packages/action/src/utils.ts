export function batch<T>(items: T[], limit: number): T[][] {
  const batches: T[][] = [];
  const batchesNum = Math.ceil(items.length / limit);

  // We still want to update check-run and send empty annotations
  if (batchesNum === 0) {
    return [[]];
  }

  for (let i = 0; i < batchesNum; i++) {
    const start = i * limit;
    const end = start + limit;

    batches.push(items.slice(start, end));
  }

  return batches;
}
