import {parse, GraphQLSchema, extendSchema} from 'graphql';

export function transformSchemaWithAWS(schema: GraphQLSchema): GraphQLSchema {
  return extendSchema(
    schema,
    parse(/* GraphQL */ `
      scalar AWSDate
      scalar AWSTime
      scalar AWSDateTime
      scalar AWSTimestamp
      scalar AWSEmail
      scalar AWSJSON
      scalar AWSURL
      scalar AWSPhone
      scalar AWSIPAddress
    `),
  );
}
