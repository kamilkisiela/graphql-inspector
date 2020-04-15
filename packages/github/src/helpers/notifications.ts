import {Change, CriticalityLevel} from '@graphql-inspector/core';
import axios from 'axios';
import {slackCoderize, discordCoderize, filterChangesByLevel} from './utils';

export interface WebhookNotification {
  environment: string;
  name?: string;
  changes: Array<{
    message: string;
    level: 'breaking' | 'dangerous' | 'safe';
  }>;
}

export async function notifyWithWebhook({
  url,
  changes,
}: {
  url: string;
  changes: Change[];
}) {
  const event: WebhookNotification = {
    environment: 'production',
    changes: changes.map((change) => {
      const lvl = change.criticality.level;

      return {
        message: change.message,
        level:
          lvl === CriticalityLevel.Breaking
            ? 'breaking'
            : lvl === CriticalityLevel.Dangerous
            ? 'dangerous'
            : 'safe',
      };
    }),
  };

  await axios.post(url, event, {
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function notifyWithSlack({
  url,
  changes,
}: {
  changes: Change[];
  url: string;
}) {
  const event = {
    username: 'GraphQL Inspector',
    icon_url: 'https://graphql-inspector/img/logo-slack.png',
    text: `:male-detective: Hi, I found *${changes.length} changes* in your schema:`,
    attachments: createAttachments(changes),
  };

  await axios.post(url, event, {
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function notifyWithDiscord({
  url,
  changes,
}: {
  changes: Change[];
  url: string;
}) {
  const event = {
    username: 'GraphQL Inspector',
    avatar_url: 'https://graphql-inspector/img/logo-slack.png',
    content: `:detective: Hi, I found **${changes.length} changes** in your schema:`,
    embeds: createDiscordEmbeds(changes),
  };

  await axios.post(url, event, {
    headers: {
      'content-type': 'application/json',
    },
  });
}

interface Attachment {
  fallback: string;
  color: string;
  mrkdwn_in: string[];
  author_name: string;
  text: string;
}

function createAttachments(changes: Change[]) {
  const breakingChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.Breaking),
  );
  const dangerousChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.Dangerous),
  );
  const safeChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.NonBreaking),
  );

  const attachments: Attachment[] = [];

  if (breakingChanges.length) {
    attachments.push(
      renderAttachments({
        color: '#E74C3B',
        title: 'Breaking changes',
        changes: breakingChanges,
      }),
    );
  }

  if (dangerousChanges.length) {
    attachments.push(
      renderAttachments({
        color: '#F0C418',
        title: 'Dangerous changes',
        changes: dangerousChanges,
      }),
    );
  }

  if (safeChanges.length) {
    attachments.push(
      renderAttachments({
        color: '#23B99A',
        title: 'Safe changes',
        changes: safeChanges,
      }),
    );
  }

  return attachments;
}

function renderAttachments({
  changes,
  title,
  color,
}: {
  color: string;
  title: string;
  changes: Change[];
}): Attachment {
  const text = changes
    .map((change) => slackCoderize(change.message))
    .join('\n');

  return {
    mrkdwn_in: ['text', 'fallback'],
    color,
    author_name: title,
    text,
    fallback: text,
  };
}

function createDiscordEmbeds(changes: Change[]): DiscordEmbed[] {
  const breakingChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.Breaking),
  );
  const dangerousChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.Dangerous),
  );
  const safeChanges = changes.filter(
    filterChangesByLevel(CriticalityLevel.NonBreaking),
  );

  const embeds: DiscordEmbed[] = [];

  if (breakingChanges.length) {
    embeds.push(
      renderDiscordEmbed({
        color: 15158331, // '#E74C3B',
        title: 'Breaking changes',
        changes: breakingChanges,
      }),
    );
  }

  if (dangerousChanges.length) {
    embeds.push(
      renderDiscordEmbed({
        color: 15778840, // '#F0C418',
        title: 'Dangerous changes',
        changes: dangerousChanges,
      }),
    );
  }

  if (safeChanges.length) {
    embeds.push(
      renderDiscordEmbed({
        color: 2341274, // '#23B99A',
        title: 'Safe changes',
        changes: safeChanges,
      }),
    );
  }

  return embeds;
}

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
}

function renderDiscordEmbed({
  changes,
  title,
  color,
}: {
  color: number;
  title: string;
  changes: Change[];
}): DiscordEmbed {
  const description = changes
    .map((change) => discordCoderize(change.message))
    .join('\n');

  return {
    color,
    title,
    description,
  };
}
