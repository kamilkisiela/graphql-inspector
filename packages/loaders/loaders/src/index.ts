import {InspectorConfig} from '@graphql-inspector/config';
import {
  UniversalLoader,
  SchemaPointerSingle,
  Source,
} from '@graphql-toolkit/common';
import {
  loadDocuments,
  loadSchema,
  LoadSchemaOptions,
  LoadTypedefsOptions,
} from '@graphql-toolkit/core';
import {GraphQLSchema} from 'graphql';

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
  ): Promise<GraphQLSchema> {
    return loadSchema(pointer, {
      loaders: this.loaders,
      ...options,
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
