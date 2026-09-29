import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'source-media', 'ourworks');
const outputRoot = path.join(root, 'src', 'assets', 'img', 'ourworks');

const projects = {
  design: [
    ['khun-jane-ban-dung-design', '01 Khun Jen บ้านดุง', ['3.webp', '1.webp', '3.webp', '6.webp', '10.webp', '14.webp']],
    ['khun-preaw-design', '02 Khun Preaw', ['ปก.webp', 'ปก.webp', '00.webp', '01.webp', '02.webp', '03.webp']],
    ['khun-vijit-design', '03 Khun Vijit', ['ภาพย่อย - 1.webp', 'หน้าปก แนวนอน.webp', 'ภาพย่อย - 1.webp', 'ภาพย่อย - 2.webp', 'ภาพย่อย - 3.webp', 'Copy of หน้าปก แนวนอน - 2.webp']],
    ['khun-win-design', '04 Khun Win', ['final EX พี่วิน.webp', 'final EX พี่วิน.webp', '01.webp', '02.webp', '03.webp', '04.webp']],
    ['khun-fai-interior-design', '05 Khun fai', ['LINE_ALBUM_INTERIOR RERENDER_250602_1.webp', ...[1, 2, 3, 4, 5].map(number => `LINE_ALBUM_INTERIOR RERENDER_250602_${number}.webp`)]],
  ],
  completed: [
    ['khun-aod-residence', '02 PIC Khun Aod', ['2.webp', '2.webp', '0.webp', '1.webp', '10.webp', '11.webp']],
    ['khun-jane-ban-dung-residence', '04 PIC Khun Jane บ้านดุง', ['Copy of หน้าปก แนวนอน.zip - 2.webp', 'Copy of หน้าปก แนวนอน.zip - 2.webp', 'Copy of หน้าปก แนวนอน.zip - 1.webp', 'FB ย่อย เตรียมส่งมอบบ้านคุณเจน.zip - 1.webp', 'FB ย่อย เตรียมส่งมอบบ้านคุณเจน.zip - 3.webp', 'FB ย่อย เตรียมส่งมอบบ้านคุณเจน.zip - 5.webp']],
    ['khun-pui-residence', '07 PIC Khun Pui', ['40.webp', '01-Banner-3840x1920px.webp', '40.webp', '01.webp', '02.webp', '03.webp']],
    ['khun-tae-residence', '08 PIC Khun Tae', ['Banner-รับสร้างบ้านอุดรธานี Twentysix 2400x1200px.webp', 'Banner-รับสร้างบ้านอุดรธานี Twentysix 2400x1200px.webp', '0.webp', '00.webp', '01.webp', '02.webp']],
    ['khun-looknam-residence', '10 PIC Khun looknam', ['0000.webp', '0000.webp', '01.webp', '02.webp', '03.webp', '04.webp']],
    ['khun-chart-residence', '12 PIC Khun Chart', ['Banner-3840x1920px-บ้านคุณชาร์ท-หนองหาน - Copy.webp', 'Banner-3840x1920px-บ้านคุณชาร์ท-หนองหาน - Copy.webp', '00.webp', '01.webp', '02.webp', '03.webp']],
    ['khun-pla-residence', '13 PIC Khun Pla', ['ภาพย่อย - 3.webp', 'ภาพย่อย - 3.webp', 'ภาพย่อย - 1.webp', 'ภาพย่อย - 2.webp', 'ภาพย่อย - 4.webp', 'ภาพย่อย - 5.webp']],
  ],
};

const sizes = {
  card: { width: 960, height: 600, quality: 78 },
  hero: { width: 1920, height: 1080, quality: 82 },
  gallery: { width: 1600, height: 1000, quality: 80 },
};

const naturalFileOrder = new Intl.Collator('th', { numeric: true, sensitivity: 'base' });

async function render(source, destination, preset) {
  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize(preset.width, preset.height, { fit: 'cover', position: 'attention', withoutEnlargement: true })
    .webp({ quality: preset.quality, effort: 5 })
    .toFile(destination);
}

await rm(outputRoot, { recursive: true, force: true });

let generated = 0;
for (const [kind, entries] of Object.entries(projects)) {
  for (const [slug, sourceFolder, files] of entries) {
    const projectSource = path.join(sourceRoot, kind, sourceFolder);
    const projectOutput = path.join(outputRoot, kind, slug);
    const [cardSource, ...curatedGallerySources] = files;
    const gallerySources = (await readdir(projectSource, { withFileTypes: true }))
      .filter(entry => entry.isFile() && /\.(avif|jpe?g|png|webp)$/i.test(entry.name))
      .map(entry => entry.name)
      .sort(naturalFileOrder.compare);

    await render(path.join(projectSource, cardSource), path.join(projectOutput, 'card.webp'), sizes.card);
    await render(path.join(projectSource, curatedGallerySources[0]), path.join(projectOutput, 'hero.webp'), sizes.hero);
    generated += 2;

    for (const [index, file] of gallerySources.entries()) {
      const number = String(index + 1).padStart(2, '0');
      const source = path.join(projectSource, file);
      await render(source, path.join(projectOutput, `gallery-${number}.webp`), sizes.gallery);
      generated += 1;
    }
  }
}

// Posters are separate so the Home video carousel can share optimized artwork.
const posters = [
  ['khun-aod.webp', 'completed', '02 PIC Khun Aod', '0.webp'],
  ['khun-jane.webp', 'completed', '04 PIC Khun Jane บ้านดุง', 'Copy of หน้าปก แนวนอน.zip - 1 - Copy.webp'],
  ['khun-pui.webp', 'completed', '07 PIC Khun Pui', '01.webp'],
  ['khun-tae.webp', 'completed', '08 PIC Khun Tae', '0.webp'],
  ['khun-looknam.webp', 'completed', '10 PIC Khun looknam', '0.webp'],
];

for (const [output, kind, folder, file] of posters) {
  await render(path.join(sourceRoot, kind, folder, file), path.join(outputRoot, 'posters', output), sizes.card);
  generated += 1;
}

console.log(`Generated ${generated} optimized Our Works images in ${path.relative(root, outputRoot)}`);
