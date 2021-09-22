import {GraphQLObjectType, buildSchema} from 'graphql';
// import {resolve} from 'path';
import loader from '../src';

test('should contain descriptions (#1604)', async () => {
  const result = await loader.load('./assets/bar.ts', {
    cwd: __dirname,
  });
  const mutation = buildSchema(result.rawSDL!).getType(
    'Mutation',
  ) as GraphQLObjectType;

  expect(mutation.getFields().bar).toBeDefined();
});
