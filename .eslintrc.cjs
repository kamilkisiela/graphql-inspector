module.exports = {
  root: true,
  ignorePatterns: ['action/index.js'],
  extends: ['@theguild', '@theguild/eslint-config/json', '@theguild/eslint-config/yml'],
  overrides: [
    {
      files: ['website/**'],
      extends: '@theguild/eslint-config/react',
    },
    {
      files: ['**'],
      rules: {
        // TODO: enable following rules
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        'yml/no-empty-mapping-value': 'off',
        'no-undef': 'off',
        'unicorn/prefer-node-protocol': 'off',
        'import/extensions': 'off',
        'no-console': 'off',
        'import/no-default-export': 'off',
        'no-inner-declarations': 'off',
      },
    },
    {
      files: ['.github/**/*'],
      rules: {
        'yml/plain-scalar': 'off',
      },
    },
  ],
};
