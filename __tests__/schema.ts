import { buildASTSchema } from 'graphql';
import gql from 'graphql-tag';

import { diff } from '../src/index';

test('same schema', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
    }
  `);

  expect(diff(schemaA, schemaB).length).toEqual(0);
});

test('renamed query', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }
  `);

  const schemaB = buildASTSchema(gql`
    type RootQuery {
      fieldA: String
    }

    schema {
      query: RootQuery
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(3);
});

test.skip('new field in Query', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
      fieldB: String
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(1);
});
