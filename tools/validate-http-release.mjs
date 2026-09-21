import { readFileSync } from 'node:fs';

const baseUrl = (process.argv[2] || 'http://localhost:4600').replace(/\/+$/, '');
const blogs = JSON.parse(readFileSync('src/assets/json/blog.json', 'utf8')).filter(blog => blog.status !== false);
const errors = [];

const canonicalPaths = readFileSync('prerender-routes.txt', 'utf8')
  .split(/\r?\n/)
  .map(path => path.trim())
  .filter(Boolean);

const redirects = new Map([
  ['/home', '/'],
  ['/aboutus', '/about'],
  ['/contactus', '/contact'],
  ['/collections', '/ourworks'],
  ['/blogs/list', '/blogs'],
  ['/รับสร้างบ้าน-อุดรธานี', '/'],
  ['/ourworks/real-projects', '/ourworks/completed'],
  ['/ourworks/house-designs', '/house-catalog'],
  ['/ourworks/house-designs/yu-plearn-nature-connected-home', '/house-catalog/yu-plearn'],
  ['/ourworks/house-designs/yu-yen-compact-single-storey-home', '/house-catalog/yu-yen'],
  ['/ourworks/house-designs/yu-sabai-modern-character-home', '/house-catalog/yu-sabai'],
  ['/ourworks/house-designs/yu-sook-private-open-plan-family-home', '/house-catalog/yu-sook'],
]);

for (const blog of blogs) {
  const id = blog._id?.$oid;
  if (!id) continue;
  redirects.set(`/blogs/detail/${id}`, `/blogs/${blog.slug}`);
  redirects.set(`/blogs/${id}`, `/blogs/${blog.slug}`);
}

for (const path of canonicalPaths) {
  const response = await fetch(`${baseUrl}${encodeURI(path)}`, { redirect: 'manual' });
  if (response.status !== 200) errors.push(`${path}: expected 200, got ${response.status}`);
  if (!response.headers.get('content-type')?.includes('text/html')) {
    errors.push(`${path}: expected text/html`);
  }
}

for (const [source, destination] of redirects) {
  const response = await fetch(`${baseUrl}${encodeURI(source)}`, { redirect: 'manual' });
  const location = response.headers.get('location');
  if (response.status !== 301 || normalizePath(location) !== destination) {
    errors.push(`${source}: expected 301 to ${destination}, got ${response.status} ${location || ''}`);
  }
}

for (const [path, expectedType] of [['/robots.txt', 'text/plain'], ['/sitemap.xml', 'application/xml']]) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  if (response.status !== 200) errors.push(`${path}: expected 200, got ${response.status}`);
  if (!response.headers.get('content-type')?.includes(expectedType)) errors.push(`${path}: expected ${expectedType}`);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map(match => decodeURI(new URL(match[1]).pathname).replace(/\/+$/, '') || '/');
if (sitemapPaths.length !== canonicalPaths.length) {
  errors.push(`/sitemap.xml: expected ${canonicalPaths.length} URLs, found ${sitemapPaths.length}`);
}
for (const path of canonicalPaths) {
  if (!sitemapPaths.includes(path)) errors.push(`/sitemap.xml: missing ${path}`);
}

for (const [path, expectedType] of [
  ['/assets/img/seo/home-hero-960.webp', 'image/webp'],
  ['/assets/videos/khun-tae-home-handover-720p.mp4', 'video/mp4'],
]) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  if (response.status !== 200) errors.push(`${path}: expected 200, got ${response.status}`);
  if (!response.headers.get('content-type')?.includes(expectedType)) errors.push(`${path}: expected ${expectedType}`);
}

const notFound = await fetch(`${baseUrl}/phase-8-missing-page`, { redirect: 'manual' });
if (notFound.status !== 404) errors.push(`/phase-8-missing-page: expected 404, got ${notFound.status}`);
if (!/noindex/i.test(notFound.headers.get('x-robots-tag') || '')) errors.push('404 response: missing X-Robots-Tag noindex');
if (!notFound.headers.get('content-type')?.includes('text/html')) errors.push('404 response: expected text/html');

const trailingSlash = await fetch(`${baseUrl}/about/`, { redirect: 'manual' });
if (trailingSlash.status !== 301 || normalizePath(trailingSlash.headers.get('location')) !== '/about') {
  errors.push(`/about/: expected one 301 to /about`);
}

if (errors.length) {
  console.error(`HTTP release validation failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`HTTP release valid: ${canonicalPaths.length} canonical pages, ${redirects.size + 1} redirects, robots, sitemap and 404 behavior.`);

function normalizePath(value) {
  if (!value) return '';
  return decodeURI(new URL(value, baseUrl).pathname).replace(/\/+$/, '') || '/';
}
