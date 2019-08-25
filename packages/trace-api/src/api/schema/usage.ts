import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    usage(input: UsageInput!): UsageResult!
  }

  input UsageInput {
    field: String!
    type: String!
    period: String
  }

  type UsageCountSummary {
    min: Long!
    max: Long!
    average: Long!
    total: Long!
  }

  type UsagePercentageSummary {
    min: Float!
    max: Float!
  }

  type UsageResult {
    count: UsageCountSummary!
    percentage: UsagePercentageSummary
    nodes: [UsageNode!]
  }

  type UsageNode {
    id: ID!
    operation: String!
    count: Long!
    percentage: Float!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    async usage(_, {input}, context) {
      return context.inspectorAdapter.readFieldUsage(input);
    },
  },
};
