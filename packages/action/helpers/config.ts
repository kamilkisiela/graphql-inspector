import { DiffInterceptor } from './diff.js';
import { isNil } from './utils.js';

export type Endpoint =
  | string
  | {
      url: string;
      method?: 'get' | 'GET' | 'post' | 'POST';
      headers?: {
        [name: string]: string;
      };
    };

export interface SchemaPointer {
  ref: string;
  path: string;
}

export interface LegacyConfig {
  diff?: boolean | Diff;
  notifications?: Notifications;
  endpoint?: Endpoint;
  schema: SchemaPointer;
}

export interface Notifications {
  slack?: string;
  discord?: string;
  webhook?: string;
}

interface Diff {
  /** @deprecated */
  experimental_merge?: boolean;
  annotations?: boolean;
  failOnBreaking?: boolean;
  approveLabel?: string;
  intercept?: DiffInterceptor;
  summaryLimit?: number;
}

interface Environment {
  branch: string;
  endpoint?: Endpoint;
  diff?: Diff | boolean;
  notifications?: Notifications | boolean;
}

export interface NormalizedEnvironment {
  name: string;
  schema: string;
  branch: string;
  endpoint?: Endpoint;
  diff: Diff | false;
  notifications: Notifications | false;
}

interface SingleEnvironmentConfig extends Environment {
  schema: string;
  others?: {
    diff?: Diff | boolean;
    notifications?: Notifications | boolean;
  };
}

interface MultipleEnvironmentConfig {
  schema: string;
  diff?: Diff | boolean;
  notifications?: Notifications | boolean;
  env: {
    [env: string]: Environment;
  };
  others?: {
    diff?: Diff | boolean;
    notifications?: Notifications | boolean;
  };
}

export type Config = SingleEnvironmentConfig | MultipleEnvironmentConfig | LegacyConfig;

export type NormalizedConfig = {
  [env: string]: NormalizedEnvironment;
};

export type NormalizedLegacyConfig = {
  __default: NormalizedEnvironment;
};

export const defaultConfigName = '__default';
export const defaultFallbackBranch = '*';
const diffDefault = {
  annotations: true,
  failOnBreaking: true,
};
const notificationsDefault = false;

function normalizeConfig(config: Config): {
  kind: 'legacy' | 'single' | 'multiple';
  config: NormalizedConfig;
} {
  if (isLegacyConfig(config)) {
    console.log('config type - "legacy"');
    return {
      kind: 'legacy',
      config: {
        [defaultConfigName]: {
          name: defaultConfigName,
          schema: config.schema.path,
          branch: config.schema.ref,
          endpoint: config.endpoint,
          notifications: prioritize<Notifications | false>(
            config.notifications,
            notificationsDefault,
          ),
          diff: prioritize<Diff | false>(config.diff, diffDefault),
        },
      },
    };
  }

  if (isSingleEnvironmentConfig(config)) {
    console.log('config type - "single"');
    return {
      kind: 'single',
      config: {
        [config.branch]: {
          name: config.branch,
          schema: config.schema,
          branch: config.branch,
          endpoint: config.endpoint,
          notifications: prioritize<Notifications | false>(
            config.notifications,
            notificationsDefault,
          ),
          diff: prioritize<Diff | false>(config.diff, diffDefault),
        },
      },
    };
  }

  if (isMultipleEnvironmentConfig(config)) {
    console.log('config type - "multiple"');
    const normalized: NormalizedConfig = {};

    for (const envName in config.env) {
      if (Object.prototype.hasOwnProperty.call(config.env, envName)) {
        const env = config.env[envName];

        normalized[envName] = {
          name: envName,
          schema: config.schema,
          branch: env.branch,
          endpoint: env.endpoint,
          diff: prioritize<Diff | false>(env.diff, config.diff, diffDefault),
          notifications: prioritize<Notifications | false>(
            env.notifications,
            config.notifications,
            notificationsDefault,
          ),
        };
      }
    }

    return {
      kind: 'multiple',
      config: normalized,
    };
  }

  throw new Error('Invalid configuration');
}

