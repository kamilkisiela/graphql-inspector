/// @ts-check
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const release = process.env.COMMIT_SHA;

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  attachStacktrace: true,
  release,
  tracesSampleRate: 1.0,
});

const {createProbot} = require('probot');
const inspector = require('@graphql-inspector/github');

module.exports = serverless(inspector.app);

function serverless(appFn) {
  console.log('Created');
  return async (req, res) => {
    console.log('Invoked');

    // A friendly homepage if there isn't a payload
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/plain');
      res.status(200);
      res.send(`Visit graphql-inspector.com`);
      return;
    }

    function lowerCaseKeys(obj) {
      return Object.keys(obj).reduce(
        (accumulator, key) =>
          Object.assign(accumulator, {[key.toLocaleLowerCase()]: obj[key]}),
        {},
      );
    }

    // Determine incoming webhook event type
    const headers = lowerCaseKeys(req.headers);
    const ev = headers['x-github-event'];
    const id = headers['x-github-delivery'];
    const event = `${ev}${req.body.action ? '.' + req.body.action : ''}`;

    function onError(error) {
      Sentry.captureException(error, {
        level: Sentry.Severity.Critical,
        extra: {
          body: req.body,
          headers: req.headers,
        },
      });
    }

    try {
      req.body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const probot = createProbot({
        defaults: {
          appId: process.env.APP_ID,
          secret: process.env.WEBHOOK_SECRET,
          privateKey: process.env.PRIVATE_KEY,
        },
        env: process.env,
      });

      inspector.setDiagnostics(probot, {
        onError,
        release,
      });

      await probot.load(appFn);

      // Do the thing
      console.log(`Received event ${event}`);

      if (req) {
        await probot.webhooks.verifyAndReceive({
          id,
          name: ev,
          payload: req.body,
          signature:
            headers['x-hub-signature-256'] || headers['x-hub-signature'],
        });

        res.status(200);
        res.json({
          message: `Received ${ev}.${req.body.action}`,
        });

        return;
      } else {
        res.status(500);
        res.send('unknown error');

        return;
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: req.body,
      });
      res.status(500);
      res.send('unknown error');
    }
  };
}
