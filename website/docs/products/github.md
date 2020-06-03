---
title: GitHub Application
---

[GraphQL Inspector App](https://github.com/apps/graphql-inspector) is a GitHub Application that you can install in any of your repositories.

GraphQL Inspector App checks your Pull Request in order to find breaking changes (and others) in a GraphQL Schema, against your `master` branch.

We strongly believe in Open Source and that's why we made it possible to have a per-repository, self-hosted GraphQL Inspector App thanks to GitHub Actions or to host your own instance in the Cloud.

---

**Main features**

- [Detect changes](#detection-of-changes)
- [Schema change notifications](#schema-change-notifications)
- [In-Code annotations](#annotations)
- [Intercept checks with serverless functions](../recipes/intercept.md)
- [Use many environments](../recipes/environments.md)
- [Use live and running GraphQL endpoints](../recipes/endpoints.md)

---

![Application](/img/github/app-action.jpg)

## Installation

GraphQL Inspector App comes with a free plan and that's the only plan.

Visit [the application on marketplace](https://github.com/marketplace/graphql-inspector) and enable it in your project:

**Pick a free plan:**
![Step 1](/img/github/app-setup-plan.jpg)
![Step 2](/img/github/app-install.jpg)

**Select repositories and click Install:**
![Step 3](/img/github/app-repositories.jpg)

## Usage

Configure GraphQL Inspector in `.github/graphql-inspector.yaml`:

```yaml
branch: 'master'
schema: 'schema.graphql' # an output of `$ graphql-inspector introspect ...`
```

It's also possible to setup everything in `package.json` (it must be placed in the root directory).

```json
{
  // ...
  "graphql-inspector": {
    "branch": "master",
    "schema": "schema.graphql"
  }
}
```

For example, `schema.graphql` points to a file in root directory of a repository.

## Features

### Schema change notifications

To stay up to date with changes in your GraphQL Schema and to receive notifications on Slack, Discord or even via WebHooks, read the ["Notifications" chapter](../essentials/notifications.md).

### Annotations

In some cases you want to get a summary of changes but no annotations on a schema file. Annotations are enabled by default but to disabled them, please follow the instructions in ["Annotations" chapter](../recipes/annotations.md).

### Detection of changes

By default, GraphQL Inspector fails the Pull Request when it detects some breaking changes. To force a successful check just set `failOnBreaking` to `false`.

### Using GraphQL Endpoint

Read more about [using live and running GraphQL endpoint](../recipes/endpoints.md) as source of schema.

### Using multiple environments

Read more about [managing many environments](../recipes/environments.md).

### Intercept checks with serverless functions

Learn how to [remotely control detected changes and accept/reject Pull Requests](../recipes/intercept.md).

## Other

### Full configuration

```yaml
# Enabling / Disabling Schema Diff
diff: true # enabled by default

# Customizing Schema Diff
diff:
  # Pull Request annotations (enabled by default)
  annotations: true
  # Fail on breaking changes or force SUCCESS when disabled (enabled by default)
  failOnBreaking: true
  # Intercept list of detected changes and decide whether or not to accept a Pull Request
  intercept: '<url>'

# Notifications (disabled by default)
notifications:
  slack: 'webhook url'
  discord: 'webhook url'
  webhook: 'webhook url'

# Your main / target branch
branch: 'master'

# A path to a schema file
schema: 'schema.graphql'

# Use live and running endpoint as source of schema
endpoint: '<url>'
```

### Recommended worflow

We recommend to automate the generation of `schema.graphql` and use `husky` to run [`$ graphql-inspector introspect`](../essentials/introspect.md):

```json
{
  // ...
  "scripts": {
    "graphql:save": "graphql-inspector introspect schema.js --write schema.graphql"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn graphql:save && git add schema.graphql"
    }
  }
}
```

This way your schema file is always up to date with your actual schema.

Now on every commit or every Pull Request the GraphQL Inspector App will annotate every change, next to the line in code where it happened.

### Deploy your own GraphQL Inspector App

We strongly believe in Open Source and that's why we made it possible to host your own instances of GraphQL Inspector App.

> Under the hood, the GraphQL Inspector uses [Probot](https://probot.github.io), a bot made by GitHub team.

There's a well written ["Deployment" chapter](https://probot.github.io/docs/deployment/) on Probot's documentation.
