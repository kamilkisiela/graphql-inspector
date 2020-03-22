import {diff} from '@graphql-inspector/core';
import {loadSchema} from '@graphql-inspector/load';
import gql from 'graphql-tag';

import {QueryResolvers} from '../generated/graphql';

export const typeDefs = gql`
  enum CriticalityLevel {
    BREAKING
    NON_BREAKING
    DANGEROUS
  }

  type Criticality {
    level: CriticalityLevel!
    reason: String
  }

  type Change {
    message: String!
    path: String
    type: String!
    criticality: Criticality!
  }

  extend type Query {
    diff(oldSchema: String!, newSchema: String!): [Change!]
  }
`;

const Query: QueryResolvers = {
  async diff(_, args) {
    const [oldSchema, newSchema] = await Promise.all([
      loadSchema(args.oldSchema),
      loadSchema(args.newSchema),
    ]);
    return diff(oldSchema, newSchema);
  },
};

export const resolvers = {
  Query,
};
