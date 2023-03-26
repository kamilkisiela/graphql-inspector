import { SchemaCoverage } from '../index.js';

export function outputJSON(coverage: SchemaCoverage): string {
  return JSON.stringify(coverage, null, 2);
}
