/// @ts-check

const globby = require('globby');
const fs = require('fs');
const path = require('path');

const files = globby.sync('docs/**', {
  absolute: true,
  cwd: __dirname,
});

const errors = [];

files.forEach((file) =>
  checkFile(file, (error) => {
    errors.push(error);
  }),
);

if (errors.length) {
  errors.forEach((error) => {
    console.error(error);
  });
  process.exit(1);
}

/**
 * @param {string} filepath
 * @param {Function} onError
 */
function checkFile(filepath, onError) {
  const doc = fs.readFileSync(filepath, {
    encoding: 'utf-8',
  });

  const links = onlyRelative(extractLinks(doc));

  links.forEach((link) => {
    if (!exists(filepath, link.href)) {
      onError(`
        ERROR: ${filepath}
          ${link.href} doesn't exist
      `);
    }
  });
}

/**
 * @param {string} source
 * @param {string} relativeLink
 */
function exists(source, relativeLink) {
  const sourceDir = source.replace(path.basename(source), '');
  const target = path.resolve(sourceDir, relativeLink);

  return fs.existsSync(target);
}

/**
 * @typedef {{title: string; href: string;}} Link
 */

/**
 * @param {string} doc
 * @returns {Link[]}
 */
function extractLinks(doc) {
  const links = doc.match(/\[([^\[\]]+)\]\(([^)]+)\)/g);

  if (!links) {
    return [];
  }

  return links.map((link) => {
    let [title, href] = link.split('](');

    title = title.replace(/^\[/, '');
    href = href.replace(/\)$/, '');

    if (href.includes('#')) {
      href = href.split('#')[0];
    }

    return {
      title,
      href,
    };
  });
}

/**
 * @param {Link[]} links
 * @returns {Link[]}
 */
function onlyRelative(links) {
  return links.filter(
    (link) =>
      link.href.startsWith('.') ||
      (link.href.startsWith('/') && !link.href.startsWith('/img/')),
  );
}
