import {makeExecutableSchema} from 'apollo-server-express';
import {mergeGraphQLSchemas} from '@graphql-modules/epoxy';
import gql from 'graphql-tag';
import * as coverage from './coverage';

const base = gql`
  type Query {
    ping: String!
  }

  type Mutation {
    ping: String!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: mergeGraphQLSchemas([base, coverage.typeDefs]),
  resolvers: [coverage.resolvers] as any,
});
