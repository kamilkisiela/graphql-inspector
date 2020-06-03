---
title: Schema change notifications
---

Stay up to date with changes in your GraphQL Schema. Receive notifications on Slack, Discord or even via WebHooks every time new changes are introduced.

Track what happens in your Production, Staging or QA environments.

> ⚠️ Available only in GitHub Application ⚠️

## How it works?

Every pushed commit is checked by GraphQL Inspector. If changes are detected, it sends a notification to your Slack or Discord.

You can exactly specifiy which environments Inspector should track.

## Configuration

Enabling schema change notifications is pretty straightforward. You need to define one of targets: Slack, Discord or generic webhook.

```yaml
notifications:
  slack: 'your-slack-webhook'
  discord: 'your-discord-webhook'
  webhook: 'your-own-webhook'
```

### Using with environments

Notifications are highly customizable.
You're able to have a setup where every schema change on any of your enironments is sent via webhook.
To reduce the noise, you can setup Slack notifications only for Production environment.

```yaml
notifications:
  webhook: 'your-own-webhook'
env:
  production:
    branch: 'master'
    notifications:
      slack: '<slack-webhook>'
  dev:
    branch: 'develop'
```

Whenever a new change is pushed to `develop` branch, you get a notification via Webhook but not on Slack.

## Notifications on Slack

In order to use Slack notifications, you need to create your own application on Slack and an Incoming Webhook. [Follow these instructions](https://slack.com/intl/en-pl/help/articles/115005265063-Incoming-Webhooks-for-Slack).

```yaml
notifications:
  slack: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
```

![Notifications on Slack](/img/notifications/slack.png)

## Notifications on Discord

Same story as with Slack. You need to create a webhook first, [following these instructions](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks) and pass it to

```yaml
notifications:
  discord: 'https://discordapp.com/api/webhooks/XXXXXX/XXXXXX'
```

![Notifications on Discord](/img/notifications/discord.png)

## Notifications via Webhook

For more advanced cases, you may want to use the Webhook option.

```yaml
notifications:
  webhook: 'https://your-app.com/webhooks/schema-changes'
```

From now on, every change in your schema will pass through the webhook. You can integrate it with other tools, send to internal applications and do pretty much whatever you can imagine.

### Payload structure

The structure of the received payload described as GraphQL.

```graphql
type Payload {
  environment: String!
  name: String
  changes: [Change!]
}

type Change {
  message: String!
  level: Level!
}

enum Level {
  Breaking
  Dangerous
  Safe
}
```

### Example payload

```json
{
  "environment": "production",
  "changes": [
    {
      "message": "Field 'user' was removed from object type 'Query'",
      "level": "breaking"
    },
    {
      "message": "Argument 'limit: Int' added to field 'Query.users'",
      "level": "dangerous"
    },
    {
      "message": "Field 'role' added to object type 'User'",
      "level": "safe"
    }
  ]
}
```
