import {Context} from 'probot';

import {CheckStatus, Annotation, CheckConclusion} from './types';

const headers = {accept: 'application/vnd.github.antiope-preview+json'};

export async function start({
  context,
  owner,
  repo,
  sha,
}: {
  sha: string;
  context: Context;
  owner: string;
  repo: string;
}): Promise<string> {
  const id = `${owner}/${repo}#${sha}`;
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
    context.log.info(`[check-start] sent - ${id}`);

    return result.data.url;
  } catch (e) {
    context.log.error(`[check-start] failed - ${id}`);
    context.log.error(e);
    throw e;
  }
}

export async function annotations({
  context,
  url,
  annotations,
  title,
  summary,
}: {
  url: string;
  annotations: Annotation[];
  context: Context;
  title: string;
  summary: string;
}) {
  try {
    await context.github.request({
      headers,
      url,
      method: 'PATCH',
      output: {
        annotations,
        title,
        summary,
      },
    } as any);
    context.log.info(`[check-annotations] sent (${annotations.length})`);
  } catch (e) {
    context.log.error(`[check-annotations] failed`);
    context.log.error(e);
    throw e;
  }
}

export async function complete({
  context,
  url,
  conclusion,
}: {
  url: string;
  context: Context;
  conclusion: CheckConclusion;
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
    context.log.info(`[check-complete] sent`);
  } catch (e) {
    context.log.error(`[check-complete] failed`);
    context.log.error(e);
    throw e;
  }
}
