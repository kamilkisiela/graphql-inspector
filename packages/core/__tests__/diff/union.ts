import {buildSchema} from 'graphql';

import {diff} from '../../src/index';
import {Change, CriticalityLevel} from '../../src/diff/changes/change';

function findChangesByPath(changes: Change[], path: string) {
  return changes.filter(c => c.path === path);
}

function findFirstChangeByPath(changes: Change[], path: string) {
  return findChangesByPath(changes, path)[0];
}

test('union member added', () => {
  const a = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    union Foo = A | B
  `);
  const b = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    type C {
      C: String!
    }

    union Foo = A | B | C
  `);

  const changes = diff(a, b);

  const change = findFirstChangeByPath(changes, 'Foo');

  expect(change.criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(change.type).toEqual('UNION_MEMBER_ADDED');
  expect(change.message).toEqual("Member 'C' was added to Union type 'Foo'");
});

test('union member removed', () => {
  const a = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    type C {
      C: String!
    }

    union Foo = A | B | C
  `);
  const b = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    union Foo = A | B
  `);

  const changes = diff(a, b);
  const change = findFirstChangeByPath(changes, 'Foo');

  expect(change.criticality.level).toEqual(CriticalityLevel.Breaking);
  expect(change.type).toEqual('UNION_MEMBER_REMOVED');
  expect(change.message).toEqual(
    "Member 'C' was removed from Union type 'Foo'",
  );
});

test('same members but different order', () => {
  const a = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    union Foo = A | B
  `);
  const b = buildSchema(/* GraphQL */ `
    type A {
      a: String!
    }

    type B {
      b: String!
    }

    union Foo = B | A
  `);

  const changes = findChangesByPath(diff(a, b), 'Foo');

  expect(changes).toHaveLength(0);
});
