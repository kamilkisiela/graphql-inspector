---
title: Serve with faked data
---

Takes a GraphQL schema and runs a server based on it, with faked data.

## Usage

Run the following command:

    graphql-inspector serve SCHEMA

**Arguments**

- [`SCHEMA`](../api/schema.md) - point to a schema

**Flags**

- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')

**Output**

A server running on port `4000`.
