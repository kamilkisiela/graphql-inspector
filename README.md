# GraphQL Inspector

[![CircleCI](https://circleci.com/gh/kamilkisiela/graphql-inspector.svg?style=shield&circle-token=d1cd06aba321ee2b7bf8bd2041104643639463b0)](https://circleci.com/gh/kamilkisiela/graphql-inspector)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![renovate-app badge](https://img.shields.io/badge/renovate-app-blue.svg)](https://renovateapp.com/)

**GraphQL Inspector** ouputs a list of changes between two GraphQL schemas. Every change is precisely explained and marked as breaking, non-breaking or dangerous.
It helps you validate documents and fragments against a schema and even find similar or duplicated types.

## Features

Major features:

- **Compares schemas**
- **Finds breaking or dangerous changes**
- **Validates documents against a schema**
- **Finds similar / duplicated types**
- **Schema coverage based on documents**
- **Serves a GraphQL server with faked data and GraphQL Playground**

GraphQL Inspector has a **CLI** and also a **programatic API**, so you can use it however you want to and even build tools on top of it.

## Installation

```bash
# CLI
yarn add @graphql-inspector/cli

# Core API for programatic usage
yarn add @graphql-inspector/core
```

### CLI Usage

```bash
# Compare schemas
$ graphql-inspector diff OLD_SCHEMA NEW_SCHEMA

Detected the following changes (4) between schemas:

🛑  Field `name` was removed from object type `Post`
⚠️  Enum value `ARCHIVED` was added to enum `Status`
✅  Field `createdAt` was added to object type `Post`

Detected 1 breaking change


# Validate documents
$ graphql-inspector validate DOCUMENTS SCHEMA

Detected 1 invalid document:

🛑  ./documents/post.graphql:
  - Cannot query field createdAtSomePoint on type Post. Did you mean createdAt?


# Find similar types
$ graphql-inspector similar SCHEMA

✅ Post
Best match (60%): BlogPost


# Serve faked GraphQL API with Playground
$ graphql-inspector serve SCHEMA

✅ Serving the GraphQL API on http://localhost:4000/


# Check coverage
$ graphql-inspector coverage DOCUMENTS SCHEMA

Schema coverage

type Query {
  post x 1
}

type Post {
  id x 1
  title x 1
  🛑 createdAt x 0
  🛑 modifiedAt x 0
}

```

## Programatic Usage

```typescript
import {
  diff,
  validate,
  similar,
  coverage,
  Change,
  InvalidDocument,
  SimilarMap,
  SchemaCoverage,
} from '@graphql-inspector/core';

// diff
const changes: Change[] = diff(schemaA, schemaB);
// validate
const invalid: InvalidDocument[] = validate(documentsGlob, schema);
// similar
const similar: SimilarMap = similar(schema, typename, threshold);
// coverage
const schemaCoverage: SchemaCoverage = coverage(schema, documents);
// ...
```

## Related

Some part of the library was ported to NodeJS from [Ruby's GraphQL Schema Comparator](https://github.com/xuorig/graphql-schema_comparator)

## License

[MIT](https://github.com/kamilkisiela/graphql-inspector/blob/master/LICENSE) © Kamil Kisiela
