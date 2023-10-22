import { Probot } from 'probot';
import { ErrorHandler } from './types.js';

const key = Symbol.for('inspector-diagnostics');

export function setDiagnostics(
  app: Probot,
  diagnostics: { onError: ErrorHandler; release: string },
) {
  (app as any)[key] = diagnostics;
}

export function getDiagnostics(app: Probot) {
  return (app as any)[key];
}
