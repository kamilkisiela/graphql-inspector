---
title: Find similar types
---

Get a list of similar types in order to find duplicates.

![Similar](/img/cli/similar.jpg)

## Usage

Run the following command:

    graphql-inspector similar SCHEMA

**Arguments**

- [`SCHEMA`](../api/schema.md) - point to a schema

**Flags**

- `-n, --type <s>` - Check only a single type (_checks all types by default_)
- `-t, --threshold <n>` - Threshold of similarity ratio (_default: 0.4_)
- `-w, --write <s>` - Write a file with results
- `-r, --require <s>` - require a module
- `-t, --token <s>` - an access token
- `-h, --header <s>` - set http header (`--header 'Auth: Basic 123')
- `--federation` - Support Apollo Federation directives (default: _false_)

**Output**

A list of similar types with the rating, grouped by a name.

Process always succeeds.
