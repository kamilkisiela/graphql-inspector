import {buildSchema} from 'graphql';

import {findFirstChangeByPath} from '../../utils/testing';
import {diff} from '../../src/index';
import {CriticalityLevel} from '../../src/diff/changes/change';

describe('enum', () => {
  test('value added', () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
        B
      }
    `);

    const b = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
        B
        C
      }
    `);

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA.C');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
    expect(change.criticality.reason).toBeDefined();
    expect(change.message).toEqual(`Enum value 'C' was added to enum 'enumA'`);
  });

  test('value removed', () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
        B
      }
    `);

    const b = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
      }
    `);

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA.B');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.Breaking);
    expect(change.criticality.reason).toBeDefined();
    expect(change.message).toEqual(
      `Enum value 'B' was removed from enum 'enumA'`,
    );
  });

  test('description changed', () => {
    const a = buildSchema(/* GraphQL */ `
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

    const b = buildSchema(/* GraphQL */ `
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

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.message).toEqual(
      `Description 'Old Description' on type 'enumA' has changed to 'New Description'`,
    );
  });

  test('deprecation reason changed', () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A @deprecated(reason: "Old Reason")
        B
      }
    `);

    const b = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A @deprecated(reason: "New Reason")
        B
      }
    `);

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA.A');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.message).toEqual(
      `Enum value 'enumA.A' deprecation reason changed from 'Old Reason' to 'New Reason'`,
    );
  });

  test('deprecation reason added', () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
        B
      }
    `);

    const b = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A @deprecated(reason: "New Reason")
        B
      }
    `);

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA.A');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.message).toEqual(
      `Enum value 'enumA.A' was deprecated with reason 'New Reason'`,
    );
  });

  test('deprecation reason removed', () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A @deprecated(reason: "New Reason")
        B
      }
    `);

    const b = buildSchema(/* GraphQL */ `
      type Query {
        fieldA: String
      }

      enum enumA {
        A
        B
      }
    `);

    const changes = diff(a, b);
    const change = findFirstChangeByPath(changes, 'enumA.A');

    expect(changes.length).toEqual(1);
    expect(change.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.message).toEqual(
      `Deprecation reason was removed from enum value 'enumA.A'`,
    );
  });
});
