import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const browserRoot = resolve(process.argv[2] || 'dist/twentysix-house/browser');
const baseUrl = process.argv[3];
const blogs = JSON.parse(readFileSync(resolve('src/assets/json/blog.json'), 'utf8'))
  .filter(blog => blog.status !== false);
const errors = [];
const slugs = new Set();
const usefulDestinations = ['/services', '/house-catalog', '/ourworks', '/contact'];

for (const blog of blogs) {
  const id = blog._id?.$oid;
  const slug = blog.slug;

  if (!slug || slug === id || /^[a-f0-9]{24}$/i.test(slug)) {
    errors.push(`${id || blog.title}: missing a readable canonical slug`);
    continue;
  }
  if (slugs.has(slug)) errors.push(`${slug}: duplicate slug`);
  slugs.add(slug);

  for (const field of ['title', 'subTitle', 'dateFormat', 'modifiedDateFormat', 'blogCategory', 'tags']) {
    if (!blog[field] || (Array.isArray(blog[field]) && blog[field].length === 0)) {
      errors.push(`${slug}: missing ${field}`);
    }
  }

  const file = join(browserRoot, 'blogs', slug, 'index.html');
  if (!existsSync(file)) {
    errors.push(`${slug}: prerendered page is missing`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
    ?? html.match(/<link\s+href="([^"]+)"\s+rel="canonical"/i)?.[1];
  const expectedCanonical = `https://twentysix.house/blogs/${slug}`;

  if (!canonical || normalizeUrl(canonical) !== normalizeUrl(expectedCanonical)) {
    errors.push(`${slug}: canonical does not match the slug route`);
  }
  if (!html.includes('TWENTYSIX.HOUSE') || !html.includes('datetime=')) {
    errors.push(`${slug}: visible author or machine-readable publication date is missing`);
  }
  if (!usefulDestinations.some(path => html.includes(`href="${path}"`))) {
    errors.push(`${slug}: no useful internal link to a service, work, catalog, or contact page`);
  }
}

for (const group of ['house-catalog', 'ourworks/completed', 'ourworks/design']) {
  const root = join(browserRoot, ...group.split('/'));
  if (!existsSync(root)) continue;

  for (const entry of listDirectories(root)) {
    const html = readFileSync(join(root, entry, 'index.html'), 'utf8');
    if (!html.includes('href="/blogs/')) {
      errors.push(`/${group}/${entry}: no link back to a helpful article`);
    }
  }
}

if (baseUrl) {
  for (const blog of blogs) {
    const id = blog._id?.$oid;
    if (!id) continue;
    const canonicalPath = `/blogs/${blog.slug}`;
    const canonicalResponse = await fetch(`${baseUrl}${canonicalPath}`, { redirect: 'manual' });

    if (canonicalResponse.status !== 200) {
      errors.push(`${canonicalPath}: expected canonical destination to return 200, got ${canonicalResponse.status}`);
    }

    for (const legacyPath of [`/blogs/detail/${id}`, `/blogs/${id}`]) {
      const response = await fetch(`${baseUrl}${legacyPath}`, { redirect: 'manual' });
      const expectedLocation = canonicalPath;
      if (response.status !== 301 || normalizeLocation(response.headers.get('location')) !== normalizeLocation(expectedLocation)) {
        errors.push(`${legacyPath}: expected 301 to ${expectedLocation}, got ${response.status} ${response.headers.get('location') || ''}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Blog SEO validation failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Blog SEO valid: ${blogs.length} canonical articles, ${blogs.length * 2} legacy redirect definitions${baseUrl ? ' tested over HTTP' : ''}.`);

function listDirectories(root) {
  return readdirSync(root).filter(name => statSync(join(root, name)).isDirectory());
}

function normalizeUrl(value) {
  return decodeURI(new URL(value).href);
}

function normalizeLocation(value) {
  if (!value) return '';
  return decodeURI(new URL(value, 'https://twentysix.house').pathname);
}
