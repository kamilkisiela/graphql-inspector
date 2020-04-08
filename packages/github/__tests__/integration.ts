import nock from 'nock';
import {Probot, Application} from 'probot';
import checkSuiteRequestedPayload from './fixtures/events/check_suite.requested.json';
import {app} from '../src';

const owner = 'kamilkisiela';
const repo = 'graphql-inspector-demo';

nock.disableNetConnect();

describe.skip('integration', () => {
  let probot: Probot;
  let application: Application;

  beforeEach(() => {
    probot = new Probot({});
    application = probot.load(app);
  });

  test('asd', async () => {
    // auth
    nock('https://api.github.com')
      .post('/app/installations/778493/access_tokens')
      .reply(200, {token: 'test'});
    
      nock('https://api.github.com').post(`/repos/${owner}/${repo}/check-runs`);
    //   .post('/app/installations/2/access_tokens')
    //   .reply(200, {token: 'test'});

    // // Test that a comment is posted
    // nock('https://api.github.com')
    //   .post('/repos/hiimbex/testing-things/issues/1/comments', (body) => {
    //     expect(body).toMatchObject(issueCreatedBody);
    //     return true;
    //   })
    //   .reply(200);

    // Receive a webhook event
    await probot.receive(checkSuiteRequestedPayload);
  });
});
