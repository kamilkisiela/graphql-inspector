import * as core from '@actions/core';
import * as github from '@actions/github';
import { CheckConclusion } from '@graphql-inspector/github';
import { updateCheckRun } from '../src/checks';
import { fileLoader } from '../src/files';
import { getAssociatedPullRequest } from '../src/git';
import { run } from '../src/run';

jest.mock('../src/checks');
jest.mock('../src/git');
jest.mock('../src/files');

const mockUpdateCheckRun = updateCheckRun as jest.MockedFunction<typeof updateCheckRun>;
const mockFileLoader = fileLoader as jest.MockedFunction<typeof fileLoader>;
const mockGetAssociatedPullRequest = getAssociatedPullRequest as jest.MockedFunction<
  typeof getAssociatedPullRequest
>;

describe('Inspector Action', () => {
  const mockLoadFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'debug').mockImplementation(jest.fn());

    jest.spyOn(core, 'getInput').mockImplementation((name: string, _options) => {
      switch (name) {
        case 'github-token':
          return 'MOCK_GITHUB_TOKEN';
        case 'schema':
          return 'master:schema.graphql';
        default:
          return '';
      }
    });

    jest.spyOn(github, 'getOctokit').mockReturnValue({
      checks: {
        create: jest.fn().mockResolvedValue({
          data: {
            id: '2',
          },
        }),
      },
    });
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        owner: 'some-owner',
        repo: 'graphql-inspector',
      };
    });

    mockGetAssociatedPullRequest.mockResolvedValue({
      state: 'open',
      number: 1,
      base: {
        ref: 'master',
      },
    });
    mockFileLoader.mockReturnValue(mockLoadFile);

    process.env.GITHUB_WORKSPACE = '/workspace';
  });

  describe('rules', () => {
    it('should accept a rules list with 1 built in rule', async () => {
      jest.spyOn(core, 'getInput').mockImplementation((name: string, _options) => {
        switch (name) {
          case 'github-token':
            return 'MOCK_GITHUB_TOKEN';
          case 'schema':
            return 'master:schema.graphql';
          case 'rules':
            return `
        suppressRemovalOfDeprecatedField
        `;
          default:
            return '';
        }
      });

      mockLoadFile.mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          oldQuery: OldType @deprecated(reason: "use newQuery")
          newQuery: Int!
        }

        type OldType {
          field: String!
        }
      `).mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          newQuery: Int!
        }
      `);

      await run();

      expect(mockUpdateCheckRun).toBeCalledWith(expect.anything(), '2', {
        conclusion: CheckConclusion.Success,
        output: {
          title: 'Everything looks good',
          summary: expect.stringContaining('Found 2 changes'),
          annotations: [
            {
              annotation_level: 'warning',
              end_line: 1,
              message: "Type 'OldType' was removed",
              path: 'schema.graphql',
              start_line: 1,
              title: "Type 'OldType' was removed",
            },
            {
              annotation_level: 'warning',
              end_line: 2,
              message: expect.any(String),
              path: 'schema.graphql',
              start_line: 2,
              title: "Field 'oldQuery' (deprecated) was removed from object type 'Query'",
            },
          ],
        },
      });
    });

    it('should accept a rules list with 1 custom rule', async () => {
      jest.spyOn(core, 'getInput').mockImplementation((name: string, _options) => {
        switch (name) {
          case 'github-token':
            return 'MOCK_GITHUB_TOKEN';
          case 'schema':
            return 'master:schema.graphql';
          case 'rules':
            // This rule turns all changes from breaking to dangerous
            return `
        example/rules/custom-rule.js
        `;
          default:
            return '';
        }
      });

      mockLoadFile.mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          oldQuery: OldType @deprecated(reason: "use newQuery")
          newQuery: Int!
        }

        type OldType {
          field: String!
        }
      `).mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          newQuery: Int!
        }
      `);

      await run();

      expect(mockUpdateCheckRun).toBeCalledWith(expect.anything(), '2', {
        conclusion: CheckConclusion.Success,
        output: {
          title: 'Everything looks good',
          summary: expect.stringContaining('Found 2 changes'),
          annotations: [
            {
              annotation_level: 'warning',
              end_line: 1,
              message: "Type 'OldType' was removed",
              path: 'schema.graphql',
              start_line: 1,
              title: "Type 'OldType' was removed",
            },
            {
              annotation_level: 'warning',
              end_line: 2,
              message: expect.any(String),
              path: 'schema.graphql',
              start_line: 2,
              title: "Field 'oldQuery' (deprecated) was removed from object type 'Query'",
            },
          ],
        },
      });
    });

    it('should accept a rules list with a built-in and a custom rule', async () => {
      jest.spyOn(core, 'getInput').mockImplementation((name: string, _options) => {
        switch (name) {
          case 'github-token':
            return 'MOCK_GITHUB_TOKEN';
          case 'schema':
            return 'master:schema.graphql';
          case 'rules':
            return `
          suppressRemovalOfDeprecatedField
          example/rules/custom-rule.js
          `;
          default:
            return '';
        }
      });

      mockLoadFile.mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          oldQuery: OldType @deprecated(reason: "use newQuery")
          newQuery: Int!
        }

        type OldType {
          field: String!
        }
      `).mockResolvedValueOnce(/* GraphQL */ `
        type Query {
          newQuery: Int!
        }
      `);

      await run();

      expect(mockUpdateCheckRun).toBeCalledWith(expect.anything(), '2', {
        conclusion: CheckConclusion.Success,
        output: {
          title: 'Everything looks good',
          summary: expect.stringContaining('Found 2 changes'),
          annotations: [
            {
              annotation_level: 'warning',
              end_line: 1,
              message: "Type 'OldType' was removed",
              path: 'schema.graphql',
              start_line: 1,
              title: "Type 'OldType' was removed",
            },
            {
              annotation_level: 'warning',
              end_line: 2,
              message: expect.any(String),
              path: 'schema.graphql',
              start_line: 2,
              title: "Field 'oldQuery' (deprecated) was removed from object type 'Query'",
            },
          ],
        },
      });
    });
  });
});
