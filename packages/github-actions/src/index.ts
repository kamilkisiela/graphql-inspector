#!/usr/bin/env node

import {handleAction} from '@graphql-inspector/github';
import * as uuid from 'uuid';
import {resolve} from 'path';
import {createProbot, Application} from 'probot';

const event = process.env.GITHUB_EVENT_NAME;
const payload = require(resolve(process.env.GITHUB_EVENT_PATH!));
const githubToken = process.env.GITHUB_TOKEN;

const probot = createProbot({
  githubToken,
});

probot.logger.info(`Running probot`);

function appFn(app: Application) {
  app.on('pull_request', async context => {
    if (!process.env.GITHUB_ACTION) {
      context.log.error('No GITHUB_ACTION available!');
      return;
    }
    const ref = context.payload.pull_request.head.sha;
    const action = 'gh-action';
    const {owner, repo} = context.repo();

    await handleAction({context, owner, repo, ref, action});
    process.exit(0);
  });

  app.on('push', async context => {
    if (!process.env.GITHUB_ACTION) {
      context.log.error('No GITHUB_ACTION available!');
      return;
    }

    const ref = context.payload.after;
    const action = 'gh-action';
    const {owner, repo} = context.repo();

    await handleAction({context, owner, repo, ref, action});
    process.exit(0);
  });
}

probot.logger.info(`Setting up probot`);
probot.setup([appFn]);

probot.receive({name: event!, payload, id: uuid.v4()}).catch(error => {
  probot.logger.info(error);
  // Process must exist non-zero to indicate that the action failed to run
  process.exit(1);
});
