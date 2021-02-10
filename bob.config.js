module.exports = {
  scope: '@graphql-inspector',
  ignore: [],
  base: `origin/master`,
  track: [
    'bob.config.js',
    'package.json',
    'yarn.lock',
    'tsconfig.json',
    '<project>/package.json',
    '<project>/tsconfig.json',
    '<project>/src/**',
  ],
  commands: {
    test: {
      track: [
        'jest.config.js',
        '<project>/jest.config.js',
        '<project>/__tests__/**',
      ],
      run(affected) {
        return [`yarn`, ['test', '--passWithNoTests', ...affected.paths]];
      },
    },
    build: {
      run() {
        return [`yarn`, ['build']];
      },
    },
  },
};
