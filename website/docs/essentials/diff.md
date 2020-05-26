---
title: Schema Validation
---

Detect changes to your GraphQL Schema and prevent breaking your existing applications. With GraphQL Inspector you get a list of breaking, potentially dangerous and safe changes on every Pull Request. Integrate it with GitHub, BitBucket, GitLab or any Continous Integration.

![Application](/img/github/app-action.jpg)

## Using GitHub Application

[Install our GitHub Application](../products/github.md#detection-of-changes) to check Pull Requests and commits.

## Using GitHub Action

[Use our GitHub Action](../products/action.md) in few steps.

## Using in CI

GraphQL Inspector offers a version of our CLI that is better suited for Continous Integrations. Learn more [how to use it](../products/ci.md).

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

- [`OLD_SCHEMA`](../api/schema.md) - point to an old schema
- [`NEW_SCHEMA`](../api/schema.md) - point to a new schema

**Flags**

- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')

**Output**

A list of all differences between two schemas.
GraphQL Inspector defines three kinds of changes:

- Non breaking change
- Dangerous Change
- Breaking change

When there's at least one breaking change, process fails, otherwise it succeeds.

### Examples

Compare your local schema against a remote server:

    graphql-inspector diff https://api.com/graphql schema.graphql

Compare your local schema against a schema on a master branch (github):

    graphql-inspector diff github:user/repo#master:schema.graphql schema.graphql

### Rules

In order to customize the diff's behavior, you're able to use a set of rules:

**suppressRemovalOfDeprecatedField**

Every removal of a deprecated field is considered as a breaking change. With that flag you can turn it into a dangerous change so it won't fail a process or a CI check.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule suppressRemovalOfDeprecatedField

**ignoreDescriptionChanges**

Changes of descriptions are filtered out and are not displayed in the CLI result.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule ignoreDescriptionChanges

### Custom rules

It's possible to write your own rules.

First, you need a module:

```javascript
// custom-rule.js

module.exports = ({changes}) => {
  return changes.filter(myCustomFilter);
};
```

Now, you can use that module as a rule:

    graphql-inspector diff https://api.com/graphql schema.graphql --rule './custom-rule.js'
