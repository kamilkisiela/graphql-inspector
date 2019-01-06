---
title: Compare schemas
---

Compares schemas and finds breaking or dangerous changes.

![Diff](/img/cli/diff.jpg)

## Usage

Run the following command:

    graphql-inspector diff OLD_SCHEMA NEW_SCHEMA

**Arguments**

- `OLD_SCHEMA` - point to an old schema
- `NEW_SCHEMA` - point to a new schema

**Flags**

- `-r, --require <s...>` - require modules
- `-t, --token <s>` - an access token

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
