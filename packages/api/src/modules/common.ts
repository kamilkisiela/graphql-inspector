import gql from 'graphql-tag';

export const typeDefs = gql`
  type DocumentSource {
    body: String!
    name: String!
  }

  type SourceLocation {
    line: Int!
    column: Int!
  }

  type GraphQLError {
    """
    A message describing the Error for debugging purposes.
    """
    message: String!

    """
    An array of { line, column } locations within the source GraphQL document
    which correspond to this error.

    Errors during validation often contain multiple locations, for example to
    point out two things with the same name. Errors during execution include a
    single location, the field which produced the error.
    """
    locations: [SourceLocation!]

    """
    An array of character offsets within the source GraphQL document
    which correspond to this error.
    """
    positions: [Int]
  }
`;
