const {serverless} = require('@probot/serverless-lambda');
const appFn = require('@graphql-inspector/github').default;

exports.handler = serverless(appFn);
