import * as stringSimilarity from 'string-similarity';
import {BestMatch} from 'string-similarity';

import {isPrimitive, isForIntrospection} from '../utils/graphql';
import {GraphQLNamedType, GraphQLSchema} from 'graphql';

export interface SimilarMap {
  [name: string]: BestMatch;
}

export function similar(
  schema: GraphQLSchema,
  typeName: string | undefined,
  threshold: number = 0.4,
): SimilarMap {
  const types = Object.keys(schema.getTypeMap()).filter(
    name => !isPrimitive(name) && !isForIntrospection(name),
  );
  const results: SimilarMap = {};

  if (typeof typeName !== 'undefined' && types.indexOf(typeName) === -1) {
    throw new Error(`Type '${typeName}' doesn't exist`);
  }

  (typeName ? [typeName] : types).forEach(name => {
    const found = similarTo(
      schema.getType(name) as GraphQLNamedType,
      types,
      schema,
      threshold,
    );

    if (found) {
      results[name] = found;
    }
  });

  return results;
}

function similarTo(
  type: GraphQLNamedType,
  typeNames: string[],
  schema: GraphQLSchema,
  threshold: number,
): BestMatch | undefined {
  const typeMap = schema.getTypeMap();
  const types = typeNames
    .filter(name => name !== type.name)
    .map(name => stripType(typeMap[name].toString()));

  const result = stringSimilarity.findBestMatch(
    stripType(type.toString()),
    types,
  );

  if (result.bestMatch.rating < threshold) {
    return;
  }

  return {
    ...result,
    ratings: result.ratings.filter(
      r => r.rating >= threshold && r.target !== result.bestMatch.target,
    ),
  };
}

function stripType(type: string): string {
  return type
    .trim()
    .replace(/(^[a-z]+ [^\{]+{)|(\}$)g/, '')
    .trim();
}
