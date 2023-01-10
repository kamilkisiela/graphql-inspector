export class MissingConfigError extends Error {
  constructor() {
    super(
      [
        'Failed to find a configuration',
        '',
        'https://graphql-inspector.com/docs/products/github#usage',
      ].join('\n'),
    );
  }
}
