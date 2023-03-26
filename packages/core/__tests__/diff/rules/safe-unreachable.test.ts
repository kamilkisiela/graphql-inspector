import { buildSchema } from 'graphql';
import { CriticalityLevel, diff } from '../../../src';
import { safeUnreachable } from '../../../src/diff/rules';
import { findFirstChangeByPath } from '../../../utils/testing';

describe('safeUnreachable rule', () => {
  test('removed field', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
      }

      type Bar {
        a: String
        b: String
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
      }

      type Bar {
        a: String
      }
    `);

    const changes = await diff(a, b, [safeUnreachable]);
    const removed = findFirstChangeByPath(changes, 'Bar.b');

    expect(removed.criticality.level).toBe(CriticalityLevel.NonBreaking);
    expect(removed.message).toContain(`Unreachable from root`);
  });

  test('removed type', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        bar: String!
      }

      type Foo {
        a: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Query {
        bar: String!
      }
    `);

    const changes = await diff(a, b, [safeUnreachable]);
    const removed = findFirstChangeByPath(changes, 'Foo');

    expect(removed.criticality.level).toBe(CriticalityLevel.NonBreaking);
    expect(removed.message).toContain(`Unreachable from root`);
  });

  test('removed scalar', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        bar: String!
      }

      scalar JSON
    `);
    const b = buildSchema(/* GraphQL */ `
      type Query {
        bar: String!
      }
    `);

    const changes = await diff(a, b, [safeUnreachable]);
    const removed = findFirstChangeByPath(changes, 'JSON');

    expect(removed.criticality.level).toBe(CriticalityLevel.NonBreaking);
    expect(removed.message).toContain(`Unreachable from root`);
  });
});
