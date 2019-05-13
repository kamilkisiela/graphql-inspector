import {buildSchema, Source, print} from 'graphql';
import gql from 'graphql-tag';

import {coverage} from '../../src/index';

describe('coverage', () => {
  test('basic', () => {
    const a = buildSchema(/* GraphQL */ `
      interface Identifiable {
        id: ID
        createdAt: Int
      }

      type Post implements Identifiable {
        id: ID
        createdAt: Int
        title: String
        author: String
      }

      type Query {
        post: Post
        posts: [Post!]
        objectById(id: ID!): Identifiable
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
      query getObjectById {
        objectById {
          id
          ... on Post {
            title
            createdAt
          }
        }
      }
    `;

    const results = coverage(a, [new Source(print(doc))]);

    // Query
    expect(results.types.Query.hits).toEqual(2);
    expect(results.types.Query.children.posts.hits).toEqual(0);
    expect(results.types.Query.children.post.hits).toEqual(1);
    // Post
    expect(results.types.Post.hits).toEqual(4);
    expect(results.types.Post.children.id.hits).toEqual(1);
    expect(results.types.Post.children.title.hits).toEqual(2);
    expect(results.types.Post.children.author.hits).toEqual(0);
    expect(results.types.Post.children.createdAt.hits).toEqual(1);
    // Identifiable
    expect(results.types.Identifiable.hits).toEqual(1);
    expect(results.types.Identifiable.children.id.hits).toEqual(1);
    expect(results.types.Identifiable.children.createdAt.hits).toEqual(0);
  });
});
