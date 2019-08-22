import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    fields: [Field!]
  }

  type Field {
    id: ID!
    name: String!
    type: String!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    fields(_, _args, context) {
      return context.inspectorAdapter.readFields();
    },
  },
};
