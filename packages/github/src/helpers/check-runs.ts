import {Context} from 'probot';
import {CheckStatus, Annotation, CheckConclusion} from './types';
import {Logger} from './logger';
import {batch} from './utils';

const headers = {accept: 'application/vnd.github.antiope-preview+json'};

export async function start({
  context,
  owner,
  repo,
  sha,
  logger,
}: {
  sha: string;
  context: Context;
  owner: string;
  repo: string;
  logger: Logger;
}): Promise<string> {
  try {
    const result = await context.github.request({
      headers,
      method: 'POST',
      url: `https://api.github.com/repos/${owner}/${repo}/check-runs`,
      name: 'graphql-inspector',
      started_at: new Date().toISOString(),
      head_sha: sha,
      status: CheckStatus.InProgress,
    } as any);
    logger.info(`check started`);

    return result.data.url;
  } catch (error) {
    logger.error(`failed to start a check`, error);
    throw error;
  }
}

export async function annotate({
  context,
  url,
  annotations,
  title,
  summary,
  logger,
}: {
  url: string;
  annotations: Annotation[];
  context: Context;
  title: string;
  summary: string;
  logger: Logger;
}) {
  const batches = batch(annotations, 50);

  context.log.info(`annotations to be sent: ${annotations.length}`);
  context.log.info(`title: ${title}`);

  try {
    await Promise.all(
      batches.map(async (chunk) => {
        await context.github.request({
          headers,
          url,
          method: 'PATCH',
          output: {
            annotations: chunk,
            title,
            summary,
          },
        } as any);
        logger.info(`annotations sent (${chunk.length})`);
      }),
    );
  } catch (error) {
    logger.error(`failed to send annotations`, error);
    throw error;
  }
}

export async function complete({
  context,
  url,
  conclusion,
  logger,
}: {
  url: string;
  context: Context;
  conclusion: CheckConclusion;
  logger: Logger;
}) {
  try {
    await context.github.request({
      headers,
      url,
      conclusion,
      method: 'PATCH',
      completed_at: new Date().toISOString(),
      status: CheckStatus.Completed,
    } as any);
    logger.info(`check completed`);
  } catch (error) {
    logger.error(`failed to complete a check`, error);
    throw error;
  }
}
