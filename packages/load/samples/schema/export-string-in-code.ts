import {readFileSync} from 'fs';
import {resolve} from 'path';

export default readFileSync(resolve(__dirname, './schema.graphql'), {
  encoding: 'utf-8',
});
