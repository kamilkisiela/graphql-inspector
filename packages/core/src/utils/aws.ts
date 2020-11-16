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
      scalar BigInt
      scalar Double

      directive @aws_subscribe(mutations: [String!]!) on FIELD_DEFINITION

      directive @deprecated(
        reason: String
      ) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ENUM | ENUM_VALUE

      directive @aws_auth(cognito_groups: [String!]!) on FIELD_DEFINITION
      directive @aws_api_key on FIELD_DEFINITION | OBJECT
      directive @aws_iam on FIELD_DEFINITION | OBJECT
      directive @aws_oidc on FIELD_DEFINITION | OBJECT
      directive @aws_cognito_user_pools(
        cognito_groups: [String!]
      ) on FIELD_DEFINITION | OBJECT
    `),
  );
}
