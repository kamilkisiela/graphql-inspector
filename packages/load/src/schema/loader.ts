import {GraphQLSchema} from 'graphql';

export type SchemaLoader = () => Promise<GraphQLSchema>;
export type SchemaHandler = (
  pointer: string,
  extra?: any,
) => void | (SchemaLoader);
