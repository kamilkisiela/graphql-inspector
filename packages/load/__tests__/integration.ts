import {GraphQLSchema, printSchema, buildSchema} from 'graphql';
import {loadSchema} from '../src';

const SAMPLES_DIR = `samples`;

function matchSchema(schema: GraphQLSchema) {
  expect(printSchema(schema)).toBe(
    printSchema(
      buildSchema(/* GraphQL */ `
        type Query {
          test: String
        }
      `),
    ),
  );
}

function matchCombinedSchema(schema: GraphQLSchema) {
  expect(printSchema(schema)).toBe(
    printSchema(
      buildSchema(/* GraphQL */ `
        type Foo {
          test: String
        }

        type Query {
          foo: Foo
        }
      `),
    ),
  );
}

describe('load schema', () => {
  test('export GraphQLSchemaObject', async () => {
    const schema = await loadSchema(
      `${SAMPLES_DIR}/schema/export-schema-object.ts`,
    );
    matchSchema(schema);
  });

  test('export DocumentNode', async () => {
    const schema = await loadSchema(
      `${SAMPLES_DIR}/schema/export-document-node.ts`,
    );
    matchSchema(schema);
  });

  test('export string', async () => {
    const schema = await loadSchema(`${SAMPLES_DIR}/schema/export-string.ts`);
    matchSchema(schema);
  });

  test('export string (in code)', async () => {
    const schema = await loadSchema(
      `${SAMPLES_DIR}/schema/export-string-in-code.ts`,
    );
    matchSchema(schema);
  });

  test('one .graphql file', async () => {
    const schema = await loadSchema(`${SAMPLES_DIR}/schema/schema.graphql`);
    matchSchema(schema);
  });

  test('multiple .graphql files', async () => {
    const schema = await loadSchema(`${SAMPLES_DIR}/schema/graphql/*.graphql`);
    matchCombinedSchema(schema);
  });

  test('multiple .ts files', async () => {
    const schema = await loadSchema(`${SAMPLES_DIR}/schema/type-defs/*.ts`);
    matchCombinedSchema(schema);
  });

  test('graphql-tag', async () => {
    const schema = await loadSchema(
      `${SAMPLES_DIR}/schema/with-graphql-tag.ts`,
    );
    matchSchema(schema);
  });
});
