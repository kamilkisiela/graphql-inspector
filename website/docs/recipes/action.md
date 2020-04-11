---
title: GitHub Action
---

[GraphQL Inspector Action](https://github.com/marketplace/actions/graphql-inspector) is a GitHub Action that you can install in any of your repositories.

GraphQL Inspector Action checks your Pull Request in order to find breaking changes (and others) in a GraphQL Schema, against your `master` branch.

![Application](/img/github/app-action.jpg)

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
          github-token: ${{ secrets.GITHUB_TOKEN }}
          schema: 'master:schema.graphql'
```

Now on every commit or every Pull Request the GraphQL Inspector App will annotate every change, next to the line in code where it happened.

![Summary](/img/github/summary.jpg)

![Annotations](/img/cli/github.jpg)
