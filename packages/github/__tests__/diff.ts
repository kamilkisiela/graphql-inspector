import {buildSchema, GraphQLSchema, printSchema} from 'graphql';
import {diff} from '../src/diff';
import {CheckConclusion} from '../src/types';

function getPrintedLine(schema: GraphQLSchema, line: number): string {
  const printed = printSchema(schema);
  return printed.split('\n')[line - 1];
}

const newSchema = buildSchema(/* GraphQL */ `
  type Post {
    id: ID!
    title: String!
    createdAt: String!
  }

  type Query {
    post: Post!
  }
`);

const oldSchema = buildSchema(/* GraphQL */ `
  type Post {
    id: ID
    title: String @deprecated(reason: "No more used")
    createdAt: String
    modifiedAt: String
  }

  type Query {
    post: Post!
    posts: [Post!]
  }
`);

test('should return 7 annotations and 7 changes and fail the check', async () => {
  const action = await diff({
    path: 'schema.graphql',
    schemas: {
      old: oldSchema,
      new: newSchema,
    },
  });

  expect(action.annotations).toHaveLength(7);
  expect(action.changes).toHaveLength(7);
  expect(action.conclusion).toBe(CheckConclusion.Failure);
});

test('annotations should match lines in schema file', async () => {
  const action = await diff({
    path: 'schema.graphql',
    schemas: {
      old: oldSchema,
      new: newSchema,
    },
  });

  // Field 'modifiedAt' was removed from object type 'Post'
  expect(getPrintedLine(oldSchema, action.annotations![0].start_line)).toBe('  modifiedAt: String');

  // Field 'Post.createdAt' changed type from 'String' to 'String!'
  expect(getPrintedLine(oldSchema, action.annotations![5].start_line)).toBe('  createdAt: String');
});
