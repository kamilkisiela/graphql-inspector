# GraphQL Inspector

[![CircleCI](https://circleci.com/gh/kamilkisiela/graphql-inspector.svg?style=shield&circle-token=d1cd06aba321ee2b7bf8bd2041104643639463b0)](https://circleci.com/gh/kamilkisiela/graphql-inspector)
[![npm version](https://badge.fury.io/js/graphql-inspector.svg)](https://npmjs.com/package/graphql-inspector)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![renovate-app badge](https://img.shields.io/badge/renovate-app-blue.svg)](https://renovateapp.com/)

GraphQL Inspector ouputs a list of changes between two GraphQL schemas. Every change is precisely explained and marked as breaking, non-breaking or dangerous.
It also helps you validate documents and fragments.

![Example](./demo.gif)

## Installation

```bash
yarn add graphql-inspector
```

## CLI Usage

```bash
graphql-inspector diff OLD_SCHEMA NEW_SCHEMA
graphql-inspector help
```

### Examples

```bash
$ graphql-inspector diff OLD_SCHEMA NEW_SCHEMA

Detected the following changes between schemas:

🛑  Field `name` was removed from object type `Post`
⚠️  Enum value `ARCHIVED` was added to enum `Status`
✅  Field `createdAt` was added to object type `Post`
```

## Programatic Usage

```typescript
import { diff } from 'graphql-inspector';

const changes = diff(schemaA, schemaB);
```

## Related

This library was ported to NodeJS from [Ruby's GraphQL Schema Comparator](https://github.com/xuorig/graphql-schema_comparator)

## License

[MIT](https://github.com/kamilkisiela/graphql-inspector/blob/master/LICENSE) © Kamil Kisiela
