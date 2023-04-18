import { buildSchema } from 'graphql';
import { considerUsage } from '../../../src/diff/rules/index.js';
import { CriticalityLevel, diff } from '../../../src/index.js';
import { findFirstChangeByPath } from '../../../utils/testing.js';

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
    expect(removed.criticality.isSafeBasedOnUsage).toBe(true);
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

    for (const change of changes) {
      expect(change.criticality.level).toBe(CriticalityLevel.Dangerous);
      expect(change.criticality.isSafeBasedOnUsage).toBe(true);
      expect(change.message).toContain(`non-breaking based on usage`);
    }
  });
});
