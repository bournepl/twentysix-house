export type BlogTopic = 'design-and-living' | 'construction-structure' | 'home-planning';

export interface BlogResourceLink {
  title: string;
  description: string;
  path: string;
}

export interface HelpfulArticle {
  slug: string;
  title: string;
  summary: string;
  topic: BlogTopic;
}

const DESIGN_TOPIC: BlogTopic = 'design-and-living';
const STRUCTURE_TOPIC: BlogTopic = 'construction-structure';
const PLANNING_TOPIC: BlogTopic = 'home-planning';

export const BLOG_TOPIC_LABELS: Record<BlogTopic, string> = {
  [DESIGN_TOPIC]: 'แนวคิดการออกแบบและการอยู่อาศัย',
  [STRUCTURE_TOPIC]: 'โครงสร้างและการก่อสร้าง',
  [PLANNING_TOPIC]: 'วางแผนก่อนเริ่มสร้างบ้าน',
};

const articles: readonly HelpfulArticle[] = [
  {
    slug: 'บ้านแนวทรอปิคอล-ออกแบบให้อยู่สบายกับอากาศเมืองไทย',
    title: 'บ้านแนวทรอปิคอล: ออกแบบให้อยู่สบายกับอากาศเมืองไทย',
    summary: 'ทำความเข้าใจการวางช่องเปิด ชายคา และพื้นที่ให้เหมาะกับอากาศเมืองไทย',
    topic: DESIGN_TOPIC,
  },
  {
    slug: 'บ้านโมเดิร์น-รูปแบบบ้านเรียบง่ายที่ตอบโจทย์การใช้ชีวิตจริง',
    title: 'บ้านโมเดิร์น: รูปแบบบ้านเรียบง่ายที่ตอบโจทย์การใช้ชีวิตจริง',
    summary: 'ดูแนวคิดการลดทอนรูปทรงและจัดฟังก์ชันให้บ้านใช้งานง่ายในทุกวัน',
    topic: DESIGN_TOPIC,
  },
  {
    slug: 'บ้านโมเดิร์นคลาสสิก-ความเรียบหรูที่ยังอยู่สบายในระยะยาว',
    title: 'บ้านโมเดิร์นคลาสสิก: ความเรียบหรูที่ยังอยู่สบายในระยะยาว',
    summary: 'รู้จักสมดุลระหว่างรายละเอียดคลาสสิกกับฟังก์ชันร่วมสมัย',
    topic: DESIGN_TOPIC,
  },
  {
    slug: 'คอนกรีต-วัสดุหลักที่เจ้าของบ้านควรรู้ก่อนเริ่มก่อสร้าง',
    title: 'คอนกรีต: วัสดุหลักที่เจ้าของบ้านควรรู้ก่อนเริ่มก่อสร้าง',
    summary: 'เข้าใจหน้าที่และประเด็นสำคัญของคอนกรีตก่อนเริ่มงานก่อสร้าง',
    topic: STRUCTURE_TOPIC,
  },
  {
    slug: 'เสาเข็มตอก-เสาเข็มเจาะ-และฐานราก-ต่างกันอย่างไร',
    title: 'เสาเข็มตอก เสาเข็มเจาะ และฐานราก ต่างกันอย่างไร?',
    summary: 'เปรียบเทียบระบบฐานรากและข้อควรรู้ก่อนเลือกให้เหมาะกับพื้นที่',
    topic: STRUCTURE_TOPIC,
  },
  {
    slug: 'สร้างบ้านอุดรธานีใช้งบเท่าไร-วางแผนก่อนเริ่มสร้าง',
    title: 'สร้างบ้านที่อุดรธานีใช้งบเท่าไร? วางแผนอย่างไรก่อนเริ่มสร้าง',
    summary: 'แยกงบตัวบ้าน งานภายนอก วัสดุ และเงินสำรองให้ครบก่อนเริ่มออกแบบ',
    topic: PLANNING_TOPIC,
  },
  {
    slug: 'เลือกบริษัทรับสร้างบ้านอุดรธานีอย่างไรให้มั่นใจ',
    title: 'เลือกบริษัทรับสร้างบ้านอุดรธานีอย่างไร ให้ได้งานตรงแบบและคุมงบได้',
    summary: 'ตรวจผลงาน BOQ สัญญา ทีมควบคุม และการรับประกันก่อนตัดสินใจ',
    topic: PLANNING_TOPIC,
  },
  {
    slug: 'มีที่ดินแล้วเริ่มสร้างบ้านในอุดรธานีอย่างไร',
    title: 'มีที่ดินแล้ว เริ่มสร้างบ้านในอุดรธานีอย่างไร? ตั้งแต่สำรวจถึงส่งมอบ',
    summary: 'เรียงขั้นตอนจากสำรวจที่ดิน วางงบ ออกแบบ ขออนุญาต จนถึงตรวจรับบ้าน',
    topic: PLANNING_TOPIC,
  },
];

