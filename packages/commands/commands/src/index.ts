import {InspectorConfig} from '@graphql-inspector/config';
import {Loaders} from '@graphql-inspector/loaders';
import {isAbsolute, resolve} from 'path';
import yargs, {CommandModule} from 'yargs';
import {pickPointers, PickPointers} from './graphql-config';

export {CommandModule as Command, PickPointers, pickPointers};

export interface UseCommandsAPI {
  config: InspectorConfig;
  loaders: Loaders;
  pickPointers: PickPointers;
}

export type CommandFactory<T = {}, U = {}> = (
  api: UseCommandsAPI,
) => CommandModule<T, U>;

export function useCommands(
  input: Omit<UseCommandsAPI, 'pickPointers'>,
): CommandModule[] {
  const api = {
    ...input,
    pickPointers,
  };

  return api.config.commands.map((name) => loadCommand(name)(api));
}

export function createCommand<T = {}, U = {}>(factory: CommandFactory<T, U>) {
  return factory;
}

function loadCommand(name: string): CommandFactory {
  const mod = require(`@graphql-inspector/${name}-command`);

  return mod.default || mod;
}

export function ensureAbsolute(
  filepath: string,
  basepath: string = process.cwd(),
) {
  return isAbsolute(filepath) ? filepath : resolve(basepath, filepath);
}

export interface GlobalArgs {
  require?: string[];
  token?: string;
  header?: string[];
}

export function parseGlobalArgs(args: GlobalArgs) {
  const headers: Record<string, string> = {};

  if (args.header) {
    args.header.forEach((header) => {
      const [name, ...values] = header.split(':');

      headers[name] = values.join('');
    });
  }

  if (args.require) {
    args.require.forEach((mod) => require(mod));
  }

  return {headers, token: args.token};
}

export async function mockCommand(mod: CommandModule, cmd: string) {
  return new Promise<string>((resolve, reject) => {
    yargs.command(mod).parse(cmd, (err: Error, _: never, output: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}
