#!/usr/bin/env node

const {readFileSync, writeFileSync} = require('fs');
const {resolve} = require('path');
const {version} = require(resolve(process.cwd(), 'lerna.json'));

const filepath = resolve(process.cwd(), 'dist/functions/webhook.js');

const content = readFileSync(filepath, {
  encoding: 'utf-8',
});

// n(792)(`${process.cwd()}/package`)
writeFileSync(
  filepath,
  content.replace(
    /n\([0-9]+\)\(\`\$\{process\.cwd\(\)\}\/package\`\)/,
    JSON.stringify({
      name: 'GraphQL Inspector App',
      version,
    }),
  ),
);
