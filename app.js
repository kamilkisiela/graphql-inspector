const {Probot} = require('probot');
const {app} = require('@graphql-inspector/github');

Probot.run(app);
