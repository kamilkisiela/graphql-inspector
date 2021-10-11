---
title: GitHub Action
---

[GraphQL Inspector Action](https://github.com/marketplace/actions/graphql-inspector) is a GitHub Action that you can install in any of your repositories.

GraphQL Inspector Action checks your Pull Request in order to find breaking changes (and others) in a GraphQL Schema, against your `master` branch.

![Application](/assets/img/github/app-action.jpg)

## Usage

```yaml
name: CI

on: [push]

jobs:
  test:
    name: Check Schema
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@master

      - uses: kamilkisiela/graphql-inspector@master
        with:
          schema: 'master:schema.graphql'
```

Now on every commit or every Pull Request the GraphQL Inspector App will annotate every change, next to the line in code where it happened.

---

## Inputs

### name

The name of the check ("GraphQL Inspector" by default). 
In case of multiple GraphQL Inspector Actions, use `name` to prevent GitHub from overwriting results. For example, "Check Public API" and "Check Internal API".

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    name: 'Validate Public API'
    schema: 'master:public.graphql'

- uses: kamilkisiela/graphql-inspector@master
  with:
    name: 'Check Internal API'
    schema: 'master:internal.graphql'
```

### annotations

Use annotation (enabled by default)

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    schema: 'master:schema.graphql'
    annotations: false
```

### fail-on-breaking

Fail on breaking changes (enabled by default)

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    schema: 'master:schema.graphql'
    fail-on-breaking: false
```

### approve-label

Label to mark Pull Request introducing breaking changes as safe and expected
By default, GraphQL Inspector fails the Pull Request when it detects any breaking changes.

_('approved-breaking-change' by default)_

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    schema: 'master:schema.graphql'
    approve-label: 'expected-breaking-change' 
```

To mark the breaking change as safe, apply the `approved-breaking-change` label or define your own in `approve-label`.

### endpoint

Use GraphQL API endpoint as source of schema. It should represent the "before" schema.

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    schema: 'schema.graphql' # important to define a path to schema file, without a branch
    endpoint: 'https://my-app.com/graphql'
```

If you want to use GraphQL API endpoint as source of "after" schema:

```yaml
- uses: kamilkisiela/graphql-inspector@master
  with:
    schema: 'https://pr-1234.my-app.dev/graphql'
    endpoint: 'https://my-app.com/graphql'
```

---

## Outputs

Read [GitHub Actions docs](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjobs_idoutputs) to see how to use outputs.

### changes

Total number of changes

![Summary](/assets/img/github/summary.jpg)

![Annotations](/assets/img/cli/github.jpg)
