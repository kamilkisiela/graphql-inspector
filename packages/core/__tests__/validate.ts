import {buildASTSchema, Source, print} from 'graphql';
import gql from 'graphql-tag';

import {validate} from '../src/index';

test('validate', () => {
  const schema = buildASTSchema(gql`
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

  const doc = gql`
    query getPost {
      post {
        id
        title
      }
    }
  `;

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
  const schema = buildASTSchema(gql`
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
    gql`
      query getPost {
        post {
          ...PostInfo
        }
      }
    `,
    gql`
      fragment PostInfo on Post {
        id
        author {
          ...AuthorInfo
        }
      }
    `,
    gql`
      fragment AuthorInfo on User {
        id
        name
      }
    `,
  ];

  const results = validate(schema, docs.map(doc => new Source(print(doc))));

  expect(results.length).toEqual(1);
  expect(results[0].errors.length).toEqual(0);
  expect(results[0].deprecated.length).toEqual(0);
});

test('multiple fragments across multiple files with nested fragments (#36)', async () => {
  const schema = buildASTSchema(gql`
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
    gql`
      query getPost {
        post {
          ...PostInfo
        }
      }
    `,
    gql`
      fragment PostInfo on Post {
        id
        title
      }
    `,
    gql`
      fragment PostInfo on Post {
        id
        title
      }
    `,
  ];

  const results = validate(schema, docs.map(doc => new Source(print(doc))));

  expect(results.length).toEqual(1);
  expect(results[0].errors.length).toEqual(1);
  expect(results[0].deprecated.length).toEqual(0);

  const error = results[0].errors[0];

  expect(error.message).toMatch(`Name of 'PostInfo' fragment is not unique`);
});
