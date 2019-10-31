import {Source, print} from 'graphql';
import {loadDocumentsUsingLoaders} from '@graphql-toolkit/core';
import {GraphQLFileLoader} from '@graphql-toolkit/graphql-file-loader';
import {CodeFileLoader} from '@graphql-toolkit/code-file-loader';

export async function loadDocuments(pointer: string): Promise<Source[]> {
  const documents = await loadDocumentsUsingLoaders(
    [new GraphQLFileLoader(), new CodeFileLoader()],
    pointer,
  );

  return documents.map(doc => new Source(print(doc.document), doc.location));
}
