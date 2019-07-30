import gql from 'graphql-tag';

export const baseSchema = gql`
  type Query {
    ping: String!
  }

  type Mutation {
    ping: String!
  }
`;
