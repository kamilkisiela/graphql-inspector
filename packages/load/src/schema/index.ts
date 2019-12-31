import {GraphQLSchema, isSchema} from 'graphql';
import {loadSchema as toolkitLoadSchema} from '@graphql-toolkit/core';
import {GraphQLFileLoader} from '@graphql-toolkit/graphql-file-loader';
import {CodeFileLoader} from '@graphql-toolkit/code-file-loader';
import {GitLoader} from '@graphql-toolkit/git-loader';
import {GithubLoader} from '@graphql-toolkit/github-loader';
import {JsonFileLoader} from '@graphql-toolkit/json-file-loader';
import {UrlLoader} from '@graphql-toolkit/url-loader';

export async function loadSchema(
  pointer: string,
  extra?: any,
): Promise<GraphQLSchema> {
  const resolved = await toolkitLoadSchema(pointer, {
    loaders: [
      new GitLoader(),
      new GithubLoader(),
      new GraphQLFileLoader(),
      new JsonFileLoader(),
      new UrlLoader(),
      new CodeFileLoader(),
    ],
    ...(extra || {}),
  });

  if (isSchema(resolved)) {
    return resolved;
  }

  throw new Error(`Couldn't handle ${pointer}`);
}
