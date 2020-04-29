// Right now everything is hardcoded for better UX but this may change in future.
// It's just easier to leave it this way

export interface GraphQLConfig {
  schema?: string;
  documents?: string;
}

export interface InspectorConfig {
  loaders: string[];
  commands: string[];
}

export const availableCommands = [
  'coverage',
  'diff',
  'docs',
  'introspect',
  'serve',
  'similar',
  'validate',
];

export const availableLoaders = [
  'code',
  'git',
  'github',
  'graphql',
  'json',
  'url',
];

export async function useConfig(): Promise<InspectorConfig | never> {
  return {
    loaders: ensureList(discoverLoaders(availableLoaders), 'loaders'),
    commands: ensureList(discoverCommands(availableCommands), 'commands'),
  };
}

function moduleExists(name: string) {
  try {
    require.resolve(name);
    return true;
  } catch (error) {
    return false;
  }
}

function discoverLoaders(loaders: string[]) {
  return loaders.filter((name) =>
    moduleExists(`@graphql-inspector/${name}-loader`),
  );
}

function discoverCommands(commands: string[]) {
  return commands.filter((name) =>
    moduleExists(`@graphql-inspector/${name}-command`),
  );
}

function ensureList<T>(list: any, path: string): T[] {
  if (!list) {
    return [];
  }

  if (Array.isArray(list)) {
    return list;
  }

  throw new Error(`Value of ${path} expected to be a list`);
}
