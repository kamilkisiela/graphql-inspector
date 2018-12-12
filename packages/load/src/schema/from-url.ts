import {introspectionQuery, buildClientSchema} from 'graphql';
import fetch from 'node-fetch';

import {SchemaHandler} from './loader';

function isUri(uri: string): boolean {
  return /^https?\:\/\//i.test(uri);
}

export const fromUrl: SchemaHandler = function fromUrl(pointer) {
  if (isUri(pointer)) {
    return async function load() {
      const request = await fetch(pointer, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          query: introspectionQuery,
        }),
      });

      const response = await request.json();

      let errorMessage;
      if (response.errors && response.errors.length > 0) {
        errorMessage = response.errors
          .map((item: Error) => item.message)
          .join(', ');
      } else if (!response.data) {
        errorMessage = response;
      }

      if (errorMessage) {
        throw new Error(
          'Unable to download schema from remote: ' + errorMessage,
        );
      }

      return buildClientSchema(response.__schema);
    };
  }
};
