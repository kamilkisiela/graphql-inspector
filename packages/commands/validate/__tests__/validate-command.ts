import '@graphql-inspector/testing';
import yargs from 'yargs';
import {buildSchema, parse} from 'graphql';
import {mockCommand, pickPointers} from '@graphql-inspector/commands';
import {mockLogger, unmockLogger} from '@graphql-inspector/logger';
import createCommand from '../src';

const schema = buildSchema(/* GraphQL */ `
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

const operation = parse(/* GraphQL */ `
  query post {
    post {
      id
      title
      createdAtSomePoint
    }
  }
`);

const validate = createCommand({
  pickPointers,
  config: {
    commands: [],
    loaders: [],
  },
  loaders: {
    async loadSchema() {
      return schema;
    },
    async loadDocuments() {
      return [
        {
          document: operation,
          location: 'document.graphql',
        },
      ];
    },
  },
});

describe('validate', () => {
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
    unmockLogger();
    yargs.reset();
  });

  test('should load graphql files', async () => {
    await mockCommand(validate, 'validate "*.graphql" schema.graphql');

    expect(spyReporter).toHaveBeenCalledNormalized(
      'Detected 1 invalid document:',
    );
    expect(spyReporter).toHaveBeenCalledNormalized('document.graphql:');
    expect(spyReporter).toHaveBeenCalledNormalized(
      'Cannot query field createdAtSomePoint on type Post',
    );
    expect(spyReporter).not.toHaveBeenCalledNormalized(
      'All documents are valid',
    );
  });
});
