import {Source, parse} from 'graphql';
import {existsSync, readFileSync} from 'fs';
import {extname} from 'path';
import * as isGlob from 'is-glob';
import * as glob from 'glob';
import * as isValidPath from 'is-valid-path';
import gqlPluck from 'graphql-tag-pluck';

import {DocumentsHandler} from './loader';

const extensions = {
  graphql: ['.gql', '.graphql', '.graphqls'],
  js: ['.js', '.jsx'],
  ts: ['.ts', '.tsx'],
};
const flattenedExtensions = Object.values(extensions).reduce(
  (acc, exts) => acc.concat(exts.map(ext => ext.substr(1))),
  [],
);

async function documentsFromGlob(documentGlob: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) =>
    glob(documentGlob, (err, files) => (err ? reject(err) : resolve(files))),
  );
}

export function extractDocument(source: Source): string | void {
  try {
    const parsed = parse(source.body);

    if (parsed) {
      return source.body;
    }
  } catch (e) {
    return gqlPluck.fromFile.sync(source.name);
  }
}

async function readFile(filepath: string): Promise<Source> {
  if (existsSync(filepath)) {
    const fileContent = readFileSync(filepath, 'utf8');
    const fileExt = extname(filepath).toLowerCase();

    if (extensions.graphql.indexOf(fileExt) !== -1) {
      return new Source(fileContent, filepath);
    }

    if (
      extensions.ts.indexOf(fileExt) !== -1 ||
      extensions.js.indexOf(fileExt) !== -1
    ) {
      const doc = extractDocument(new Source(fileContent, filepath));

      if (doc) {
        return new Source(doc, filepath);
      }
    }

    throw new Error(
      `Only files with extensions: ${flattenedExtensions.join(
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
