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
    const baseUrl = 'https://twentysix.house';

    const normalizePath = (path: string): string => {
      const normalized = path.replace(/\/+/g, '/');
      return normalized === '/' ? '' : normalized.replace(/\/$/, '');
    };

    const toAbsoluteUrl = (path: string): string => `${baseUrl}${normalizePath(path)}`;

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

    const getBlogSlug = (blog: BlogSlugItem): string => {
      const slug = normalizeSlug(blog.slug || blog.title || '');

      return slug || blog.bId || blog._id?.$oid || '';
    };

    const flattenRoutes = (routes: SitemapRoute[], parent: string = ''): string[] => {
      let urls: string[] = [];
      for (const route of routes) {
        if (route.redirectTo !== undefined || route.path === '**' || route.path?.includes(':')) {
          continue;
        }

        const fullPath = `${parent}/${route.path ?? ''}`.replace(/\/+/g, '/');
        if (route.data?.sitemap !== false) {
          urls.push(toAbsoluteUrl(fullPath));
        }
        if (route.children) {
          urls = urls.concat(flattenRoutes(route.children, fullPath));
        }
      }
      return urls;
    };

    const staticUrls = flattenRoutes(routes as SitemapRoute[]);
    const ourWorksUrls = [
      '/ourworks/real-projects',
      '/ourworks/house-designs',
      ...(realProjects as SlugItem[]).map((project) => `/ourworks/real-projects/${project.slug}`),
      ...(houseDesigns as SlugItem[]).map((design) => `/ourworks/house-designs/${design.slug}`),
    ].map(toAbsoluteUrl);

    const blogUrls = (blogs as BlogSlugItem[])
      .filter((blog) => blog.status !== false)
      .map(getBlogSlug)
      .filter(Boolean)
      .map((slug) => toAbsoluteUrl(`/blogs/${slug}`));

    const urls = Array.from(new Set([...staticUrls, ...ourWorksUrls, ...blogUrls]));
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
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
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
