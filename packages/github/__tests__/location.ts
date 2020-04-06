import {buildSchema, Source} from 'graphql';
import {getLocation} from '../src/location';

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

const schema = buildSchema(source);

function printedLine(source: Source, line: number): string {
  return source.body.split('\n')[line - 1];
}

test('location of a Type', () => {
  const {line} = getLocation({
    schema,
    source,
    path: 'User',
  });

  expect(printedLine(source, line)).toMatch('type User {');
});

test('location of a Type.Field', () => {
  const {line} = getLocation({
    schema,
    source,
    path: 'User.id',
  });

  expect(printedLine(source, line)).toMatch('id: ID!');
});

test('location of a Type.Field.Arg', () => {
  const {line} = getLocation({
    schema,
    source,
    path: 'Query.user.id',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});

test('location of a RootType.Field', () => {
  const {line} = getLocation({
    schema,
    source,
    path: 'Query.user',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});
