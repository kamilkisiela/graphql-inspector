#!/usr/bin/env node

const {readFileSync, writeFileSync} = require('fs');
const {resolve, join, relative} = require('path');
const {exec} = require('shelljs');
const semver = require('semver');
const detectIndent = require('detect-indent');
const immer = require('immer').default;

const placeholder = '0.0.0-PLACEHOLDER';
const [, , versionOrCanary, code] = process.argv;
const rootDir = resolve(__dirname, '../');
const rootPackage = join(rootDir, 'package.json');
const lerna = join(rootDir, 'lerna.json');

const isCanary = versionOrCanary === 'canary';

const version = isCanary
  ? `0.0.0-${Math.random()
      .toString(16)
      .substring(2, 9)}.0`
  : versionOrCanary;

const packages = JSON.parse(
  readFileSync(rootPackage, {encoding: 'utf-8'}),
).workspaces.map(p => join(rootDir, p));

const current = JSON.parse(readFileSync(lerna, {encoding: 'utf-8'})).version;
const branch = `release/v${version}`;

if (!semver.valid(version)) {
  throw new Error(`Version ${version} is not valid`);
}

if (!isCanary) {
  // Create a release branch
  exec(`git checkout -b ${branch}`);
}

// ! lerna.json as the source of truth of a version number

// Set version in lerna.json
updateJSON(lerna, data => {
  data.version = version;
});

// Set version in packages
packages.map(dir => {
  updateString(join(dir, 'package.json'), pkg =>
    pkg.replace(new RegExp(placeholder, 'g'), version),
  );
});

// Set version in Dockerfile (both LABEL and RUN)
updateString(join(rootDir, 'Dockerfile-cli'), docker =>
  docker.replace(new RegExp(current, 'g'), version),
);

if (!isCanary) {
  // Bump version in changelog
  updateString(join(rootDir, 'CHANGELOG.md'), changelog =>
    changelog.replace('### vNEXT', `### vNEXT` + '\n\n' + `### v${version}`),
  );
}

const cmd = `npm publish${isCanary ? ' --tag canary' : ''}`;

// Run npm publish in all libraries
packages.map(dir => {
  exec(`(cd ${dir} && ${cmd} --access public --otp=${code})`);
});

if (!isCanary) {
  // Revert changes in libraries (back to placeholders)
  exec(
    `git checkout -- ${packages.map(dir => relative(rootDir, dir)).join(' ')}`,
  );

  // Add changes and commit as `Release vX.X.X`
  exec(`git add . && git commit -m "Release v${version}"`);

  // Push the release branch to origin
  exec(`git push origin ${branch}`);

  // Back to master
  exec(`git checkout master`);

  // Remove the release branch
  exec(`git branch -D ${branch}`);
}

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
