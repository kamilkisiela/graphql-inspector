import { parse } from 'graphql';
import { calculateDepth } from '../../src/validate/query-depth';

describe('calculateDepth', () => {
  test('spread fragments', async () => {
    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          ...PostInfo
        }
      }
    `);

    const fragments: Record<string, any> = {
      PostInfo: parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id # 1
          title
          author {
            ...UserInfo
          }
        }
      `).definitions[0],
      UserInfo: parse(/* GraphQL */ `
        fragment UserInfo on User {
          id # 2
          name
        }
      `).definitions[0],
    };

    expect(
      calculateDepth({
        node: doc,
        currentDepth: 0,
        getFragment: name => fragments[name],
      }),
    ).toEqual(2);
  });

  test('inline fragments', async () => {
    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          ...PostInfo
        }
      }
    `);

    const fragments: Record<string, any> = {
      PostInfo: parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id #1
          title
          author {
            ... on User {
              id # 2
              name
            }
          }
        }
      `).definitions[0],
    };

    expect(
      calculateDepth({
        node: doc,
        currentDepth: 0,
        getFragment: name => fragments[name],
      }),
    ).toEqual(2);
  });

  test('no fragments', async () => {
    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          id # 1
          title
          author {
            id # 2
            name
          }
        }
      }
    `);

    expect(
      calculateDepth({
        node: doc,
        currentDepth: 0,
        getFragment: () => ({} as any),
      }),
    ).toEqual(2);
  });

  test('throw ASTNode on maxDepth', async () => {
    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          id # 1
          title
          author {
            id # 2
            name
          }
        }
      }
    `);

    expect(() => {
      calculateDepth({
        node: doc,
        currentDepth: 0,
        maxDepth: 1,
        getFragment: () => ({} as any),
      });
    }).toThrow();
  });
});
