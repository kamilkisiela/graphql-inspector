import {makeExecutableSchema} from 'graphql-tools';

import * as common from './schema/common';
import * as field from './schema/field';
import * as operation from './schema/operation';
import * as trace from './schema/trace';
import * as usage from './schema/usage';

const modules = [common, field, operation, trace, usage];

export const inspectorApiTypeDefs = modules.map(m => m.typeDefs);
export const inspectorApiResolvers = modules.map(m => m.resolvers);
export const inspectorApiSchema = makeExecutableSchema({
  typeDefs: inspectorApiTypeDefs,
  resolvers: inspectorApiResolvers,
});
