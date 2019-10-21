---
title: Validate documents
---

Validates documents against a schema and looks for deprecated usage.

`graphql-inspector validate './documents/*.graphql' http://localhost:3000/graphql`

![Validate](/img/cli/validate.jpg)

## Usage

Run the following command:

    graphql-inspector validate DOCUMENTS SCHEMA

**Arguments**

- [`DOCUMENTS`](../api/documents) - a glob pattern that points to GraphQL Documents / Operations
- [`SCHEMA`](../api/schema) - point to a schema

**Flags**

- `-d, --deprecated` - Fail on deprecated usage (default: _false_)
- `--noStrictFragments` - Do not fail on duplicated fragment names (default: _false_)
- `--apollo` - Support Apollo directives (@client and @connection) (default: _false_)
- `--maxDepth <n>` - Fail when operation depth exceeds maximum depth (default: _false_)
- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')

**Output**

A list of errors found in documents.
A second list with every deprecated usage.

When there's at least one error or a deprecated usage (when _--deprecated_ flag is enabled), process fails.
