import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    operations(filter: OperationFilter): [Operation!]
  }

  type Operation {
    id: ID!
    name: String!
    signature: String!
    operation: String!
  }

  input OperationFilter {
    limit: Int
    period: String
    where: OperationFilterWhere
  }

  input OperationFilterWhere {
    operationName: String
    hasField: HasField
  }

  input HasField {
    name: String
    type: String
  }
`;

export const resolvers: Resolvers = {
  Query: {
    operations(_, {filter}, context) {
      return context.inspectorAdapter.readOperations(filter);
    },
  },
};
