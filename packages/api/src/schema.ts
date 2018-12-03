import {makeExecutableSchema} from 'apollo-server-express';
import {mergeGraphQLSchemas} from '@graphql-modules/epoxy';
import gql from 'graphql-tag';
import * as common from './modules/common';
import * as coverage from './modules/coverage';
import * as diff from './modules/diff';
import * as validate from './modules/validate';
import * as similar from './modules/similar';

const base = gql`
  type Query {
    ping: String!
  }

  type Mutation {
    ping: String!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: mergeGraphQLSchemas([
    base,
    common.typeDefs,
    coverage.typeDefs,
    diff.typeDefs,
    validate.typeDefs,
    similar.typeDefs,
  ]),
  resolvers: [
    coverage.resolvers,
    diff.resolvers,
    validate.resolvers,
    similar.resolvers,
  ] as any,
});
