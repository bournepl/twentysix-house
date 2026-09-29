export interface HouseCatalogItem {
  slug: string;
  name: string;
  thaiName: string;
  collection: string;
  style: string;
  description: string;
  concept: string;
  coverImage: string;
  cardImage: string;
  gallery: string[];
  galleryThumbnails: string[];
  floorPlanImages: string[];
  floors?: number;
  usableArea?: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  kitchens: number;
  parking: number;
  landWidth?: number;
  landDepth?: number;
  startingBudget: number;
  priceDisclaimer: string;
  tags: string[];
  featured: boolean;
}

export interface HouseCatalogCollection {
  slug: string;
  name: string;
  thaiName: string;
  coverImage: string;
  heroImage: string;
  route: string;
  items: readonly HouseCatalogItem[];
}

const pureCollectionRoot = 'assets/img/house-catalog/pure-collection';
const yuPlearnRoot = `${pureCollectionRoot}/yu-plearn`;
const yuYenRoot = `${pureCollectionRoot}/yu-yen`;
const yuSabaiRoot = `${pureCollectionRoot}/yu-sabai`;
const yuSookRoot = `${pureCollectionRoot}/yu-sook`;

const numberedImages = (root: string, folder: 'gallery' | 'thumbnails', count: number): string[] =>
  Array.from({ length: count }, (_, index) =>
    `${root}/${folder}/${String(index + 1).padStart(2, '0')}.webp`
  );

