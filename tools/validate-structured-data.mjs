import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const browserRoot = resolve(process.argv[2] || 'dist/twentysix-house/browser');
const organizationId = 'https://twentysix.house/#organization';

if (!existsSync(browserRoot)) {
  fail(`Build output not found: ${browserRoot}`);
}

const htmlFiles = walk(browserRoot).filter(file => file.endsWith(`${sep}index.html`) || file === join(browserRoot, 'index.html'));
const errors = [];
let articleCount = 0;
let organizationFingerprint;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = routeFromFile(file);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
    ?? html.match(/<link\s+href="([^"]+)"\s+rel="canonical"/i)?.[1];
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  if (scripts.length !== 1) {
    errors.push(`${route}: expected 1 JSON-LD script, found ${scripts.length}`);
    continue;
  }

  let document;
  try {
    document = JSON.parse(scripts[0][1]);
  } catch (error) {
    errors.push(`${route}: invalid JSON-LD (${error.message})`);
    continue;
  }

  const nodes = Array.isArray(document['@graph']) ? document['@graph'] : [document];
  const organization = nodes.find(node => node?.['@id'] === organizationId);
  const types = collectTypes(document);

  if (document['@context'] !== 'https://schema.org') {
    errors.push(`${route}: missing https://schema.org context`);
  }
  if (!organization) {
    errors.push(`${route}: missing shared organization ${organizationId}`);
  }
  if (!canonical) {
    errors.push(`${route}: missing canonical URL`);
  } else {
    const expectedCanonical = new URL(route, 'https://twentysix.house').href;
    if (normalizeUrl(canonical) !== normalizeUrl(expectedCanonical)) {
      errors.push(`${route}: canonical is ${canonical}, expected ${expectedCanonical}`);
    }
    if (!nodes.some(node => node?.url && normalizeUrl(node.url) === normalizeUrl(canonical))) {
      errors.push(`${route}: no top-level schema entity uses the canonical URL`);
    }
  }

  if (organization) {
    const fingerprint = JSON.stringify(organization);
    organizationFingerprint ??= fingerprint;
    if (fingerprint !== organizationFingerprint) {
      errors.push(`${route}: organization data differs from other routes`);
    }
  }

  for (const expectedType of expectedTypes(route)) {
    if (!types.has(expectedType)) {
      errors.push(`${route}: missing ${expectedType}`);
    }
  }

  if (hasProperty(document, 'availability')) {
    errors.push(`${route}: contains availability that is not shown on the page`);
  }
  if (hasProperty(document, 'aggregateRating') || hasProperty(document, 'review')) {
    errors.push(`${route}: contains review or rating data that is not shown on the page`);
  }

  const article = nodes.find(node => node?.['@type'] === 'BlogPosting');
  if (article) {
    articleCount += 1;
    for (const property of ['headline', 'image', 'author', 'publisher', 'datePublished', 'dateModified', 'mainEntityOfPage']) {
      if (!article[property]) {
        errors.push(`${route}: BlogPosting missing ${property}`);
      }
    }
    if (article.author?.['@id'] !== organizationId || article.publisher?.['@id'] !== organizationId) {
      errors.push(`${route}: BlogPosting author/publisher must reference the shared organization`);
    }
  }
}

if (errors.length) {
  console.error(`Structured data validation failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Structured data valid: ${htmlFiles.length} prerendered routes, ${articleCount} BlogPosting pages.`);

function expectedTypes(route) {
  if (route === '/') return ['Organization', 'LocalBusiness', 'WebSite', 'WebPage'];
  if (route === '/about') return ['AboutPage', 'BreadcrumbList'];
  if (route === '/services') return ['Service', 'OfferCatalog', 'BreadcrumbList'];
  if (route === '/contact') return ['ContactPage', 'PostalAddress', 'BreadcrumbList'];
  if (route === '/blogs') return ['Blog', 'ItemList', 'BreadcrumbList'];
  if (route.startsWith('/blogs/')) return ['BlogPosting', 'BreadcrumbList'];
  if (route === '/house-catalog') return ['CollectionPage', 'ItemList', 'BreadcrumbList'];
  if (route.startsWith('/house-catalog/')) return ['Product', 'WebPage', 'BreadcrumbList'];
  if (route === '/ourworks' || route === '/ourworks/completed' || route === '/ourworks/design') {
    return ['CollectionPage', 'ItemList', 'BreadcrumbList'];
  }
  if (route.startsWith('/ourworks/completed/') || route.startsWith('/ourworks/design/')) {
    return ['CreativeWork', 'ImageObject', 'WebPage', 'BreadcrumbList'];
  }
  return [];
}

function collectTypes(value, result = new Set()) {
  if (Array.isArray(value)) {
    value.forEach(item => collectTypes(item, result));
    return result;
  }
  if (!value || typeof value !== 'object') return result;

  const type = value['@type'];
  if (Array.isArray(type)) type.forEach(item => result.add(item));
  else if (type) result.add(type);
  Object.values(value).forEach(item => collectTypes(item, result));
  return result;
}

function hasProperty(value, property) {
  if (Array.isArray(value)) return value.some(item => hasProperty(item, property));
  if (!value || typeof value !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(value, property)
    || Object.values(value).some(item => hasProperty(item, property));
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalizeUrl(value) {
  return decodeURI(new URL(value).href);
}
