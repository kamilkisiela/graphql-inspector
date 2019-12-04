---
title: Compare schemas
---

Compares schemas and finds breaking or dangerous changes.

![Diff](/img/cli/diff.jpg)

## Usage

Run the following command:

    graphql-inspector diff OLD_SCHEMA NEW_SCHEMA

**Arguments**

- [`OLD_SCHEMA`](../api/schema) - point to an old schema
- [`NEW_SCHEMA`](../api/schema) - point to a new schema

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

## Examples

Compare your local schema against a remote server:

    graphql-inspector diff https://api.com/graphql schema.graphql

Compare your local schema against a schema on a master branch (github):

    graphql-inspector diff github:user/repo#master:schema.graphql schema.graphql

## Rules

In order to customize the diff's behavior, you're able to use a set of rules:

**suppressRemovalOfDeprecatedField**

Every removal of a deprecated field is considered as a breaking change. With that flag you can turn it into a dangerous change so it won't fail a process or a CI check.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule suppressRemovalOfDeprecatedField

**ignoreDescriptionChanges**

Changes of descriptions are filtered out and are not displayed in the CLI result.

    graphql-inspector diff https://api.com/graphql schema.graphql --rule ignoreDescriptionChanges

## Custom rules

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
