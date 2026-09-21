import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(toolsDirectory, '..');
const defaultSourceDirectory = join(
  projectRoot,
  'src',
  'assets',
  'img',
  'Photo',
  '02 ผลงานการส่งมอบจริง',
);
const defaultOutputDirectory = join(projectRoot, '.tmp', 'video-optimized');
const manifestPath = join(toolsDirectory, 'video-manifest.json');

const args = process.argv.slice(2);
const hasFlag = flag => args.includes(flag);
const readOption = (option, fallback) => {
  const index = args.indexOf(option);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const sourceDirectory = resolve(readOption('--source', defaultSourceDirectory));
const outputDirectory = resolve(readOption('--output', defaultOutputDirectory));
const selectedSlug = readOption('--slug', '');
const crf = Number(readOption('--crf', '23'));
const maxWidth = Number(readOption('--max-width', '1920'));
const preset = readOption('--preset', 'slow');
const startSeconds = Number(readOption('--start', '0'));
const durationSeconds = Number(readOption('--duration', '0'));
const probeOnly = hasFlag('--probe-only');
const dryRun = hasFlag('--dry-run');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';

if (!Number.isInteger(crf) || crf < 0 || crf > 51) {
  throw new Error(`Invalid --crf value: ${crf}`);
}
if (!Number.isInteger(maxWidth) || maxWidth < 320 || maxWidth > 3840) {
  throw new Error(`Invalid --max-width value: ${maxWidth}`);
}
if (!Number.isFinite(startSeconds) || startSeconds < 0) {
  throw new Error(`Invalid --start value: ${startSeconds}`);
}
if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
  throw new Error(`Invalid --duration value: ${durationSeconds}`);
}

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Unable to run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const details = options.capture ? `\n${result.stderr || result.stdout}` : '';
    throw new Error(`${command} exited with code ${result.status}.${details}`);
  }

  return result.stdout || '';
};

const parseRate = value => {
  if (!value || value === '0/0') return 0;
  const [numerator, denominator = '1'] = value.split('/').map(Number);
  return denominator ? numerator / denominator : 0;
};

const probeVideo = path => {
  const output = run(ffprobe, [
    '-v', 'error',
    '-show_entries',
    'format=duration,format_name,bit_rate,size:stream=index,codec_type,codec_name,profile,width,height,pix_fmt,avg_frame_rate,sample_rate,channels,channel_layout,bit_rate',
    '-of', 'json',
    '--', path,
  ], { capture: true });
  const data = JSON.parse(output);
  const video = data.streams?.find(stream => stream.codec_type === 'video');
  const audio = data.streams?.find(stream => stream.codec_type === 'audio');

  if (!video) {
    throw new Error(`No video stream found: ${path}`);
  }

  return {
    durationSeconds: Number(data.format?.duration || 0),
    sizeBytes: Number(data.format?.size || 0),
    totalBitrate: Number(data.format?.bit_rate || 0),
    container: data.format?.format_name || '',
    video: {
      codec: video.codec_name,
      profile: video.profile,
      width: video.width,
      height: video.height,
      pixelFormat: video.pix_fmt,
      frameRate: parseRate(video.avg_frame_rate),
      bitrate: Number(video.bit_rate || 0),
    },
    audio: audio ? {
      codec: audio.codec_name,
      sampleRate: Number(audio.sample_rate || 0),
      channels: audio.channels,
      channelLayout: audio.channel_layout,
      bitrate: Number(audio.bit_rate || 0),
    } : null,
  };
};

const formatMegabytes = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = selectedSlug
  ? manifest.filter(entry => entry.slug === selectedSlug)
  : manifest;

if (!entries.length) {
  throw new Error(`No manifest entry found for slug: ${selectedSlug}`);
}

const report = [];

for (const entry of entries) {
  const sourcePath = resolve(sourceDirectory, entry.source);
  const resolutionLabel = maxWidth <= 1280 ? '720p' : maxWidth <= 1920 ? '1080p' : `${maxWidth}w`;
  const sampleSuffix = durationSeconds > 0
    ? `-sample-${startSeconds}s-${durationSeconds}s`
    : '';
  const outputPath = join(outputDirectory, `${entry.slug}-${resolutionLabel}${sampleSuffix}.mp4`);
  const temporaryPath = join(outputDirectory, `${entry.slug}-${resolutionLabel}${sampleSuffix}.partial.mp4`);

  if (!sourcePath.startsWith(`${sourceDirectory}\\`) && sourcePath !== sourceDirectory) {
    throw new Error(`Source path escapes the configured source directory: ${entry.source}`);
  }
  if (!existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }

  const before = probeVideo(sourcePath);
  console.log(`\n${entry.slug}`);
  console.log(`  Source: ${entry.source}`);
  console.log(`  Input:  ${before.video.width}x${before.video.height}, ${before.video.frameRate.toFixed(2)}fps, ${formatMegabytes(before.sizeBytes)}`);
  console.log(`  Audio:  ${before.audio ? `${before.audio.codec}, ${before.audio.sampleRate}Hz, ${before.audio.channels}ch` : 'none'}`);

  if (probeOnly) {
    report.push({ ...entry, sourcePath, before });
    continue;
  }

  if (existsSync(outputPath) || existsSync(temporaryPath)) {
    throw new Error(`Output already exists; refusing to overwrite: ${existsSync(outputPath) ? outputPath : temporaryPath}`);
  }

  const filters = [`scale=w='min(${maxWidth},iw)':h=-2:flags=lanczos`];
  if (before.video.frameRate > 30) {
    filters.push('fps=30');
  }

  const ffmpegArgs = [
    '-hide_banner',
    ...(startSeconds > 0 ? ['-ss', String(startSeconds)] : []),
    '-i', sourcePath,
    ...(durationSeconds > 0 ? ['-t', String(durationSeconds)] : []),
    '-map', '0:v:0',
    '-map', '0:a:0?',
    '-map_metadata', '0',
    '-vf', filters.join(','),
    '-c:v', 'libx264',
    '-preset', preset,
    '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '48000',
    '-ac', '2',
    '-movflags', '+faststart',
    temporaryPath,
  ];

  console.log(`  Output: ${outputPath}`);
  if (dryRun) {
    console.log(`  Command: ${ffmpeg} ${ffmpegArgs.map(value => JSON.stringify(value)).join(' ')}`);
    report.push({ ...entry, sourcePath, outputPath, before, startSeconds, durationSeconds, dryRun: true });
    continue;
  }

  mkdirSync(outputDirectory, { recursive: true });
  run(ffmpeg, ffmpegArgs);
  const after = probeVideo(temporaryPath);
  renameSync(temporaryPath, outputPath);
  report.push({ ...entry, sourcePath, outputPath, before, after, startSeconds, durationSeconds });

  console.log(`  Result: ${after.video.width}x${after.video.height}, ${after.video.frameRate.toFixed(2)}fps, ${formatMegabytes(after.sizeBytes)}`);
}

if (!probeOnly && !dryRun) {
  const reportPath = join(outputDirectory, 'video-optimization-report.json');
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`\nReport: ${reportPath}`);
}

console.log(`\nProcessed ${report.length} video manifest entries${dryRun ? ' (dry run)' : ''}.`);
