---
title: GitHub Application
---

[GraphQL Inspector App](https://github.com/apps/graphql-inspector) is a GitHub Application that you can install in any of your repositories.

GraphQL Inspector App checks your Pull Request in order to find breaking changes (and others) in a GraphQL Schema, against your `master` branch.

We strongly believe in Open Source and that's why we made it possible to have a per-repository, self-hosted GraphQL Inspector App thanks to GitHub Actions or to host your own instance in the Cloud.

![GitHub](/img/cli/github.jpg)

## Usage

Configure GraphQL Inspector in `.github/graphql-inspector.yaml`:

```yaml
diff: true # enables Schema Comparison (reject PR on breaking changes)
schema:
  ref: master # branch, SHA
  path: schema.graphql # an output of `$ graphql-inspector introspect ...`
```

It's also possible to setup everything in `package.json` (it must be placed in the root directory).

```json
{
  // ...
  "graphql-inspector": {
    "diff": true, // enables Schema Comparison (reject PR on breaking changes)
    "schema": {
      "ref": "master", // branch, SHA
      "path": "schema.graphql" // an output of `$ graphql-inspector introspect ...`
    }
  }
}
```

> We recommend to automate the workflow and use `husky` to run [`$ graphql-inspector introspect`](../essentials/introspect):

```json
{
  // ...
  "scripts": {
    "graphql:dump": "graphql-inspector introspect schema.js --write schema.graphql",
    "precommit": "yarn graphql:dump && git add schema.graphql"
  }
}
```

This way your schema file is always up to date with your actual schema.

## GitHub Application

You don't have to host your own instance of GraphQL Inspector, we got you covered. Simply install [GraphQL Inspector App](https://github.com/apps/graphql-inspector) in a repository and enjoy having a solid workflow.

## Use GitHub Actions

With GitHub Actions, you don't have to host GraphQL Inspector anywhere on your own. Here's an example workflow:

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
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          schema: 'master:schema.graphql'
```

Here's how it looks like:

![GitHub](/img/github/workflow.jpg)

Now on every commit or every Pull Request the GraphQL Inspector App will annotate every change, next to the line in code where it happened.

## Deploy your own GraphQL Inspector App

We strongly believe in Open Source and that's why we made it possible to host your own instances of GraphQL Inspector App.

> Under the hood, the GraphQL Inspector uses [Probot](https://probot.github.io) a bot made by GitHub team.

There's a well written ["Deployment" chapter](https://probot.github.io/docs/deployment/) on Probot's documentation.
