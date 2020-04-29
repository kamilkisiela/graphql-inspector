import {GraphQLConfig} from '@graphql-inspector/config';
import {readFile, stat} from 'fs';
import {resolve} from 'path';
import {parse as parseYAML} from 'yamljs';

const searchPlaces = [
  `graphql.config.js`,
  'graphql.config.json',
  'graphql.config.yaml',
  'graphql.config.yml',
  '.graphqlrc',
  '.graphqlrc.js',
  '.graphqlrc.json',
  '.graphqlrc.yml',
  '.graphqlrc.yaml',
];

const legacySearchPlaces = [
  '.graphqlconfig',
  '.graphqlconfig.json',
  '.graphqlconfig.yaml',
  '.graphqlconfig.yml',
];

export type PickPointers = (
  args: {
    config?: boolean;
    schema?: string;
    documents?: string;
  },
  required: {
    schema: boolean;
    documents: boolean;
  },
) => Promise<{
  schema?: string;
  documents?: string;
}>;

export const pickPointers: PickPointers = async (args, required) => {
  let schema: string | undefined;
  let documents: string | undefined;

  if (args.config) {
    const config = await useGraphQLConfig();

    schema = config.schema;
    documents = config.documents;
  } else {
    schema = args.schema;
    documents = args.documents;
  }

  if (required.documents || required.schema) {
    const errors: string[] = [];

    if (required.schema && !schema) {
      errors.push(`Schema pointer is missing`);
    }

    if (required.documents && !documents) {
      errors.push(`Documents pointer is missing`);
    }

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }
  }

  return {
    schema,
    documents,
  };
};

async function useGraphQLConfig(): Promise<GraphQLConfig> {
  const found = await firstExisting(searchPlaces);

  if (found) {
    return parse(found);
  }

  const foundLegacy = await firstExisting(legacySearchPlaces);

  if (foundLegacy) {
    return parse(foundLegacy);
  }

  throw new Error(`Couldn't find a GraphQL Config`);
}

async function firstExisting(places: string[]) {
  const statuses = await Promise.all(
    places.map((place) => resolve(process.cwd(), place)).map(exists),
  );

  return places.find((_, i) => statuses[i] === true);
}

async function parse(path: string): Promise<GraphQLConfig> {
  const normalizedPath = resolve(process.cwd(), path.toLowerCase());

  if (normalizedPath.endsWith('.js')) {
    const mod = require(normalizedPath);

    return mod.default || mod;
  }

  const content = await read(path);

  if (normalizedPath.endsWith('.yml') || normalizedPath.endsWith('.yaml')) {
    return parseYAML(content);
  }

  if (normalizedPath.endsWith('.json')) {
    return JSON.parse(content);
  }

  try {
    return parseYAML(content);
  } catch (error) {}

  try {
    return JSON.parse(content);
  } catch (error) {}

  throw new Error(`Failed to parse: ${path}`);
}

function read(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function exists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    stat(path, (error) => {
      resolve(error ? false : true);
    });
  });
}
