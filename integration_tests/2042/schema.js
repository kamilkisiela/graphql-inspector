const { resolve } = require('path');
const { loadSchemaSync } = require('@graphql-tools/load');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

const baseSchema = resolve(__dirname, 'schema.graphql');
const extraTypeSchemas = [resolve(__dirname, 'extra.graphql')];

const typeDefs = loadSchemaSync([baseSchema, ...extraTypeSchemas], {
  loaders: [new GraphQLFileLoader()],
});

module.exports = makeExecutableSchema({ typeDefs });
