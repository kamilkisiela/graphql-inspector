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
        '@typescript-eslint/no-namespace': 'off',
        'unicorn/filename-case': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'yml/no-empty-mapping-value': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
        'unicorn/prefer-node-protocol': 'off',
        'no-restricted-syntax': 'off',
        'no-implicit-coercion': 'off',
        'import/extensions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-prototype-builtins': 'off',
        'unicorn/no-useless-fallback-in-spread': 'off',
        'no-empty': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'n/no-restricted-import': 'off',
        'no-inner-declarations': 'off',
      },
    },
  ],
};
