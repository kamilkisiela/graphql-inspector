import {makeExecutableSchema} from 'graphql-tools';
import {LongResolver} from 'graphql-scalars';

import * as common from './schema/common';
import * as field from './schema/field';
import * as operation from './schema/operation';
import * as trace from './schema/trace';

export const inspectorApiTypeDefs = [
  common.typeDefs,
  field.typeDefs,
  operation.typeDefs,
  trace.typeDefs,
];

export const inspectorApiResolvers = [
  {
    Long: LongResolver,
  },
  field.resolvers,
  operation.resolvers,
  trace.resolvers,
];

export const inspectorApiSchema = makeExecutableSchema({
  typeDefs: inspectorApiTypeDefs,
  resolvers: inspectorApiResolvers,
});
