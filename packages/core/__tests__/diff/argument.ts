import { buildSchema } from 'graphql';

import { findFirstChangeByPath } from '../../utils/testing';
import { diff } from '../../src/index';
import { CriticalityLevel } from '../../src/diff/changes/change';

describe('argument', () => {
  test('added non-nullable with default value', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Query {
        a: String
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Query {
        a(b: Boolean! = true): String
      }
    `);

    const change = findFirstChangeByPath(await diff(a, b), 'Query.a.b');

    expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
    expect(change.type).toEqual('FIELD_ARGUMENT_ADDED');
    expect(change.message).toEqual("Argument 'b: Boolean!' (with default value) added to field 'Query.a'");
  });

  test('deprecation added / removed', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a(someArg: String): String
        b(
          someArg: String @deprecated
        ): String
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        a(
          someArg: String @deprecated
          ): String
        b(someArg: String): String
      }
    `);

    const changes = await diff(a, b);
    const change = {
      a: findFirstChangeByPath(changes, 'Foo.a'),
      b: findFirstChangeByPath(changes, 'Foo.b'),
    };

    // Added
    expect(change.a.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.a.type).toEqual('FIELD_ARGUMENT_DEPRECATION_ADDED');
    expect(change.a.message).toEqual("Argument 'someArg' on field 'Foo.a' is deprecated");
    // Removed
    expect(change.b.criticality.level).toEqual(CriticalityLevel.NonBreaking);
    expect(change.b.type).toEqual('FIELD_ARGUMENT_DEPRECATION_REMOVED');
    expect(change.b.message).toEqual("Argument 'someArg' on field 'Foo.b' is no longer deprecated");
  });

  describe('default value', () => {
    test('added', async () => {
      const a = buildSchema(/* GraphQL */ `
        input Foo {
          a: String!
        }

        type Dummy {
          field(foo: Foo): String
        }
      `);
      const b = buildSchema(/* GraphQL */ `
        input Foo {
          a: String!
        }

        type Dummy {
          field(foo: Foo = { a: "a" }): String
        }
      `);

      const change = findFirstChangeByPath(await diff(a, b), 'Dummy.field.foo');

      expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
      expect(change.type).toEqual('FIELD_ARGUMENT_DEFAULT_CHANGED');
      expect(change.message).toEqual("Default value '{ a: 'a' }' was added to argument 'foo' on field 'Dummy.field'");
    });

    test('changed', async () => {
      const a = buildSchema(/* GraphQL */ `
        input Foo {
          a: String!
        }

        type Dummy {
          field(foo: Foo = { a: "a" }): String
        }
      `);
      const b = buildSchema(/* GraphQL */ `
        input Foo {
          a: String!
        }

        type Dummy {
          field(foo: Foo = { a: "new-value" }): String
        }
      `);

      const change = findFirstChangeByPath(await diff(a, b), 'Dummy.field.foo');

      expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
      expect(change.type).toEqual('FIELD_ARGUMENT_DEFAULT_CHANGED');
      expect(change.message).toEqual(
        "Default value for argument 'foo' on field 'Dummy.field' changed from '{ a: 'a' }' to '{ a: 'new-value' }'"
      );
    });
  });
});
