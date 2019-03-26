import {buildSchema, printSchema} from 'graphql';
import {getLocation} from '../src/location';
import {GraphQLSchema} from 'graphql';

const schema = buildSchema(/* GraphQL */ `
  type Query {
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    name: String!
  }
`);

function printedLine(schema: GraphQLSchema, line: number): string {
  const printed = printSchema(schema);
  return printed.split('\n')[line - 1];
}

test('location of a Type', async () => {
  const {line} = getLocation({
    schema,
    path: 'User',
  });

  expect(printedLine(schema, line)).toMatch('type User {');
});
test('location of a Type.Field', async () => {
  const {line} = getLocation({
    schema,
    path: 'User.id',
  });

  expect(printedLine(schema, line)).toMatch('id: ID!');
});

test('location of a Type.Field.Arg', async () => {
  const {line} = getLocation({
    schema,
    path: 'Query.user.id',
  });

  expect(printedLine(schema, line)).toMatch('user(id: ID!): User');
});

test('location of a RootType.Field', async () => {
  const {line} = getLocation({
    schema,
    path: 'Query.user',
  });

  expect(printedLine(schema, line)).toMatch('user(id: ID!): User');
});
