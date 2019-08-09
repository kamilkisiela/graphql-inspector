const {serverless} = require('@probot/serverless-lambda');
const appFn = require('@graphql-inspector/github').default;

console.log(process.env);

module.exports = serverless(app => {
  console.log(process.env);
  return appFn(app);
});
