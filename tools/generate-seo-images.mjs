import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outputDirectory = path.resolve('src/assets/img/seo');

const images = [
  {
    source: 'src/assets/img/home/บ้านฮิมโขงปกเว็ป.png',
    name: 'home-hero',
    widths: [960, 1920],
  },
  {
    source: 'src/assets/img/photo11.jpg',
    name: 'about-hero',
    widths: [960, 1600],
  },
  {
    source: 'src/assets/img/Collection/collection5.jpg',
    name: 'services-hero',
    widths: [960, 1600],
  },
  {
    source: 'src/assets/img/photo2.jpg',
    name: 'contact-hero',
    widths: [960, 1440],
  },
  {
    source: 'src/assets/img/Collection/collection9.jpg',
    name: 'blog-hero',
    widths: [960, 1600],
  },
  {
    source: 'src/assets/img/Collection/collection7.jpg',
    name: 'consultation-cta',
    widths: [960, 1600],
  },
  {
    source: 'src/assets/img/home/LOGO.png',
    name: 'brand-mark',
    widths: [320, 640],
  },
  {
    source: 'src/assets/img/logobg.png',
    name: 'footer-brand',
    widths: [320],
  },
  ...[1, 2, 3, 4, 5, 6].map(number => ({
    source: `src/assets/img/house${number}.jpg`,
    name: `portfolio-house-${number}`,
    widths: [960],
  })),
];

const socialImages = [
  { source: 'src/assets/img/photo2.webp', name: 'blog-tropical' },
  { source: 'src/assets/img/collection16.webp', name: 'blog-modern' },
  { source: 'src/assets/img/photo15.jpg', name: 'blog-modern-classic' },
  { source: 'src/assets/img/blog_2.webp', name: 'blog-concrete' },
  { source: 'src/assets/img/blog_1.webp', name: 'blog-foundation' },
  {
    source: 'src/assets/img/ourworks/completed/khun-aod-residence/card.webp',
    name: 'blog-home-budget-udon',
  },
  {
    source: 'src/assets/img/ourworks/completed/khun-chart-residence/gallery-02.webp',
    name: 'blog-choose-home-builder-udon',
  },
  {
    source: 'src/assets/img/ourworks/completed/khun-pui-residence/card.webp',
    name: 'blog-build-home-process-udon',
  },
  {
    source: 'src/assets/img/ourworks/completed/khun-aod-residence/hero.webp',
    name: 'completed-khun-aod',
  },
];

await mkdir(outputDirectory, { recursive: true });

for (const image of images) {
  for (const width of image.widths) {
    const output = path.join(outputDirectory, `${image.name}-${width}.webp`);

    await sharp(path.resolve(image.source))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(output);

    console.log(`${image.source} -> ${path.relative(process.cwd(), output)}`);
  }
}

for (const image of socialImages) {
  const output = path.join(outputDirectory, `${image.name}-1200x630.webp`);

  await sharp(path.resolve(image.source))
    .rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  console.log(`${image.source} -> ${path.relative(process.cwd(), output)}`);
}

const faviconSource = path.resolve('src/assets/img/home/LOGO.png');
const faviconOutputs = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const favicon of faviconOutputs) {
  const output = path.join(outputDirectory, favicon.name);

  await sharp(faviconSource)
    .rotate()
    .resize({
      width: favicon.size,
      height: favicon.size,
      fit: 'contain',
      background: { r: 6, g: 29, b: 41, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(`${faviconSource} -> ${path.relative(process.cwd(), output)}`);
}
