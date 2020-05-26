---
title: Managing Pull Requests
---

GraphQL Inspector runs a change detection on every Pull Request. It matches the target branch with the one defined in Inspector configuration.

In cases of multiple environments, it iterates over all of them and compares a target branch of the Pull Request. In single environments is less complex.

When GraphQL Inspector succeeds and finds associated environment, it detects changes between source and target schemas. If a Pull Request is not related to any environment, same thing happens.

The described approach may get you into trouble because usually you don't want to reject Pull Requests that are not (yet) affecting your environments.

This is why Inspector lets you still run the change detection but without rejecting those Pull Requests. You just need to turn off `failOnBreaking` flag.

## Single environment

You keep all the options but disable `failOnBreaking` flag.

```yaml
diff:
  annotations: true
schema: 'schema.graphql'
branch: 'master'

others:
  diff:
    failOnBreaking: false
```

## Multiple environments

You keep all the global options but disable `failOnBreaking` flag.

```yaml
diff:
  annotations: true
schema: 'schema.graphql'

env:
  production:
    branch: 'master'
  preview:
    branch: 'develop'

others:
  diff:
    failOnBreaking: false
```

## Disabling on GitHub Action

It's simple, use the [fail-on-breaking](../products/action.md#fail-on-breaking) input.
