import * as probot from 'probot';
import {createConfigLoader, createFileLoader} from './helpers/loaders';
import {handleSchemaChangeNotifications} from './schema-change-notifications';
import {handleSchemaDiff} from './schema-diff';
import {ErrorHandler} from './helpers/types';

const allowedCheckActions = ['rerequested'];
const noopError = () => {};

export default function handleProbot(
  app: probot.Probot & {
    onError?: ErrorHandler;
  },
) {
  const onError = app.onError || noopError;

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
    wrap(async (context) => {
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
        onError,
      });
    }),
  );

  app.on(
    'check_suite',
    wrap(async (context) => {
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
        onError,
      });
    }),
  );

  app.on(
    'pull_request',
    wrap(async (context) => {
      const ref = context.payload.pull_request.head.ref;
      const pullRequestNumber = context.payload.pull_request.number;
      const {owner, repo} = context.repo();
      const action = context.payload.action;
      const pullRequests = [context.payload.pull_request];
      const before = context.payload.pull_request.base.ref;

      if (
        ['opened', 'synchronize', 'edited', 'labeled', 'unlabeled'].includes(
          action,
        ) === false
      ) {
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
        pullRequestNumber,
        onError,
      });
    }),
  );

  app.on(
    'push',
    wrap(async (context) => {
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
        onError,
      });
    }),
  );
}
