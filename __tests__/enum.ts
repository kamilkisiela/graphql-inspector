import { buildASTSchema } from 'graphql';
import gql from 'graphql-tag';

import { diff } from '../src/index';
import { CriticalityLevel } from '../src/changes/change';

test('enum with new value', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A
      B
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A
      B
      C
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(1);
  expect(changes[0].criticality.level).toEqual(CriticalityLevel.Dangerous);
  expect(changes[0].criticality.reason).toBeDefined();
  expect(changes[0].message).toEqual(
    `Enum value 'C' was added to enum 'enumA'`,
  );
  expect(changes[0].path).toEqual('enumA.C');
});

test('enum with removed value', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A
      B
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(1);
  expect(changes[0].criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(changes[0].criticality.reason).toBeDefined();
  expect(changes[0].message).toEqual(
    `Enum value 'B' was removed from enum 'enumA'`,
  );
  expect(changes[0].path).toEqual('enumA.B');
});

test('enum with description changed', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    """
    Old Description
    """
    enum enumA {
      A
      B
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    """
    New Description
    """
    enum enumA {
      A
      B
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(1);
  expect(changes[0].criticality.level).toEqual(CriticalityLevel.NonBreaking);
  expect(changes[0].message).toEqual(
    `Description 'Old Description' on type 'enumA' has changed to 'New Description'`,
  );
  expect(changes[0].path).toEqual('enumA');
});

test('enum with deprecationReason changed', () => {
  const schemaA = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A @deprecated(reason: "Old Reason")
      B
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Query {
      fieldA: String
    }

    enum enumA {
      A @deprecated(reason: "New Reason")
      B
    }
  `);

  const changes = diff(schemaA, schemaB);

  expect(changes.length).toEqual(1);
  expect(changes[0].criticality.level).toEqual(CriticalityLevel.NonBreaking);
  expect(changes[0].message).toEqual(
    `Enum value 'enumA.A' deprecation reason changed from 'Old Reason' to 'New Reason'`,
  );
  expect(changes[0].path).toEqual('enumA.A');
});
