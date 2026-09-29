import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import AppServerModule from './src/main.server';
import blogs from './src/assets/json/blog.json';
import { HOUSE_CATALOG_ITEMS } from './src/app/house-catalog/house-catalog.data';
import { COMPLETED_HOMES } from './src/app/new-ourworks/completed-homes.data';
import { DESIGN_PROJECTS } from './src/app/new-ourworks/design-projects.data';

type BlogItem = {
  _id?: { $oid?: string };
  bId?: string;
  slug?: string;
  title?: string;
  dateFormat?: string | number;
  modifiedDateFormat?: string | number;
  status?: boolean;
};

type SitemapEntry = {
  path: string;
  lastmod?: string;
};

type RequestResolution =
  | { type: 'redirect'; target: string; status: 301 }
  | { type: 'render'; path: string; status: 200 | 404 };

const SITE_URL = 'https://twentysix.house';
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');
const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
};
const SSR_ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  'twentysix.house',
  '*.twentysix.house',
  '*.vercel.app',
];

const normalizeSlug = (value = ''): string => {
  try {
    value = decodeURIComponent(value);
  } catch {
    value = value || '';
  }

  return value
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
};

const normalizePath = (value = '/'): string => {
  let path = value || '/';

  try {
    path = decodeURIComponent(path);
  } catch {
    path = path || '/';
  }

  path = path.replace(/\/+/g, '/');
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path || '/';
};

