import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import { routes } from './src/app/app-routing.module';
import realProjects from './src/assets/data/real-projects.json';
import houseDesigns from './src/assets/data/house-designs.json';
import blogs from './src/assets/json/blog.json';

type SitemapRoute = {
  path?: string;
  redirectTo?: string;
  children?: SitemapRoute[];
  data?: {
    sitemap?: boolean;
  };
};

type SlugItem = {
  slug: string;
};

type BlogSlugItem = {
  bId?: string;
  slug?: string;
  title?: string;
  status?: boolean;
  _id?: {
    $oid?: string;
  };
};

type RequestResolution =
  | { type: 'redirect'; target: string; status: number }
  | { type: 'render'; status: number; renderPath: string };

const SITE_URL = 'https://twentysix.house';
const NOT_FOUND_RENDER_PATH = '/this-route-returns-404';

const normalizeSlug = (value: string = ''): string => {
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

const normalizePath = (path: string = '/'): string => {
  let normalized = path || '/';

  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    normalized = normalized || '/';
  }

  normalized = normalized.replace(/\/+/g, '/');

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || '/';
};

const toAbsoluteUrl = (path: string): string => {
  const normalized = normalizePath(path);
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`;
};

const getBlogId = (blog: BlogSlugItem): string => blog._id?.$oid || blog.bId || '';

const getBlogSlug = (blog: BlogSlugItem): string => {
  const slug = normalizeSlug(blog.slug || blog.title || '');

  return slug || getBlogId(blog);
};

const flattenRoutes = (appRoutes: SitemapRoute[], parent: string = ''): string[] => {
  let urls: string[] = [];

  for (const route of appRoutes) {
    if (route.redirectTo !== undefined || route.path === '**' || route.path?.includes(':')) {
      continue;
    }

    const fullPath = normalizePath(`${parent}/${route.path ?? ''}`);

    if (route.data?.sitemap !== false) {
      urls.push(fullPath);
    }

    if (route.children) {
      urls = urls.concat(flattenRoutes(route.children, fullPath));
    }
  }

  return urls;
};

const activeBlogs = (blogs as BlogSlugItem[]).filter((blog) => blog.status !== false);
const staticKnownPaths = new Set(flattenRoutes(routes as SitemapRoute[]));
const knownPaths = new Set<string>([
  ...staticKnownPaths,
  '/ourworks/real-projects',
  '/ourworks/house-designs',
  ...(realProjects as SlugItem[]).map((project) => normalizePath(`/ourworks/real-projects/${project.slug}`)),
  ...(houseDesigns as SlugItem[]).map((design) => normalizePath(`/ourworks/house-designs/${design.slug}`)),
  ...activeBlogs.map((blog) => normalizePath(`/blogs/${getBlogSlug(blog)}`)),
]);

const findBlogByRouteValue = (routeValue: string): BlogSlugItem | undefined => {
  const normalizedKey = normalizeSlug(routeValue);

  return activeBlogs.find((blog) => {
    const blogId = getBlogId(blog);

    return blogId === routeValue || blog.bId === routeValue || getBlogSlug(blog) === normalizedKey;
  });
};

const resolveRequest = (requestPath: string): RequestResolution => {
  const normalizedPath = normalizePath(requestPath);
  const redirectMap = new Map<string, string>([
    ['/collections', '/ourworks'],
    ['/blogs/list', '/blogs'],
    ['/รับสร้างบ้าน-อุดรธานี', '/'],
  ]);

  const mappedRedirect = redirectMap.get(normalizedPath);
  if (mappedRedirect) {
    return { type: 'redirect', target: mappedRedirect, status: 301 };
  }

  if (requestPath && normalizedPath !== requestPath) {
    return { type: 'redirect', target: normalizedPath, status: 301 };
  }

  const legacyBlogMatch = normalizedPath.match(/^\/blogs\/detail\/([^/]+)$/);
  if (legacyBlogMatch) {
    const blog = findBlogByRouteValue(legacyBlogMatch[1]);

    if (!blog) {
      return { type: 'render', status: 404, renderPath: NOT_FOUND_RENDER_PATH };
    }

    return {
      type: 'redirect',
      target: `/blogs/${getBlogSlug(blog)}`,
      status: 301,
    };
  }

  const blogMatch = normalizedPath.match(/^\/blogs\/([^/]+)$/);
  if (blogMatch) {
    const blog = findBlogByRouteValue(blogMatch[1]);

    if (!blog) {
      return { type: 'render', status: 404, renderPath: NOT_FOUND_RENDER_PATH };
    }

    const canonicalPath = `/blogs/${getBlogSlug(blog)}`;
    if (normalizedPath !== canonicalPath) {
      return { type: 'redirect', target: canonicalPath, status: 301 };
    }

    return { type: 'render', status: 200, renderPath: normalizedPath };
  }

  if (!knownPaths.has(normalizedPath)) {
    return { type: 'render', status: 404, renderPath: NOT_FOUND_RENDER_PATH };
  }

  return { type: 'render', status: 200, renderPath: normalizedPath };
};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/sitemap.xml', (req, res) => {
    const staticUrls = flattenRoutes(routes as SitemapRoute[]);
    const ourWorksUrls = [
      '/ourworks/real-projects',
      '/ourworks/house-designs',
      ...(realProjects as SlugItem[]).map((project) => `/ourworks/real-projects/${project.slug}`),
      ...(houseDesigns as SlugItem[]).map((design) => `/ourworks/house-designs/${design.slug}`),
    ].map(toAbsoluteUrl);

    const blogUrls = activeBlogs
      .map(getBlogSlug)
      .filter(Boolean)
      .map((slug) => toAbsoluteUrl(`/blogs/${slug}`));

    const urls = Array.from(new Set([...staticUrls.map(toAbsoluteUrl), ...ourWorksUrls, ...blogUrls]));
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapXml);
  });

  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, baseUrl, headers, path } = req;
    const resolution = resolveRequest(path);

    if (resolution.type === 'redirect') {
      res.redirect(resolution.status, resolution.target);
      return;
    }

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${resolution.renderPath}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.status(resolution.status).send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMainModule) {
  run();
}

export default app();
