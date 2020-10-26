import {mockGraphQLServer} from '@graphql-inspector/testing';
import {LoadersRegistry} from '@graphql-inspector/loaders';
import loader from '@graphql-inspector/url-loader';
import {mockCommand} from '@graphql-inspector/commands';
import {mockLogger, unmockLogger} from '@graphql-inspector/logger';
import yargs from 'yargs';
import {buildSchema} from 'graphql';
import {unlinkSync, existsSync} from 'fs';
import createCommand from '../src';

function sleepFor(ms: number) {
  return new Promise((resolve) => {
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
  let spyReporter: jest.SpyInstance;
  let spyProcessCwd: jest.SpyInstance;

  beforeEach(() => {
    yargs.reset();

    spyProcessCwd = jest
      .spyOn(process, 'cwd')
      .mockImplementation(() => __dirname);

    spyReporter = jest.fn();
    mockLogger(spyReporter as any);
  });

  afterEach(() => {
    yargs.reset();
    unmockLogger();
    spyProcessCwd.mockRestore();
    spyReporter.mockRestore();
    unlinkSync('graphql.schema.json');
  });

  test('graphql api with port and ws in name using url-loader', async () => {
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
});