function getGlobalConfig(
  config: SingleEnvironmentConfig | MultipleEnvironmentConfig,
  fallbackBranch: string,
): NormalizedEnvironment {
  return {
    name: 'global',
    schema: config.schema,
    branch: fallbackBranch,
    notifications: false, // notifications should be disabled for non-environment commits
    diff: prioritize<Diff | false>(config.others?.diff, config.diff, diffDefault),
  };
}

export function createConfig(
  rawConfig: Config,
  setConfigKind: (kind: 'legacy' | 'single' | 'multiple') => void,
  branches: string[] = [],
  fallbackBranch = defaultFallbackBranch,
): NormalizedEnvironment {
  const { config: normalizedConfig, kind: configKind } = normalizeConfig(rawConfig);

  let config: NormalizedEnvironment | null = null;

  setConfigKind(configKind);

  if (isNormalizedLegacyConfig(normalizedConfig)) {
    config = normalizedConfig[defaultConfigName];

    if (branches.includes(config.branch) === false) {
      config.endpoint = undefined;
    }

    return config;
  }

  for (const branch of branches) {
    if (config == null) {
      config = findConfigByBranch(branch, normalizedConfig, false);
    }

    if (config) {
      break;
    }
  }

  if (config == null) {
    config = getGlobalConfig(rawConfig as any, fallbackBranch);
  }

  return config;
}

function isNormalizedLegacyConfig(config: any): config is NormalizedLegacyConfig {
  return typeof config[defaultConfigName] === 'object';
}

function isLegacyConfig(config: any): config is LegacyConfig {
  return config.schema && typeof config.schema === 'object';
}

function isSingleEnvironmentConfig(config: any): config is SingleEnvironmentConfig {
  return !config.env;
}

function isMultipleEnvironmentConfig(config: any): config is MultipleEnvironmentConfig {
  return !isLegacyConfig(config) && !isSingleEnvironmentConfig(config);
}

function findConfigByBranch(
  branch: string,
  config: NormalizedConfig,
): NormalizedEnvironment | never;
function findConfigByBranch(
  branch: string,
  config: NormalizedConfig,
  throwOnMissing: true,
): NormalizedEnvironment | never;
function findConfigByBranch(
  branch: string,
  config: NormalizedConfig,
  throwOnMissing: false,
): NormalizedEnvironment | null;
function findConfigByBranch(
  branch: string,
  config: NormalizedConfig,
  throwOnMissing = true,
): NormalizedEnvironment | null | never {
  const branches: string[] = [];

  for (const name in config) {
    if (Object.prototype.hasOwnProperty.call(config, name)) {
      const env = config[name];

      if (env.branch === branch) {
        return env;
      }

      branches.push(env.branch);
    }
  }

  if (throwOnMissing) {
    throw new Error(
      `Couldn't match branch "${branch}" with branches in config. Available branches: ${branches.join(
        ', ',
      )}`,
    );
  }

  return null;
}

type Maybe<T> = T | undefined | null;
type Toggle<T> = T | boolean;
type Option<T> = Toggle<Maybe<T>>;

// I'm not very proud of it :)
function prioritize<T>(child: Option<T>, parent: Option<T>, defaults?: T): T | false {
  if (child === false) {
    return false;
  }

  if (child === true || isNil(child)) {
    if (parent === true || isNil(parent)) {
      return defaults || false;
    }

    return typeof parent === 'object' && typeof defaults === 'object'
      ? { ...defaults, ...parent }
      : parent;
  }

  if (parent && typeof parent === 'object') {
    return {
      ...defaults,
      ...parent,
      ...child,
    };
  }

  return typeof child === 'object' && typeof defaults === 'object'
    ? { ...defaults, ...child }
    : child;
}
