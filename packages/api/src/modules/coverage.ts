import {coverage} from '@graphql-inspector/core';
import {loadSchema, loadDocuments} from '@graphql-inspector/load';
import gql from 'graphql-tag';
import {
  QueryResolvers,
  SchemaCoverageResolvers,
  TypeCoverageResolvers,
  TypeChildCoverageResolvers,
} from '../generated/graphql';

export const typeDefs = gql`
  type Location {
    start: Int!
    end: Int!
  }

  type DocumentLocation {
    name: String!
    locations: [Location!]
  }

  type TypeChildCoverage {
    name: String!
    hits: Int!
    locations: [DocumentLocation!]
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

const Query: QueryResolvers = {
  async coverage(_, args) {
    const schema = await loadSchema(args.schema);
    const documents = await loadDocuments(args.documents);

    return coverage(schema, documents);
  },
};

const SchemaCoverage: SchemaCoverageResolvers = {
  types(schemaCoverage) {
    return Object.keys(schemaCoverage.types).map((name) => ({
      name,
      ...schemaCoverage.types[name],
    }));
  },
};

const TypeCoverage: TypeCoverageResolvers = {
  children(typeCoverage) {
    return Object.keys(typeCoverage.children).map((name) => ({
      name,
      ...typeCoverage.children[name],
    }));
  },
};

const TypeChildCoverage: TypeChildCoverageResolvers = {
  locations(typeChildCoverage) {
    return Object.keys(typeChildCoverage.locations).map((name) => ({
      name,
      locations: typeChildCoverage.locations[name],
    }));
  },
};

export const resolvers = {
  Query,
  SchemaCoverage,
  TypeCoverage,
  TypeChildCoverage,
};
