---
title: Providing Schema
---

There are few options to provide your schema in GraphQL Inspector.

## JavaScript / TypeScript file

GraphQL Inspector accepts CommonJS and ESModules

```typescript
// as `default`
export default makeExecutableSchema({...});

// as `schema` variables
export const schema = makeExecutableSchema({...});
```

Or with CommonJS

```javascript
module.exports = makeExecutableSchema({...});
```

If you need to transpile a file, use `--require` option of the CLI:

    $ graphql-inspector introspect ./schema.ts --require ts-node/register

## GraphQL file

Files with those extensions: `.graphql`, `.graphqls` or `.gql` are supported by GraphQL Inspector.

    $ graphql-inspector diff ./old-schema.graphql ./new-schema.gql

## JSON file

A JSON file with introspection result can also be provided

    $ graphql-inspector diff ./old-schema.json ./new-schema.json

## GraphQL endpoint

GraphQL Inspector can also introspect your GraphQL server:

    $ graphql-inspector diff http://api.com/graphql ./new-schema.json

## Git repository

Get GraphQL Schema file from any branch or commit of your git repository:

    git:origin/branch:path/to/file

For example, you want to get `schema.graphql` from `origin/master`:

    git:origin/master:./schema.graphql

## GitHub repository

Yes, GraphQL Inspector can also do that, here's the pattern:

    github:owner/name#ref:path/to/file

- `github` - stays there, it tells Inspector we want to use github
- `owner` - your github username or organization
- `name` - repository's name
- `ref` - can be name of a branch or commit sha
- `path/to/file` - where Inspector can find the graphql file

For example, we want to fetch a .graphql file from master branch of [this sample repository](https://github.com/kamilkisiela/graphql-inspector-example/blob/master/schema.graphql):

    github:kamilkisiela/graphql-inspector-example#master:./schema.graphql --token 'github-token-here'

> GitHub Loader requires a GitHub token to be defined
