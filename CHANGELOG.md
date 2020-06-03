# Change log

### vNEXT

### v2.1.0

- Use GraphQL Tools v6
- Integration with GraphQL CLI

### v2.0.1

- **github** skip diff checks for new branches and re-check once Pull Request is opened [#1493](https://github.com/kamilkisiela/graphql-inspector/issues/1493)
- **action github cli ci loaders** - assume valid Schema and SDL [#1508](https://github.com/kamilkisiela/graphql-inspector/pull/1508)

### v2.0.0

Read ["New GraphQL Inspector"](https://the-guild.dev/blog/new-graphql-inspector) on our blog

- **github** put annotations of removed parts of schema on new schema [#1414](https://github.com/kamilkisiela/graphql-inspector/issues/1414)
- **ci**: improve UX [#1413](https://github.com/kamilkisiela/graphql-inspector/pull/1413)
- **github** schema change notifications on Slack, Discord and through Webhook.
- **github** **action** opt-out annotations
- **github** **action** opt-in forced success on breaking changes
- **github** **action** endpoint as source of schema
- **github** support multiple environments (production, preview etc)
- **github** remote interception of detected changes (schema check) via http
- **github** managing unrelated PRs separately
- **action** use original SHA, not SHA from `pull_request` event [PR #1440](https://github.com/kamilkisiela/graphql-inspector/pull/1440)
- **github** **action** assume valid schema to avoid missing directive definitions [PR #1440](https://github.com/kamilkisiela/graphql-inspector/pull/1440)
- **cli** **ci** fix `--header` and `--token` [PR #1442](https://github.com/kamilkisiela/graphql-inspector/pull/1442)
- **cli** **ci** BREAKING: don't use preceding comments as the description by default (`--comments` flag to enable comments) [PR #1443](https://github.com/kamilkisiela/graphql-inspector/pull/1443)
- **github** use SHA of the most recent commit on ref before the push [PR #1448](https://github.com/kamilkisiela/graphql-inspector/pull/1448)
- **github** send annotations in batches [PR #1402](https://github.com/kamilkisiela/graphql-inspector/pull/1402)
- **github** use `failure` instead of `action_required` - allows to call re-runs
- **github** reduce the number of GitHub API calls by batching file fetching calls [PR #1460](https://github.com/kamilkisiela/graphql-inspector/pull/1460)

### v1.30.4

- **github**: summary page with details (like in Github Action)
- **ci**: auto discovery of commands and loaders
- **ci**: fail on unknown command
- use version ranges for `@graphql-toolkit/*`
- **logger**: remove `jest` from dependencies

### v1.30.3

### v1.30.2

- **github**: bring back default export of `app`

### v1.30.1

- Support GraphQL v15
- New package: `@graphql-inspector/ci` - a lightweight version of CLI mostly for CI usage
- Modularized Commands for CLI. Each command is now a standalone package:
  - @graphql-inspector/commands (core package)
  - @graphql-inspector/coverage-command
  - @graphql-inspector/docs-command
  - @graphql-inspector/diff-command
  - @graphql-inspector/introspect-command
  - @graphql-inspector/similar-command
  - @graphql-inspector/serve-command
  - @graphql-inspector/validate-command
- Modularized Schema and Documents loading. Each loader is now a standalone package:
  - @graphql-inspector/loaders (core package)
  - @graphql-inspector/code-loader
  - @graphql-inspector/github-loader
  - @graphql-inspector/git-loader
  - @graphql-inspector/json-loader
  - @graphql-inspector/graphql-loader
  - @graphql-inspector/url-loader
- New package for internal usage: `@graphql-inspector/logger` and `@graphql-inspector/config`
- Rename package: `@graphql-inspector/action` (was `@graphql-inspector/actions`)
- **core**: introduce `removed` and `added` change types for description of Object Type (before it was showing all changes as `changed`)
- **github**, **action**: fix import of `chalk` [#1341](https://github.com/kamilkisiela/graphql-inspector/issues/1341)
- **github**, **action**: adjust annotations to show up in correct lines [#907](https://github.com/kamilkisiela/graphql-inspector/issues/907)
- **github**, **action**: fix an issue with `@action/core` import [#1056](https://github.com/kamilkisiela/graphql-inspector/issues/1056)
- **action**: create integration test
- **cli**: fix an issue with empty descriptions when using URL pointer [#1378](https://github.com/kamilkisiela/graphql-inspector/issues/1378)

### v1.27.0

- **core** **cli**: introduce `keepClientFields` flag in `validate` [PR #783](https://github.com/kamilkisiela/graphql-inspector/pull/783)
- **core**: `UNION_MEMBER_ADDED` is no longer a breaking change but dangerous

### v1.26.0

-- **core**: add rule to ignore description changes [PR #687](https://github.com/kamilkisiela/graphql-inspector/pull/687) [@fabsrc](https://github.com/fabsrc)
-- **cli**: custom rules from local fs [PR #665](https://github.com/kamilkisiela/graphql-inspector/pull/665) [@chunksnbits](https://github.com/chunksnbits)

### v1.25.0

- **action**: log more errors (in loadConfig) [PR #606](https://github.com/kamilkisiela/graphql-inspector/pull/606)
- **docker**: make the docker image suitable for CI and document usage [PR #633](https://github.com/kamilkisiela/graphql-inspector/pull/633)

### v1.24.0

- **load**: support `.graphqls` and `.gqls` extensions [PR #576](https://github.com/kamilkisiela/graphql-inspector/pull/576)
- **load**: include `graphql-tag-pluck` [PR #577](https://github.com/kamilkisiela/graphql-inspector/pull/577)
- **cli**: [available in Docker](https://cloud.docker.com/repository/docker/kamilkisiela/graphql-inspector) [PR #578](https://github.com/kamilkisiela/graphql-inspector/pull/578) [PR #518](https://github.com/kamilkisiela/graphql-inspector/pull/518)
- **load**: make git and github loaders accept introspection results file [PR #556](https://github.com/kamilkisiela/graphql-inspector/pull/556)

### v1.23.1

### v1.23.0

- **action**: fail on missing check [PR #504](https://github.com/kamilkisiela/graphql-inspector/pull/504)
- **cli**: Allow to supress removal of deprecated fields [PR #506](https://github.com/kamilkisiela/graphql-inspector/pull/506)
- **cli**: Support Apollo directives [PR #505](https://github.com/kamilkisiela/graphql-inspector/pull/505)

### v1.22.1

### v1.22.0

- **cli**: maximum depth of operations [PR #432](https://github.com/kamilkisiela/graphql-inspector/pull/432)
- **core**: maximum depth of operations [PR #432](https://github.com/kamilkisiela/graphql-inspector/pull/432)

### v1.21.0

- **load**: allow to load schema entirely based on `git` [PR #366](https://github.com/kamilkisiela/graphql-inspector/pull/366)
- **cli**: open up for every CI solution out there! [PR #366](https://github.com/kamilkisiela/graphql-inspector/pull/366)

### v1.20.0

- **core**: `strictFragments` and `strictDeprecated` falgs in `validate()` [PR #321](https://github.com/kamilkisiela/graphql-inspector/pull/321)
- **cli**: `noStrictFragments` flag [PR #321](https://github.com/kamilkisiela/graphql-inspector/pull/321)
- **core**: fix schema coverage by skipping `__typename` [PR #353](https://github.com/kamilkisiela/graphql-inspector/pull/353) - thanks to [@loremaps](http://github.com/loremaps)

### v1.19.0

- **core**: include Interfaces in schema coverage [PR #271](https://github.com/kamilkisiela/graphql-inspector/pull/271) - thanks to [@alx13](http://github.com/alx13)
- **cli**: add http headers [PR #281](https://github.com/kamilkisiela/graphql-inspector/pull/281)
- **cli**: support gql and graphqls files as an introspect output [PR #295](https://github.com/kamilkisiela/graphql-inspector/pull/295)

### v1.18.1

- **action**: show more details after file load failed [PR #223](https://github.com/kamilkisiela/graphql-inspector/pull/223)
- **github**: show more details after file load failed [PR #223](https://github.com/kamilkisiela/graphql-inspector/pull/223)

### v1.18.0

- **github**: load `.yaml` file too [PR #216](https://github.com/kamilkisiela/graphql-inspector/pull/216)

### v1.17.0

- **action**: Update Check Run instead of creating an extra one [PR #177](https://github.com/kamilkisiela/graphql-inspector/pull/177) - thanks to [@BeeeQueue](http://github.com/BeeeQueue)

- **core**: New optional argument or an optional input field is now treated as a dangerous change [PR #147](https://github.com/kamilkisiela/graphql-inspector/pull/147)

### v1.16.0

- **core**: Required field becoming nullable should be a non-breaking change [PR #139](https://github.com/kamilkisiela/graphql-inspector/pull/139) - thanks to [@filipncs](http://github.com/filipncs)

### v1.15.0

- **action**: No double check [PR #111](https://github.com/kamilkisiela/graphql-inspector/pull/111)
- **action**: Way more independent of the github package - uses `actions-toolkit` instead of `probot` [PR #111](https://github.com/kamilkisiela/graphql-inspector/pull/111)
- **github**: Fix location of a targeted entity [PR #104](https://github.com/kamilkisiela/graphql-inspector/pull/104)
- **github**: Support .github/graphql-inspector.yml config [PR #105](https://github.com/kamilkisiela/graphql-inspector/pull/105) [PR #109](https://github.com/kamilkisiela/graphql-inspector/pull/109)

### v1.14.0

- **core**: Fix how GraphQL Schema is fetched [PR #101](https://github.com/kamilkisiela/graphql-inspector/pull/101)
- **core**: Added diff support for arrays and objects (arguments) [PR #95](https://github.com/kamilkisiela/graphql-inspector/pull/95) - thanks to [@mkaradeniz](http://github.com/mkaradeniz)

### v0.13.3

- **load**: `graphql-toolkit` expects options to be a non-null value [PR #92](https://github.com/kamilkisiela/graphql-inspector/pull/92) [Issue #91](https://github.com/kamilkisiela/graphql-inspector/issues/91)

### v0.13.2

- **github**: annotation's `message` was empty [PR #87](https://github.com/kamilkisiela/graphql-inspector/pull/87)

### v0.13.1

- **cli**: bump `apollo-server@2.4.0` [PR #86](https://github.com/kamilkisiela/graphql-inspector/pull/86)

### v0.13.0

- **load**: use The Guild's `graphql-toolkit` [PR #77](https://github.com/kamilkisiela/graphql-inspector/pull/77)
- **cli**: pass `--token` to introspection [PR #77](https://github.com/kamilkisiela/graphql-inspector/pull/77)
- **cli**: pass `--token` to introspection command [PR #77](https://github.com/kamilkisiela/graphql-inspector/pull/77)

### v0.12.0

- Move `graphql` to peer dependencies [PR #70](https://github.com/kamilkisiela/graphql-inspector/pull/70)

### v0.11.0

- **cli**: Make `--require` accept multiple values `--require a --require b` [PR #67](https://github.com/kamilkisiela/graphql-inspector/pull/67)
- **cli**: Fix `--require` not loading modules [PR #67](https://github.com/kamilkisiela/graphql-inspector/pull/67)
- **github**: Use message as a title and reason as a message [PR #67](https://github.com/kamilkisiela/graphql-inspector/pull/67)

### v0.10.0

- **github**: Uses path as a title and includes a reason [PR #65](https://github.com/kamilkisiela/graphql-inspector/pull/65)

### v0.9.0

Initial release. We didn't track changes before this version.
