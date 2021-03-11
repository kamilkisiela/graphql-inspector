const fs = require('fs');
const path = require('path');

function createPublish(name) {
  return `
      - name: "Publish ${name}"
        uses: actions/upload-artifact@v2
        if: steps.bob-build.outputs.dirty == 'true'
        with:
          name: ${name}.tar.gz
          path: .bob-packed/graphql-inspector-${name}-0.0.0-canary-\${{ env.VER }}.tgz
          retention-days: 7
          if-no-files-found: ignore
  `;
}

const canaryWorkflowFile = path.resolve(
  __dirname,
  '../.github/workflows/canary.yml',
);
const raw = fs.readFileSync(canaryWorkflowFile, 'utf-8');
const tsconfig = require('../tsconfig.json');

const breakpoint = '      # PUBLISH_PACKAGES\n';
const parts = raw.split(breakpoint);

const workflow = [
  parts[0],
  breakpoint,
  ...Object.keys(tsconfig.compilerOptions.paths)
    .map((name) =>
      name.startsWith('@graphql-inspector')
        ? createPublish(name.replace('@graphql-inspector/', ''))
        : null,
    )
    .filter(Boolean)
    .join('\n'),
].join('');

fs.writeFileSync(canaryWorkflowFile, workflow, 'utf-8');
