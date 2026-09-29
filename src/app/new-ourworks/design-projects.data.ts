export interface DesignProject {
  slug: string;
  title: string;
  style: string;
  scope: string;
  category: string;
  location: string;
  year: string;
  description: string;
  concept: string;
  image: string;
  heroImage: string;
  gallery: string[];
}

const designRoot = 'assets/img/ourworks/design';

function designImages(slug: string, galleryCount: number): Pick<DesignProject, 'image' | 'heroImage' | 'gallery'> {
  const root = `${designRoot}/${slug}`;
  return {
    image: `${root}/card.webp`,
    heroImage: `${root}/hero.webp`,
    gallery: Array.from(
      { length: galleryCount },
      (_, index) => `${root}/gallery-${String(index + 1).padStart(2, '0')}.webp`,
    ),
  };
}

const archivedDesignCodes = [
  'TWS002',
  'TWS006',
  'TWS007',
  'TWS008',
  'TWS010',
  'TWS011',
  'TWS012',
  'TWS014',
  'TWS015',
  'TWS016.1',
  'TWS017',
  'TWS021',
  'TWS022',
  'TWS023',
  'TWS024',
] as const;

const archivedDesignProjects: DesignProject[] = archivedDesignCodes.map(code => {
  const slug = code.toLowerCase().replace('.', '-');

  return {
    slug,
    title: `แบบบ้าน ${code}`,
    style: 'Residential Design',
    scope: 'Architecture Design',
    category: 'ออกแบบสถาปัตยกรรม',
    location: 'อุดรธานี',
    year: 'Design Archive',
    description: `ผลงานแบบบ้าน ${code} จากคลังผลงานออกแบบของ Twentysix House ซึ่งถ่ายทอดแนวคิดของบ้านพักอาศัยผ่านรูปทรงและการจัดฟังก์ชันที่ชัดเจน`,
    concept: 'เก็บรักษาผลงานออกแบบเดิมไว้เป็นแนวทางสำหรับผู้ที่กำลังมองหารูปแบบบ้าน และเป็นจุดเริ่มต้นสำหรับการนำไปพัฒนาให้เหมาะกับที่ดินและการใช้ชีวิตของแต่ละครอบครัว',
    ...designImages(slug, 1),
  };
});

