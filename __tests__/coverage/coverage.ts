import {buildASTSchema, Source, print} from 'graphql';
import gql from 'graphql-tag';

import {coverage} from '../../src/index';

test('coverage', () => {
  const schemaA = buildASTSchema(gql`
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

  const results = coverage(schemaA, [new Source(print(doc))]);

  // Query
  expect(results.Query.hits).toEqual(1);
  expect(results.Query.children.posts.hits).toEqual(0);
  expect(results.Query.children.post.hits).toEqual(1);
  // Post
  expect(results.Post.hits).toEqual(2);
  expect(results.Post.children.id.hits).toEqual(1);
  expect(results.Post.children.title.hits).toEqual(1);
  expect(results.Post.children.author.hits).toEqual(0);
  expect(results.Post.children.createdAt.hits).toEqual(0);
});
