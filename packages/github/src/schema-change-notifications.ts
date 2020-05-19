import * as probot from 'probot';
import {buildSchema} from 'graphql';
import {diff} from '@graphql-inspector/core';
import {FileLoader, ConfigLoader, loadSources} from './helpers/loaders';
import {
  SchemaPointer,
  NormalizedEnvironment,
  Notifications,
  createConfig,
} from './helpers/config';
import {
  notifyWithSlack,
  notifyWithWebhook,
  notifyWithDiscord,
} from './helpers/notifications';
import {createLogger} from './helpers/logger';

export async function handleSchemaChangeNotifications({
  context,
  ref,
  repo,
  owner,
  before,
  loadFile,
  loadConfig,
}: {
  context: probot.Context;
  owner: string;
  repo: string;
  ref: string;
  before: string;
  loadFile: FileLoader;
  loadConfig: ConfigLoader;
}): Promise<void> {
  const id = `${owner}/${repo}#${ref}`;
  const logger = createLogger('NOTIFICATIONS', context);

  logger.info(`started - ${id}`);

  const isBranchPush = ref.startsWith('refs/heads/');

  if (!isBranchPush) {
    logger.warn(
      `Received Push event is not a branch push event (ref "${ref}")`,
    );
    return;
  }

  const rawConfig = await loadConfig();

  if (!rawConfig) {
    logger.error(`Missing config file`);
    return;
  }

  const branch = ref.replace('refs/heads/', '');
  const config = createConfig(rawConfig as any, [branch]);

  if (!config.notifications) {
    logger.info(`disabled. Skipping...`);
    return;
  } else {
    logger.info(`enabled`);
  }

  if (config.branch !== branch) {
    logger.info(
      `Received branch "${branch}" doesn't match expected branch "${config.branch}". Skipping...`,
    );
    return;
  }

  const oldPointer: SchemaPointer = {
    path: config.schema,
    ref: before,
  };
  const newPointer: SchemaPointer = {
    path: config.schema,
    ref,
  };

  const sources = await loadSources({config, oldPointer, newPointer, loadFile});

  const schemas = {
    old: buildSchema(sources.old, {
      assumeValid: true,
      assumeValidSDL: true,
    }),
    new: buildSchema(sources.new, {
      assumeValid: true,
      assumeValidSDL: true,
    }),
  };

  logger.info(`built schemas`);

  const changes = diff(schemas.old, schemas.new);

  if (!changes.length) {
    logger.info(`schemas are equal. Skipping...`);
    return;
  }

  const notifications = config.notifications;
  if (hasNotificationsEnabled(notifications)) {
    async function actionRunner(target: string, fn: () => Promise<void>) {
      try {
        await fn();
      } catch (error) {
        logger.error(`Failed to send a notification via ${target}`, error);
      }
    }

    const actions: Array<Promise<void>> = [];

    if (notifications.slack) {
      actions.push(
        actionRunner('slack', () =>
          notifyWithSlack({
            url: notifications.slack!,
            changes,
            environment: config.name,
          }),
        ),
      );
    }

    if (notifications.discord) {
      actions.push(
        actionRunner('slack', () =>
          notifyWithDiscord({
            url: notifications.slack!,
            changes,
            environment: config.name,
          }),
        ),
      );
    }

    if (notifications.webhook) {
      actions.push(
        actionRunner('webhook', () =>
          notifyWithWebhook({
            url: notifications.webhook!,
            changes,
            environment: config.name,
          }),
        ),
      );
    }

    if (actions.length) {
      await Promise.all(actions);
    }
  }
}

function hasNotificationsEnabled(
  notifications: NormalizedEnvironment['notifications'],
): notifications is Notifications {
  return notifications && typeof notifications === 'object';
}
