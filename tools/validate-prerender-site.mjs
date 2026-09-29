import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import sharp from 'sharp';

const browserRoot = resolve(process.argv[2] || 'dist/twentysix-house/browser');
const siteUrl = 'https://twentysix.house';
const primaryKeyword = 'รับสร้างบ้านอุดรธานี';
const companyKeyword = 'บริษัทรับสร้างบ้านอุดรธานี';

if (!existsSync(browserRoot)) {
  fail(`Build output not found: ${browserRoot}`);
}

const files = walk(browserRoot)
  .filter(file => file === join(browserRoot, 'index.html') || file.endsWith(`${sep}index.html`));
const pages = new Map(files.map(file => [routeFromFile(file), readFileSync(file, 'utf8')]));
const routes = new Set(pages.keys());
const errors = [];
const titles = new Map();
const inboundLinks = new Map([...routes].map(route => [route, new Set()]));
const socialImages = new Map();

for (const [route, html] of pages) {
  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const title = decodeEntities(titleMatches[0]?.[1] || '').trim();
  const canonicalMatches = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];
  const canonical = attribute(canonicalMatches[0]?.[0], 'href');
  const descriptions = [...html.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)];
  const description = attribute(descriptions[0]?.[0], 'content');
  const robotsTags = [...html.matchAll(/<meta\b[^>]*name=["']robots["'][^>]*>/gi)];
  const robots = attribute(robotsTags[0]?.[0], 'content') || '';
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1Matches.length;
  const h1 = decodeEntities(h1Matches[0]?.[1]?.replace(/<[^>]+>/g, ' ') || '')
    .replace(/\s+/g, ' ')
    .trim();
  const mainCount = (html.match(/<main\b/gi) || []).length;
  const imagePreloads = [...html.matchAll(/<link\b[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*>/gi)];

  if (titleMatches.length !== 1 || !title) errors.push(`${route}: expected one non-empty title`);
  if (title.length > 65) errors.push(`${route}: title is ${title.length} characters; maximum is 65`);
  if (title) {
    const previous = titles.get(title);
    if (previous) errors.push(`${route}: duplicate title also used by ${previous}`);
    else titles.set(title, route);
  }
  if (canonicalMatches.length !== 1 || !canonical) {
    errors.push(`${route}: expected one canonical link`);
  } else if (normalizeUrl(canonical) !== normalizeUrl(`${siteUrl}${route === '/' ? '' : route}`)) {
    errors.push(`${route}: canonical is ${canonical}`);
  }
  if (descriptions.length !== 1 || !description?.trim()) errors.push(`${route}: missing unique meta description`);
  if (description && description.length > 160) errors.push(`${route}: description is ${description.length} characters; maximum is 160`);
  if (/noindex/i.test(robots)) errors.push(`${route}: canonical prerender route is noindex`);
  if (h1Count !== 1) errors.push(`${route}: expected one h1, found ${h1Count}`);
  if (mainCount !== 1) errors.push(`${route}: expected one main landmark, found ${mainCount}`);
  if (!/<html\b[^>]*lang=["']th["']/i.test(html)) errors.push(`${route}: html lang is not th`);
  if (imagePreloads.length > 1) errors.push(`${route}: more than one image preload (${imagePreloads.length})`);

  if (route === '/') {
    if (!title.startsWith(primaryKeyword)) errors.push(`/: title must start with ${primaryKeyword}`);
    if (h1 !== primaryKeyword) errors.push(`/: h1 must be exactly ${primaryKeyword}`);
    if (!description?.includes(companyKeyword)) errors.push(`/: description must include ${companyKeyword}`);
  }

  validateSocialMetadata(route, html, title, description, canonical);

  for (const match of html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const [, element, attributes, content] = match;
    const text = decodeEntities(content.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    const label = attribute(attributes, 'aria-label') || attribute(attributes, 'aria-labelledby') || attribute(attributes, 'title');
    const imageAlt = [...content.matchAll(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi)]
      .some(image => decodeEntities(image[1]).trim());
    if (!text && !label && !imageAlt) errors.push(`${route}: ${element} has no accessible name`);
  }

  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (/target=["']_blank["']/i.test(attributes) && !/rel=["'][^"']*noopener/i.test(attributes)) {
      errors.push(`${route}: target=_blank link is missing rel=noopener`);
    }
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt(?:=["'][^"']*["'])?(?=\s|$)/i.test(match[1])) errors.push(`${route}: image is missing alt`);
    const src = attribute(match[1], 'src');
    if (src) validateAsset(route, src);
    const srcset = attribute(match[1], 'srcset');
    if (srcset) srcset.split(',').forEach(candidate => validateAsset(route, candidate.trim().split(/\s+/)[0]));
  }

  for (const match of html.matchAll(/<video\b([^>]*)>/gi)) {
    const poster = attribute(match[1], 'poster');
    if (poster) validateAsset(route, poster);
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = decodeEntities(match[1]);
    const target = internalRoute(href);
    if (!target) continue;

    if (!routes.has(target)) {
      errors.push(`${route}: broken internal link ${href}`);
      continue;
    }
    if (target !== route) inboundLinks.get(target)?.add(route);
  }
}

for (const [assetPath, imageRoutes] of socialImages) {
  try {
    const metadata = await sharp(assetPath).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const ratio = height ? width / height : 0;
    if (width < 1200 || height < 600 || ratio < 1.5 || ratio > 2.1) {
      errors.push(`${[...imageRoutes].join(', ')}: social image must be at least 1200x600 with a 1.5-2.1 ratio; got ${width}x${height}`);
    }
  } catch (error) {
    errors.push(`${[...imageRoutes].join(', ')}: cannot inspect social image (${error.message})`);
  }
}

for (const [route, sources] of inboundLinks) {
  if (route !== '/' && sources.size === 0) errors.push(`${route}: orphan prerender page`);
}

if (errors.length) {
  console.error(`Prerender crawl failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Prerender crawl valid: ${pages.size} routes, ${titles.size} unique titles, no broken links or orphan pages.`);

function internalRoute(href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return null;
  const url = new URL(href, siteUrl);
  if (url.origin !== siteUrl) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null;
  const path = decodeURI(url.pathname).replace(/\/+$/, '') || '/';
  return path;
}

function attribute(tag = '', name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
}

function routeFromFile(file) {
  const folder = relative(browserRoot, dirname(file)).split(sep).join('/');
  return folder ? `/${folder}` : '/';
}

function walk(directory) {
  return readdirSync(directory).flatMap(name => {
    const file = join(directory, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeUrl(value) {
  const url = new URL(value, siteUrl);
  url.hash = '';
  url.search = '';
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
  return decodeURI(url.href);
}

function validateAsset(route, value) {
  if (!value || /^(https?:|data:|blob:)/i.test(value)) return;
  const pathname = decodeURI(new URL(value, siteUrl).pathname).replace(/^\/+/, '');
  if (!existsSync(join(browserRoot, pathname))) errors.push(`${route}: missing local asset /${pathname}`);
}

function validateSocialMetadata(route, html, title, description, canonical) {
  const property = key => metaContent(html, 'property', key);
  const named = key => metaContent(html, 'name', key);
  const expected = [
    ['og:title', property('og:title')],
    ['og:description', property('og:description')],
    ['og:url', property('og:url')],
    ['og:type', property('og:type')],
    ['og:site_name', property('og:site_name')],
    ['og:locale', property('og:locale')],
    ['og:image', property('og:image')],
    ['og:image:alt', property('og:image:alt')],
    ['twitter:card', named('twitter:card')],
    ['twitter:title', named('twitter:title')],
    ['twitter:description', named('twitter:description')],
    ['twitter:image', named('twitter:image')],
    ['twitter:image:alt', named('twitter:image:alt')],
  ];

  expected.forEach(([key, value]) => {
    if (!value?.trim()) errors.push(`${route}: missing ${key}`);
  });

  const ogTitle = property('og:title');
  const ogDescription = property('og:description');
  const ogUrl = property('og:url');
  const ogImage = property('og:image');
  const twitterImage = named('twitter:image');

  if (ogTitle && ogTitle !== title) errors.push(`${route}: og:title differs from title`);
  if (ogDescription && ogDescription !== decodeEntities(description || '')) errors.push(`${route}: og:description differs from description`);
  if (canonical && ogUrl && normalizeUrl(ogUrl) !== normalizeUrl(canonical)) errors.push(`${route}: og:url differs from canonical`);
  if (named('twitter:title') && named('twitter:title') !== title) errors.push(`${route}: twitter:title differs from title`);
  if (named('twitter:description') && named('twitter:description') !== decodeEntities(description || '')) errors.push(`${route}: twitter:description differs from description`);
  if (ogImage && twitterImage && normalizeUrl(ogImage) !== normalizeUrl(twitterImage)) errors.push(`${route}: Twitter and Open Graph images differ`);

  if (!ogImage) return;

  const imageUrl = new URL(decodeEntities(ogImage), siteUrl);
  if (imageUrl.origin !== siteUrl) {
    errors.push(`${route}: social image must be hosted on ${siteUrl}`);
    return;
  }
  if (imageUrl.search || imageUrl.hash) errors.push(`${route}: social image URL must not contain a query or hash`);

  const pathname = decodeURI(imageUrl.pathname).replace(/^\/+/, '');
  const assetPath = join(browserRoot, pathname);
  if (!existsSync(assetPath)) {
    errors.push(`${route}: missing social image /${pathname}`);
    return;
  }

  if (!socialImages.has(assetPath)) socialImages.set(assetPath, new Set());
  socialImages.get(assetPath).add(route);
}

function metaContent(html, attributeName, key) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (attribute(match[0], attributeName) === key) {
      return decodeEntities(attribute(match[0], 'content') || '');
    }
  }
  return '';
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
