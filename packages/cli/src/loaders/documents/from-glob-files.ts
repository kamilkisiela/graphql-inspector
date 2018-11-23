import {Source} from 'graphql';
import {existsSync, readFileSync} from 'fs';
import {extname} from 'path';
import * as isGlob from 'is-glob';
import * as glob from 'glob';
import * as isValidPath from 'is-valid-path';

import {DocumentsHandler} from './loader';

const graphQLExtensions = ['.gql', '.graphql', '.graphqls'];

async function documentsFromGlob(documentGlob: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) =>
    glob(documentGlob, (err, files) => (err ? reject(err) : resolve(files))),
  );
}

async function readFile(filepath: string): Promise<Source> {
  if (existsSync(filepath)) {
    const fileContent = readFileSync(filepath, 'utf8');
    const fileExt = extname(filepath);

    if (graphQLExtensions.indexOf(fileExt) !== -1) {
      return new Source(fileContent, filepath);
    }

    throw new Error(
      `Only files with extensions: ${graphQLExtensions.join(
        ', ',
      )} are allowed. We couldn't handle ${filepath}`,
    );
  } else {
    throw new Error(`Failed to load a document ${filepath}`);
  }
}

export const fromGlobFiles: DocumentsHandler = function fromGlobFiles(pointer) {
  if (isGlob(pointer) || isValidPath(pointer)) {
    return async function load() {
      const found = await documentsFromGlob(pointer);

      return await Promise.all(found.map(readFile));
    };
  }
};
