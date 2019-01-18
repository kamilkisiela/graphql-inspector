---
title: Find similar types
---

Get a list of similar types in order to find duplicates.

![Similar](/img/cli/similar.jpg)

## Usage

Run the following command:

    graphql-inspector similar SCHEMA

**Arguments**

- [`SCHEMA`](../api/schema) - point to a schema

**Flags**

- `-n, --type <s>` - Check only a single type (_checks all types by default_)
- `-t, --threshold <n>` - Threshold of similarity ratio (_default: 0.4_)
- `-w, --write <s>` - Write a file with results
- `-r, --require <s...>` - require modules
- `-t, --token <s>` - an access token

**Output**

A list of similar types with the rating, grouped by a name.

Process always succeeds.
