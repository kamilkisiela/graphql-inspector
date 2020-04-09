export interface InspectorConfig {
  use: {
    loaders: string[];
    commands: string[];
  };
}

export async function useConfig(): Promise<InspectorConfig | never> {
  return {
    use: {
      loaders: ensureList(
        discoverLoaders(['code', 'git', 'github', 'graphql', 'json', 'url']),
        'loaders',
      ),
      commands: ensureList(
        discoverCommands([
          'coverage',
          'diff',
          'docs',
          'introspect',
          'serve',
          'similar',
          'validate',
        ]),
        'commands',
      ),
    },
  };
}

function moduleExists(name: string) {
  try {
    require(name);

    return true;
  } catch (error) {
    if (error?.message?.includes(`Cannot find module '${name}'`)) {
      return false;
    }

    throw error;
  }
}

function discoverLoaders(loaders: string[]) {
  const names = loaders.map((name) => `@graphql-inspector/${name}-loader`);

  return names.filter(moduleExists);
}

function discoverCommands(commands: string[]) {
  const names = commands.map((name) => `@graphql-inspector/${name}-command`);

  return names.filter(moduleExists);
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
