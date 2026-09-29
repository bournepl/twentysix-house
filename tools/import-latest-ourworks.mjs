import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(root, 'source-media', 'ourworks');
const sourceFlagIndex = process.argv.indexOf('--source');
const sourceRoot = sourceFlagIndex >= 0 ? process.argv[sourceFlagIndex + 1] : undefined;

if (!sourceRoot) {
  throw new Error('Usage: node tools/import-latest-ourworks.mjs --source <assets/img path>');
}

const imports = [
  {
    kind: 'completed',
    sourceGroup: 'B ผลงานจริง',
    sourceFolder: '01 PIC Khun Add',
    destinationFolder: '14 PIC Khun Add',
  },
  {
    kind: 'completed',
    sourceGroup: 'B ผลงานจริง',
    sourceFolder: '02 PIC Khun Taew',
    destinationFolder: '15 PIC Khun Taew',
  },
  {
    kind: 'design',
    sourceGroup: 'B ผลงานออกแบบ',
    sourceFolder: 'Khun Taew',
    destinationFolder: '06 Khun Taew',
  },
];

async function findDirectories(directory, targetName, matches = []) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const child = path.join(directory, entry.name);
    if (entry.name === targetName) matches.push(child);
    await findDirectories(child, targetName, matches);
  }

  return matches;
}

async function locateSource({ sourceGroup, sourceFolder }) {
  const matches = await findDirectories(sourceRoot, sourceFolder);
  const match = matches.find(directory => directory.includes(sourceGroup));
  if (!match) throw new Error(`Could not find ${sourceGroup}/${sourceFolder} below ${sourceRoot}`);
  return match;
}

let imported = 0;
let originalBytes = 0;
let optimizedBytes = 0;

for (const project of imports) {
  const source = await locateSource(project);
  const destination = path.join(outputRoot, project.kind, project.destinationFolder);
  const files = (await readdir(source, { withFileTypes: true }))
    .filter(entry => entry.isFile() && /\.(avif|jpe?g|png|webp)$/i.test(entry.name));

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });

  for (const file of files) {
    const input = path.join(source, file.name);
    const output = path.join(destination, `${path.parse(file.name).name}.webp`);
    const image = sharp(input).rotate().resize(2400, 2400, {
      fit: 'inside',
      withoutEnlargement: true,
    });
    const inputStats = await stat(input);
    const result = await image.webp({ quality: 88, effort: 5 }).toFile(output);

    originalBytes += inputStats.size;
    optimizedBytes += result.size;
    imported += 1;
  }

  console.log(`Imported ${files.length} images: ${project.sourceFolder}`);
}

const megabytes = bytes => (bytes / 1024 / 1024).toFixed(2);
console.log(`Imported ${imported} images (${megabytes(originalBytes)} MB -> ${megabytes(optimizedBytes)} MB)`);
