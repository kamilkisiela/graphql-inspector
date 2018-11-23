import * as express from 'express';
import {join} from 'path';

export async function serve(options: {port: number}) {
  const app = express();
  const base = join(__dirname, '../build');

  app.use(express.static(base));

  app.get('/', (_req, res) => {
    res.sendFile(join(base, 'index.html'));
  });

  app.listen(options.port);
}
