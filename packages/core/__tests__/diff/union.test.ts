import { buildSchema } from 'graphql';
import { CriticalityLevel, diff } from '../../src';
import { findChangesByPath, findFirstChangeByPath } from '../../utils/testing';

describe('union', () => {
  test('member added', async () => {
    const a = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      union Foo = A | B
    `);
    const b = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      type C {
        C: String!
      }

      union Foo = A | B | C
    `);

    const changes = await diff(a, b);

    const change = findFirstChangeByPath(changes, 'Foo');

    expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
    expect(change.type).toEqual('UNION_MEMBER_ADDED');
    expect(change.message).toEqual("Member 'C' was added to Union type 'Foo'");
  });

  test('member removed', async () => {
    const a = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      type C {
        C: String!
      }

      union Foo = A | B | C
    `);
    const b = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      union Foo = A | B
    `);

    const changes = await diff(a, b);
    const change = findFirstChangeByPath(changes, 'Foo');

    expect(change.criticality.level).toEqual(CriticalityLevel.Breaking);
    expect(change.type).toEqual('UNION_MEMBER_REMOVED');
    expect(change.message).toEqual("Member 'C' was removed from Union type 'Foo'");
  });

  test('same members but different order', async () => {
    const a = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      union Foo = A | B
    `);
    const b = buildSchema(/* GraphQL */ `
      type A {
        a: String!
      }

      type B {
        b: String!
      }

      union Foo = B | A
    `);

    const changes = findChangesByPath(await diff(a, b), 'Foo');

    expect(changes).toHaveLength(0);
  });
});
