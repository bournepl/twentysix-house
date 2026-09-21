import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const roots = [
  'src/app/new-home',
  'src/app/new-about-us',
  'src/app/new-services',
  'src/app/new-contact',
  'src/app/new-blog-list',
  'src/app/new-blog-detail',
  'src/app/new-ourworks',
  'src/app/house-catalog',
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return files.flat();
}

const templateFiles = (await Promise.all(roots.map(walk)))
  .flat()
  .filter(file => file.endsWith('.html'));

const findings = [];

for (const file of templateFiles) {
  const source = await readFile(file, 'utf8');
  const imagePattern = /<img\b[\s\S]*?>/gi;
  let match;

  while ((match = imagePattern.exec(source))) {
    const tag = match[0];
    const line = source.slice(0, match.index).split('\n').length;
    const missing = [];

    if (!/\b(?:\[)?alt(?:\])?\s*=/.test(tag)) missing.push('alt');
    if (!/\bwidth\s*=/.test(tag)) missing.push('width');
    if (!/\bheight\s*=/.test(tag)) missing.push('height');
    if (!/\bdecoding\s*=/.test(tag)) missing.push('decoding');
    const intentionallyEager = /fetchpriority\s*=\s*["']high["']/.test(tag)
      || /brand-mark-320\.webp/.test(tag);
    if (!intentionallyEager && !/\bloading\s*=/.test(tag)) missing.push('loading');

    if (missing.length) {
      findings.push(`${path.relative(process.cwd(), file)}:${line} missing ${missing.join(', ')}`);
    }
  }
}

const assetFiles = await walk('src/assets/img');
const largePublicAssets = [];

for (const file of assetFiles) {
  const details = await stat(file);
  if (details.size >= 1024 * 1024) {
    largePublicAssets.push({
      file: path.relative(process.cwd(), file),
      size: details.size,
    });
  }
}

largePublicAssets.sort((a, b) => b.size - a.size);

if (findings.length) {
  console.error('Media attribute findings:');
  findings.forEach(finding => console.error(`- ${finding}`));
} else {
  console.log('Media attributes: PASS');
}

if (largePublicAssets.length) {
  console.log('\nPublic image assets >= 1 MiB (inventory; not all are referenced):');
  largePublicAssets.forEach(item => {
    console.log(`- ${(item.size / 1024 / 1024).toFixed(2)} MiB ${item.file}`);
  });
}

if (findings.length) {
  process.exitCode = 1;
}
