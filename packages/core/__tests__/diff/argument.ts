import {buildSchema} from 'graphql';

import {findFirstChangeByPath} from '../../utils/testing';
import {diff} from '../../src/index';
import {CriticalityLevel} from '../../src/diff/changes/change';

describe('argument', () => {
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
        field(foo: Foo = {a: "a"}): String
      }
    `);

      const change = findFirstChangeByPath(await diff(a, b), 'Dummy.field.foo');

      expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
      expect(change.type).toEqual('FIELD_ARGUMENT_DEFAULT_CHANGED');
      expect(change.message).toEqual('Default value \'[Object: null prototype] { a: \'a\' }\' was added to argument \'foo\' on field \'Dummy.field\'');
    });

    test('changed', async () => {
      const a = buildSchema(/* GraphQL */ `
      input Foo {
        a: String!
      }
        
      type Dummy {
        field(foo: Foo = {a: "a"}): String
      }
    `);
      const b = buildSchema(/* GraphQL */ `
      input Foo {
        a: String!
      }
            
      type Dummy {
        field(foo: Foo = {a: "new-value"}): String
      }
    `);

      const change = findFirstChangeByPath(await diff(a, b), 'Dummy.field.foo');

      expect(change.criticality.level).toEqual(CriticalityLevel.Dangerous);
      expect(change.type).toEqual('FIELD_ARGUMENT_DEFAULT_CHANGED');
      expect(change.message).toEqual('Default value for argument \'foo\' on field \'Dummy.field\' changed from \'[Object: null prototype] { a: \'a\' }\' to \'[Object: null prototype] { a: \'new-value\' }\'');
    });
  });
});
