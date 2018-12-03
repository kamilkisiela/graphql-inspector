import {buildClientSchema} from 'graphql';
import {existsSync, readFileSync} from 'fs';

import {SchemaHandler} from './loader';
import {parseBOM} from '../helpers/string';
import {ensureAbsolute} from '../helpers/path';

function isJSONFile(pointer: string): boolean {
  return /\.json$/i.test(pointer);
}

export const fromJSONFile: SchemaHandler = function fromUrl(pointer) {
  if (isJSONFile(pointer) && existsSync(pointer)) {
    return async function load() {
      const fullPath = ensureAbsolute(pointer);

      if (existsSync(fullPath)) {
        try {
          const fileContent = readFileSync(fullPath, 'utf8');

          if (!fileContent) {
            throw new Error(
              `Unable to read local introspection file: ${fullPath}`,
            );
          }

          let introspection = parseBOM(fileContent);

          if (introspection.data) {
            introspection = introspection.data;
          }

          return buildClientSchema(introspection.__schema);
        } catch (e) {
          throw e;
        }
      } else {
        throw new Error(
          `Unable to locate local introspection file: ${fullPath}`,
        );
      }
    };
  }
};
