import yargs from 'yargs';
import {buildSchema, parse} from 'graphql';
import createCommand from '../src';
import {mockCommand} from '@graphql-inspector/commands';
import {mockLogger, unmockLogger, nonTTY} from '@graphql-inspector/logger';

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

function hasMessage(msg: string) {
  return (args: string[]) => nonTTY(args.join(' ')).indexOf(nonTTY(msg)) !== -1;
}

const validate = createCommand({
  config: {
    use: {
      commands: [],
      loaders: [],
    },
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

    expect(
      spyReporter.mock.calls.find(hasMessage('Detected 1 invalid document:')),
    ).toBeDefined();

    expect(
      spyReporter.mock.calls.find(hasMessage('document.graphql:')),
    ).toBeDefined();

    expect(
      spyReporter.mock.calls.find(
        hasMessage('Cannot query field createdAtSomePoint on type Post'),
      ),
    ).toBeDefined();

    expect(
      spyReporter.mock.calls.find(hasMessage('All documents are valid')),
    ).not.toBeDefined();
  });
});
