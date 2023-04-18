import open from 'open';
import { createCommand } from '@graphql-inspector/commands';

export default createCommand((): any => {
  return {
    command: ['docs', 'website'],
    describe: 'Open Documentation',
    async handler() {
      return await open('https://graphql-inspector.com');
    },
  };
});