const toAbsoluteUrl = (path: string): string => {
  const normalized = normalizePath(path);
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`;
};

const escapeXml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const toIsoDate = (value?: string | number): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const numericValue = typeof value === 'string' && /^\d+$/.test(value)
    ? Number(value)
    : value;
  const date = new Date(numericValue);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const activeBlogs = (blogs as BlogItem[]).filter(blog => blog.status !== false);
const getBlogId = (blog: BlogItem): string => blog._id?.$oid || blog.bId || '';
const getBlogSlug = (blog: BlogItem): string => normalizeSlug(blog.slug || blog.title || '') || getBlogId(blog);

const findBlog = (routeValue: string): BlogItem | undefined => {
  const normalizedValue = normalizeSlug(routeValue);
  return activeBlogs.find(blog =>
    getBlogId(blog) === routeValue || blog.bId === routeValue || getBlogSlug(blog) === normalizedValue
  );
};

const completedPaths = COMPLETED_HOMES.map(project => `/ourworks/completed/${project.slug}`);
const designPaths = DESIGN_PROJECTS.map(project => `/ourworks/design/${project.slug}`);
const catalogPaths = HOUSE_CATALOG_ITEMS.map(house => `/house-catalog/${house.slug}`);

const sitemapEntries: SitemapEntry[] = [
  '/',
  '/about',
  '/services',
  '/ourworks',
  '/ourworks/completed',
  '/ourworks/design',
  '/house-catalog',
  '/blogs',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  ...completedPaths,
  ...designPaths,
  ...catalogPaths,
].map(path => ({ path }));

for (const blog of activeBlogs) {
  sitemapEntries.push({
    path: `/blogs/${getBlogSlug(blog)}`,
    lastmod: toIsoDate(blog.modifiedDateFormat || blog.dateFormat),
  });
}

const uniqueSitemapEntries = Array.from(
  new Map(sitemapEntries.map(entry => [normalizePath(entry.path), {
    ...entry,
    path: normalizePath(entry.path),
  }])).values()
);
const canonicalPaths = new Set(uniqueSitemapEntries.map(entry => entry.path));

const redirectMap = new Map<string, string>([
  ['/home', '/'],
  ['/aboutus', '/about'],
  ['/contactus', '/contact'],
  ['/collections', '/ourworks'],
  ['/blogs/list', '/blogs'],
  ['/รับสร้างบ้าน-อุดรธานี', '/'],
  ['/ourworks/real-projects', '/ourworks/completed'],
  ['/ourworks/real-projects/modern-black-white-single-storey-home-udon-thani', '/ourworks/completed'],
  ['/ourworks/real-projects/single-storey-warm-family-home-nong-khai', '/ourworks/completed'],
  ['/ourworks/real-projects/compact-modern-gable-home-two-bedroom', '/ourworks/completed'],
  ['/ourworks/real-projects/earth-tone-nordic-family-home', '/ourworks/completed'],
  ['/ourworks/real-projects/modern-contemporary-european-home-310sqm', '/ourworks/completed'],
  ['/ourworks/real-projects/modern-one-and-half-storey-home-phen-udon-thani', '/ourworks/completed'],
  ['/ourworks/real-projects/cozy-modern-two-storey-home-phen-udon-thani', '/ourworks/completed'],
  ['/ourworks/real-projects/luxury-modern-single-storey-home-udon-thani', '/ourworks/completed'],
  ['/ourworks/real-projects/modern-minimal-single-storey-home-with-garden-udon-thani', '/ourworks/completed'],
  ['/ourworks/real-projects/modern-loft-single-storey-home-with-two-car-parking', '/ourworks/completed'],
  ['/ourworks/house-designs', '/house-catalog'],
  ['/ourworks/house-designs/yu-plearn-nature-connected-home', '/house-catalog/yu-plearn'],
  ['/ourworks/house-designs/yu-yen-compact-single-storey-home', '/house-catalog/yu-yen'],
  ['/ourworks/house-designs/yu-sabai-modern-character-home', '/house-catalog/yu-sabai'],
  ['/ourworks/house-designs/yu-sook-private-open-plan-family-home', '/house-catalog/yu-sook'],
]);

const resolveRequest = (requestPath: string): RequestResolution => {
  const normalizedPath = normalizePath(requestPath);
  const mappedPath = redirectMap.get(normalizedPath);

  if (mappedPath) {
    return { type: 'redirect', target: mappedPath, status: 301 };
  }

  const hasDuplicateSlash = requestPath.slice(1).includes('//');
  const hasTrailingSlash = requestPath.length > 1 && requestPath.endsWith('/');
  if (hasDuplicateSlash || hasTrailingSlash) {
    return { type: 'redirect', target: normalizedPath, status: 301 };
  }

  const legacyBlogMatch = normalizedPath.match(/^\/blogs\/detail\/([^/]+)$/);
  if (legacyBlogMatch) {
    const blog = findBlog(legacyBlogMatch[1]);
    return blog
      ? { type: 'redirect', target: `/blogs/${getBlogSlug(blog)}`, status: 301 }
      : { type: 'render', path: normalizedPath, status: 404 };
  }

  const blogMatch = normalizedPath.match(/^\/blogs\/([^/]+)$/);
  if (blogMatch) {
    const blog = findBlog(blogMatch[1]);
    if (!blog) {
      return { type: 'render', path: normalizedPath, status: 404 };
    }

    const canonicalPath = `/blogs/${getBlogSlug(blog)}`;
    return canonicalPath === normalizedPath
      ? { type: 'render', path: normalizedPath, status: 200 }
      : { type: 'redirect', target: canonicalPath, status: 301 };
  }

  return canonicalPaths.has(normalizedPath)
    ? { type: 'render', path: normalizedPath, status: 200 }
    : { type: 'render', path: normalizedPath, status: 404 };
};

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');
  const commonEngine = new CommonEngine({ allowedHosts: SSR_ALLOWED_HOSTS });

  server.disable('x-powered-by');
  server.use((_req, res, next) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      res.setHeader(name, value);
    }
    next();
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/robots.txt', (_req, res) => {
    const robotsTxt = [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ].join('\n');

    res
      .type('text/plain')
      .set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
      .send(robotsTxt);
  });

  server.get('/sitemap.xml', (_req, res) => {
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueSitemapEntries.map(entry => {
      const location = escapeXml(toAbsoluteUrl(entry.path));
      const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
      return `  <url><loc>${location}</loc>${lastmod}</url>`;
    }).join('\n')}
</urlset>`;

    res
      .type('application/xml')
      .set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
      .send(sitemapXml);
  });

  server.get('*', (req, res, next) => {
    const resolution = resolveRequest(req.path);

    if (resolution.type === 'redirect') {
      res.redirect(resolution.status, resolution.target);
      return;
    }

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}${resolution.path}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl || '/' }],
      })
      .then(html => {
        if (resolution.status === 404) {
          res.set('X-Robots-Tag', 'noindex, follow');
        }
        res
          .set('Cache-Control', 'private, no-store')
          .status(resolution.status)
          .send(html);
      })
      .catch(error => next(error));
  });

  return server;
}

export const handler = app();
