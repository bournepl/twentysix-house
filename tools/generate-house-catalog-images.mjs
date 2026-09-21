import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'source-media', 'house-catalog', 'pure-collection');
const outputRoot = path.join(projectRoot, 'src', 'assets', 'img', 'house-catalog', 'pure-collection');

const houses = [
  {
    slug: 'yu-yen',
    folder: 'collection2 Yu  yen',
    cover: '3.webp',
    card: '1.webp',
    gallery: Array.from({ length: 6 }, (_, index) => `${index + 2}.webp`),
    floorPlan: 'Yu Yen 2.webp',
  },
  {
    slug: 'yu-plearn',
    folder: 'collection1 Yu  Plearn',
    cover: '2.webp',
    card: '1.webp',
    gallery: Array.from({ length: 11 }, (_, index) => `${index + 2}.webp`),
    floorPlan: 'Yu Plearn  2.webp',
  },
  {
    slug: 'yu-sabai',
    folder: 'collection3 Yu Sabai',
    cover: '3.webp',
    card: '1.webp',
    gallery: Array.from({ length: 11 }, (_, index) => `${index + 2}.webp`),
    floorPlan: 'Yu Sabai  2.webp',
  },
  {
    slug: 'yu-sook',
    folder: 'collection4 Yu Sook',
    cover: '3.webp',
    card: '1.webp',
    gallery: Array.from({ length: 11 }, (_, index) => `${index + 2}.webp`),
    floorPlan: 'Yu Sook 2.webp',
  },
];

const variants = {
  collection: { width: 1200, height: 750, fit: 'cover', quality: 78, background: '#03131f' },
  hero: { width: 1920, height: 1080, fit: 'cover', quality: 82, background: '#03131f' },
  card: { width: 960, height: 600, fit: 'cover', quality: 76, background: '#03131f' },
  gallery: { width: 1600, height: 1000, fit: 'contain', quality: 78, background: '#03131f' },
  thumbnail: { width: 320, height: 200, fit: 'contain', quality: 68, background: '#03131f' },
  floorPlan: { width: 1600, height: 1200, fit: 'contain', quality: 82, background: '#ffffff' },
};

async function render(source, destination, variant) {
  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({
      width: variant.width,
      height: variant.height,
      fit: variant.fit,
      position: 'centre',
      background: variant.background,
      withoutEnlargement: false,
    })
    .webp({ quality: variant.quality, effort: 5, smartSubsample: true })
    .toFile(destination);
}

await render(
  path.join(sourceRoot, 'รวม Col PURE (1).webp'),
  path.join(outputRoot, 'collection-card.webp'),
  variants.collection,
);

await render(
  path.join(sourceRoot, 'collection1 Yu  Plearn', '2.webp'),
  path.join(outputRoot, 'collection-hero.webp'),
  variants.hero,
);

for (const house of houses) {
  const houseSource = path.join(sourceRoot, house.folder);
  const houseOutput = path.join(outputRoot, house.slug);

  await render(path.join(houseSource, house.cover), path.join(houseOutput, 'hero.webp'), variants.hero);
  await render(path.join(houseSource, house.card), path.join(houseOutput, 'card.webp'), variants.card);
  await render(path.join(houseSource, house.floorPlan), path.join(houseOutput, 'floor-plan.webp'), variants.floorPlan);

  for (const [index, filename] of house.gallery.entries()) {
    const imageNumber = String(index + 1).padStart(2, '0');
    const source = path.join(houseSource, filename);
    await render(source, path.join(houseOutput, 'gallery', `${imageNumber}.webp`), variants.gallery);
    await render(source, path.join(houseOutput, 'thumbnails', `${imageNumber}.webp`), variants.thumbnail);
  }
}

console.log(`Generated optimized House Catalog images in ${outputRoot}`);
