const { readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = readFileSync(resolve(__dirname, './schema.graphql'), 'utf8');
