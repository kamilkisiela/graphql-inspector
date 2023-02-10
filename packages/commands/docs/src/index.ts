import open from 'open';
import { createCommand } from '@graphql-inspector/commands';

export default createCommand(() => {
  return {
    command: ['docs', 'website'],
    describe: 'Open Documentation',
    handler() {
      return open('https://graphql-inspector.com');
    },
  };
});
