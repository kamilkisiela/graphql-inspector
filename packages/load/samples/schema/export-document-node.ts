import {parse} from 'graphql';

export default parse(`
  type Query {
    test: String
  }
`);
