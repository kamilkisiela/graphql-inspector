import {NormalizedEnvironment, SchemaPointer, Endpoint} from './config';
import * as probot from 'probot';
import Dataloader from 'dataloader';
import yaml from 'js-yaml';
import axios from 'axios';
import {
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  Source,
} from 'graphql';
import {isNil, parseEndpoint} from './utils';

const GET_FILE_QUERY = /* GraphQL */ `
  query GetFile($repo: String!, $owner: String!, $expression: String!) {
    repository(name: $repo, owner: $owner) {
      object(expression: $expression) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

type FileLoaderConfig = {
  context: probot.Context;
  owner: string;
  repo: string;
};

interface FileLoaderInput {
  path: string;
  ref: string;
  throwNotFound?: boolean;
}

export type FileLoader = (input: FileLoaderInput) => Promise<string | null>;
export type ConfigLoader = () => Promise<object | null | undefined>; // id is the same every time

export function createFileLoader(config: FileLoaderConfig): FileLoader {
  const loader = new Dataloader<FileLoaderInput, string | null, string>(
    (inputs) => {
      return Promise.all(
        inputs.map(async (input) => {
          const {context, repo, owner} = config;
          const {ref, path} = input;

          const result = await context.github.graphql(GET_FILE_QUERY, {
            repo,
            owner,
            expression: `${ref}:${path}`,
          });

          try {
            if (!result) {
              throw new Error(`No result :(`);
            }

            if (result.data) {
              return result.data.repository.object.text as string;
            }

            return (result as any).repository.object.text as string;
          } catch (error) {
            console.error(error);
            const failure = new Error(`Failed to load '${path}' (ref: ${ref})`);

            if (input.throwNotFound === false) {
              console.error(failure);
              return null;
            }

            throw failure;
          }
        }),
      );
    },
    {
      batch: false,
      cacheKeyFn(obj) {
        return `${obj.ref} - ${obj.path}`;
      },
    },
  );

  return (input) => loader.load(input);
}

export function createConfigLoader(
  config: FileLoaderConfig & {
    ref: string;
  },
  loadFile: FileLoader,
): ConfigLoader {
  const loader = new Dataloader<string, object | null, string>(
    (ids) => {
      return Promise.all(
        ids.map(async (id) => {
          const [yamlConfig, ymlConfig] = await Promise.all([
            loadFile({
              ...config,
              path: `.github/${id}.yaml`,
              throwNotFound: false,
            }),
            loadFile({
              ...config,
              path: `.github/${id}.yml`,
              throwNotFound: false,
            }),
          ]);

          if (yamlConfig || ymlConfig) {
            return yaml.safeLoad((yamlConfig || ymlConfig)!);
          }

          const file = await loadFile({
            ...config,
            path: 'package.json',
          });

          if (file) {
            const pkg = JSON.parse(file);

            if (pkg[id]) {
              return pkg[id];
            }
          }

          return null;
        }),
      );
    },
    {
      batch: false,
    },
  );

  return () => loader.load('graphql-inspector');
}

export async function printSchemaFromEndpoint(endpoint: Endpoint) {
  const config = parseEndpoint(endpoint);

  const {data: response} = await axios.request({
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: {
      query: getIntrospectionQuery().replace(/\s+/g, ' ').trim(),
    },
  });
  const introspection = response.data;

  return printSchema(buildClientSchema(introspection));
}

export async function loadSources({
  config,
  oldPointer,
  newPointer,
  loadFile,
}: {
  config: NormalizedEnvironment;
  oldPointer: SchemaPointer;
  newPointer: SchemaPointer;
  loadFile: FileLoader;
}): Promise<{
  old: Source;
  new: Source;
}> {
  // Here, config.endpoint is defined only if target's branch matches branch of environment
  // otherwise it's empty
  const useEndpoint = !isNil(config.endpoint);

  const [oldFile, newFile] = await Promise.all([
    useEndpoint
      ? printSchemaFromEndpoint(config.endpoint!)
      : loadFile(oldPointer),
    loadFile(newPointer),
  ]);

  return {
    old: new Source(oldFile!),
    new: new Source(newFile!),
  };
}
