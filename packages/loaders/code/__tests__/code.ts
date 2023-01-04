import { buildSchema, GraphQLObjectType } from 'graphql';
import loader from '../src';

test('should contain descriptions (#1604)', async () => {
  const results = await loader.load('./assets/bar.ts', {
    cwd: __dirname,
  });
  const mutation = buildSchema(results[0].rawSDL!).getType('Mutation') as GraphQLObjectType;

  expect(mutation.getFields().bar).toBeDefined();
});
