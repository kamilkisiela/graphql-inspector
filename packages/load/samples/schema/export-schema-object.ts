import {buildSchema} from 'graphql';

export default buildSchema(`
  type Query {
    test: String
  }
`);
