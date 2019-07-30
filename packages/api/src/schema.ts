import {baseSchema} from './base-schema';
import {makeExecutableSchema} from 'apollo-server-express';
import {mergeGraphQLSchemas} from '@graphql-modules/epoxy';
import * as common from './modules/common';
import * as coverage from './modules/coverage';
import * as diff from './modules/diff';
import * as validate from './modules/validate';
import * as similar from './modules/similar';

export const schema = makeExecutableSchema({
  typeDefs: mergeGraphQLSchemas([
    baseSchema,
    common.typeDefs,
    coverage.typeDefs,
    diff.typeDefs,
    validate.typeDefs,
    similar.typeDefs,
  ]),
  resolvers: [
    coverage.resolvers,
    diff.resolvers,
    validate.resolvers,
    similar.resolvers,
  ] as any,
});
