---
title: Introspection
---

Dumps an introspection file based on a schema.

## Usage

Run the following command:

    graphql-inspector introspect SCHEMA --write path/to/file

It supports .graphql, .gql and .json extensions.

**Arguments**

- [`SCHEMA`](../api/schema) - point to a schema

**Flags**

- `-w, --write <s>` - overwrite the output (_default: graphql.schema.json_)
- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')
- `--method` - method on url schema pointers (default: _POST_)
- `--federation` - Support Apollo Federation directives (default: _false_)
- `--aws` - Support AWS Appsync directives and scalar types (default: _false_)

**Output**

Writes a file with introspection result.

> We recommend to use `introspect` as part of a git hook. Having an always up-to-date schema file might improve your workflow.
