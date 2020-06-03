import {buildSchema, Source, print, parse} from 'graphql';

import {validate} from '../src/index';

describe('validate', () => {
  test('basic', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String @deprecated(reason: "BECAUSE")
        author: String
        createdAt: Int
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          id
          title
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))]);

    expect(results.length).toEqual(1);
    expect(results[0].errors.length).toEqual(0);
    expect(results[0].deprecated.length).toEqual(1);

    const deprecated = results[0].deprecated[0];
    expect(deprecated.message).toMatch(
      `The field 'Post.title' is deprecated. BECAUSE`,
    );
  });

  test('multiple fragments across multiple files with nested fragments (#36)', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String @deprecated(reason: "BECAUSE")
        author: User
        createdAt: Int
      }

      type User {
        id: ID
        name: String
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          author {
            ...AuthorInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment AuthorInfo on User {
          id
          name
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
    );

    expect(results.length).toEqual(0);
  });

  test('fail on non unique fragment names', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        createdAt: Int
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          title
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          title
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
    );

    expect(results.length).toEqual(1);
    expect(results[0].errors.length).toEqual(1);
    expect(results[0].deprecated.length).toEqual(0);

    const error = results[0].errors[0];

    expect(error.message).toMatch(`Name of 'PostInfo' fragment is not unique`);
  });

  test('omit unused fragment from a document', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        createdAt: Int
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }

        fragment UnusedPost on Post {
          id
          createdAt
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          title
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
    );

    expect(results.length).toEqual(0);
  });

  test('fail when exceeded max query depth (inline fragment)', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        createdAt: Int
        author: User
      }

      type User {
        id: ID
        name: String
        posts: [Post]
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          author {
            ... on User {
              id
            }
          }
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
      {
        maxDepth: 1,
      },
    );

    expect(results.length).toEqual(1);
  });

  test('fail when exceeded max query depth (spread fragments)', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        createdAt: Int
        author: User
      }

      type User {
        id: ID
        name: String
        posts: [Post]
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          title
          author {
            ...UserInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment UserInfo on User {
          id
          name
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
      {
        maxDepth: 1,
      },
    );

    expect(results.length).toEqual(1);
  });

  test('pass when not exceeded max query depth', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        createdAt: Int
        author: User
      }

      type User {
        id: ID
        name: String
        posts: [Post]
      }

      type Query {
        post: Post
      }

      schema {
        query: Query
      }
    `);

    const docs = [
      parse(/* GraphQL */ `
        query getPost {
          post {
            ...PostInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment PostInfo on Post {
          id
          author {
            ...UserInfo
          }
        }
      `),
      parse(/* GraphQL */ `
        fragment UserInfo on User {
          id
        }
      `),
    ];

    const results = validate(
      schema,
      docs.map((doc) => new Source(print(doc))),
      {
        maxDepth: 2,
      },
    );

    expect(results.length).toEqual(0);
  });
});
