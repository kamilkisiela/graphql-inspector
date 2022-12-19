import { loaders } from '@graphql-cli/loaders';
import { GraphQLExtensionDeclaration } from 'graphql-config';

export { loaders };

export interface GlobalArgs {
  require?: Array<string | number>;
  token?: string;
  header?: Array<string | number>;
  config?: string;
}

export function parseGlobalArgs(args: GlobalArgs) {
  const headers: Record<string, string> = {};

  if (args.header) {
    args.header.forEach(header => {
      const [name, ...values] = (header as string).split(':');

      headers[name] = values.join('');
    });
  }

  if (args.require) {
    args.require.forEach(mod => require(mod as string));
  }

  return { headers, token: args.token };
}

// Supports old loader format
function compatibleLoader<TSource>(loader: {
  loaderId(): string;
  canLoad(pointer: string, options?: any): Promise<boolean>;
  canLoadSync?(pointer: string, options?: any): boolean;
  load(pointer: string, options?: any): Promise<TSource | never>;
  loadSync?(pointer: string, options?: any): TSource | never;
}): {
  loaderId(): string;
  canLoad(pointer: string, options?: any): Promise<boolean>;
  canLoadSync?(pointer: string, options?: any): boolean;
  load(pointer: string, options?: any): Promise<TSource[] | never>;
  loadSync?(pointer: string, options?: any): TSource[] | never;
} {
  return {
    loaderId: loader.loaderId.bind(loader),
    canLoad: loader.canLoad.bind(loader),
    canLoadSync: loader.canLoadSync?.bind(loader),
    load(pointer, options) {
      return loader.load(pointer, options).then(source => [source]);
    },
    loadSync: loader.loadSync
      ? (pointer, options) => {
          return [loader.loadSync!(pointer, options)];
        }
      : undefined,
  };
}

export const createInspectorExtension: (name: string) => GraphQLExtensionDeclaration = (name: string) => api => {
  loaders.forEach(loader => {
    api.loaders.schema.register(compatibleLoader(loader));
  });
  loaders.forEach(loader => {
    api.loaders.documents.register(compatibleLoader(loader));
  });

  return {
    name,
  };
};
