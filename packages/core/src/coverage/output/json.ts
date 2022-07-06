import { SchemaCoverage } from '../index';

export function outputJSON(coverage: SchemaCoverage): string {
  return JSON.stringify(coverage, null, 2);
}
