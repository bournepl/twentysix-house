import express from 'express';
import { resolve } from 'node:path';

import { handler } from '../dist/twentysix-house/server/server.mjs';

const port = process.env.PORT || 3000;
const browserDistFolder = resolve(process.cwd(), 'dist/twentysix-house/browser');
const server = express();

server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));
server.use(handler);

server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
