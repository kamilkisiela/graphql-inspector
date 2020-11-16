import {buildSchema, Source, print, parse} from 'graphql';

import {validate} from '../../src/validate';

describe('aws', () => {
  test('should accept AWS Appsync types', () => {
    const schema = buildSchema(
      /* GraphQL */ `
        type AWS_Data {
          normalScalar: String
          date: AWSDate!
          time: AWSTime!
          dateTime: AWSDateTime!
          timestamp: AWSTimestamp!
          email: AWSEmail!
          json: AWSJSON!
          url: AWSURL!
          phone: AWSPhone!
          ipAddress: AWSIPAddress!
        }

        type Query {
          data: AWS_Data
        }
      `,
      {
        assumeValid: true,
        assumeValidSDL: true,
      },
    );

    const doc = parse(/* GraphQL */ `
      query getPost {
        data {
          normalScalar
          date
          time
          dateTime
          timestamp
          email
          json
          url
          phone
          ipAddress
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      aws: true,
    });

    expect(results).toHaveLength(0);
  });
});
