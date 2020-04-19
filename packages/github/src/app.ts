import * as probot from 'probot';
import axios from 'axios';
import {createConfigLoader, createFileLoader} from './helpers/loaders';
import {handleSchemaChangeNotifications} from './schema-change-notifications';
import {handleSchemaDiff} from './schema-diff';

const allowedCheckActions = ['requested', 'rerequested', 'gh-action']

async function collect() {
  try {
    await axios.get('https://graphql-inspector.com/api/collect?kind=app');
  } catch (e) {}
}

export default function handleProbot(app: probot.Application) {
  app.on('check_run', async (context) => {
    const ref = context.payload.check_run.head_sha;
    const {owner, repo} = context.repo();
    const action = context.payload.action;
    const pullRequests = context.payload.check_run.pull_requests;
    
    if (allowedCheckActions.includes(action) === false) {
      return;
    }

    await collect();

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaDiff({
      context,
      ref,
      repo,
      owner,
      loadFile,
      loadConfig,
      pullRequests,
    });
  });

  app.on('check_suite', async (context) => {
    const ref = context.payload.check_suite.head_sha;
    const {owner, repo} = context.repo();
    const action = context.payload.action;
    const pullRequests = context.payload.check_suite.pull_requests;

    if (allowedCheckActions.includes(action) === false) {
      return;
    }

    await collect();

    const loadFile = createFileLoader({context, owner, repo});
    const loadConfig = createConfigLoader(
      {context, owner, repo, ref},
      loadFile,
    );

    await handleSchemaDiff({
      context,
      ref,
      repo,
      owner,
      loadFile,
      loadConfig,
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

    await collect();

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
