import {ErrorHandler} from './types';

let diagnostics: {
  onError: ErrorHandler;
  release: string;
} = {
  onError() {},
  release: 'unknown',
};

export function setDiagnostics(obj: {onError: ErrorHandler; release: string}) {
  diagnostics = obj;
}

export function getDiagnostics() {
  return diagnostics;
}
