---
title: Getting Started
---

## GitHub Application

Visit [GraphQL Inspector](https://github.com/marketplace/graphql-inspector) on GitHub Marketplace and complete installation.

Read the ["GitHub Application"](./products/github.md) chapter to see the instructions.

---

## GitHub Action

Visit [GraphQL Inspector](https://github.com/marketplace/actions/graphql-inspector) on GitHub Marketplace and complete installation.

Read the ["GitHub Action"](./products/action.md) chapter to see the instructions.

---

## CLI

Command Line Tool with all the features, installable with a single command:

Install using [`yarn`](https://yarnpkg.com/en) or [`npm`](https://www.npmjs.com/):

```bash
# Yarn
yarn global add @graphql-inspector/cli graphql

# NPM
npm install --global @graphql-inspector/cli graphql
```

### Usage

    graphql-inspector --help

---

## CLI for CI

Works similar to regular CLI but every feature is pluggable to keep the size as low as possible.

Install using [`yarn`](https://yarnpkg.com/en) or [`npm`](https://www.npmjs.com/):

```bash
# Yarn
yarn global add @graphql-inspector/ci

# NPM
npm install --global @graphql-inspector/ci
```

### Commands

Every command is installable through a package.

- diff - `@graphql-inspector/diff-command`
- validate - `@graphql-inspector/validate-command`
- coverage - `@graphql-inspector/coverage-command`
- similar - `@graphql-inspector/similar-command`
- introspect - `@graphql-inspector/introspect-command`
- serve - `@graphql-inspector/serve-command`

> Please take a look at ["Continous Integration"](./products/ci.md) chapter.

### Usage

    graphql-inspector --help

---

## Programatic API

GraphQL Inspector comes with a programatic API, here is how to use the Core package.

Install using [`yarn`](https://yarnpkg.com/en) or [`npm`](https://www.npmjs.com/):

```bash
# Yarn
yarn add @graphql-inspector/core

# NPM
npm install @graphql-inspector/core
```

### Usage

```typescript
import { diff, validate, coverage, ... } from '@graphql-inspector/core';
```

## Docker

GraphQL Inspector is also available on Docker.

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
