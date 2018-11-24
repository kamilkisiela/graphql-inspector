import * as express from 'express';
import opn = require('opn');
import {middleware as uiMiddleware} from '@graphql-inspector/ui';
import {apply} from '@graphql-inspector/api';

import {Renderer, ConsoleRenderer} from '../render';

export async function ui(options: {
  renderer?: Renderer;
  port: string | number;
}) {
  const renderer = options.renderer || new ConsoleRenderer();
  const PORT =
    typeof options.port === 'number'
      ? options.port
      : parseInt(options.port, 10);
  const url = `http://localhost:${PORT}`;
  const app = express();

  // API
  apply(app, {
    path: '/api',
  });

  // UI
  uiMiddleware(app);

  app.listen(PORT, async () => {
    renderer.success(`GraphQL Inspector runs on ${url}`);
    await opn(url);
  });
}