const resourcesByTopic: Record<BlogTopic, readonly BlogResourceLink[]> = {
  [DESIGN_TOPIC]: [
    {
      title: 'สำรวจแบบบ้านของเรา',
      description: 'ดู Pure Collection พร้อมฟังก์ชัน จำนวนห้อง และงบประมาณเริ่มต้นที่แสดงบนแต่ละแบบ',
      path: '/house-catalog',
    },
    {
      title: 'ชมผลงานออกแบบ',
      description: 'ดูวิธีที่ทีมพัฒนาแนวคิด รูปทรง พื้นที่ และวัสดุจากโจทย์ของเจ้าของบ้านจริง',
      path: '/ourworks/design',
    },
    {
      title: 'ดูบริการออกแบบและก่อสร้าง',
      description: 'ทำความเข้าใจขอบเขตงานและขั้นตอนตั้งแต่รับโจทย์จนถึงส่งมอบบ้าน',
      path: '/services',
    },
    {
      title: 'ปรึกษาเรื่องแบบบ้าน',
      description: 'ส่งข้อมูลที่ดิน ฟังก์ชัน และงบประมาณเพื่อเริ่มวางแนวทางกับทีม',
      path: '/contact',
    },
  ],
  [STRUCTURE_TOPIC]: [
    {
      title: 'ดูขั้นตอนการทำงาน',
      description: 'เข้าใจลำดับการวางแผน ออกแบบ ก่อสร้าง ตรวจสอบ และส่งมอบอย่างเป็นระบบ',
      path: '/services',
    },
    {
      title: 'ชมผลงานบ้านสร้างจริง',
      description: 'ดูบ้านที่ก่อสร้างและส่งมอบแล้ว พร้อมข้อมูลพื้นที่ใช้สอยและฟังก์ชันหลัก',
      path: '/ourworks/completed',
    },
    {
      title: 'เลือกแบบบ้านเพื่อเริ่มวางงบ',
      description: 'เปรียบเทียบฟังก์ชันและงบประมาณเริ่มต้นของแบบบ้านแต่ละหลัง',
      path: '/house-catalog',
    },
    {
      title: 'ปรึกษาทีมก่อนเริ่มก่อสร้าง',
      description: 'พูดคุยเรื่องที่ดิน แบบบ้าน งบประมาณ และคำถามด้านงานก่อสร้าง',
      path: '/contact',
    },
  ],
  [PLANNING_TOPIC]: [
    {
      title: 'เปรียบเทียบแบบบ้านและงบตั้งต้น',
      description: 'ดูฟังก์ชัน จำนวนห้อง และงบประมาณเริ่มต้นของ Pure Collection เพื่อเตรียมโจทย์ก่อนคุยกับทีม',
      path: '/house-catalog',
    },
    {
      title: 'ดูบริการและขั้นตอนการทำงาน',
      description: 'ทำความเข้าใจลำดับงานตั้งแต่รับโจทย์ สำรวจ ออกแบบ ก่อสร้าง ไปจนถึงส่งมอบบ้าน',
      path: '/services',
    },
    {
      title: 'ตรวจสอบผลงานบ้านสร้างจริง',
      description: 'ชมบ้านที่ก่อสร้างและส่งมอบแล้ว พร้อมข้อมูลพื้นที่ใช้สอยและฟังก์ชันของแต่ละโครงการ',
      path: '/ourworks/completed',
    },
    {
      title: 'เริ่มประเมินโครงการของคุณ',
      description: 'ส่งข้อมูลที่ดิน ฟังก์ชัน และงบประมาณ เพื่อพูดคุยแนวทางเบื้องต้นกับทีม Twentysix House',
      path: '/contact',
    },
  ],
};

export function getBlogTopic(slug: string): BlogTopic {
  return articles.find(article => article.slug === slug)?.topic ?? DESIGN_TOPIC;
}

export function getBlogTopicLabel(slug: string): string {
  return BLOG_TOPIC_LABELS[getBlogTopic(slug)];
}

export function getBlogResourceLinks(slug: string): readonly BlogResourceLink[] {
  return resourcesByTopic[getBlogTopic(slug)];
}

export function getHelpfulArticles(
  style = '',
  options: { includeConstruction?: boolean; limit?: number } = {},
): readonly HelpfulArticle[] {
  const normalizedStyle = style.toLowerCase();
  const preferredDesignSlug = normalizedStyle.includes('classic')
    ? 'บ้านโมเดิร์นคลาสสิก-ความเรียบหรูที่ยังอยู่สบายในระยะยาว'
    : normalizedStyle.includes('tropical') || normalizedStyle.includes('nordic')
      ? 'บ้านแนวทรอปิคอล-ออกแบบให้อยู่สบายกับอากาศเมืองไทย'
      : 'บ้านโมเดิร์น-รูปแบบบ้านเรียบง่ายที่ตอบโจทย์การใช้ชีวิตจริง';
  const preferred = articles.find(article => article.slug === preferredDesignSlug);
  const candidates = [
    preferred,
    ...(options.includeConstruction === false
      ? articles.filter(article => article.topic === DESIGN_TOPIC)
      : articles.filter(article => article.topic === STRUCTURE_TOPIC)),
    ...articles,
  ].filter((article): article is HelpfulArticle => Boolean(article));
  const unique = candidates.filter((article, index, list) =>
    list.findIndex(item => item.slug === article.slug) === index
  );

  return unique.slice(0, options.limit ?? 2);
}
