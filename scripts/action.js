const {rollup} = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const builtins = require('builtin-modules');
const path = require('path');

async function main() {
  const bundle = await rollup({
    input: path.resolve(__dirname, '../packages/action/dist/index.esm.js'),
    external: builtins,
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  });

  await bundle.write({
    file: path.resolve(__dirname, '../action/index.js'),
    format: 'cjs',
  });
}

main();