export const HOUSE_CATALOG_ITEMS: readonly HouseCatalogItem[] = [
  {
    slug: 'yu-yen',
    name: 'Yu Yen',
    thaiName: 'อยู่-เย็น',
    collection: 'Pure Collection',
    style: 'Modern Minimal',
    description: 'บ้านชั้นเดียวขนาดกะทัดรัดที่จัดทุกพื้นที่อย่างคุ้มค่า โปร่ง โล่ง และเป็นมิตรกับการใช้ชีวิตในทุกช่วงวัย',
    concept: 'โถงกลางรับแสงธรรมชาติเต็มที่ เชื่อมพื้นที่พักผ่อนและพื้นที่ใช้งานให้เดินถึงกันง่าย พร้อมบรรยากาศอบอุ่นที่ช่วยให้บ้านขนาดพอดีอยู่สบายตลอดวัน',
    coverImage: `${yuYenRoot}/hero.webp`,
    cardImage: `${yuYenRoot}/card.webp`,
    gallery: numberedImages(yuYenRoot, 'gallery', 6),
    galleryThumbnails: numberedImages(yuYenRoot, 'thumbnails', 6),
    floorPlanImages: [`${yuYenRoot}/floor-plan.webp`],
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    livingRooms: 1,
    kitchens: 1,
    parking: 2,
    startingBudget: 3750000,
    priceDisclaimer: 'มูลค่าก่อสร้างอ้างอิงจากสื่อ Pure Collection และอาจเปลี่ยนแปลงตามวัสดุ ที่ดิน และขอบเขตงาน',
    tags: ['บ้านชั้นเดียว', 'ครอบครัวเริ่มต้น', 'Modern Minimal'],
    featured: true,
  },
  {
    slug: 'yu-plearn',
    name: 'Yu Plearn',
    thaiName: 'อยู่-เพลิน',
    collection: 'Pure Collection',
    style: 'Modern Luxury',
    description: 'บ้านที่เปิดรับธรรมชาติผ่านช่องแสงขนาดใหญ่และพื้นที่สูงโปร่ง เชื่อมบรรยากาศภายนอกเข้ากับชีวิตภายในบ้านอย่างลงตัว',
    concept: 'หน้าต่างสูงต่อเนื่องสองชั้นและทางเดินที่วางใกล้ช่องเปิดช่วยนำแสงเข้าสู่พื้นที่หลัก พร้อมสร้างมุมมองที่ทำให้สมาชิกในบ้านสัมผัสสวนและท้องฟ้าได้จากหลายจุด',
    coverImage: `${yuPlearnRoot}/hero.webp`,
    cardImage: `${yuPlearnRoot}/card.webp`,
    gallery: numberedImages(yuPlearnRoot, 'gallery', 11),
    galleryThumbnails: numberedImages(yuPlearnRoot, 'thumbnails', 11),
    floorPlanImages: [`${yuPlearnRoot}/floor-plan.webp`],
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    kitchens: 2,
    parking: 3,
    startingBudget: 5940000,
    priceDisclaimer: 'มูลค่าก่อสร้างอ้างอิงจากสื่อ Pure Collection และอาจเปลี่ยนแปลงตามวัสดุ ที่ดิน และขอบเขตงาน',
    tags: ['บ้านสองชั้น', 'Double Volume', 'Modern Luxury'],
    featured: true,
  },
  {
    slug: 'yu-sabai',
    name: 'Yu Sabai',
    thaiName: 'อยู่-สบาย',
    collection: 'Pure Collection',
    style: 'Modern Contemporary',
    description: 'บ้านร่วมสมัยสำหรับการใช้ชีวิตยุคใหม่ ใช้รูปทรงเรขาคณิตและเส้นสายแนวยาวสร้างบุคลิกที่เรียบ เท่ และโปร่งสบาย',
    concept: 'องค์ประกอบอาคารถูกจัดให้มีจังหวะที่ชัดเจน ช่องเปิดขนาดใหญ่รับแสงธรรมชาติและช่วยให้อากาศไหลเวียน โดยยังรักษาความเป็นส่วนตัวของพื้นที่พักผ่อน',
    coverImage: `${yuSabaiRoot}/hero.webp`,
    cardImage: `${yuSabaiRoot}/card.webp`,
    gallery: numberedImages(yuSabaiRoot, 'gallery', 11),
    galleryThumbnails: numberedImages(yuSabaiRoot, 'thumbnails', 11),
    floorPlanImages: [`${yuSabaiRoot}/floor-plan.webp`],
    floors: 2,
    bedrooms: 4,
    bathrooms: 4,
    livingRooms: 1,
    kitchens: 2,
    parking: 3,
    startingBudget: 9250000,
    priceDisclaimer: 'มูลค่าก่อสร้างอ้างอิงจากสื่อ Pure Collection และอาจเปลี่ยนแปลงตามวัสดุ ที่ดิน และขอบเขตงาน',
    tags: ['บ้านสองชั้น', 'ครอบครัวใหญ่', 'Modern Contemporary'],
    featured: true,
  },
  {
    slug: 'yu-sook',
    name: 'Yu Sook',
    thaiName: 'อยู่-สุข',
    collection: 'Pure Collection',
    style: 'Modern Open Plan',
    description: 'บ้านสำหรับครอบครัวใหญ่ที่ให้ทั้งความอบอุ่น ความเป็นส่วนตัว และพื้นที่ส่วนกลางที่เชื่อมทุกคนเข้าหากันอย่างเป็นธรรมชาติ',
    concept: 'ผังแบบ Open Plan เชื่อมพื้นที่ใช้งานหลักเข้าด้วยกัน ขณะเดียวกันยังแบ่งพื้นที่พักผ่อนอย่างสงบ เพื่อให้กิจกรรมร่วมกันและเวลาส่วนตัวอยู่ในบ้านหลังเดียวกันได้อย่างพอดี',
    coverImage: `${yuSookRoot}/hero.webp`,
    cardImage: `${yuSookRoot}/card.webp`,
    gallery: numberedImages(yuSookRoot, 'gallery', 11),
    galleryThumbnails: numberedImages(yuSookRoot, 'thumbnails', 11),
    floorPlanImages: [`${yuSookRoot}/floor-plan.webp`],
    floors: 2,
    bedrooms: 4,
    bathrooms: 5,
    livingRooms: 2,
    kitchens: 2,
    parking: 4,
    startingBudget: 11200000,
    priceDisclaimer: 'มูลค่าก่อสร้างอ้างอิงจากสื่อ Pure Collection และอาจเปลี่ยนแปลงตามวัสดุ ที่ดิน และขอบเขตงาน',
    tags: ['บ้านสองชั้น', 'ครอบครัวใหญ่', 'Open Plan'],
    featured: true,
  },
];

export const HOUSE_CATALOG_COLLECTIONS: readonly HouseCatalogCollection[] = [
  {
    slug: 'pure-collection',
    name: 'Pure Collection',
    thaiName: '4 แบบบ้านเพื่อการอยู่อาศัยที่ลงตัว',
    coverImage: `${yuPlearnRoot}/hero.webp`,
    heroImage: `${pureCollectionRoot}/collection-hero.webp`,
    route: '/house-catalog',
    items: HOUSE_CATALOG_ITEMS,
  },
];

export const ALL_HOUSE_CATALOG_ITEMS: readonly HouseCatalogItem[] =
  HOUSE_CATALOG_COLLECTIONS.flatMap(collection => collection.items);

export const findHouseCatalogItem = (slug: string): HouseCatalogItem | undefined =>
  ALL_HOUSE_CATALOG_ITEMS.find(item => item.slug === slug);
