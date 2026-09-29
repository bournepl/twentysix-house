# Final SEO Audit ก่อนขึ้น Production

วันที่ตรวจ: 29 กันยายน 2569

## เป้าหมายหลัก

- Primary keyword: `รับสร้างบ้านอุดรธานี`
- Secondary keyword: `รับสร้างบ้านอุดร`
- Supporting keyword: `บริษัทรับสร้างบ้านอุดรธานี`
- Canonical domain: `https://twentysix.house`

## ผลตรวจหน้าแรก

- Title: `รับสร้างบ้านอุดรธานี | Twentysix House`
- Title length: 38 ตัวอักษร
- Meta description: 126 ตัวอักษร และมีคำว่า `บริษัทรับสร้างบ้านอุดรธานี`
- H1: มีหนึ่งตำแหน่งและเป็น `รับสร้างบ้านอุดรธานี`
- เนื้อหาช่วงต้นอธิบายบริการออกแบบ วางงบประมาณ ก่อสร้าง และส่งมอบบ้านอย่างเป็นธรรมชาติ
- Canonical ชี้ไป `https://twentysix.house`
- Robots เป็น `index, follow`
- LocalBusiness, Organization, WebSite และ WebPage structured data ถูกต้อง
- ระบุพื้นที่ให้บริการจังหวัดอุดรธานีและจังหวัดหนองคาย

ไม่เพิ่มคำหลักซ้ำโดยไม่จำเป็น เพราะ title, H1, description และเนื้อหาหลักครอบคลุม search intent แล้ว คำว่า `รับสร้างบ้านอุดร` เป็นส่วนหนึ่งของคำหลักเต็มและไม่จำเป็นต้องฝืนเขียนซ้ำเพื่อเอา exact match

## การรักษา SEO จากเว็บเดิม

- URL หลักเดิม `/home`, `/aboutus`, `/contactus`, `/collections` และ `/blogs/list` มี server-side 301
- URL แบบบ้านเดิม 4 หน้ามี 301 ไปหน้า House Catalog ใหม่แบบหนึ่งต่อหนึ่ง
- URL บทความเดิมแบบ ID มี 301 ไป canonical slug
- เพิ่ม 301 ให้หน้าผลงานสร้างจริงเดิม 10 หน้าไป `/ourworks/completed` เพื่อไม่ปล่อย URL ที่ Google เคยรู้จักเป็น 404
- Redirect ต้องคงไว้อย่างน้อย 1 ปี และควรเก็บไว้ถาวรถ้าไม่มีเหตุผลต้องนำออก

## ผลการทดสอบ

- Unit tests: 17/17 ผ่าน
- Production build: ผ่าน และ prerender สำเร็จ 38 routes
- Prerender SEO crawl: 32 canonical routes ผ่าน
- Titles: 32 รายการไม่ซ้ำกัน
- Broken internal links: ไม่พบ
- Orphan pages: ไม่พบ
- Structured data: 32 routes และ BlogPosting 5 หน้า ผ่าน
- Blog SEO: canonical 5 หน้า และ legacy redirects 10 รายการ ผ่าน
- Media SEO attributes: ผ่าน
- Security headers และ cache policy: ผ่าน
- HTTP release validation: 32 canonical pages, 33 redirects, robots, sitemap และ custom 404 ผ่าน

Build ยังมี Sass deprecation warnings จาก stylesheet รุ่นเก่า แต่ไม่ใช่ blocker สำหรับ SEO หรือ Production รอบนี้

## Checklist หลังขึ้น Production

1. ตรวจ `https://twentysix.house`, `robots.txt` และ `sitemap.xml` ด้วย HTTP validator อีกครั้ง
2. ตรวจ URL เก่าทั้งหมดว่าตอบ 301 ไปปลายทางที่ตั้งไว้
3. ส่ง `https://twentysix.house/sitemap.xml` ใน Google Search Console
4. ใช้ URL Inspection กับหน้าแรกและหน้าหลัก แล้วเลือก Test live URL
5. Request indexing หน้าแรก, About, Services, Our Works, House Catalog, Blog และ Contact
6. ตรวจ Page indexing, Manual actions และ Security issues
7. เปรียบเทียบ impressions และอันดับของคำว่า `รับสร้างบ้านอุดรธานี` เป็นรายสัปดาห์
8. หลีกเลี่ยงการเปลี่ยน URL, title หรือ H1 ซ้ำในช่วงที่ Google กำลังประมวลผลเว็บใหม่

## ข้อสรุป

โครงสร้าง SEO ของรุ่นใหม่พร้อมสำหรับคำหลัก `รับสร้างบ้านอุดรธานี` ในระดับ on-page และ technical SEO แต่ไม่มีระบบใดรับประกันอันดับได้ทันที หลัง Production ต้องให้ Google crawl และประมวลผลใหม่ พร้อมติดตามข้อมูลจริงจาก Search Console
