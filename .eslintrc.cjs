module.exports = {
  root: true,
  ignorePatterns: ['action/index.js'],
  extends: ['@theguild', '@theguild/eslint-config/json'],
  overrides: [
    {
      files: 'website/**',
      extends: '@theguild/eslint-config/react',
    },
  ],
};
