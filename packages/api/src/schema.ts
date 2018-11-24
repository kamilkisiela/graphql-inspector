import {buildSchema} from 'graphql';

export const schema = buildSchema(`
  type Query {
    greeting: String
  }
`);
