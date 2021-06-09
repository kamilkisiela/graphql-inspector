import {GraphQLExtensionDeclaration} from 'graphql-config';
import {loaders} from '@graphql-cli/loaders';

export {loaders};

export interface GlobalArgs {
  require?: Array<string | number>;
  token?: string;
  header?: Array<string | number>;
  config?: string;
}

export async function parseGlobalArgs(args: GlobalArgs) {
  const headers: Record<string, string> = {};

  if (args.header) {
    args.header.forEach((header) => {
      const [name, ...values] = (header as string).split(':');

      headers[name] = values.join('');
    });
  }

  if (args.require) {
    await Promise.all(args.require.map((mod) => import(mod as string)));
  }

  return {headers, token: args.token};
}

export const createInspectorExtension: (
  name: string,
) => GraphQLExtensionDeclaration = (name: string) => (api) => {
  loaders.forEach((loader) => {
    api.loaders.schema.register(loader);
  });
  loaders.forEach((loader) => {
    api.loaders.documents.register(loader);
  });

  return {
    name,
  };
};
