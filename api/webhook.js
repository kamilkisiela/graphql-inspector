const {createProbot} = require('probot');
const {resolve} = require('probot/lib/resolver');
const {findPrivateKey} = require('probot/lib/private-key');
const {GraphQLClient} = require('graphql-request');

const githubApp = require('@graphql-inspector/github').default;

let probot;

const loadProbot = appFn => {
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

const lowerCaseKeys = obj =>
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

        await logEvent({
          event,
          ok: false,
          error: err,
        });

        res.status(500);
        res.json(err);

        return;
      }
    } else {
      console.error({req, res});

      await logEvent({
        event,
        ok: false,
        error: 'No req object...',
      });

      res.status(500);
      res.send('unknown error');

      return;
    }
  };
}

async function logEvent({event, ok, error}) {
  const secret = process.env.FAUNADB_SECRET;

  if (!secret) {
    return;
  }

  const status = ok === true ? 'success' : 'failure';

  console.log('log', {event, status});

  try {
    const graphQLClient = new GraphQLClient(
      'https://graphql.fauna.com/graphql',
      {
        headers: {
          Authorization: `Basic ${secret}`,
        },
      },
    );

    const query = /* GraphQL */ `
      mutation invocation($event: String!, $status: Status!, $error: String) {
        createInvocation(
          data: {event: $event, status: $status, error: $error}
        ) {
          _id
          _ts
        }
      }
    `;

    const variables = {event, status};

    if (error) {
      variables.error =
        typeof error.toString !== 'undefined' ? error.toString() : `${error}`;
    }

    const result = await graphQLClient.request(query, variables);

    console.log('LOG SENT');
    console.log(result);
  } catch (e) {
    console.log('FAILED TO SEND LOG');
    console.error(e);
  }
}
