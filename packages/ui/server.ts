import * as express from 'express';
import {join} from 'path';

export async function serve(options: {port: number}) {
  const app = express();

  process.env.PORT = options.port + '';

  app.get('/', middleware(app));

  return listen(app, options.port);
}

export function middleware(app: express.Application): express.Handler {
  const base = join(__dirname, '../build');

  app.use(express.static(base));

  return (_req, res) => {
    res.sendFile(join(base, 'index.html'));
  };
}

function listen(app: express.Application, port: number): Promise<void> {
  return new Promise<void>(resolve => {
    app.listen(port, () => {
      resolve();
    });
  });
}
