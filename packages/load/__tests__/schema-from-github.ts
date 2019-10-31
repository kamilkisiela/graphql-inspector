jest.mock('node-fetch');

import fetch from 'node-fetch';
import {loadSchema} from '../src/schema';
import {printSchema, buildSchema, parse, print} from 'graphql';
const {Response} = jest.requireActual('node-fetch');

const owner = 'kamilkisiela';
const name = 'graphql-inspector-example';
const ref = 'master';
const path = 'example/schemas/schema.graphqls';
const token = 'MY-SECRET-TOKEN';

const pointer = `github:${owner}/${name}#${ref}:${path}`;

const typeDefs = `
  type Post {
    id: ID
    title: String @deprecated(reason: "No more used")
    createdAt: String
    modifiedAt: String
  }

  type Query {
    post: Post!
    posts: [Post!]
  }
`;

function normalize(doc: string): string {
  return print(parse(doc));
}

test('load schema from GitHub', async () => {
  const mockedFetch: jest.SpyInstance<any> = fetch as any;

  mockedFetch.mockReturnValue(
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            repository: {
              object: {
                text: typeDefs,
              },
            },
          },
        }),
      ),
    ),
  );

  const schema = await loadSchema(pointer, {
    token,
  });

  expect(mockedFetch).toBeCalledTimes(1);

  const [url, init] = mockedFetch.mock.calls[0];

  // settings
  expect(url).toEqual('https://api.github.com/graphql');
  expect(init.method).toEqual('POST');
  expect(init.headers).toEqual({
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `bearer ${token}`,
  });

  const body = JSON.parse(init.body);

  // query
  expect(normalize(body.query)).toEqual(
    normalize(`
      query GetGraphQLSchemaForGraphQLInspector($owner: String!, $name: String!, $expression: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: $expression) {
            ... on Blob {
              text
            }
          }
        }
      }
    `),
  );

  // variables
  expect(body.variables).toEqual({
    owner,
    name,
    expression: ref + ':' + path,
  });

  // name
  expect(body.operationName).toEqual('GetGraphQLSchemaForGraphQLInspector');

  // schema
  expect(printSchema(schema)).toEqual(printSchema(buildSchema(typeDefs)));
});
