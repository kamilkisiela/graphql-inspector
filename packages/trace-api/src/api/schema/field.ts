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

  extend type Operation {
    fields: [Field!]
  }
`;

export const resolvers: Resolvers = {
  Query: {
    fields(_, _args, context) {
      return context.inspectorAdapter.readFields();
    },
  },
  Operation: {
    fields(operation, _args, context) {
      return context.inspectorAdapter.readFieldsByOperationId(operation.id);
    },
  },
};
