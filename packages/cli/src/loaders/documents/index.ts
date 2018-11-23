import {Source} from 'graphql';

import {DocumentsHandler, DocumentsLoader} from './loader';
import {fromGlobFiles} from './from-glob-files';

const loaders: DocumentsHandler[] = [fromGlobFiles];

function isLoader(loader: any): loader is DocumentsLoader {
  return typeof loader !== 'undefined';
}

export function loadDocuments(pointer: string): Promise<Source[]> {
  let loader: DocumentsLoader | undefined = undefined;

  loaders.some(fn => {
    const _loader = fn(pointer);

    if (_loader) {
      loader = _loader;
      return true;
    }

    return false;
  });

  if (isLoader(loader)) {
    return loader();
  }

  throw new Error(`Couldn't handle ${pointer}`);
}
