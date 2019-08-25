---
title: Monitoring
---

A completely free and open-sourced set of tools to monitor and trace data of your GraphQL server.

Easy to setup and to deploy in your own environment.

## Features

- tracks GraphQL server's production usage
- traces and collects data of all operations and fields
- integrates with schema validation (usage statistics are taken into account when checking for breaking changes)
- helps you find unused parts of your schema

## Architecture overview

GraphQL Inspector's tracing service includes **three elements**:

- **GraphQL Extension** to collect data (used in your GraphQL server)
- **Endpoint** to receive the collected data (can be a lambda function or any http service)
- **GraphQL server** to explore collected data

There's also a thin layer called **Adapter** that reads and writes data from any source. At this point we only offer an adapter for PostgreSQL but we plan to create one for FaunaDB.

## Give a green light for breaking changes on no longer used fields

Let's say you want to introduce breaking changes and you know the fields you're going to remove are no longer in use. For example, they were deprecated a long time ago and now none of the operations are fetchig them.

Normally, depends on your setup, you would have to be entirely sure they are outdated and no one is using them or make GraphQL Inspector to scan all GraphQL operations in your codebase and allow for a breaking change when possible.

Statically analyzing the operations is fine but only if your application is always in sync with the GraphQL API.

Now with GraphQL Inspector and its data tracing service you're able to take for account the production usage and allow to make a breaking change when it's entirely safe.

To use it, you simply need to pass an address to the Inspector's GraphQL endpoint:

**Use with CLI**

```bash
graphql-inspector diff ... \
  --rule considerUsage     \
  --tracingEndpoint 'http://localhost:4000/inspector'
```

**Use with Github Action or Github App**

```yaml
# ...
tracing:
  endpoint: http://localhost:4000/inspector
```

## It's customizable

GraphQL Inspector by default doesn't allow for a breaking change if a field was used even just one time. There are ways to change that behavior.

### Period of time

Take for account only data collected in a period of time.

Let's say we want to validate changes against the data from 30 days ago till now:

**CLI**

```bash
graphql-inspector diff ... \
  --tracingPeriod '30 days'
```

**Github Action or Github App**

```yaml
# ...
tracing:
  endpoint: http://localhost:4000/inspector
  period: 30 days
```

> Be creative! It accepts values like `1 day`, `20 months`, `2 years` and a lot more.
> Thanks to the amazing [`ms`](npmjs.com/package/ms) library <3

### Number of runs

Allows to make a breaking change based on operations that have run at least 10 times.

**CLI**

```bash
graphql-inspector diff ... \
  --tracingCount 10
```

**Github Action or Github App**

```yaml
# ...
tracing:
  endpoint: http://localhost:4000/inspector
  count: 10
```

### Based on percentage

Allows to make a breaking change based on operations that have run more times than 10% of all operations.

**CLI**

```bash
graphql-inspector diff ... \
  --tracingPercentage 10
```

**Github Action or Github App**

```yaml
# ...
tracing:
  endpoint: http://localhost:4000/inspector
  percentage: 10
```

### Using filters together

When using the percentage or the count filter you're able to combine it with a tracking period. So it analyzes data only in a frame of time.

**CLI**

```bash
graphql-inspector diff ... \
  --tracingPercentage 10
  --tracingPeriod '30 days'
```

**Github Action or Github App**

```yaml
# ...
tracing:
  endpoint: http://localhost:4000/inspector
  percentage: 10
  period: 30 days
```

### Want more?

Open an issue, create a Pull Request or just talk to us :)

---

## Setup

Now let's talk how to setup everything in your environment.

### Collect data

You're able to use Inspector in your GraphQL server thanks to the GraphQL Extensions.

```ts
import {InspectorAdapter} from '@graphql-inspector/trace';

const inspector = new InspectorAgent({
  schema: your_schema,
  tag: 'master',
  // points to your tracing endpoint
  endpointUrl: 'http://localhost:4000/trace',
});

const apollo = new ApolloServer({
  schema,
  extensions: [() => inspector.extension()],
});

apollo.listen(3000).then(({url}) => {
  console.log(`GraphQL API: ${url}`);
});
```

Inspector tracks now all of your operations and sends them to `http://localhost:4000/trace` endpoint.

### Receive collected data

In order to start collecting data you need to create that endpoint:

```ts
import * as express from 'express';

import {
  inspectorApiTypeDefs,
  inspectorApiResolvers,
  InspectorApiContext,
} from '@graphql-inspector/trace-api';
import {PostgreSQLAdapter} from '@graphql-inspector/trace-api-postgresql';

async function main() {
  const app = express();

  const inspector = new PostgreSQLAdapter({
    debug: true,
    connection: `postgres://user:password@localhost:5432/inspector`,
  });

  // if necessary
  await inspector.createTables();

  app.post('/trace', (req, res, next) => {
    // use body-parser or similar to parse req.body
    inspector
      .writeReport(req.body)
      .then(() => {
        req.status(200).send({ok: true});
      })
      .catch(next);
  });

  app.listen(4000, () => {
    console.log(`Trace: http://localhost:4000/trace`);
  });
}

main();
```

Having the extension and the endpoint running, your data is now produced and saved in a database.

### Expose and explore collected data

To get the full potential of GraphQL Inspector we recommend to create a GraphQL API:

```ts
import {
  inspectorApiTypeDefs,
  inspectorApiResolvers,
  InspectorApiContext,
} from '@graphql-inspector/trace-api';

async function main() {
  // ...

  const apollo = new ApolloServer({
    typeDefs: inspectorApiTypeDefs,
    resolvers: inspectorApiResolvers,
    context(): InspectorApiContext {
      return {
        inspectorAdapter: inspector,
      };
    },
  });

  apollo.applyMiddleware({
    app,
    path: '/inspector',
  });

  app.listen(4000, () => {
    console.log(`Trace:     http://localhost:4000/trace`);
    console.log(`Inspector: http://localhost:4000/inspector`);
  });
}
```

Now you're able to use it with the CLI, GitHub Actions and GitHub App.

## Notes

We know there's a lot to improve, of course there is...

The whole idea behind GraphQL Inspector is to help developers build better and stable GraphQL APIs, for free, always.

There is no business model in GraphQL Inspector, we (The Guild) made it sustainable because all of our clients use it.

Because it's open-sourced and available to anyone we would appriciate any help from the community (pull requests, well described issues and things like that).
