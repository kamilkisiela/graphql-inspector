import {printType, GraphQLNamedType, GraphQLSchema} from 'graphql';

import {isPrimitive, isForIntrospection} from '../utils/graphql';
import {findBestMatch, BestMatch, Target, Rating} from '../utils/string';

export interface SimilarMap {
  [name: string]: BestMatch;
}

export function similar(
  schema: GraphQLSchema,
  typeName: string | undefined,
  threshold: number = 0.4,
): SimilarMap {
  const typeMap = schema.getTypeMap();
  const targets: Target[] = Object.keys(schema.getTypeMap())
    .filter((name) => !isPrimitive(name) && !isForIntrospection(name))
    .map((name) => ({
      typeId: name,
      value: stripType(typeMap[name]),
    }));
  const results: SimilarMap = {};

  if (
    typeof typeName !== 'undefined' &&
    !targets.some((t) => t.typeId === typeName)
  ) {
    throw new Error(`Type '${typeName}' doesn't exist`);
  }

  (typeName ? [{typeId: typeName, value: ''}] : targets).forEach((source) => {
    const sourceType = schema.getType(source.typeId) as GraphQLNamedType;
    const matchWith = targets.filter(
      (target) =>
        (schema.getType(target.typeId) as any).astNode.kind ===
          (sourceType.astNode as any).kind && target.typeId !== source.typeId,
    );

    if (matchWith.length > 0) {
      const found = similarTo(sourceType, matchWith, threshold);

      if (found) {
        results[source.typeId] = found;
      }
    }
  });

  return results;
}

function similarTo(
  type: GraphQLNamedType,
  targets: Target[],
  threshold: number,
): BestMatch | undefined {
  const types = targets.filter((target) => target.typeId !== type.name);
  const result = findBestMatch(stripType(type), types);

  if (result.bestMatch.rating < threshold) {
    return;
  }

  return {
    bestMatch: result.bestMatch,
    ratings: result.ratings
      .filter(
        (r) => r.rating >= threshold && r.target !== result.bestMatch.target,
      )
      .sort((a: Rating, b: Rating) => a.rating - b.rating)
      .reverse(),
  };
}

function stripType(type: GraphQLNamedType): string {
  return printType(type)
    .trim()
    .replace(/^[a-z]+ [^\{]+\{/g, '')
    .replace(/\}$/g, '')
    .trim()
    .split('\n')
    .map((s) => s.trim())
    .sort((a, b) => a.localeCompare(b))
    .join(' ');
}
