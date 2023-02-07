import { buildSchema } from 'graphql';
import { CriticalityLevel, diff } from '../../../src';
import { considerUsage } from '../../../src/diff/rules';
import { findFirstChangeByPath } from '../../../utils/testing';

describe('considerUsage rule', () => {
  test('removed field', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
        b: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
        c: String!
      }
    `);

    const changes = await diff(a, b, [considerUsage], {
      async checkUsage(list) {
        return list.map(() => true);
      },
    });

    const removed = findFirstChangeByPath(changes, 'Foo.b');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
    expect(removed.message).toContain(`non-breaking based on usage`);
  });

  test('removed type', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        bar: String!
        foo: Foo!
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

    const changes = await diff(a, b, [considerUsage], {
      async checkUsage(list) {
        return list.map(() => true);
      },
    });

    changes.forEach(change => {
      expect(change.criticality.level).toBe(CriticalityLevel.Dangerous);
      expect(change.message).toContain(`non-breaking based on usage`);
    });
  });
});
