import {createCommand} from '@graphql-inspector/commands';
import open from 'open';

export default createCommand<
  {},
  {
    oldSchema: string;
    newSchema: string;
  }
>(() => {
  return {
    command: ['docs', 'website'],
    describe: 'Open Documentation',
    handler() {
      return open('https://graphql-inspector.com');
    },
  };
});
