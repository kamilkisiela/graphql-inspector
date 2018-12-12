import {
  buildClientSchema,
  IntrospectionQuery,
  GraphQLSchema,
  DocumentNode,
  buildASTSchema,
  parse,
} from 'graphql';
import {existsSync} from 'fs';
import {extname} from 'path';
import * as isValidPath from 'is-valid-path';

import {SchemaHandler} from './loader';
import {ensureAbsolute} from '../helpers/path';

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

export const fromExport: SchemaHandler = function fromUrl(pointer) {
  const fullPath = ensureAbsolute(pointer);

  if (
    isValidPath(pointer) &&
    extensions.indexOf(extname(pointer).toLowerCase()) !== -1 &&
    existsSync(fullPath)
  ) {
    return async function load() {
      const exports = require(fullPath);

      if (exports) {
        let rawExport = exports.default || exports.schema || exports;

        if (rawExport) {
          let schema = await rawExport;

          try {
            const schemaResult = await resolveSchema(schema);

            return schemaResult;
          } catch (e) {
            console.log(
              'Unexpected exception while trying to figure out the schema: ',
              e,
            );

            throw new Error(
              'Exported schema must be of type GraphQLSchema, text, AST, or introspection JSON.',
            );
          }
        } else {
          throw new Error(
            `Invalid export from export file ${fullPath}: missing default export or 'schema' export!`,
          );
        }
      } else {
        throw new Error(
          `Invalid export from export file ${fullPath}: empty export!`,
        );
      }
    };
  }
};

function isSchemaText(obj: any): obj is string {
  return typeof obj === 'string';
}

function isSchemaJson(obj: any): obj is {data: IntrospectionQuery} {
  const json = obj as {data: IntrospectionQuery};
  return json.data !== undefined && json.data.__schema !== undefined;
}

function isSchemaObject(obj: any): obj is GraphQLSchema {
  return obj instanceof GraphQLSchema;
}

function isSchemaAst(obj: string | DocumentNode): obj is DocumentNode {
  return (obj as DocumentNode).kind !== undefined;
}

async function resolveSchema(schema: any): Promise<any> {
  if (isSchemaObject(schema)) {
    return schema;
  } else if (isSchemaAst(schema)) {
    return buildASTSchema(schema);
  } else if (isSchemaText(schema)) {
    const ast = parse(schema);
    return buildASTSchema(ast);
  } else if (isSchemaJson(schema)) {
    return buildClientSchema(schema.data);
  } else {
    throw new Error('Unexpected schema type provided!');
  }
}
