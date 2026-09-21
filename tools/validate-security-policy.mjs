import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const errors = [];
const rules = new Map((config.headers || []).map(rule => [rule.source, new Map(
  (rule.headers || []).map(header => [header.key.toLowerCase(), header.value])
)]));

const securityRule = rules.get('/(.*)');
if (!securityRule) {
  errors.push('vercel.json: missing catch-all security header rule');
} else {
  const expectedHeaders = new Map([
    ['x-content-type-options', 'nosniff'],
    ['referrer-policy', 'strict-origin-when-cross-origin'],
    ['x-frame-options', 'DENY'],
    ['permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'],
    ['strict-transport-security', 'max-age=63072000; includeSubDomains'],
  ]);

  for (const [name, expected] of expectedHeaders) {
    if (securityRule.get(name) !== expected) errors.push(`vercel.json: invalid ${name}`);
  }

  const csp = securityRule.get('content-security-policy') || '';
  for (const directive of [
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
  ]) {
    if (!csp.includes(directive)) errors.push(`vercel.json: CSP missing ${directive}`);
  }
}

assertCacheRule('/(main|polyfills|chunk)-(.*).js', ['max-age=31536000', 'immutable']);
assertCacheRule('/styles-(.*).css', ['max-age=31536000', 'immutable']);
assertCacheRule('/media/(.*)', ['max-age=31536000', 'immutable']);
assertCacheRule('/assets/(.*)', ['max-age=3600', 'must-revalidate'], ['immutable', 'max-age=31536000']);
assertCacheRule('/assets/videos/(.*)', ['max-age=3600', 'must-revalidate'], ['immutable', 'max-age=31536000']);
assertCacheRule('/favicon.ico', ['max-age=3600', 'must-revalidate'], ['immutable', 'max-age=31536000']);

const videoRule = rules.get('/assets/videos/(.*)');
if (!videoRule?.get('vercel-cdn-cache-control')?.includes('max-age=86400')) {
  errors.push('vercel.json: video CDN cache must be limited to one day');
}

const serverSource = readFileSync('server.ts', 'utf8');
if (!/server\.disable\(['"]x-powered-by['"]\)/.test(serverSource)) {
  errors.push('server.ts: Express X-Powered-By is not disabled');
}
if (!serverSource.includes("'Cache-Control', 'private, no-store'")) {
  errors.push('server.ts: rendered HTML must use private, no-store');
}

if (errors.length) {
  console.error(`Security policy validation failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Security policy valid: CSP, browser protections, HSTS and tiered cache rules are configured.');

function assertCacheRule(source, required, forbidden = []) {
  const cacheControl = rules.get(source)?.get('cache-control') || '';
  if (!cacheControl) {
    errors.push(`vercel.json: missing Cache-Control rule for ${source}`);
    return;
  }
  for (const directive of required) {
    if (!cacheControl.includes(directive)) errors.push(`${source}: Cache-Control missing ${directive}`);
  }
  for (const directive of forbidden) {
    if (cacheControl.includes(directive)) errors.push(`${source}: Cache-Control must not include ${directive}`);
  }
}
