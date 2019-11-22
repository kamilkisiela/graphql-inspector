---
title: What is GraphQL Inspector?
---

GraphQL Inspector outputs a list of changes between two GraphQL schemas. Every change is precisely explained and marked as breaking, non-breaking or dangerous. It will help you validate documents and fragments against a schema and even find similar or duplicated types.

![Example](/img/cli/demo.gif)

> GraphQL Inspector has a **CLI** and also a **programatic API**, so you can use it however you want to and even build tools on top of it.

# Features

### Compare GraphQL Schemas

Detects every change (both neutral, dangerous or breaking).

![Diff](/img/cli/diff.jpg)

### Validate documents against a schema

Validates documents against a schema and looks for deprecated usage.

![Validate](/img/cli/validate.jpg)

### GitHub Bot and GitHub Actions

Have a per-repository, self-hosted GraphQL Inspector service or deploy it with Docker.

![GitHub](/img/cli/github.jpg)

### Find duplicated types

Finds similar / duplicated types.

![Similar](/img/cli/similar.jpg)

### Schema coverage

Schema coverage based on documents. Find out how many times types and fields are used in your application.

![Coverage](/img/cli/coverage.jpg)

### Serve faked GraphQL API

Serves a GraphQL server with faked data and GraphQL Playground

```bash
✅ Serving the GraphQL API on http://localhost:4000/
```

### Introspect GraphQL server

Introspects a GraphQL Server and writes the result to a file

```bash
✅ Introspection result saved to schema.json
```
