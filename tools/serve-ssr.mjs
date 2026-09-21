import express from 'express';
import { resolve } from 'node:path';

import { handler } from '../dist/twentysix-house/server/server.mjs';

const port = process.env.PORT || 3000;
const browserDistFolder = resolve(process.cwd(), 'dist/twentysix-house/browser');
const server = express();
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');

server.disable('x-powered-by');
server.use((_req, res, next) => {
  res.set({
    'Content-Security-Policy': contentSecurityPolicy,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  });
  next();
});

server.get('*.*', express.static(browserDistFolder, {
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    const normalizedPath = filePath.replaceAll('\\', '/');
    const fileName = normalizedPath.split('/').pop() || '';
    const isHashedBundle = /-[A-Z0-9]{8}\.(?:js|css)$/i.test(fileName);
    const isHashedMedia = normalizedPath.includes('/media/');

    res.setHeader(
      'Cache-Control',
      isHashedBundle || isHashedMedia
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600, must-revalidate'
    );
  },
}));
server.use(handler);

server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
