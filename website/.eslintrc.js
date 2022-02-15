module.exports = {
  root: true,
  ignorePatterns: ['!.*', '.next'],
  reportUnusedDisableDirectives: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'prettier',
  ],
  settings: {
    next: {
      rootDir: './src',
    },
  },
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/no-unused-modules': [
      'error',
      {
        unusedExports: true,
        missingExports: true,
        ignoreExports: [
          '.eslintrc.js',
          'next.config.js',
          'next-env.d.ts',
          'next-i18next.config.js',
          'src/pages/_document.tsx',
          'src/pages/_app.tsx',
          'src/pages/index.tsx',
          'src/pages/enterprise/index.tsx',
          'src/pages/docs/[[...slug]].tsx',
        ],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: './*.css',
            group: 'unknown',
            position: 'after',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'next-i18next.config.js', 'next.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
