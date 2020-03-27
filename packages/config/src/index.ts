import {cosmiconfig} from 'cosmiconfig';
import {isAbsolute, resolve} from 'path';

export interface InspectorConfig {
  use: {
    loaders: string[];
    commands: string[];
  };
}

interface UseConfigOptions {
  config?: string;
}

export async function useConfig(
  options?: UseConfigOptions,
): Promise<InspectorConfig | never> {
  const cosmi = cosmiconfig('inspector', {
    cache: true,
  });

  const config = await (options?.config
    ? cosmi.load(
        isAbsolute(options.config)
          ? options.config
          : resolve(process.cwd(), options.config),
      )
    : cosmi.search());

  if (!config) {
    throw new Error('Config not found');
  }

  if (config.isEmpty) {
    throw new Error('Config is empty');
  }

  return {
    use: {
      loaders: ensureList(config.config?.use?.loaders, 'loaders'),
      commands: ensureList(config.config?.use?.commands, 'commands'),
    },
  };
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
