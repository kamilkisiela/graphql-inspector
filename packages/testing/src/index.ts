import { execute, GraphQLSchema, parse } from 'graphql';
import nock from 'nock';

export function mockGraphQLServer({
  schema,
  host,
  path,
  method = 'POST',
}: {
  schema: GraphQLSchema;
  host: string;
  path: string;
  method?: 'GET' | 'POST';
}) {
  const scope = nock(host);
  if (method === 'GET') {
    scope
      .get(path => path.startsWith(path))
      .reply(async (unformattedQuery, _: any) => {
        const query = new URL(host + unformattedQuery).searchParams.get('query');
        try {
          const result = await execute({
            schema,
            document: parse(query || ''),
          });
          return [200, result];
        } catch (error) {
          return [500, error];
        }
      });
  } else {
    scope.post(path).reply(async (_, body: any) => {
      try {
        const result = await execute({
          schema,
          document: parse(body.query),
          operationName: body.operationName,
          variableValues: body.variables,
        });
        return [200, result];
      } catch (error) {
        return [500, error];
      }
    });
  }

  return () => {
    scope.done();
  };
}
