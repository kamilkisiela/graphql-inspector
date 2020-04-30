/// @ts-check
const {readFileSync, writeFileSync} = require('fs');
const {resolve, join, relative} = require('path');
const {execSync, exec} = require('child_process');
const semver = require('semver');
const immer = require('immer').default;

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        encoding: 'utf-8',
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout || stderr);
        }
      },
    );
  });
}

const placeholder = '0.0.0-PLACEHOLDER';
const [, , versionOrCanary, nextVersion] = process.argv;
const rootDir = resolve(__dirname, '../');
const lerna = join(rootDir, 'lerna.json');

const isCanary = versionOrCanary === 'canary';
const isNext = versionOrCanary === 'next';
const isLatest = !isNext && !isCanary;

const version = isCanary
  ? `0.0.0-canary.${Math.random().toString(16).substring(2, 9)}`
  : isNext
  ? nextVersion
  : versionOrCanary;

const packages = getWorkspaces().map((path) => join(rootDir, path));

const current = JSON.parse(readFileSync(lerna, {encoding: 'utf-8'})).version;
const branch = `release/v${version}`;

if (!semver.valid(version)) {
  throw new Error(`Version ${version} is not valid`);
}

async function main() {
  if (isLatest) {
    // Create a release branch
    execSync(`git checkout -b ${branch}`, {
      stdio: 'inherit',
    });
  }

  // ! lerna.json as the source of truth of a version number

  // Set version in lerna.json
  updateJSON(lerna, (data) => {
    data.version = version;
  });

  // Set version in packages
  packages.map((dir) => {
    updateString(join(dir, 'package.json'), (pkg) =>
      pkg.replace(new RegExp(placeholder, 'g'), version),
    );
  });

  // Set version in Dockerfile (both LABEL and RUN)
  updateString(join(rootDir, 'Dockerfile-cli'), (docker) =>
    docker.replace(new RegExp(current, 'g'), version),
  );

  if (isLatest) {
    // Bump version in changelog
    updateString(join(rootDir, 'CHANGELOG.md'), (changelog) =>
      changelog.replace('### vNEXT', `### vNEXT` + '\n\n' + `### v${version}`),
    );
  }

  execSync(`yarn build && yarn action && git add action/`, {
    stdio: 'inherit',
  });

  const extra = isLatest ? '' : ` --tag ${versionOrCanary}`;
  const cmd = `npm publish dist${extra} --access public`;

  // Run npm publish in all libraries
  await Promise.all(
    packages.map((dir) => execAsync(`(cd ${dir} && ${cmd} --access public)`)),
  );

  if (isLatest) {
    // Revert changes in libraries (back to placeholders)
    execSync(
      `git checkout -- ${packages
        .map((dir) => relative(rootDir, dir))
        .join(' ')}`,
      {
        stdio: 'inherit',
      },
    );

    // Add changes and commit as `Release vX.X.X`
    execSync(`git add . && git commit -m "Release v${version}"`, {
      stdio: 'inherit',
    });

    // Push the release branch to origin
    execSync(`git push origin ${branch}`, {
      stdio: 'inherit',
    });

    // Back to master
    execSync(`git checkout master`, {
      stdio: 'inherit',
    });

    // Remove the release branch
    execSync(`git branch -D ${branch}`, {
      stdio: 'inherit',
    });
  }
}

function updateJSON(filepath, updateFn) {
  const content = readFileSync(filepath, {encoding: 'utf-8'});
  const data = JSON.parse(content);

  const modified = immer(data, updateFn);

  writeFileSync(filepath, JSON.stringify(modified, null, 2), {
    encoding: 'utf-8',
  });
}

function updateString(filepath, updateFn) {
  const content = readFileSync(filepath, {encoding: 'utf-8'});

  writeFileSync(filepath, updateFn(content), {
    encoding: 'utf-8',
  });
}

function getWorkspaces() {
  const rawInfo = execSync('yarn workspaces info', {
    encoding: 'utf-8',
  });

  const startsAt = rawInfo.indexOf('{');
  const endsAt = rawInfo.lastIndexOf('}');

  const info = JSON.parse(rawInfo.substr(startsAt, endsAt - startsAt + 1));

  return Object.values(info).map(({location}) => location);
}

main();
