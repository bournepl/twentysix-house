import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import AppServerModule from './src/main.server';

export function app(): express.Express {

  const server = express();

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = join(serverDistFolder, '../browser');

  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // serve static files
  server.use(express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // SSR
  server.get('*', (req, res, next) => {

    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine.render({
      bootstrap: AppServerModule,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl }
      ]
    })
      .then(html => res.send(html))
      .catch(err => next(err));

  });

  return server;
}

export default app();