export const DESIGN_PROJECTS: DesignProject[] = [
  {
    slug: 'khun-jane-ban-dung-design',
    title: 'แบบบ้านคุณเจน บ้านดุง',
    style: 'Modern Minimal Residence',
    scope: 'Architecture & Interior',
    category: 'ออกแบบบ้านและตกแต่งภายใน',
    location: 'บ้านดุง อุดรธานี',
    year: '2025',
    description: 'บ้านโมเดิร์นมินิมอลที่จัดพื้นที่ใช้งานให้ต่อเนื่อง เปิดรับแสงธรรมชาติ และสร้างบรรยากาศอบอุ่นสำหรับการใช้ชีวิตของครอบครัว',
    concept: 'แนวคิดเริ่มจากการลดทอนรูปทรงให้เรียบชัด แล้วเติมความอบอุ่นผ่านสัดส่วน ช่องเปิด และวัสดุ เพื่อให้บ้านดูสงบแต่ไม่เรียบจนขาดเอกลักษณ์',
    ...designImages('khun-jane-ban-dung-design', 25),
  },
  {
    slug: 'khun-preaw-design',
    title: 'แบบบ้านคุณแพรว',
    style: 'Minimal Modern Residence',
    scope: 'Interior Design',
    category: 'ออกแบบตกแต่งภายใน',
    location: 'อุดรธานี',
    year: '2025',
    description: 'งานออกแบบภายในโทนสว่างที่ลดรายละเอียดให้เรียบสงบ พร้อมวางฟังก์ชันและพื้นที่จัดเก็บให้เหมาะกับการใช้งานในทุกวัน',
    concept: 'พื้นที่ภายในถูกวางให้ใช้งานง่ายและเป็นระเบียบ โดยใช้แสง โทนสี และงานบิลต์อินสร้างความต่อเนื่องในบรรยากาศเดียวกันทั้งบ้าน',
    ...designImages('khun-preaw-design', 16),
  },
  {
    slug: 'khun-vijit-design',
    title: 'แบบบ้านคุณวิจิตร',
    style: 'Contemporary Residence',
    scope: 'Architecture Design',
    category: 'ออกแบบสถาปัตยกรรม',
    location: 'อุดรธานี',
    year: '2025',
    description: 'บ้านร่วมสมัยที่วางสัดส่วนอาคารอย่างสง่างาม เชื่อมพื้นที่ภายในกับบริบทภายนอก และตอบโจทย์การอยู่อาศัยระยะยาว',
    concept: 'มวลอาคารถูกแบ่งให้เกิดความโปร่งและมีมิติ พร้อมจัดตำแหน่งช่องเปิดและชายคาให้สัมพันธ์กับทิศทางแดด ลม และความเป็นส่วนตัว',
    ...designImages('khun-vijit-design', 6),
  },
  {
    slug: 'khun-win-design',
    title: 'แบบบ้านคุณวิน',
    style: 'Modern Luxury Residence',
    scope: 'Architecture & Interior',
    category: 'ออกแบบบ้านและตกแต่งภายใน',
    location: 'อุดรธานี',
    year: '2025',
    description: 'บ้าน Modern Luxury ที่เน้นเส้นสายชัดเจน พื้นที่โปร่ง และรายละเอียดวัสดุที่เรียบหรู โดยทุกองค์ประกอบถูกวางให้สัมพันธ์กันทั้งหลัง',
    concept: 'ความหรูถูกถ่ายทอดผ่านสัดส่วน พื้นผิว และแสงเงา มากกว่าการตกแต่งที่มากเกินไป ทำให้บ้านมีตัวตนชัดและยังคงอยู่สบายในทุกวัน',
    ...designImages('khun-win-design', 6),
  },
  {
    slug: 'khun-fai-interior-design',
    title: 'งานออกแบบบ้านคุณฝ้าย',
    style: 'Warm Contemporary Interior',
    scope: 'Interior & Built-in Design',
    category: 'ออกแบบภายในและบิลต์อิน',
    location: 'อุดรธานี',
    year: '2025',
    description: 'งานตกแต่งภายในและบิลต์อินที่ใช้โทนสีอบอุ่น จัดเก็บเป็นระเบียบ และใส่ใจรายละเอียดของพื้นที่เพื่อให้บ้านใช้งานได้อย่างสบาย',
    concept: 'วัสดุโทนอุ่นและเส้นสายเรียบถูกใช้สร้างบรรยากาศที่ผ่อนคลาย งานบิลต์อินทุกชิ้นจึงเป็นทั้งองค์ประกอบของพื้นที่และคำตอบของการใช้งานจริง',
    ...designImages('khun-fai-interior-design', 27),
  },
  {
    slug: 'khun-taew-design',
    title: 'งานออกแบบบ้านคุณแต้ว',
    style: 'Warm Contemporary Interior',
    scope: 'Interior & Built-in Design',
    category: 'ออกแบบภายในและบิลต์อิน',
    location: 'อุดรธานี',
    year: '2026',
    description: 'งานออกแบบภายในที่วางพื้นที่ใช้สอยให้โปร่งและต่อเนื่อง ใช้โทนสีอ่อน งานไม้ และรายละเอียดบิลต์อินสร้างบ้านที่อบอุ่นและเป็นระเบียบ',
    concept: 'แต่ละพื้นที่ถูกออกแบบให้ตอบโจทย์กิจวัตรของผู้อยู่อาศัย พร้อมควบคุมโทนวัสดุ แสง และเส้นสายให้เชื่อมต่อกันอย่างสงบตลอดทั้งบ้าน',
    ...designImages('khun-taew-design', 38),
  },
  ...archivedDesignProjects,
];
