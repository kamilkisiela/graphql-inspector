const {serverless} = require('@probot/serverless-lambda');
const appFn = require('@graphql-inspector/github').default;

console.log(process.env);

exports.handler = serverless(app => {
  console.log(process.env);
  return appFn(app);
});
