import {parse, buildASTSchema} from 'graphql';
import {existsSync, readFileSync} from 'fs';
import {isAbsolute, resolve} from 'path';

import {SchemaHandler} from './loader';
import {stripBOM} from '../../utils/string';

function isGraphQLFile(pointer: string): boolean {
  return /\.(graphql|gql|graphqls)$/i.test(pointer);
}

export const fromGraphQLFile: SchemaHandler = function fromUrl(pointer) {
  if (isGraphQLFile(pointer)) {
    const fullPath = isAbsolute(pointer)
      ? pointer
      : resolve(process.cwd(), pointer);
    if (existsSync(fullPath)) {
      return async function load() {
        if (existsSync(fullPath)) {
          const fileContent = readFileSync(fullPath, 'utf8');

          if (!fileContent) {
            throw new Error(`Unable to read file: ${fullPath}`);
          }

          return buildASTSchema(parse(stripBOM(fileContent)));
        } else {
          throw new Error(`Unable to locate file: ${fullPath}`);
        }
      };
    }
  }
};
