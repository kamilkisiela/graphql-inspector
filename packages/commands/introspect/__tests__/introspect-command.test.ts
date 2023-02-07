import { existsSync, readFileSync, unlinkSync } from 'fs';
import { buildSchema } from 'graphql';
import yargs from 'yargs';
import { mockCommand } from '@graphql-inspector/commands';
import { LoadersRegistry } from '@graphql-inspector/loaders';
import { mockLogger, unmockLogger } from '@graphql-inspector/logger';
import { mockGraphQLServer } from '@graphql-inspector/testing';
import loader from '@graphql-inspector/url-loader';
import createCommand from '../src';

function sleepFor(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const schema = buildSchema(/* GraphQL */ `
  type Post {
    id: ID!
    title: String!
    createdAt: String!
  }

  type Query {
    post: Post!
  }
`);

const loaders = new LoadersRegistry();

loaders.register(loader);

const introspect = createCommand({
  config: {
    commands: [],
    loaders: [],
  },
  loaders,
});

describe('introspect', () => {
  let spyReporter: vi.SpyInstance;
  let spyProcessCwd: vi.SpyInstance;

  beforeEach(() => {
    yargs();
    spyProcessCwd = vi.spyOn(process, 'cwd').mockImplementation(() => __dirname);
    spyReporter = vi.fn();
    mockLogger(spyReporter);
  });

  afterEach(() => {
    yargs();
    unmockLogger();
    spyProcessCwd.mockRestore();
    spyReporter.mockRestore();
    try {
      unlinkSync('graphql.schema.json');
    } catch {
      /* ignore */
    }
  });

  test.skip('graphql api with port and ws in name using url-loader', async () => {
    const done = mockGraphQLServer({
      schema,
      host: 'http://foo.ws:8020',
      path: '/graphql',
    });
    await mockCommand(introspect, 'introspect http://foo.ws:8020/graphql');
    await sleepFor(500);

    done();
    expect(existsSync('graphql.schema.json')).toBe(true);
  });

  test.skip('saved to graphql files using url-loader', async () => {
    const done = mockGraphQLServer({
      schema,
      host: 'https://example.com',
      path: '/graphql',
    });
    await mockCommand(introspect, 'introspect https://example.com/graphql -w schema.graphql');
    await sleepFor(500);

    done();
    expect(existsSync('schema.graphql')).toBe(true);
    const printed = readFileSync('schema.graphql', 'utf8');
    unlinkSync('schema.graphql');

    const builtSchema = buildSchema(printed);

    expect(builtSchema.getQueryType().getFields()).toHaveProperty('post');
  });

  test.skip('saved to graphql files using url-loader by GET method', async () => {
    const done = mockGraphQLServer({
      schema,
      host: 'https://example.com',
      path: '/graphql',
      method: 'GET',
    });
    await mockCommand(
      introspect,
      'introspect https://example.com/graphql -w schema.graphql --method GET',
    );
    await sleepFor(500);

    done();
    expect(existsSync('schema.graphql')).toBe(true);
    const printed = readFileSync('schema.graphql', 'utf8');
    unlinkSync('schema.graphql');

    const builtSchema = buildSchema(printed);

    expect(builtSchema.getQueryType().getFields()).toHaveProperty('post');
  });
});
