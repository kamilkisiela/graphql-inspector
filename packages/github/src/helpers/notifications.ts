import {Change, CriticalityLevel} from '@graphql-inspector/core';
import axios from 'axios';
import {slackCoderize, discordCoderize, filterChangesByLevel} from './utils';
import {defaultConfigName} from './config';

export interface WebhookNotification {
  environment: string;
  name?: string;
  owner: string;
  repo: string;
  commit?: string;
  changes: Array<{
    message: string;
    level: CriticalityLevel;
  }>;
}

export async function notifyWithWebhook({
  url,
  changes,
  environment,
  repo,
  owner,
  commit,
}: {
  url: string;
  changes: Change[];
  environment?: string;
  owner: string;
  repo: string;
  commit?: string;
}) {
  const event: WebhookNotification = {
    repo,
    owner,
    commit,
    environment:
      environment && environment !== defaultConfigName
        ? environment
        : 'default',
    changes: changes.map((change) => ({
      message: change.message,
      level: change.criticality.level,
    })),
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
  environment,
  repo,
  owner,
  commit,
}: {
  changes: Change[];
  url: string;
  environment?: string;
  owner: string;
  repo: string;
  commit?: string;
}) {
  const totalChanges = changes.length;
  const schemaName = environment ? `${environment} schema` : `schema`;
  const sourceLink = commit
    ? ` (<https://github.com/${owner}/${repo}/commit/${commit}|\`${commit.substr(
        0,
        7,
      )}\`>)`
    : '';

  const event = {
    username: 'GraphQL Inspector',
    icon_url: 'https://graphql-inspector/img/logo-slack.png',
    text: `:male-detective: Hi, I found *${totalChanges} ${pluralize(
      'change',
      totalChanges,
    )}* in ${schemaName}${sourceLink}:`,
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
  environment,
  repo,
  owner,
  commit,
}: {
  changes: Change[];
  url: string;
  environment?: string;
  owner: string;
  repo: string;
  commit?: string;
}) {
  const totalChanges = changes.length;
  const schemaName = environment ? `${environment} schema` : `schema`;
  const sourceLink = commit
    ? ` ([\`${commit.substr(
        0,
        7,
      )}\`](https://github.com/${owner}/${repo}/commit/${commit}))`
    : '';

  const event = {
    username: 'GraphQL Inspector',
    avatar_url: 'https://graphql-inspector/img/logo-slack.png',
    content: `:detective: Hi, I found **${totalChanges} ${pluralize(
      'change',
      totalChanges,
    )}** in ${schemaName}${sourceLink}:`,
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

function pluralize(word: string, num: number): string {
  return word + (num > 1 ? 's' : '');
}
