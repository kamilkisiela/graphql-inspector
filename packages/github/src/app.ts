import * as probot from 'probot';
import {createConfigLoader, createFileLoader} from './helpers/loaders';
import {handleSchemaChangeNotifications} from './schema-change-notifications';
import {handleSchemaDiff} from './schema-diff';

const allowedCheckActions = ['requested', 'rerequested', 'gh-action'];

export default function handleProbot(app: probot.Application) {
  app.on('check_run', async (context) => {
    const ref = context.payload.check_run.head_sha;
    const {owner, repo} = context.repo();
    const action = context.payload.action;
    const pullRequests = context.payload.check_run.pull_requests;
    const before = context.payload.check_run.check_suite.before;

    if (allowedCheckActions.includes(action) === false) {
      return;
    }

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaDiff({
      action: 'check_run.' + action,
      context,
      ref,
      repo,
      owner,
      loadFile,
      loadConfig,
      before,
      pullRequests,
    });
  });

  app.on('check_suite', async (context) => {
    const ref = context.payload.check_suite.head_sha;
    const {owner, repo} = context.repo();
    const action = context.payload.action;
    const pullRequests = context.payload.check_suite.pull_requests;
    const before = context.payload.check_suite.before;

    if (allowedCheckActions.includes(action) === false) {
      return;
    }

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaDiff({
      action: 'check_suite.' + action,
      context,
      ref,
      repo,
      owner,
      loadFile,
      loadConfig,
      before,
      pullRequests,
    });
  });

  app.on('pull_request', async (context) => {
    const ref = context.payload.pull_request.head.ref;
    const {owner, repo} = context.repo();
    const action = context.payload.action;
    const pullRequests = [context.payload.pull_request];
    const before = context.payload.pull_request.base.ref;

    if (['opened', 'synchronize', 'edited'].includes(action) === false) {
      return;
    }

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaDiff({
      action: 'pull_request.' + action,
      context,
      ref,
      repo,
      owner,
      loadFile,
      loadConfig,
      before,
      pullRequests,
    });
  });

  app.on('push', async (context) => {
    const ref = context.payload.ref;
    const {owner, repo} = context.repo();
    const before = context.payload.before;

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaChangeNotifications({
      context,
      ref,
      before,
      repo,
      owner,
      loadFile,
      loadConfig,
    });
  });
}
