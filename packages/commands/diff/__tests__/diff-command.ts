import {mockCommand} from '@graphql-inspector/commands';
import {mockLogger, unmockLogger, nonTTY} from '@graphql-inspector/logger';
import yargs from 'yargs';
import {buildSchema} from 'graphql';
import {resolve} from 'path';
import createCommand from '../src';

const oldSchema = buildSchema(/* GraphQL */ `
  type Post {
    id: ID
    title: String
    createdAt: String
    modifiedAt: String
  }

  type Query {
    post: Post!
  }
`);
const newSchema = buildSchema(/* GraphQL */ `
  type Post {
    id: ID!
    title: String!
    createdAt: String!
  }

  type Query {
    post: Post!
  }
`);

function hasMessage(msg: string) {
  return (args: string[]) => nonTTY(args.join('')).indexOf(nonTTY(msg)) !== -1;
}

const diff = createCommand({
  config: {
    use: {
      commands: [],
      loaders: [],
    },
  },
  loaders: {
    async loadSchema(pointer) {
      if (pointer.includes('old')) {
        return oldSchema;
      }

      return newSchema;
    },
    async loadDocuments() {
      throw new Error('Not implemented');
    },
  },
});

describe('diff', () => {
  let spyReporter: jest.SpyInstance;
  let spyProcessExit: jest.SpyInstance;
  let spyProcessCwd: jest.SpyInstance;

  beforeEach(() => {
    spyProcessExit = jest.spyOn(process, 'exit');
    spyProcessExit.mockImplementation();

    spyProcessCwd = jest
      .spyOn(process, 'cwd')
      .mockImplementation(() => __dirname);

    spyReporter = jest.fn();
    mockLogger(spyReporter as any);
  });

  afterEach(() => {
    spyProcessExit.mockRestore();
    spyProcessCwd.mockRestore();
    spyReporter.mockRestore();
    yargs.reset();
    unmockLogger();
  });

  test('should load graphql file', async () => {
    await mockCommand(diff, 'diff old.graphql old.graphql');

    expect(
      spyReporter.mock.calls.find(hasMessage('No changes detected')),
    ).toBeDefined();

    expect(
      spyReporter.mock.calls.find(hasMessage('Detected the following changes')),
    ).not.toBeDefined();
  });

  test('should load different schema from graphql file', async () => {
    await mockCommand(diff, 'diff old.graphql new.graphql');

    expect(spyReporter).not.toHaveBeenCalledWith('No changes detected');

    expect(
      spyReporter.mock.calls.find(
        hasMessage('Detected the following changes (4) between schemas:'),
      ),
    ).toBeDefined();

    expect(spyProcessExit).toHaveBeenCalledWith(1);
  });

  test('should load rule by name', async () => {
    await mockCommand(
      diff,
      'diff old.graphql new.graphql --rule suppressRemovalOfDeprecatedField',
    );

    expect(
      spyReporter.mock.calls.find(hasMessage('does not exist')),
    ).not.toBeDefined();
  });

  test('should load rules with local path from fs', async () => {
    await mockCommand(
      diff,
      'diff old.graphql new.graphql --rule ./assets/rule.js',
    );

    expect(
      spyReporter.mock.calls.find(hasMessage('does not exist')),
    ).not.toBeDefined();
  });

  test('should load rules with absolute path from fs', async () => {
    await mockCommand(
      diff,
      `diff old.graphql new.graphql --rule ${resolve(
        __dirname,
        'assets/rule.js',
      )}`,
    );

    expect(
      spyReporter.mock.calls.find(hasMessage('does not exist')),
    ).not.toBeDefined();
  });

  test('should render error if file does not exist', async () => {
    await mockCommand(diff, `diff old.graphql new.graphql --rule noop.js`);

    expect(
      spyReporter.mock.calls.find(hasMessage('does not exist')),
    ).toBeDefined();
  });
});
