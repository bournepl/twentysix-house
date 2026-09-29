export interface CompletedHome {
  slug: string;
  title: string;
  style: string;
  type: string;
  year: string;
  location: string;
  description: string;
  concept: string;
  image: string;
  heroImage: string;
  socialImage?: string;
  gallery: string[];
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
}

const completedRoot = 'assets/img/ourworks/completed';

function completedImages(slug: string, galleryCount: number): Pick<CompletedHome, 'image' | 'heroImage' | 'gallery'> {
  const root = `${completedRoot}/${slug}`;
  return {
    image: `${root}/card.webp`,
    heroImage: `${root}/hero.webp`,
    gallery: Array.from(
      { length: galleryCount },
      (_, index) => `${root}/gallery-${String(index + 1).padStart(2, '0')}.webp`,
    ),
  };
}

export const COMPLETED_HOMES: CompletedHome[] = [
  {
    slug: 'khun-aod-residence',
    title: 'บ้านคุณอ๊อด',
    style: 'Modern Classic Residence',
    type: 'บ้านสองชั้น',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้านสไตล์ Modern Classic ที่ผสานเส้นสายร่วมสมัยกับรายละเอียดคลาสสิก พร้อมพื้นที่ใช้งานสำหรับครอบครัวอย่างครบถ้วน',
    concept: 'ออกแบบให้ความสง่างามและการใช้งานจริงอยู่ร่วมกัน ผ่านสัดส่วนอาคารที่ชัดเจน ช่องเปิดรับแสง และพื้นที่ส่วนกลางที่เชื่อมสมาชิกในบ้านเข้าหากัน',
    ...completedImages('khun-aod-residence', 65),
    socialImage: 'assets/img/seo/completed-khun-aod-1200x630.webp',
    area: 320, bedrooms: 4, bathrooms: 5, parking: 3,
  },
  {
    slug: 'khun-jane-ban-dung-residence',
    title: 'บ้านคุณเจน บ้านดุง',
    style: 'Modern Minimal Residence',
    type: 'บ้านชั้นเดียว',
    year: '2025',
    location: 'บ้านดุง อุดรธานี',
    description: 'บ้านชั้นเดียวรูปทรงเรียบสะอาด ใช้อิฐและโทนสีขาวสร้างความอบอุ่น พร้อมจัดฟังก์ชันให้เชื่อมต่อกันอย่างเป็นธรรมชาติ',
    concept: 'ความเรียบง่ายถูกใช้เพื่อทำให้บ้านดูแลสะดวกและอยู่สบาย พื้นที่ทุกส่วนจึงถูกวางให้เดินถึงกันง่าย พร้อมเปิดมุมมองสู่สวนรอบบ้าน',
    ...completedImages('khun-jane-ban-dung-residence', 10),
    area: 185, bedrooms: 3, bathrooms: 2, parking: 2,
  },
  {
    slug: 'khun-pui-residence',
    title: 'บ้านคุณปุ้ย',
    style: 'Modern & Cozy Residence',
    type: 'บ้านสองชั้น',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้าน Modern & Cozy ที่เน้นความโปร่งสบาย เลือกใช้วัสดุโทนธรรมชาติ และจัดพื้นที่ให้เหมาะกับการใช้ชีวิตของทุกคนในบ้าน',
    concept: 'แสงธรรมชาติ วัสดุที่ให้สัมผัสอบอุ่น และพื้นที่ส่วนกลางขนาดพอดี ช่วยสร้างบ้านที่ทันสมัยโดยยังคงบรรยากาศผ่อนคลาย',
    ...completedImages('khun-pui-residence', 41),
    area: 240, bedrooms: 4, bathrooms: 3, parking: 2,
  },
  {
    slug: 'khun-tae-residence',
    title: 'บ้านคุณเต้',
    style: 'Contemporary Residence',
    type: 'บ้านสองชั้น',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้าน Modern Style ที่จัดองค์ประกอบอาคารอย่างชัดเจน ผสานช่องเปิดและระแนงเพื่อควบคุมแสงและสร้างความเป็นส่วนตัว',
    concept: 'เปลือกอาคารทำหน้าที่ทั้งสร้างเอกลักษณ์และตอบโจทย์สภาพอากาศ ช่วยกรองแสง เพิ่มความเป็นส่วนตัว และทำให้พื้นที่ภายในสบายขึ้น',
    ...completedImages('khun-tae-residence', 65),
    area: 280, bedrooms: 4, bathrooms: 4, parking: 2,
  },
  {
    slug: 'khun-looknam-residence',
    title: 'บ้านคุณลูกน้ำ',
    style: 'Modern Living Residence',
    type: 'บ้านชั้นเดียว',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้าน Nordic Style ที่โดดเด่นด้วยหลังคาทรงสูงและพื้นที่ส่วนกลางสว่างโปร่ง ออกแบบให้บรรยากาศภายในอบอุ่นและอยู่สบาย',
    concept: 'หลังคาทรงสูงและช่องเปิดที่สัมพันธ์กันช่วยให้พื้นที่หลักดูโปร่ง ขณะที่การเลือกวัสดุและโทนสีช่วยรักษาความอบอุ่นในทุกมุมของบ้าน',
    ...completedImages('khun-looknam-residence', 61),
    area: 165, bedrooms: 3, bathrooms: 2, parking: 2,
  },
  {
    slug: 'khun-chart-residence',
    title: 'บ้านคุณชาติ',
    style: 'Modern Family Residence',
    type: 'บ้านชั้นเดียว',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้านชั้นเดียวสำหรับครอบครัวที่วางพื้นที่ใช้สอยไว้อย่างเป็นสัดส่วน ใช้เส้นสายแนวนอนช่วยให้ตัวบ้านดูสงบและร่วมสมัย',
    concept: 'ผังบ้านเน้นความชัดเจนในการใช้งาน แยกพื้นที่พักผ่อนและพื้นที่ส่วนรวมอย่างเหมาะสม พร้อมชายคาที่ช่วยดูแลบ้านในสภาพอากาศร้อนชื้น',
    ...completedImages('khun-chart-residence', 27),
    area: 210, bedrooms: 3, bathrooms: 3, parking: 2,
  },
  {
    slug: 'khun-pla-residence',
    title: 'บ้านคุณปลา',
    style: 'Contemporary Family Home',
    type: 'บ้านชั้นเดียว',
    year: '2025',
    location: 'อุดรธานี',
    description: 'บ้านร่วมสมัยที่เปิดพื้นที่ภายในสู่สวนและลานพักผ่อน ใช้ชายคาและช่องเปิดขนาดใหญ่ให้เหมาะกับสภาพอากาศและชีวิตประจำวัน',
    concept: 'พื้นที่ภายในและภายนอกถูกออกแบบให้ต่อเนื่องกัน เพื่อให้กิจกรรมของครอบครัวขยายออกสู่สวนได้ พร้อมรับลมและแสงอย่างพอดี',
    ...completedImages('khun-pla-residence', 25),
    area: 190, bedrooms: 3, bathrooms: 2, parking: 2,
  },
];
