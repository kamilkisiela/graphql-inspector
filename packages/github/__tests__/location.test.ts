import { Source } from 'graphql';
import { getLocationByPath } from '../src/helpers/location';

const source = new Source(/* GraphQL */ `
  type Query {
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    name: String!
  }
`);

function printedLine(source: Source, line: number): string {
  return source.body.split('\n')[line - 1];
}

test('location of a Type', () => {
  const { line } = getLocationByPath({
    source,
    path: 'User',
  });

  expect(printedLine(source, line)).toMatch('type User {');
});

test('location of a Type.Field', () => {
  const { line } = getLocationByPath({
    source,
    path: 'User.id',
  });

  expect(printedLine(source, line)).toMatch('id: ID!');
});

test('location of a Type.Field.Arg', () => {
  const { line } = getLocationByPath({
    source,
    path: 'Query.user.id',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});

test('location of a RootType.Field', () => {
  const { line } = getLocationByPath({
    source,
    path: 'Query.user',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});

test('Type.Field.Arg: non-existing Arg should point to Type.Field ', () => {
  const { line } = getLocationByPath({
    source,
    path: 'Query.user.nonExisting',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});

test('Type.Field.Arg: non-existing Field should point to Type ', () => {
  const { line } = getLocationByPath({
    source,
    path: 'Query.nonExisting.id',
  });

  expect(printedLine(source, line)).toMatch('type Query {');
});

test('Type.Field.Arg: non-existing Type should point to first line ', () => {
  const { line } = getLocationByPath({
    source,
    path: 'NonExisting.user.id',
  });

  expect(printedLine(source, line)).toMatch(/^\s*$/);
});

test('Directive.Field.Arg: non-existing Type should point to first line ', () => {
  const { line } = getLocationByPath({
    source,
    path: 'NonExisting.user.id',
  });

  expect(printedLine(source, line)).toMatch(/^\s*$/);
});

test('Enum.Value: non-existing Value should point to Enum', () => {
  const testSource = new Source(/* GraphQL */ `
    enum MyEnum {
      Foo
      Bar
    }
  `);
  const { line } = getLocationByPath({
    source: testSource,
    path: 'MyEnum.Nonexisting',
  });

  expect(printedLine(testSource, line)).toMatch('enum MyEnum {');
});

test('Enum.Value: Value should point to Value', () => {
  const testSource = new Source(/* GraphQL */ `
    enum MyEnum {
      Foo
      Bar
    }
  `);
  const { line } = getLocationByPath({
    source: testSource,
    path: 'MyEnum.Bar',
  });

  expect(printedLine(testSource, line)).toMatch('Bar');
});
