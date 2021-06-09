import {InspectorConfig} from '@graphql-inspector/config';
import {
  Source,
  UniversalLoader,
  SchemaPointerSingle,
} from '@graphql-tools/utils';
import {
  loadDocuments,
  loadSchema,
  LoadSchemaOptions,
  LoadTypedefsOptions,
} from '@graphql-tools/load';
import {GraphQLSchema, buildSchema} from 'graphql';

export class LoadersRegistry {
  private loaders: UniversalLoader[] = [];

  register(loader: UniversalLoader) {
    this.loaders.push(loader);
  }

  async registerModule(loaderName: string) {
    try {
      const loader: UniversalLoader = await loadModule(
        `@graphql-inspector/${loaderName}-loader`,
      );

      this.register(loader);
    } catch (error) {
      console.error(error);
      throw new Error(`Couldn't load ${loaderName} loader`);
    }
  }

  loadSchema(
    pointer: SchemaPointerSingle,
    options: Omit<LoadSchemaOptions, 'loaders'> = {},
    enableApolloFederation: boolean,
    enableAWS: boolean,
  ): Promise<GraphQLSchema> {
    return enrichError(
      loadSchema(pointer, {
        loaders: this.loaders,
        ...options,
        ...(enableApolloFederation
          ? {
              schemas: [
                buildSchema(/* GraphQL */ `
                  scalar _FieldSet
                  directive @external on FIELD_DEFINITION
                  directive @requires(fields: _FieldSet!) on FIELD_DEFINITION
                  directive @provides(fields: _FieldSet!) on FIELD_DEFINITION
                  directive @key(fields: _FieldSet!) on OBJECT | INTERFACE
                  directive @extends on OBJECT | INTERFACE
                `),
              ],
            }
          : {}),
        ...(enableAWS
          ? {
              schemas: [
                buildSchema(/* GraphQL */ `
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

                  directive @aws_subscribe(
                    mutations: [String!]!
                  ) on FIELD_DEFINITION

                  directive @deprecated(
                    reason: String
                  ) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ENUM | ENUM_VALUE

                  directive @aws_auth(
                    cognito_groups: [String!]!
                  ) on FIELD_DEFINITION
                  directive @aws_api_key on FIELD_DEFINITION | OBJECT
                  directive @aws_iam on FIELD_DEFINITION | OBJECT
                  directive @aws_oidc on FIELD_DEFINITION | OBJECT
                  directive @aws_cognito_user_pools(
                    cognito_groups: [String!]
                  ) on FIELD_DEFINITION | OBJECT
                `),
              ],
            }
          : {}),
      }),
    );
  }

  loadDocuments(
    pointer: SchemaPointerSingle,
    options: Omit<LoadTypedefsOptions, 'loaders'> = {},
  ): Promise<Source[]> {
    return enrichError(
      loadDocuments(pointer, {
        loaders: this.loaders,
        ...options,
      }),
    );
  }
}

export type Loaders = Pick<LoadersRegistry, 'loadSchema' | 'loadDocuments'>;

export async function useLoaders(config: InspectorConfig): Promise<Loaders> {
  const loaders = new LoadersRegistry();

  await Promise.all(
    config.loaders.map((loaderName) => loaders.registerModule(loaderName)),
  );

  return loaders;
}

async function loadModule<T>(name: string): Promise<T> {
  const mod = await import(name);

  return mod.default ? mod.default : mod;
}

/**
 * Adds `(source: <file-path>)` suffix to error message if source is available
 */
function enrichError<T>(looksPromising: Promise<T>): Promise<T> {
  return looksPromising.catch((error) => {
    if (error.source?.name) {
      error.message = `${error.message} (source: ${error.source?.name})`;
    }
    return Promise.reject(error);
  });
}
