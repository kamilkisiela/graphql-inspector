jest.mock('request');

import {buildSchema, introspectionFromSchema, printSchema} from 'graphql';
import {loadSchema} from '../src';

const mockRequest = (url: string, content: object) =>
  require('request').__registerUrlRequestMock(url, content);

const schema = buildSchema(/* GraphQL */ `
  type Book {
    title: String
  }

  type Query {
    books: [Book]
  }
`);

const introspection = introspectionFromSchema(schema);

test('should get schema from an endpoint', async () => {
  const testUrl = 'http://localhost:3000/graphql';

  mockRequest(testUrl, introspection);

  const fetchedSchema = await loadSchema(testUrl);

  expect(printSchema(fetchedSchema)).toEqual(printSchema(schema));
});
