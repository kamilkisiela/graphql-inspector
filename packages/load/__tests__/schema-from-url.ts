jest.mock('node-fetch');

import fetch from 'node-fetch';
import {buildSchema, introspectionFromSchema, printSchema} from 'graphql';
const {Response} = jest.requireActual('node-fetch');
import {loadSchema} from '../src';

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

  // mockRequest(testUrl, introspection);
  const mockedFetch: jest.SpyInstance<any> = fetch as any;

  mockedFetch.mockReturnValue(
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: introspection,
        }),
      ),
    ),
  );

  const fetchedSchema = await loadSchema(testUrl);

  expect(printSchema(fetchedSchema)).toEqual(printSchema(schema));
});
