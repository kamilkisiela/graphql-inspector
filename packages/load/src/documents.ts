import {Source, print} from 'graphql';
import {loadDocuments as useDocuments} from 'graphql-toolkit';

export async function loadDocuments(pointer: string): Promise<Source[]> {
  const documents = await useDocuments(pointer);

  return documents.map(doc => new Source(print(doc.content), doc.filePath));
}
