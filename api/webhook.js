/// @ts-check
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  attachStacktrace: true,
  release: process.env.COMMIT_SHA,
  tracesSampleRate: 1.0,
});

const {Probot} = require('probot');
const githubApp = require('@graphql-inspector/github').app;

let probot;

module.exports = serverless(githubApp);

function serverless(appFn) {
  console.log('Created');
  return async (req, res) => {
    function onError(error) {
      Sentry.captureException(error, {
        level: Sentry.Severity.Critical,
        extra: {
          body: req.body,
          headers: req.headers,
        },
      });
    }

    appFn.onError = onError;

    function initPropot(app) {
      probot =
        probot ||
        new Probot({
          appId: process.env.APP_ID,
          secret: process.env.WEBHOOK_SECRET,
          privateKey: process.env.PRIVATE_KEY
        });

      probot.load(app);
    }

    function lowerCaseKeys(obj) {
      return Object.keys(obj).reduce(
        (accumulator, key) =>
          Object.assign(accumulator, {[key.toLocaleLowerCase()]: obj[key]}),
        {},
      );
    }

    try {
      console.log('Invoked');

      // A friendly homepage if there isn't a payload
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.send(`Visit graphql-inspector.com`);
        return;
      }

      // Otherwise let's listen handle the payload
      initPropot(appFn);

      // Determine incoming webhook event type
      const headers = lowerCaseKeys(req.headers);
      const e = headers['x-github-event'];
      const event = `${e}${req.body.action ? '.' + req.body.action : ''}`;

      req.body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Do the thing
      console.log(`Received event ${event}`);

      if (req) {
        try {
          await probot.receive({
            name: e,
            payload: req.body,
          });

          res.status(200);
          res.json({
            message: `Received ${e}.${req.body.action}`,
          });

          return;
        } catch (err) {
          Sentry.captureException(err, {
            extra: req.body,
          });
          console.error(err);

          res.status(500);
          res.json(err);

          return;
        }
      } else {
        console.error({req, res});

        res.status(500);
        res.send('unknown error');

        return;
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: req.body,
      });
      throw error;
    }
  };
}
