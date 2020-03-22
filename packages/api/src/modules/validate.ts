import {validate} from '@graphql-inspector/core';
import {loadSchema, loadDocuments} from '@graphql-inspector/load';
import gql from 'graphql-tag';

import {QueryResolvers, InvalidDocumentResolvers} from '../generated/graphql';

export const typeDefs = gql`
  type InvalidDocument {
    source: DocumentSource!
    errors: [GraphQLError!]
  }

  extend type Query {
    validate(schema: String!, documents: String!): [InvalidDocument!]
  }
`;

const Query: QueryResolvers = {
  async validate(_, args) {
    const [schema, documents] = await Promise.all([
      loadSchema(args.schema),
      loadDocuments(args.documents),
    ]);

    return validate(schema, documents);
  },
};

const InvalidDocument: InvalidDocumentResolvers = {
  errors(doc) {
    if (doc.errors) {
      return doc.errors.map(error => ({
        message: error.message,
        locations: error.locations,
        positions: error.positions,
      }));
    }

    return null;
  },
};

export const resolvers = {
  Query,
  InvalidDocument,
};
