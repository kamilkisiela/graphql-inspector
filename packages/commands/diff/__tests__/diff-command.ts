import '@graphql-inspector/testing';
import {mockCommand} from '@graphql-inspector/commands';
import {mockLogger, unmockLogger} from '@graphql-inspector/logger';
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

const diff = createCommand({
  config: {
    commands: [],
    loaders: [],
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
    yargs.reset();
    spyProcessExit = jest.spyOn(process, 'exit');
    spyProcessExit.mockImplementation();

    spyProcessCwd = jest
      .spyOn(process, 'cwd')
      .mockImplementation(() => __dirname);

    spyReporter = jest.fn();
    mockLogger(spyReporter as any);
  });

  afterEach(() => {
    yargs.reset();
    unmockLogger();
    spyProcessExit.mockRestore();
    spyProcessCwd.mockRestore();
    spyReporter.mockRestore();
  });

  test('should load graphql file', async () => {
    await mockCommand(diff, 'diff old.graphql old.graphql');

    expect(spyReporter).toHaveBeenCalledNormalized('No changes detected');
    expect(spyReporter).not.toHaveBeenCalledNormalized(
      'Detected the following changes',
    );
  });

  test('should load different schema from graphql file', async () => {
    await mockCommand(diff, 'diff old.graphql new.graphql');

    expect(spyReporter).not.toHaveBeenCalledWith('No changes detected');
    expect(spyReporter).toHaveBeenCalledNormalized(
      'Detected the following changes (4) between schemas:',
    );

    expect(spyProcessExit).toHaveBeenCalledWith(1);
  });

  test('should load rule by name', async () => {
    await mockCommand(
      diff,
      'diff old.graphql new.graphql --rule suppressRemovalOfDeprecatedField',
    );

    expect(spyReporter).not.toHaveBeenCalledNormalized('does not exist');
  });

  test('should load rules with local path from fs', async () => {
    await mockCommand(
      diff,
      'diff old.graphql new.graphql --rule ./assets/rule.js',
    );

    expect(spyReporter).not.toHaveBeenCalledNormalized('does not exist');
  });

  test('should load rules with absolute path from fs', async () => {
    await mockCommand(
      diff,
      `diff old.graphql new.graphql --rule ${resolve(
        __dirname,
        'assets/rule.js',
      )}`,
    );

    expect(spyReporter).not.toHaveBeenCalledNormalized('does not exist');
  });

  test.only('should render error if file does not exist', async () => {
    await mockCommand(diff, `diff old.graphql new.graphql --rule noop.js`);

    expect(spyReporter).toHaveBeenCalledNormalized('does not exist');
  });

  test('should render error if file does not exist', async () => {
    await mockCommand(
      diff,
      `diff old.graphql new.graphql --onComplete ${resolve(
        __dirname,
        'assets/onComplete.js',
      )}`,
    );

    expect(spyProcessExit).toHaveBeenCalledWith(2);
  });

  test('should render error if file does not exist', async () => {
    await mockCommand(
      diff,
      `diff old.graphql new.graphql --onComplete noop.js`,
    );

    expect(spyReporter).toHaveBeenCalledNormalized('does not exist');
  });
});
