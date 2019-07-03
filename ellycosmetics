---
title: Schema coverage
---

Schema coverage based on documents. Find out how many times types and fields are used in your application.

![Coverage](/img/cli/coverage.jpg)

## Usage

Run the following command:

    graphql-inspector coverage DOCUMENTS SCHEMA

**Arguments**

- [`DOCUMENTS`](../api/documents) - a glob pattern that points to GraphQL Documents / Operations
- [`SCHEMA`](../api/schema) - point to a schema

**Flags**

- `-s, --silent`- Do not render any stats in the terminal (_default: false_)
- `-w, --write <s>` - Write a file with coverage stats (_disabled by default_)
- `-d, --deprecated` - Fail on deprecated usage (_default: false_)
- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')

**Output**

Depending on enabled flags, a printed GraphQL Schema with stats per each field and a json file with data.
