import { Context } from 'probot';
import { CheckStatus, Annotation, CheckConclusion } from './types';
import { Logger } from './logger';
import { batch } from './utils';

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
}): Promise<number> {
  try {
    const result = await context.octokit.checks.create({
      owner,
      repo,
      name: 'graphql-inspector',
      head_sha: sha,
      status: CheckStatus.InProgress,
    });
    logger.info(`check started`);

    return result.data.id;
  } catch (error) {
    logger.error(`failed to start a check`, error);
    throw error;
  }
}

export async function annotate({
  context,
  owner,
  repo,
  checkRunId,
  annotations,
  title,
  summary,
  logger,
}: {
  owner: string;
  repo: string;
  checkRunId: number;
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
      batches.map(async chunk => {
        await context.octokit.checks.update({
          owner,
          repo,
          check_run_id: checkRunId,
          output: {
            annotations: chunk,
            title,
            summary,
          },
        });
        logger.info(`annotations sent (${chunk.length})`);
      })
    );
  } catch (error) {
    logger.error(`failed to send annotations`, error);
    throw error;
  }
}

export async function complete({
  context,
  owner,
  repo,
  checkRunId,
  conclusion,
  logger,
}: {
  owner: string;
  repo: string;
  checkRunId: number;
  context: Context;
  conclusion: CheckConclusion;
  logger: Logger;
}) {
  try {
    await context.octokit.checks.update({
      owner,
      repo,
      check_run_id: checkRunId,
      conclusion,
      status: CheckStatus.Completed,
    });
    logger.info(`check completed`);
  } catch (error) {
    logger.error(`failed to complete a check`, error);
    throw error;
  }
}
