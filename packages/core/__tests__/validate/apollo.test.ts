import { buildSchema, parse, print, Source } from 'graphql';
import { validate } from '../../src';

describe('apollo', () => {
  test('should remove a filed with @client', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
      }

      type Query {
        post: Post
      }
    `);

    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          id
          title
          extra @client
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
    });

    expect(results).toHaveLength(0);
  });

  test('should include @connection', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        comments: [String]
      }

      type Query {
        post(id: ID!): Post
      }
    `);

    const doc = parse(/* GraphQL */ `
      query getPost {
        post(id: 1) {
          id
          title
          comments @connection(key: "comments")
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
    });

    expect(results).toHaveLength(0);
  });

  test('should not remove fields with @client directive (on demand)', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Query {
        random(seed: Int): Int!
      }
    `);

    const doc = parse(/* GraphQL */ `
      query Random($seed: Int) {
        random(seed: $seed) @client
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
      keepClientFields: true,
    });

    expect(results).toHaveLength(0);
  });

  test('should remove fields with @client directive by default', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Query {
        random(seed: Int): Int!
      }
    `);

    const doc = parse(/* GraphQL */ `
      query Random($seed: Int) {
        random(seed: $seed) @client
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
    });

    expect(results).toHaveLength(1);
  });
});
