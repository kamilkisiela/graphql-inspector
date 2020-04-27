---
title: Intercepting Schema Changes
---

GraphQL Inspector lets you intercept schema changes via HTTP. You're able to decide which changes are acceptable which are not and all of this through even a serverless function.

Whenever GraphQL Inspector runs schema checking triggered by Push or Pull Request events, your http endpoint receives a list of changes, list of related Pull Request or a commit SHA.

![Intercept](/img/github/intercept.png)

## Usage

Configuring an interceptor looks fairly similar to [`endpoints`](./endpoints.md), except you can't modify a method, it's always POST request.

**Single environment setup:**

```yaml
# POST with no headers
intercept: '<url>'
schema: 'schema.graphql'

# With headers
schema: 'schema.graphql'
intercept:
  url: '<url>'
  headers:
    auth: Basic <public-key>
```

**Multiple environment setup:**

```yaml
schema: 'schema.graphql'
# Or globbally
# intercept: <url>
env:
  production:
    branch: 'master'
    intercept: '<url>'
  development:
    branch: 'develop'
    intercept:
      url: '<url>'
      headers:
        auth: Basic <public-key>
```

## Setting an interceptor logic

Let's set all [criticality levels to Non-Breaking](https://github.com/kamilkisiela/graphql-inspector/blob/master/packages/core/src/diff/changes/change.ts#L67) and GitHub Check [conculsion to Success](https://github.com/kamilkisiela/graphql-inspector/blob/master/packages/github/src/types.ts#L33).

```javascript
module.exports = (req, res) => {
  const changes = req.body.changes;

  changes = changes.forEach((change) => {
    change.criticality.level = 'NON_BREAKING';
  });

  res.json({
    changes,
    conclusion: 'success',
  });
};
```

There's so much freedom here. Because you know which commit or a pull request triggered the cehck, you're able to decide if submitted changes should be rejected or accepted by fetching informations from GitHub API or your internal APIs.

## Payload and Response structrues

### Payload

Described in TypeScript. Look at the source code to see the exact shape.

```typescript
import {Change} from '@graphql-inspector/core';

interface DiffInterceptorPayload {
  /**
   * https://developer.github.com/v3/activity/events/types/#checkrunevent - see "pull_request"
   */
  pullRequests?: PullRequest[];
  /**
   * Commit SHA
   */
  ref?: string;
  /**
   * https://github.com/kamilkisiela/graphql-inspector/blob/master/packages/core/src/diff/changes/change.ts#L76-L81
   */
  changes: Change[];
}
```

### Response

Described in TypeScript. Look at the source code to see the exact shape.

```typescript
import {Change} from '@graphql-inspector/core';

interface DiffInterceptorResponse {
  /**
   * https://github.com/kamilkisiela/graphql-inspector/blob/master/packages/github/src/types.ts#L32-L36
   */
  conclusion?: CheckConclusion;
  /**
   * https://github.com/kamilkisiela/graphql-inspector/blob/master/packages/core/src/diff/changes/change.ts#L76-L81
   */
  changes: Change[];
}
```
