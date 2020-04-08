import {InspectorConfig} from '@graphql-inspector/config';
import {Loaders} from '@graphql-inspector/loaders';
import {isAbsolute, resolve} from 'path';
import yargs, {CommandModule} from 'yargs';

export {CommandModule as Command};

export interface UseCommandsAPI {
  config: InspectorConfig;
  loaders: Loaders;
}

export type CommandFactory<T = {}, U = {}> = (
  api: UseCommandsAPI,
) => CommandModule<T, U>;

export function useCommands(api: UseCommandsAPI): CommandModule[] {
  return api.config.use.commands.map((name) => loadCommand(name)(api));
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
  headers?: string[];
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
