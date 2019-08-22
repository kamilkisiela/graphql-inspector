import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    operations: [Operation!]
  }

  type Operation {
    id: ID!
    name: String!
    signature: String!
    operation: String!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    operations(_, _args, context) {
      return context.inspectorAdapter.readOperations();
    },
  },
};
