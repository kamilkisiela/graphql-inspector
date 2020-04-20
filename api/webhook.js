/// @ts-check
const {createProbot} = require('probot');
const {resolve} = require('probot/lib/resolver');
const {findPrivateKey} = require('probot/lib/private-key');

const githubApp = require('@graphql-inspector/github').app;

let probot;

const loadProbot = (appFn) => {
  probot =
    probot ||
    createProbot({
      id: process.env.APP_ID,
      secret: process.env.WEBHOOK_SECRET,
      cert: findPrivateKey(),
    });

  if (typeof appFn === 'string') {
    appFn = resolve(appFn);
  }

  probot.load(appFn);

  return probot;
};

const lowerCaseKeys = (obj) =>
  Object.keys(obj).reduce(
    (accumulator, key) =>
      Object.assign(accumulator, {[key.toLocaleLowerCase()]: obj[key]}),
    {},
  );

module.exports = serverless(githubApp);

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

    // Otherwise let's listen handle the payload
    probot = probot || loadProbot(appFn);

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
  };
}
