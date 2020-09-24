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

  registerModule(loaderName: string) {
    try {
      const loader: UniversalLoader = loadModule(
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
  ): Promise<GraphQLSchema> {
    return loadSchema(pointer, {
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
    });
  }

  loadDocuments(
    pointer: SchemaPointerSingle,
    options: Omit<LoadTypedefsOptions, 'loaders'> = {},
  ): Promise<Source[]> {
    return loadDocuments(pointer, {
      loaders: this.loaders,
      ...options,
    });
  }
}

export type Loaders = Pick<LoadersRegistry, 'loadSchema' | 'loadDocuments'>;

export function useLoaders(config: InspectorConfig): Loaders {
  const loaders = new LoadersRegistry();

  config.loaders.forEach((loaderName) => loaders.registerModule(loaderName));

  return loaders;
}

function loadModule<T>(name: string): T {
  const mod = require(name);

  return mod.default ? mod.default : mod;
}
