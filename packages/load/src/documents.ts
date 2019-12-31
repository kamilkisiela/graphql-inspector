import {Source, print} from 'graphql';
import {loadDocuments as toolkitLoadDocuments} from '@graphql-toolkit/core';
import {GraphQLFileLoader} from '@graphql-toolkit/graphql-file-loader';
import {CodeFileLoader} from '@graphql-toolkit/code-file-loader';

export async function loadDocuments(pointer: string): Promise<Source[]> {
  const documents = await toolkitLoadDocuments(pointer, {
    loaders: [new GraphQLFileLoader(), new CodeFileLoader()],
  });

  return documents.map(doc => new Source(print(doc.document!), doc.location));
}
