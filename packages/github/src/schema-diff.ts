import * as probot from 'probot';
import {buildSchema} from 'graphql';
import {CheckConclusion, PullRequest} from './helpers/types';
import {FileLoader, ConfigLoader, loadSources} from './helpers/loaders';
import {start, complete, annotate} from './helpers/check-runs';
import {SchemaPointer, createConfig} from './helpers/config';
import {diff} from './helpers/diff';
import {createSummary} from './helpers/utils';
import {createLogger} from './helpers/logger';
import { MissingConfigError } from './helpers/errors';

export async function handleSchemaDiff({
  context,
  ref,
  repo,
  owner,
  pullRequests = [],
  loadFile,
  loadConfig,
}: {
  context: probot.Context;
  owner: string;
  repo: string;
  ref: string;
  pullRequests: PullRequest[];
  loadFile: FileLoader;
  loadConfig: ConfigLoader;
}): Promise<void> {
  const id = `${owner}/${repo}#${ref}`;
  const logger = createLogger('DIFF', context);

  logger.info(`Started - ${id}`);

  const checkUrl = await start({
    context,
    owner,
    repo,
    sha: ref,
    logger,
  });

  try {
    logger.info(`Looking for config`);

    const rawConfig = await loadConfig();

    if (!rawConfig) {
      logger.error(`Config file missing`);
      throw new MissingConfigError()
    }

    const branches = pullRequests.map((pr) => pr.base.ref);
    // on non-environment related PRs, use a branch from first associated pull request
    const config = createConfig(rawConfig as any, branches, branches[0]);

    if (!config.diff) {
      logger.info(`disabled. Skipping...`);

      await complete({
        url: checkUrl,
        context,
        conclusion: CheckConclusion.Success,
        logger,
      });
      return;
    }

    const oldPointer: SchemaPointer = {
      path: config.schema,
      ref: config.branch,
    };
    const newPointer: SchemaPointer = {
      path: oldPointer.path,
      ref,
    };

    const sources = await loadSources({
      config,
      oldPointer,
      newPointer,
      loadFile,
    });

    const schemas = {
      old: buildSchema(sources.old),
      new: buildSchema(sources.new),
    };

    logger.info(`built schemas`);

    const action = await diff({
      path: config.schema,
      schemas,
      sources,
    });

    logger.info(`schema diff result is ready`);

    let conclusion = action.conclusion;
    let annotations = action.annotations || [];
    const changes = action.changes || [];

    const summary = createSummary(changes);

    // Force Success when failOnBreaking is disabled
    if (config.diff.failOnBreaking === false) {
      logger.info('FailOnBreaking disabled. Forcing SUCCESS');
      conclusion = CheckConclusion.Success;
    }

    const title =
      conclusion === CheckConclusion.Failure
        ? 'Something is wrong with your schema'
        : 'Everything looks good';

    if (config.diff.annotations === false) {
      logger.info(`Anotations are disabled. Skipping annotations...`);
      annotations = [];
    } else {
      logger.info(`Sending annotations (${annotations.length})`);
    }

    await annotate({
      url: checkUrl,
      context,
      title,
      summary,
      annotations,
      logger,
    });

    logger.info(`Finishing check (${conclusion})`);

    await complete({
      url: checkUrl,
      context,
      conclusion,
      logger,
    });

    logger.info(`done`);
  } catch (error) {
    logger.error(error);

    await annotate({
      url: checkUrl,
      context,
      title: `Failed to complete schema check`,
      summary: `ERROR: ${error.message || error}`,
      annotations: [],
      logger
    });

    await complete({
      url: checkUrl,
      context,
      conclusion: CheckConclusion.Failure,
      logger
    });
  }
}
