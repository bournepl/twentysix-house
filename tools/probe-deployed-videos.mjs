import { spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(toolsDirectory, '..');
const sourceDirectory = resolve(projectRoot, 'src', 'assets', 'videos');
const browserDirectory = resolve(projectRoot, 'dist', 'twentysix-house', 'browser', 'assets', 'videos');
const maxTotalBytes = 100_000_000;
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
const args = process.argv.slice(2);
const requireBuildOutput = args.includes('--require-build-output');

const runProbe = path => {
  const result = spawnSync(ffprobe, [
    '-v', 'error',
    '-show_entries',
    'format=format_name,duration,size:stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate',
    '-of', 'json',
    '--', path,
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Unable to run ${ffprobe}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${basename(path)}: ffprobe failed\n${result.stderr || result.stdout}`);
  }

  return JSON.parse(result.stdout);
};

const parseRate = value => {
  const [numerator, denominator = '1'] = String(value || '0/1').split('/').map(Number);
  return denominator ? numerator / denominator : 0;
};

const readBoxOrder = path => {
  const fileSize = statSync(path).size;
  const descriptor = openSync(path, 'r');
  const boxes = [];
  let offset = 0;

  try {
    while (offset + 8 <= fileSize && boxes.length < 64) {
      const header = Buffer.alloc(16);
      const bytesRead = readSync(descriptor, header, 0, 16, offset);
      if (bytesRead < 8) break;

      let boxSize = header.readUInt32BE(0);
      const boxType = header.toString('ascii', 4, 8);
      let headerSize = 8;

      if (boxSize === 1) {
        if (bytesRead < 16) break;
        boxSize = Number(header.readBigUInt64BE(8));
        headerSize = 16;
      } else if (boxSize === 0) {
        boxSize = fileSize - offset;
      }

      if (!Number.isSafeInteger(boxSize) || boxSize < headerSize) break;
      boxes.push(boxType);
      if (boxType === 'mdat' || boxType === 'moov') {
        const hasMdat = boxes.includes('mdat');
        const hasMoov = boxes.includes('moov');
        if (hasMdat && hasMoov) break;
      }
      offset += boxSize;
    }
  } finally {
    closeSync(descriptor);
  }

  return boxes;
};

const listVideos = directory => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.mp4'))
    .map(entry => join(directory, entry.name))
    .sort();
};

const sourceVideos = listVideos(sourceDirectory);
const errors = [];

if (!sourceVideos.length) {
  errors.push(`No production MP4 files found in ${sourceDirectory}`);
}

let totalBytes = 0;
const rows = [];

for (const path of sourceVideos) {
  const data = runProbe(path);
  const video = data.streams?.find(stream => stream.codec_type === 'video');
  const audio = data.streams?.find(stream => stream.codec_type === 'audio');
  const sizeBytes = statSync(path).size;
  const frameRate = parseRate(video?.avg_frame_rate);
  const boxes = readBoxOrder(path);
  const moovIndex = boxes.indexOf('moov');
  const mdatIndex = boxes.indexOf('mdat');
  const fastStart = moovIndex >= 0 && mdatIndex >= 0 && moovIndex < mdatIndex;

  totalBytes += sizeBytes;

  if (!data.format?.format_name?.includes('mp4')) errors.push(`${basename(path)}: container is not MP4`);
  if (video?.codec_name !== 'h264') errors.push(`${basename(path)}: expected H.264 video, got ${video?.codec_name || 'none'}`);
  if (video?.pix_fmt !== 'yuv420p') errors.push(`${basename(path)}: expected yuv420p, got ${video?.pix_fmt || 'none'}`);
  if ((video?.width || 0) > 1920) errors.push(`${basename(path)}: width exceeds 1920px`);
  if (frameRate > 30.01) errors.push(`${basename(path)}: frame rate exceeds 30fps (${frameRate.toFixed(2)})`);
  if (audio && audio.codec_name !== 'aac') errors.push(`${basename(path)}: expected AAC audio, got ${audio.codec_name}`);
  if (!fastStart) errors.push(`${basename(path)}: MP4 moov atom is not before mdat (fast-start missing)`);

  rows.push({
    file: basename(path),
    sizeMB: (sizeBytes / 1_000_000).toFixed(2),
    dimensions: `${video?.width || 0}x${video?.height || 0}`,
    fps: frameRate.toFixed(2),
    codecs: `${video?.codec_name || 'none'}${audio ? `/${audio.codec_name}` : ''}`,
    fastStart,
  });
}

if (totalBytes > maxTotalBytes) {
  errors.push(`Production videos total ${(totalBytes / 1_000_000).toFixed(2)} MB; limit is ${(maxTotalBytes / 1_000_000).toFixed(0)} MB`);
}

const browserVideos = listVideos(browserDirectory);
if (requireBuildOutput) {
  const sourceNames = sourceVideos.map(path => basename(path));
  const browserNames = browserVideos.map(path => basename(path));
  if (JSON.stringify(sourceNames) !== JSON.stringify(browserNames)) {
    errors.push(`Build output video set differs from source: source=${sourceNames.join(', ')} output=${browserNames.join(', ')}`);
  } else {
    for (const sourcePath of sourceVideos) {
      const outputPath = join(browserDirectory, basename(sourcePath));
      const source = readFileSync(sourcePath);
      const output = readFileSync(outputPath);
      if (!source.equals(output)) errors.push(`${basename(sourcePath)}: build output differs from source`);
    }
  }
}

console.table(rows);
console.log(`Production video total: ${(totalBytes / 1_000_000).toFixed(2)} MB (${(totalBytes / 1024 / 1024).toFixed(2)} MiB)`);

if (errors.length) {
  console.error('\nVideo deployment validation failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Video deployment validation passed${requireBuildOutput ? ' with matching build output' : ''}.`);
