#!/usr/bin/env node

const {readFileSync, writeFileSync} = require('fs');
const {resolve, join, relative} = require('path');
const {exec} = require('shelljs');
const semver = require('semver');
const detectIndent = require('detect-indent');
const immer = require('immer').default;

const placeholder = '0.0.0-PLACEHOLDER';
const [, , version] = process.argv;
const rootDir = resolve(__dirname, '../');
const rootPackage = join(rootDir, 'package.json');
const lerna = join(rootDir, 'lerna.json');

const packages = JSON.parse(
  readFileSync(rootPackage, {encoding: 'utf-8'}),
).workspaces.packages.map(p => join(rootDir, p));

const current = JSON.parse(readFileSync(lerna, {encoding: 'utf-8'})).version;

if (!semver.valid(version)) {
  throw new Error(`Version ${version} is not valid`);
}

// !  lerna.json as the source of truth of a version number

// 0. Branch out
exec(`git checkout -b release/v${version}`);

// 1. Set version in lerna.json
updateJSON(lerna, data => {
  data.version = version;
});

// 2. Set version in packages
packages.map(dir => {
  updateString(join(dir, 'package.json'), pkg =>
    pkg.replace(new RegExp(`${placeholder}`, 'g'), version),
  );
});

// 3. Set version in Dockerfile (both LABEL and RUN)
updateString(join(rootDir, 'Dockerfile'), docker =>
  docker.replace(new RegExp(`${placeholder}`, 'g'), version),
);

// 4. Run npm publish in all libraries
// packages.map(dir => {
//   exec(`(cd ${dir} && npm publish)`);
// });

// 5. Change version to a placeholder in all libraries
exec(
  `git checkout -- ${packages.map(dir => relative(rootDir, dir)).join(' ')}`,
);

// 6. Commit as `Release vX.X.X`
// exec(`git commit -m "Release v${version}"`);

// 7. git push origin release/vX.X.X
// 8. git checkout master
// 9. git branch -D release/vX.X.X

// LABEL version="1.0.1" <-
// RUN yarn global add @graphql-inspector/actions@0.7.0 <-

function updateJSON(filepath, updateFn) {
  const content = readFileSync(filepath, {encoding: 'utf-8'});
  const {indent} = detectIndent(content);
  const data = JSON.parse(content);

  const modified = immer(data, updateFn);

  writeFileSync(filepath, JSON.stringify(modified, null, indent), {
    encoding: 'utf-8',
  });
}

function updateString(filepath, updateFn) {
  const content = readFileSync(filepath, {encoding: 'utf-8'});

  writeFileSync(filepath, updateFn(content), {
    encoding: 'utf-8',
  });
}
