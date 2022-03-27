import { gql } from 'graphql-tag';

gql(/* GraphQL */ `
  query isAuthenticated {
    isLoggedIn
  }
`);

export const UserFrgmnt = gql(/* GraphQL */ `
  fragment UserFrgmnt on User {
    id
  }
`);
