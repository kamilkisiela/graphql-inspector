import opn = require('opn');
import {serve} from '@graphql-inspector/ui';

import {Renderer, ConsoleRenderer} from '../render';

export async function ui(options: {
  renderer?: Renderer;
  port?: string | number;
}) {
  const renderer = options.renderer || new ConsoleRenderer();
  const PORT =
    typeof options.port === 'number'
      ? options.port
      : parseInt(options.port || '4000', 10);
  const url = `http://localhost:${PORT}`;

  await serve({
    port: PORT,
  });

  renderer.success(`Serving the GraphQL API on ${url}`);

  await opn(url);
}
