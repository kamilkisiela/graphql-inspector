import {GraphQLSchema} from 'graphql';

import {SchemaHandler, SchemaLoader} from './loader';
import {fromUrl} from './from-url';
import {fromGithub} from './from-github';
import {fromJSONFile} from './from-json-file';
import {fromGraphQLFile} from './from-graphql-file';
import {fromExport} from './from-export';

const loaders: SchemaHandler[] = [
  fromUrl,
  fromGithub,
  fromJSONFile,
  fromGraphQLFile,
  fromExport,
];

function isLoader(loader: any): loader is SchemaLoader {
  return typeof loader !== 'undefined';
}

export function loadSchema(
  pointer: string,
  extra?: any,
): Promise<GraphQLSchema> {
  let loader: SchemaLoader | undefined = undefined;

  loaders.some(fn => {
    const _loader = fn(pointer, extra);

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
