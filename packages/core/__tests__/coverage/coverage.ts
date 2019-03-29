import {buildSchema, Source, print} from 'graphql';
import gql from 'graphql-tag';

import {coverage} from '../../src/index';

test('coverage', () => {
  const a = buildSchema(/* GraphQL */ `
    type Post {
      id: ID
      title: String
      author: String
      createdAt: Int
    }

    type Query {
      post: Post
      posts: [Post!]
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

  const results = coverage(a, [new Source(print(doc))]);

  // Query
  expect(results.types.Query.hits).toEqual(1);
  expect(results.types.Query.children.posts.hits).toEqual(0);
  expect(results.types.Query.children.post.hits).toEqual(1);
  // Post
  expect(results.types.Post.hits).toEqual(2);
  expect(results.types.Post.children.id.hits).toEqual(1);
  expect(results.types.Post.children.title.hits).toEqual(1);
  expect(results.types.Post.children.author.hits).toEqual(0);
  expect(results.types.Post.children.createdAt.hits).toEqual(0);
});
