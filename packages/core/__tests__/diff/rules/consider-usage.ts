import {buildSchema} from 'graphql';

import {diff, CriticalityLevel} from '../../../src/index';
import {findFirstChangeByPath} from '../../../utils/testing';
import {considerUsage} from '../../../src/diff/rules/consider-usage';

describe('considerUsage rule', () => {
  test('removed', async () => {
    const a = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
        b: String!
      }
    `);
    const b = buildSchema(/* GraphQL */ `
      type Foo {
        a: String!
        c: String!
      }
    `);

    const changes = await diff(a, b, [considerUsage], {
      async checkUsage() {
        return [];
      },
    });

    const removed = findFirstChangeByPath(changes, 'Foo.b');

    expect(removed.criticality.level).toBe(CriticalityLevel.Dangerous);
  });
});
