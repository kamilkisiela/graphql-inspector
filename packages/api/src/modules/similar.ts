import {similar} from '@graphql-inspector/core';
import {loadSchema} from '@graphql-inspector/load';
import gql from 'graphql-tag';

import {QueryResolvers, SimilarResolvers} from '../generated/graphql';

export const typeDefs = gql`
  type Match {
    name: String!
    rating: Float!
  }

  type Similar {
    name: String!
    best: Match!
    types: [Match!]
  }

  extend type Query {
    similar(schema: String!, threshold: Float): [Similar!]
    similarTo(schema: String!, name: String!, threshold: Float): Similar!
  }
`;

const Query: QueryResolvers = {
  async similar(_, args) {
    const schema = await loadSchema(args.schema);
    const similarMap = await similar(schema, undefined, args.threshold as any);

    return Object.keys(similarMap).map(name => ({
      name,
      ...similarMap[name],
    }));
  },
  async similarTo(_, args) {
    const schema = await loadSchema(args.schema);
    const similarMap = await similar(schema, args.name, args.threshold as any);

    return {
      name: args.name,
      ...similarMap[args.name],
    };
  },
};

const Similar: SimilarResolvers = {
  best(parent) {
    return {
      name: parent.bestMatch.target.typeId,
      rating: parent.bestMatch.rating,
    };
  },
  types(parent) {
    return parent.ratings.map(match => ({
      name: match.target.typeId,
      rating: match.rating,
    }));
  },
};

export const resolvers = {
  Query,
  Similar,
};
