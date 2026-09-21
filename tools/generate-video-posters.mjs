import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(toolsDirectory, '..');
const manifestPath = join(toolsDirectory, 'video-manifest.json');
const defaultInputDirectory = join(projectRoot, '.tmp', 'video-optimized');
const assetsDirectory = join(projectRoot, 'src', 'assets');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';

const readOption = (option, fallback) => {
  const index = args.indexOf(option);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const inputDirectory = resolve(readOption('--input', defaultInputDirectory));
const selectedSlug = readOption('--slug', '');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = selectedSlug
  ? manifest.filter(item => item.slug === selectedSlug)
  : manifest;

if (!entries.length) {
  throw new Error(`No video manifest entry found for slug: ${selectedSlug}`);
}

const isWithin = (parent, child) => {
  const pathFromParent = relative(parent, child);
  return pathFromParent === '' || (!pathFromParent.startsWith('..') && !isAbsolute(pathFromParent));
};

for (const entry of entries) {
  if (!Number.isFinite(entry.posterTimeSeconds) || entry.posterTimeSeconds < 0) {
    throw new Error(`Invalid posterTimeSeconds for ${entry.slug}`);
  }
  if (!entry.poster?.startsWith('assets/')) {
    throw new Error(`Poster path must start with assets/: ${entry.slug}`);
  }

  const inputPath = join(inputDirectory, `${entry.slug}-1080p.mp4`);
  const outputPath = resolve(projectRoot, 'src', entry.poster);

  if (!existsSync(inputPath)) {
    throw new Error(`Optimized video not found: ${inputPath}`);
  }
  if (!isWithin(assetsDirectory, outputPath)) {
    throw new Error(`Poster output is outside src/assets: ${outputPath}`);
  }

  const commandArgs = [
    '-y',
    '-hide_banner',
    '-loglevel', 'error',
    '-ss', String(entry.posterTimeSeconds),
    '-i', inputPath,
    '-frames:v', '1',
    '-vf', 'scale=1280:720:flags=lanczos',
    '-an',
    '-c:v', 'libwebp',
    '-quality', '82',
    '-compression_level', '6',
    outputPath,
  ];

  console.log(`${entry.slug}: ${entry.posterTimeSeconds}s -> ${entry.poster}`);
  if (dryRun) continue;

  mkdirSync(dirname(outputPath), { recursive: true });
  const result = spawnSync(ffmpeg, commandArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Unable to run ${ffmpeg}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`Poster generation failed for ${entry.slug}`);
  }
}

console.log(`Processed ${entries.length} poster manifest entries${dryRun ? ' (dry run)' : ''}.`);
