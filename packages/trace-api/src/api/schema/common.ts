import {LongResolver} from 'graphql-scalars';
import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  scalar Long

  type Query {
    _: String
  }
`;

export const resolvers: Resolvers = {
  Long: LongResolver,
};
