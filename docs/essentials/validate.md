---
title: Validate documents
---

Validates documents against a schema and looks for deprecated usage.

![Validate](/img/cli/validate.jpg)

## Usage

Run the following command:

    graphql-inspector validate DOCUMENTS SCHEMA

**Arguments**

- `DOCUMENTS` - a glob pattern that points to GraphQL Documents / Operations
- `SCHEMA` - point to a schema

**Flags**

- `-d, --deprecated` - Fail on deprecated usage (default: _false_)
- `-r, --require <s...>` - require modules
- `-t, --token <s>` - an access token

**Output**

A list of errors found in documents.
A second list with every deprecated usage.

When there's at least one error or a deprecated usage (when _--deprecated_ flag is enabled), process fails.
