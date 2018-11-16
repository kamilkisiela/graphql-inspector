# GraphQL Schema Comparator

[![CircleCI](https://circleci.com/gh/kamilkisiela/graphql-schema-comparator.svg?style=svg&circle-token=d1cd06aba321ee2b7bf8bd2041104643639463b0)](https://circleci.com/gh/kamilkisiela/graphql-schema-comparator)
[![npm version](https://badge.fury.io/js/graphql-schema-comparator.svg)](https://npmjs.com/package/graphql-schema-comparator)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![renovate-app badge](https://img.shields.io/badge/renovate-app-blue.svg)](https://renovateapp.com/)

GraphQL Schema Comparator ouputs a list of changes between two GraphQL schemas. Every change is precisely explained and marked as breaking, non-breaking or dangerous.

## Installation

```bash
yarn add graphql-schema-comparator
```

## CLI Usage

```bash
graphql-compare OLD_SCHEMA NEW_SCHEMA
graphql-compare help
```

### Examples

```bash
$ graphql-compare OLD_SCHEMA NEW_SCHEMA

Detected the following changes between schemas:

🛑  Field `name` was removed from object type `Post`
⚠️  Enum value `ARCHIVED` was added to enum `Status`
✅  Field `createdAt` was added to object type `Post`
```

## Programatic Usage

```typescript
import diff from 'graphql-schema-comparator';

const changes = diff(schemaA, schemaB);
```

## Related

This library was ported to NodeJS from [Ruby's GraphQL Schema Comparator](https://github.com/xuorig/graphql-schema_comparator)

## License

[MIT](https://github.com/kamilkisiela/graphql-schema-comparator/blob/master/LICENSE) © Kamil Kisiela
