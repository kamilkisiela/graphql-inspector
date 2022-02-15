---
title: Schema Validation
---

Detect changes to your GraphQL Schema and prevent breaking your existing applications. With GraphQL Inspector you get a list of breaking, potentially dangerous and safe changes on every Pull Request. Integrate it with GitHub, BitBucket, GitLab or any Continuous Integration.

![Application](/assets/img/github/app-action.jpg)

## Using GitHub Application

[Install our GitHub Application](../products/github#detection-of-changes) to check Pull Requests and commits.

## Using GitHub Action

[Use our GitHub Action](../products/action) in few steps.

## Using in CI

GraphQL Inspector offers a version of our CLI that is better suited for Continuous Integrations. Learn more [how to use it](../products/ci).

## Using CLI

<div style={{
    padding: 16,
    backgroundColor: '#292d3e',
    color: '#bfc7d5'
}}>
    <div style={{marginBottom: 15}}>Detected following changes:</div>
    <div>❌ Field <b>posts</b> was removed from object type <b>Query</b></div>
    <div>❌ Field <b>modifiedAt</b> was removed from object type <b>Post</b></div>
    <div>✅ Field <b>Post.id</b> changed typed from <b>ID</b> to <b>ID!</b></div>
    <div>✅ Deprecation reason <b>"No more used"</b> on field <b>Post.title</b> was added</div>
    <div style={{marginTop: 15}}><span style={{color: 'red'}}>ERROR</span> Detected 2 breaking changes!</div>
</div>

### Usage

Run the following command:

    graphql-inspector diff OLD_SCHEMA NEW_SCHEMA

**Arguments**

- [`OLD_SCHEMA`](../api/schema) - point to an old schema
- [`NEW_SCHEMA`](../api/schema) - point to a new schema

**Flags**

- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')
- `--method` - method on url schema pointers (default: _POST_)
- `--federation` - Support Apollo Federation directives (default: _false_)
- `--aws` - Support AWS Appsync directives and scalar types (default: _false_)

**Output**

A list of all differences between two schemas.
GraphQL Inspector defines three kinds of changes:

- Non-breaking change
- Dangerous Change
- Breaking change

When there's at least one breaking change, process fails, otherwise it succeeds.

### Examples

Compare your local schema against a remote server:

    graphql-inspector diff https://api.com/graphql schema.graphql

Compare your local schema against a schema on a master branch (GitHub):

    graphql-inspector diff github:user/repo#master:schema.graphql schema.graphql

### Rules

In order to customize the diff's behavior, you're able to use a set of rules:

**dangerousBreaking**

Turns every dangerous change to be a breaking change.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule dangerousBreaking

**suppressRemovalOfDeprecatedField**

Every removal of a deprecated field is considered as a breaking change. With that flag you can turn it into a dangerous change, so it won't fail a process or a CI check.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule suppressRemovalOfDeprecatedField

**ignoreDescriptionChanges**

Changes of descriptions are filtered out and are not displayed in the CLI result.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule ignoreDescriptionChanges

**safeUnreachable**

Breaking changes done on unreachable parts of schema (non-accessible when starting from the root types) won't be marked as breaking.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule safeUnreachable

Example of unreachable type:

```graphql
type Query {
  me: String
}

"""
User can't be requested, it's unreachable
"""
type User {
  id: ID!
}
```

**considerUsage**

Decides if a breaking change are in fact breaking, based on real usage of schema.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule considerUsage --onUsage check-usage.js

Example `check-usage.js` file:

```js
const BREAKING = false;
const NOT_BREAKING = true;

module.exports = (entities) => {
  return Promise.all(
    entities.map(async ({type, field, argument}) => {
      // User                   => { type: 'User' }
      // Query.id               => { type: 'Query', field: 'me' }
      // Query.users(last: 10)  => { type: 'Query', field: 'users', argument: 'last' }
      const used = await checkIfUsedInLast30Days(type, field, argument)
      return used ? BREAKING : NOT_BREAKING;
    })
  );
}
```

### Custom rules

It's possible to write your own rules.

First, you need a module:

```js
// custom-rule.js
module.exports = ({changes}) => {
  return changes.filter(myCustomFilter);
};
```

Now, you can use that module as a rule:

    graphql-inspector diff https://api.com/graphql schema.graphql --rule './custom-rule.js'


### Passing different headers to multiple remote schemas

If you want to do a diff between multiple remote schemas, each with different set of authentication headers, you can do it with `--left-header` and `--right-header` flags like so:

`graphql-inspector diff http://your-schema-1/graphql http://your-schema-2/graphql --left-header 'Auth: Basic 123' --right-header 'Auth: Basic 345'`

where `--left-header` will get passed to `http://your-schema-1/graphql` and `--right-header` will get passed to `http://your-schema-2/graphql`

**Note:** `--left-header` and `--right-header` overrides the `--header` flags
