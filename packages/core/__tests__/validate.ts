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
