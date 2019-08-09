import {GraphQLSchema} from 'graphql';
import {Change} from '../changes/change';

export type Rule = (input: {
  changes: Change[];
  oldSchema: GraphQLSchema;
  newSchema: GraphQLSchema;
}) => Change[];
