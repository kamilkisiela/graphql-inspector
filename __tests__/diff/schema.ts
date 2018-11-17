import {buildASTSchema} from 'graphql';
import gql from 'graphql-tag';
import * as stringSimilarity from 'string-similarity';

import {diff} from '../../src/index';
import {CriticalityLevel, Change} from '../../src/changes/change';

test('same schema', () => {
  const schemaA = buildASTSchema(gql`
    type Post {
      id: ID
    }

    type Query {
      fieldA: Post!
    }
  `);

  const schemaB = buildASTSchema(gql`
    type Post {
      id: ID
    }

    type Query {
      fieldA: Post!
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

test('', () => {
  const schemaA = buildASTSchema(gql`
    schema {
      query: Query
    }
    input AInput {
      """
      a
      """
      a: String = "1"
      b: String!
    }
    """
    The Query Root of this schema
    """
    type Query {
      """
      Just a simple string
      """
      a(anArg: String): String!
      b: BType
    }
    type BType {
      a: String
    }
    type CType {
      a: String @deprecated(reason: "whynot")
      c: Int!
      d(arg: Int): String
    }
    union MyUnion = CType | BType
    interface AnInterface {
      interfaceField: Int!
    }
    interface AnotherInterface {
      anotherInterfaceField: String
    }
    type WithInterfaces implements AnInterface & AnotherInterface {
      a: String!
    }
    type WithArguments {
      a(
        """
        Meh
        """
        a: Int
        b: String
      ): String
      b(arg: Int = 1): String
    }
    enum Options {
      A
      B
      C
      E
      F @deprecated(reason: "Old")
    }
    """
    Old
    """
    directive @yolo(
      """
      Included when true.
      """
      someArg: Boolean!
      anotherArg: String!
      willBeRemoved: Boolean!
    ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT
    type WillBeRemoved {
      a: String
    }
    directive @willBeRemoved on FIELD
  `);

  const schemaB = buildASTSchema(gql`
    schema {
      query: Query
    }
    input AInput {
      """
      changed
      """
      a: Int = 1
      c: String!
    }
    """
    Query Root description changed
    """
    type Query {
      """
      This description has been changed
      """
      a: String!
      b: Int!
    }
    input BType {
      a: String!
    }
    type CType implements AnInterface {
      a(arg: Int): String @deprecated(reason: "cuz")
      b: Int!
      d(arg: Int = 10): String
    }
    type DType {
      b: Int!
    }
    union MyUnion = CType | DType
    interface AnInterface {
      interfaceField: Int!
    }
    interface AnotherInterface {
      b: Int
    }
    type WithInterfaces implements AnInterface {
      a: String!
    }
    type WithArguments {
      a(
        """
        Description for a
        """
        a: Int
        b: String!
      ): String
      b(arg: Int = 2): String
    }
    enum Options {
      """
      Stuff
      """
      A
      B
      D
      E @deprecated
      F @deprecated(reason: "New")
    }
    """
    New
    """
    directive @yolo(
      """
      someArg does stuff
      """
      someArg: String!
      anotherArg: String! = "Test"
    ) on FIELD | FIELD_DEFINITION
    directive @yolo2(
      """
      Included when true.
      """
      someArg: String!
    ) on FIELD
  `);

  const changes = diff(schemaA, schemaB);

  [
    `Type 'WillBeRemoved' was removed`,
    `Type 'DType' was added`,
    `Field 'Query.a' description changed from 'Just a simple string' to 'This description has been changed'`,
    `Argument 'anArg: String' was removed from field 'Query.a'`,
    `Field 'Query.b' changed type from 'BType' to 'Int!'`,
    `Description 'The Query Root of this schema' on type 'Query' has changed to 'Query Root description changed'`,
    `'BType' kind changed from 'ObjectTypeDefinition' to 'InputObjectTypeDefinition'`,
    `Input field 'b' was removed from input object type 'AInput'`,
    `Input field 'c' was added to input object type 'AInput'`,
    `Input field 'AInput.a' description changed from 'a' to 'changed'`,
    `Input field 'AInput.a' default value changed from '1' to '1'`,
    `Input field 'AInput.a' changed type from 'String' to 'Int'`,
    `'CType' object implements 'AnInterface' interface`,
    `Field 'c' was removed from object type 'CType'`,
    `Field 'b' was added to object type 'CType'`,
    `Deprecation reason on field 'CType.a' has changed from 'whynot' to 'cuz'`,
    `Argument 'arg: Int' added to field 'CType.a'`,
    `Default value '10' was added to argument 'arg' on field 'CType.d'`,
    `Member 'BType' was removed from Union type 'MyUnion'`,
    `Member 'DType' was added to Union type 'MyUnion'`,
    `Field 'anotherInterfaceField' was removed from object type 'AnotherInterface'`,
    `Field 'b' was added to object type 'AnotherInterface'`,
    `'WithInterfaces' object type no longer implements 'AnotherInterface' interface`,
    `Description for argument 'a' on field 'WithArguments.a' changed from 'Meh' to 'Description for a'`,
    `Type for argument 'b' on field 'WithArguments.a' changed from 'String' to 'String!'`,
    `Default value for argument 'arg' on field 'WithArguments.b' changed from '1' to '2'`,
    `Enum value 'C' was removed from enum 'Options'`,
    `Enum value 'D' was added to enum 'Options'`,
    `Description 'Stuff' was added to enum value 'Options.A'`,
    `Enum value 'Options.E' was deprecated with reason 'No longer supported'`,
    `Enum value 'Options.F' deprecation reason changed from 'Old' to 'New'`,
    `Directive 'willBeRemoved' was removed`,
    `Directive 'yolo2' was added`,
    `Directive 'yolo' description changed from 'Old' to 'New'`,
    `Location 'FRAGMENT_SPREAD' was removed from directive 'yolo'`,
    `Location 'INLINE_FRAGMENT' was removed from directive 'yolo'`,
    `Location 'FIELD_DEFINITION' was added to directive 'yolo'`,
    `Argument 'willBeRemoved' was removed from directive 'yolo'`,
    `Description for argument 'someArg' on directive 'yolo' changed from 'Included when true.' to 'someArg does stuff'`,
    `Type for argument 'someArg' on directive 'yolo' changed from 'Boolean!' to 'String!'`,
    `Default value 'Test' was added to argument 'anotherArg' on directive 'yolo'`,
  ].forEach(msg => {
    try {
      expect(changes.some(c => c.message === msg)).toEqual(true);
    } catch (e) {
      console.log(`Couldn't find: ${msg}`);
      const match = stringSimilarity.findBestMatch(
        msg,
        changes.map(c => c.message),
      );

      if (match.bestMatch) {
        console.log(`We found a similar change: ${match.bestMatch.target}`);
      }

      throw e;
    }
  });

  [
    'WillBeRemoved',
    'DType',
    'Query.a',
    'Query.a.anArg',
    'Query.b',
    'Query',
    'BType',
    'AInput.b',
    'AInput.c',
    'AInput.a',
    'AInput.a',
    'AInput.a',
    'CType',
    'CType.c',
    'CType.b',
    'CType.a',
    'CType.a.arg',
    'CType.d.arg',
    'MyUnion',
    'MyUnion',
    'AnotherInterface.anotherInterfaceField',
    'AnotherInterface.b',
    'WithInterfaces',
    'WithArguments.a.a',
    'WithArguments.a.b',
    'WithArguments.b.arg',
    'Options.C',
    'Options.D',
    'Options.A',
    'Options.E',
    'Options.F',
    '@willBeRemoved',
    '@yolo2',
    '@yolo',
    '@yolo',
    '@yolo',
    '@yolo',
    '@yolo.willBeRemoved',
    '@yolo.someArg',
    '@yolo.someArg',
    '@yolo.anotherArg',
  ].forEach(path => {
    try {
      expect(changes.some(c => c.path === path)).toEqual(true);
    } catch (e) {
      console.log(`Couldn't find: ${path}`);
      throw e;
    }
  });
});
