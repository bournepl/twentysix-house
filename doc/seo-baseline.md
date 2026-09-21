# SEO Phase 0: Baseline

วันที่บันทึก: 18 กันยายน 2026

## ขอบเขต

Baseline นี้แยกเป็น 2 ส่วน:

1. เว็บไซต์ production `https://twentysix.house` และโปรเจกต์อ้างอิงที่มี SEO เดิม
2. โปรเจกต์ redesign ปัจจุบันก่อนเริ่ม SEO migration

## Production / Reference Baseline

### สิ่งที่ตรวจพบ

- Home canonical อยู่ที่ `/`
- Home title คือ `รับสร้างบ้านอุดรธานี | Twentysix House`
- Home มี H1 ที่สื่อ search intent ชัดเจน: `รับสร้างบ้านอุดรธานี ออกแบบและก่อสร้างบ้านครบวงจร`
- มีเนื้อหา Local SEO ระบุอุดรธานี บริการ ผลงานจริง และช่องทางติดต่อ
- Route หลักใช้ `/about`, `/services`, `/ourworks`, `/blogs`, `/contact`
- Blog ใช้ URL slug ที่อ่านได้
- Sitemap จาก reference implementation ครอบคลุม static page, project detail, house design detail และ active blog
- Reference server รองรับ 301, URL normalization และ HTTP 404 จริง
- Reference SEO service รองรับ canonical, robots, Open Graph, Twitter และ article metadata
- มี JSON-LD หลายชุดในหน้าเดียวผ่าน service ที่แยก script ID

### URL ที่พบจากข้อมูล reference

- Static canonical pages: 6
- Our Works list pages: 2
- Real Project detail pages: 10
- House Design detail pages: 4
- Active Blog detail pages: 5
- รวม URL ที่คาดว่าอยู่ใน sitemap: 27

### ข้อจำกัดของ baseline

- ยังไม่มีข้อมูล Google Search Console จึงยังยืนยัน clicks, impressions, CTR, average position และ indexed URL จริงไม่ได้
- ยังไม่ได้ตรวจ backlink profile และ Google Business Profile
- อันดับหน้า 1 อาจต่างตามพื้นที่ อุปกรณ์ และ personalization จึงต้องใช้ Search Console เป็นข้อมูลหลัก

## Redesign Project Baseline

### Deployment

- Platform: Vercel
- Rendering: Angular SSR ผ่าน `server.ts`
- `vercel.json` ส่งทุก route ไปยัง `server.ts`
- Build command: `npm run build:ssr`
- Production server entry: `dist/twentysix-house/server/server.mjs`

### สิ่งที่มีแล้ว

- Angular SSR และ prerender routes
- Our Works และ House Catalog มี canonical/meta implementation บางส่วน
- Invalid detail slug มี `noindex,follow` ใน component บางหน้า
- ภาพ Our Works และ House Catalog ถูก optimize เป็น WebP
- ข้อมูล Blog ทั้ง 5 รายการมี slug อยู่แล้ว
- Detail routes ของ Our Works และ House Catalog ถูกระบุใน `prerender-routes.txt`

### ช่องว่างที่พบ

| รายการ | สถานะก่อนแก้ | ความเสี่ยง |
|---|---|---|
| Home canonical | ใช้ `/home` และ root redirect ไป `/home` | สูญเสียความต่อเนื่องของ `/` |
| About URL | `/aboutus` | URL เดิม `/about` ไม่มีปลายทาง canonical ในแอปใหม่ |
| Contact URL | `/contactus` | URL เดิม `/contact` ไม่มีปลายทาง canonical ในแอปใหม่ |
| Blog detail | `/blogs/detail/:id` | Canonical เดิมแบบ slug หาย |
| Real Projects | เปลี่ยน path และ slug | ต้องทำ 301 รายโครงการ |
| House Designs | แยกไป `/house-catalog` | ต้องทำ 301 รายแบบบ้าน |
| Root wildcard | App routing ไม่มี explicit `**` | เสี่ยง route ไม่รู้จักถูก render แบบ 200 |
| Server route validation | ยังไม่ครอบคลุม Blog และ Our Works ทุกกรณี | เสี่ยง soft 404 และ sitemap ไม่ครบ |
| Sitemap | logic ปัจจุบันยังไม่ใช่ inventory ครบทุก dynamic route | Google อาจค้นพบหน้าไม่ครบหรือพบ parameter route |
| Robots endpoint | ยังไม่ยืนยัน implementation ใน Vercel server | Bot อาจไม่พบ sitemap declaration |
| SEO service | รองรับ structured data เพียง script เดียว | schema หลายประเภทเขียนทับกันได้ |
| Route metadata | หลายหน้าใช้ description/OG ชุดเก่าซ้ำกัน | relevance ต่ำและ metadata ค้างข้าม route ได้ |
| HTML language | `lang="en"` | ไม่ตรงกับเนื้อหาหลักภาษาไทย |
| Home heading | มี H1 มากกว่าหนึ่งตำแหน่ง | hierarchy ไม่ชัดเจน |

## Search Console Baseline ที่ต้องเติม

ช่วงข้อมูลแนะนำ: 3 เดือนล่าสุด และเทียบกับช่วง 3 เดือนก่อนหน้า

| Metric | ค่า | สถานะ |
|---|---:|---|
| Total clicks | TBD | รอ export |
| Total impressions | TBD | รอ export |
| Average CTR | TBD | รอ export |
| Average position | TBD | รอ export |
| Indexed pages | TBD | รอ export |
| Not indexed pages | TBD | รอ export |
| Top query | TBD | รอ export |
| Top landing page | TBD | รอ export |

ไฟล์ที่เหมาะสำหรับนำมาเติม baseline:

- Search results > Queries CSV
- Search results > Pages CSV
- Indexing > Pages export
- Sitemaps status
- Core Web Vitals export หรือ screenshot พร้อมวันที่

## Keyword Baseline ที่ควรติดตาม

- รับสร้างบ้านอุดรธานี
- บริษัทรับสร้างบ้านอุดรธานี
- ออกแบบบ้านอุดรธานี
- สร้างบ้านอุดรธานี
- ผู้รับเหมาสร้างบ้านอุดรธานี
- แบบบ้านอุดรธานี
- ผลงานสร้างบ้านอุดรธานี
- Twentysix House
- Twentysix.House

## เกณฑ์ป้องกันอันดับระหว่าง migration

- Organic clicks ของ URL เดิมไม่ควรลดต่อเนื่องโดยไม่มี impressions ย้ายไป destination
- จำนวน soft 404 และ duplicate canonical ต้องไม่เพิ่มหลัง deploy
- Google-selected canonical ต้องตรงกับ user-declared canonical
- Redirect URL ต้องถูกแทนที่ด้วย destination ใน index ตามลำดับ
- หน้าอันดับหลักต้องรักษา intent, H1 และเนื้อหาสำคัญของ production เดิมไว้

## Phase 0 Completion

- [x] ตรวจโครงสร้าง production/reference
- [x] ตรวจ routes และ dynamic data ของ redesign
- [x] สร้าง URL inventory
- [x] สร้าง redirect map ฉบับ technical
- [x] บันทึก technical baseline
- [ ] เติม Search Console baseline
- [ ] ยืนยัน mapping ของ Real Projects เดิมกับ Completed Homes ใหม่

Phase 0 พร้อมใช้เริ่ม Phase 1 ในส่วน URL ที่จับคู่แล้ว แต่ยังไม่ควร deploy redirect ของ Real Projects รายละเอียดจนกว่าจะยืนยัน mapping ครบ
