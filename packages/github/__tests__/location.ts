import {Source} from 'graphql';
import {getLocationByPath} from '../src/location';

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
  const {line} = getLocationByPath({
    source,
    path: 'User',
  });

  expect(printedLine(source, line)).toMatch('type User {');
});

test('location of a Type.Field', () => {
  const {line} = getLocationByPath({
    source,
    path: 'User.id',
  });

  expect(printedLine(source, line)).toMatch('id: ID!');
});

test('location of a Type.Field.Arg', () => {
  const {line} = getLocationByPath({
    source,
    path: 'Query.user.id',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});

test('location of a RootType.Field', () => {
  const {line} = getLocationByPath({
    source,
    path: 'Query.user',
  });

  expect(printedLine(source, line)).toMatch('user(id: ID!): User');
});
