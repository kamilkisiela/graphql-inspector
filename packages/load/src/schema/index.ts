import {GraphQLSchema, isSchema, DocumentNode, buildASTSchema} from 'graphql';
import {loadSchema as useSchema} from 'graphql-toolkit';

import {fromGithub} from './from-github';
export async function loadSchema(
  pointer: string,
  extra?: any,
): Promise<GraphQLSchema> {
  const useGithub = fromGithub(pointer, extra);

  if (useGithub) {
    return useGithub();
  }

  const resolved = await useSchema(pointer, null);

  if (isSchema(resolved)) {
    return resolved;
  }

  if (isDocumentNode(resolved)) {
    return buildASTSchema(resolved);
  }

  throw new Error(`Couldn't handle ${pointer}`);
}

function isDocumentNode(doc: any): doc is DocumentNode {
  return !!doc.kind;
}
