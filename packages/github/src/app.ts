import * as probot from 'probot';
import { createConfigLoader, createFileLoader } from './helpers/loaders';
import { handleSchemaChangeNotifications } from './schema-change-notifications';
import { handleSchemaDiff } from './schema-diff';
import { getDiagnostics } from './helpers/diagnostics';

const allowedCheckActions = ['rerequested'];

export default function handleProbot(app: probot.Probot) {
  const { onError, release } = getDiagnostics(app);

  function wrap<T>(runner: (ctx: T) => Promise<void>) {
    return async (ctx: T) => {
      try {
        await runner(ctx);
      } catch (error) {
        onError(error);
        throw error;
      }
    };
  }

  app.on(
    'check_run',
    wrap(async context => {
      const ref = context.payload.check_run.head_sha;
      const { owner, repo } = context.repo();
      const action = context.payload.action;
      const pullRequests = context.payload.check_run.pull_requests;
      const before = context.payload.check_run.check_suite.before;
      const fullAction = 'check_run.' + action;

      if (allowedCheckActions.includes(action) === false) {
        return;
      }

      const loadFile = createFileLoader({
        context,
        owner,
        repo,
        release,
        action: fullAction,
      });
      const loadConfig = createConfigLoader({ context, owner, repo, ref, release, action: fullAction }, loadFile);

      await handleSchemaDiff({
        release,
        action: fullAction,
        context,
        ref,
        repo,
        owner,
        loadFile,
        loadConfig,
        before,
        pullRequests,
        onError,
      });
    })
  );

  app.on(
    'check_suite',
    wrap(async context => {
      const ref = context.payload.check_suite.head_sha;
      const { owner, repo } = context.repo();
      const action = context.payload.action;
      const pullRequests = context.payload.check_suite.pull_requests;
      const before = context.payload.check_suite.before;
      const fullAction = 'check_suite.' + action;

      if (allowedCheckActions.includes(action) === false) {
        return;
      }

      const loadFile = createFileLoader({
        context,
        owner,
        repo,
        release,
        action: fullAction,
      });
      const loadConfig = createConfigLoader({ context, owner, repo, ref, release, action: fullAction }, loadFile);

      await handleSchemaDiff({
        release,
        action: fullAction,
        context,
        ref,
        repo,
        owner,
        loadFile,
        loadConfig,
        before,
        pullRequests,
        onError,
      });
    })
  );

  app.on(
    'pull_request',
    wrap(async context => {
      const ref = context.payload.pull_request.head.sha;
      const pullRequestNumber = context.payload.pull_request.number;
      const { owner, repo } = context.repo();
      const action = context.payload.action;
      const pullRequests = [context.payload.pull_request];
      const before = context.payload.pull_request.base.sha;
      const fullAction = 'pull_request.' + action;

      if (['opened', 'synchronize', 'edited', 'labeled', 'unlabeled'].includes(action) === false) {
        return;
      }

      const loadFile = createFileLoader({
        context,
        owner,
        repo,
        release,
        action: fullAction,
      });
      const loadConfig = createConfigLoader({ context, owner, repo, ref, release, action: fullAction }, loadFile);

      await handleSchemaDiff({
        release,
        action: fullAction,
        context,
        ref,
        repo,
        owner,
        loadFile,
        loadConfig,
        before,
        pullRequests,
        pullRequestNumber,
        onError,
      });
    })
  );

  app.on(
    'push',
    wrap(async context => {
      const ref = context.payload.ref;
      const { owner, repo } = context.repo();
      const before = context.payload.before;
      const action = 'push';

      const loadFile = createFileLoader({
        context,
        owner,
        repo,
        release,
        action,
      });
      const loadConfig = createConfigLoader({ context, owner, repo, ref, release, action }, loadFile);

      await handleSchemaChangeNotifications({
        action,
        release,
        context,
        ref,
        before,
        repo,
        owner,
        loadFile,
        loadConfig,
        onError,
      });
    })
  );
}
