#!/usr/bin/env node

import appFn, {handleAction} from '@graphql-inspector/github';
import * as uuid from 'uuid';
import {resolve} from 'path';
import {findPrivateKey} from 'probot/lib/private-key';
import {createProbot, Application, ApplicationFunction} from 'probot';

const event = process.env.GITHUB_EVENT_NAME;
const cert = findPrivateKey()!;
const payload = require(resolve(process.env.GITHUB_EVENT_PATH!));

const probot = createProbot({
  id: parseInt(process.env.APP_ID!, 10),
  cert: cert as string,
  githubToken: process.env.GITHUB_TOKEN,
});

function wrapAppFn(fn: ApplicationFunction) {
  return (app: Application) => {
    fn(app);

    app.on('pull_request', async context => {
      if (!process.env.GITHUB_ACTION) {
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
        return;
      }

      const ref = context.payload.after;
      const action = 'gh-action';
      const {owner, repo} = context.repo();

      await handleAction({context, owner, repo, ref, action});
      process.exit(0);
    });
  };
}

probot.setup([wrapAppFn(appFn)]);

probot.receive({name: event, payload, id: uuid.v4()}).catch(() => {
  // Process must exist non-zero to indicate that the action failed to run
  process.exit(1);
});
