---
title: Using GraphQL Endpoints
---

In this chapter, we're going to use live and running GraphQL API instead of GraphQL file as the source of truth of your schema.
This approach is very useful when you don't deploy on every push and your default branch is fine with temporary breaking changes.

> Using GitHub secrets is not possible at the moment but we're working on it!

## Usage

**Single environment setup:**

```yaml
# POST with no headers
endpoint: '<graphql-api-url>'
schema: 'schema.graphql'

# GET or POST with headers
schema: 'schema.graphql'
endpoint:
  url: '<graphql-api-url>'
  method: 'GET'
  headers:
    auth: Basic <public-key>
```

**Multiple environment setup:**

```yaml
schema: 'schema.graphql'
env:
  production:
    branch: 'master'
    endpoint: '<prod-api-url>'
  development:
    branch: 'develop'
    endpoint:
      url: '<graphql-api-url>'
      method: 'GET'
      headers:
        auth: Basic <public-key>
```

## How it works

Whenever possible, GraphQL Inspector introspects a given GraphQL endpoint and compares it with a GraphQL schema of the Pull Request.

Two scenarios to consider here.

1. When a Pull Request to `master` branch is created, GraphQL Inspector introspects a given GraphQL endpoint and compares it with a GraphQL schema of the Pull Request.
2. In case when your Pull Request targets to a branch, let's call it `my-random-branch` and it's not a branch defined in any of environments, GraphQL Inspector picks schema file as the source of truth.

> When using GraphQL Inspector as GitHub Action, endpoint is always as the source of truth.
