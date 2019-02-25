import {
  GraphQLSchema,
  isSchema,
  DocumentNode,
  buildASTSchema,
  printSchema,
  buildSchema,
} from 'graphql';
import {loadSchema as useSchema} from 'graphql-toolkit';

import {fromGithub} from './from-github';

function isUri(uri: string): boolean {
  return uri.startsWith('http');
}

function normalizeSchema(schema: GraphQLSchema): GraphQLSchema {
  return buildSchema(printSchema(schema));
}

export async function loadSchema(
  pointer: string,
  extra?: any,
): Promise<GraphQLSchema> {
  const useGithub = fromGithub(pointer, extra);

  if (useGithub) {
    // quickfix of #73
    return normalizeSchema(await useGithub());
  }

  const resolved = await useSchema(pointer, {});

  if (isSchema(resolved)) {
    // quickfix of #73
    if (isUri(pointer)) {
      return normalizeSchema(resolved);
    }

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
