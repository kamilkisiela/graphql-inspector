---
title: Getting Started
---

## CLI

Install GraphQL Inspector using [`yarn`](https://yarnpkg.com/en):

```bash
yarn global add @graphql-inspector/cli
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --global @graphql-inspector/cli
```

### Usage

    graphql-inspector --help

---

## Programatic API

Install GraphQL Inspector using [`yarn`](https://yarnpkg.com/en):

```bash
yarn add @graphql-inspector/core
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save @graphql-inspector/core
```

### Usage

```typescript
import { ... } from '@graphql-inspector/core';
```

## Docker

```bash
docker run kamilkisiela/graphql-inspector --help
```

Bind volumes to `/app` for working with local files, for example:

```bash
docker run -v $PWD:/app kamilkisiela/graphql-inspector graphql-inspector diff old.graphql new.graphql
```

To run commands interactively inside of the container, use the following:

```bash
docker run -it kamilkisiela/graphql-inspector
```
