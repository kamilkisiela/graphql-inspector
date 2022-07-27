---
title: Validate documents
---

Validate documents against a schema and looks for deprecated usage.

![Validate](/assets/img/cli/validate.jpg)

## Usage

Run the following command:

    graphql-inspector validate DOCUMENTS SCHEMA

**Example**

    graphql-inspector validate './documents/*.graphql' http://localhost:3000/graphql

**Arguments**

- [`DOCUMENTS`](../api/documents) - a glob pattern that points to GraphQL Documents / Operations
- [`SCHEMA`](../api/schema) - point to a schema

**Flags**

- `-d, --deprecated` - Fail on deprecated usage (default: _false_)
- `--noStrictFragments` - Do not fail on duplicated fragment names (default: _false_)
- `--apollo` - Support Apollo directives (@client and @connection) (default: _false_)
- `--keepClientFields <b>` - Keeps the fields with @client, but removes @client directive from them - works only with combination of `--apollo` (default: _false_)
- `--method` - method on url schema pointers (default: _POST_)
- `--federation` - Support Apollo Federation directives (default: _false_)
- `--aws` - Support AWS Appsync directives and scalar types (default: _false_)
- `--maxDepth <n>` - Fail when operation depth exceeds maximum depth (default: _false_)
- `--filter <s>` - show warnings and errors only for a file (or a list of files)
- `--silent` - silent mode
- `--output <s>` - writes errors to a file
- `--onlyErrors` - shows only errors
- `--relativePaths` - displays file paths relative to process cwd
- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')

**Output**

A list of errors found in documents.
A second list with every deprecated usage.

When there's at least one error or a deprecated usage (when _--deprecated_ flag is enabled), process fails.
