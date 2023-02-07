import { buildSchema } from 'graphql';
import { CriticalityLevel, diff } from '../../../src';
import { suppressRemovalOfDeprecatedField } from '../../../src/diff/rules';
import { findFirstChangeByPath } from '../../../utils/testing';

describe('suppressRemovalOfDeprecatedFields rule', () => {
  test('removed field on object', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a: String! @deprecated(reason: "use b")
        b: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        b: String!
      }
    `);

    const changes = await diff(a, b, [suppressRemovalOfDeprecatedField]);

    const removed = findFirstChangeByPath(changes, 'Foo.a');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
  });

  test('removed field on interface', async () => {
    const a = buildSchema(/* GraphQL */ `
      interface Foo {
        a: String! @deprecated(reason: "use b")
        b: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      interface Foo {
        b: String!
      }
    `);

    const changes = await diff(a, b, [suppressRemovalOfDeprecatedField]);

    const removed = findFirstChangeByPath(changes, 'Foo.a');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
  });

  test('removed enum', async () => {
    const a = buildSchema(/* GraphQL */ `
      enum Foo {
        a @deprecated(reason: "use b")
        b
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      enum Foo {
        b
      }
    `);

    const changes = await diff(a, b, [suppressRemovalOfDeprecatedField]);

    const removed = findFirstChangeByPath(changes, 'Foo.a');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
  });

  test('removed input field', async () => {
    const a = buildSchema(/* GraphQL */ `
      input Foo {
        a: String! @deprecated(reason: "use b")
        b: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      input Foo {
        b: String!
      }
    `);

    const changes = await diff(a, b, [suppressRemovalOfDeprecatedField]);

    const removed = findFirstChangeByPath(changes, 'Foo.a');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
  });

  test('removed field with custom types', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a: CustomType! @deprecated(reason: "use b")
        b: String!
      }

      type CustomType {
        c: String!
        d: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        b: String!
      }
    `);

    const changes = await diff(a, b, [suppressRemovalOfDeprecatedField]);

    const removedField = findFirstChangeByPath(changes, 'Foo.a');
    const removedType = findFirstChangeByPath(changes, 'CustomType');

    expect(removedField.criticality.level).toBe(CriticalityLevel.Dangerous);
    expect(removedType.criticality.level).toBe(CriticalityLevel.Dangerous);
  });
});
