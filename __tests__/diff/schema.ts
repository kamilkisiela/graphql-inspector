import {buildASTSchema} from 'graphql';
import gql from 'graphql-tag';

import {diff} from '../../src/index';
import {CriticalityLevel, Change} from '../../src/changes/change';

test('same schema', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String!
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String!
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(0);
});

test('renamed query', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String!
    }
  `);

  const schemaB = buildASTSchema(gql`
    type RootQuery {
      fieldA: String!
    }

    schema {
      query: RootQuery
    }
  `);

  const changes = diff(schemaA, schemaB);

  // Type Added
  const added = changes.find(c => c.message.indexOf('added') !== -1) as Change;

  expect(added).toBeDefined();
  expect(added.criticality.level).toEqual(CriticalityLevel.NonBreaking);
  expect(added.message).toEqual(`Type 'RootQuery' was added`);
  expect(added.path).toEqual(`RootQuery`);

  // Type Removed
  const removed = changes.find(
    c => c.message.indexOf('removed') !== -1,
  ) as Change;

  expect(removed).toBeDefined();
  expect(removed.criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(removed.message).toEqual(`Type 'Query' was removed`);
  expect(removed.path).toEqual(`Query`);

  // Root Type Changed
  const changed = changes.find(
    c => c.message.indexOf('changed') !== -1,
  ) as Change;

  expect(changed).toBeDefined();
  expect(changed.criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(changed.message).toEqual(
    `Schema query root has changed from 'Query' to 'RootQuery'`,
  );
});

test('new field and field changed in Query', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String!
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: Int
      fieldB: String
    }
  `);

  const changes = diff(schemaA, schemaB);
  const changed = changes.find(c => c.message.includes('changed')) as Change;
  const added = changes.find(c => c.message.includes('added')) as Change;

  expect(changed).toBeDefined();
  expect(changed.criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(changed.message).toEqual(
    `Field 'Query.fieldA' changed type from 'String!' to 'Int'`,
  );
  expect(added).toBeDefined();
  expect(added.criticality.level).toEqual(CriticalityLevel.NonBreaking);
  expect(added.message).toEqual(
    `Field 'fieldB' was added to object type 'Query'`,
  );
});
