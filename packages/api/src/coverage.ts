import {coverage} from '@graphql-inspector/core';
import {loadSchema, loadDocuments} from '@graphql-inspector/load';
import gql from 'graphql-tag';
import {
  QueryResolvers,
  SchemaCoverageResolvers,
  TypeCoverageResolvers,
} from './generated/graphql';

export const typeDefs = gql`
  type DocumentSource {
    body: String!
    name: String!
  }

  type Location {
    name: String!
    start: Int!
    end: Int!
  }

  type TypeChildCoverage {
    name: String!
    hits: Int!
    locations: [Location!]
  }

  type TypeCoverage {
    name: String!
    hits: Int!
    # type: GraphQLNamedType; TODO: define that
    children: [TypeChildCoverage!]
  }

  type SchemaCoverage {
    sources: [DocumentSource!]
    types: [TypeCoverage!]
  }

  extend type Query {
    coverage(schema: String!, documents: String!): SchemaCoverage!
  }
`;

const Query: QueryResolvers.Resolvers = {
  async coverage(_, args) {
    const schema = await loadSchema(args.schema);
    const documents = await loadDocuments(args.documents);

    return coverage(schema, documents);
  },
};

const SchemaCoverage: SchemaCoverageResolvers.Resolvers = {
  types(schemaCoverage) {
    return Object.keys(schemaCoverage.types).map(name => ({
      name,
      ...schemaCoverage.types[name],
    }));
  },
};

const TypeCoverage: TypeCoverageResolvers.Resolvers = {
  children(typeCoverage) {
    return Object.keys(typeCoverage.children).map(name => ({
      name,
      ...typeCoverage.children[name],
    }));
  },
};

export const resolvers = {
  Query,
  SchemaCoverage,
  TypeCoverage,
};
