import {
  GraphQLSchema,
  DocumentNode,
  Source,
  print,
  isSchema,
  printSchema,
} from 'graphql';
import {hash, isSource} from '../helpers';

export function hashSchema(
  schema: GraphQLSchema | DocumentNode | Source | string,
): string {
  return hash(stringifySchema(schema));
}

function stringifySchema(
  schema: GraphQLSchema | DocumentNode | Source | string,
): string {
  if (typeof schema === 'string') {
    return schema;
  }

  if (isSchema(schema)) {
    return printSchema(schema);
  }

  if (isSource(schema)) {
    return schema.body;
  }

  return print(schema);
}
