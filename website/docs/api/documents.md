---
title: Providing Documents
---

There are few ways of providing operations and fragments (documents in general).

## JavaScript and TypeScript files

GraphQL Inspector support glob pattern.

    ./src/app/**/*.ts

Given example above, Inspector will search every file that matches that pattern and extract operations and fragments wrapped with `gql` or `graphql` template literal tag.

Supported extensions: `.ts`, `.tsx`, `.js` and `.jsx`

## GraphQL files

GraphQL Inspector support glob pattern.

    ./src/app/**/*.graphql

Given example above, Inspector will search every file that matches that pattern and extract operations and fragments.

Supported extensions: `.graphql`, `.graphqls` and `.gql`.

> ⚠️ Remember to wrap a glob pattern with quotes: `"./src/app/**/*.graphql"` ⚠️
