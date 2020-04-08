import nock from 'nock';
import {GraphQLSchema, execute, parse} from 'graphql';

export function mockGraphQLServer({
  schema,
  host,
  path,
}: {
  schema: GraphQLSchema;
  host: string;
  path: string;
}) {
  const scope = nock(host)
    .post(path)
    .reply(async (_, body: any) => {
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

  return () => {
    scope.done();
  };
}
