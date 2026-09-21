# SEO Roadmap for Vercel SSR

## เป้าหมาย

ปรับเว็บไซต์ Twentysix.House เวอร์ชันใหม่ให้รักษาคุณค่าจากเว็บไซต์เดิมที่มีอันดับบน Google พร้อมวางระบบ SEO ที่รองรับ Home, Services, Our Works, House Catalog, Blog และหน้ารายละเอียดที่จะเพิ่มในอนาคต

เอกสารนี้อ้างอิงการ deploy ด้วย **Vercel + Angular SSR** โดย `vercel.json` ส่ง request ทั้งหมดเข้า `server.ts` ไม่ใช้แนวทางของ Firebase Hosting

## หลักสำคัญ

1. รักษา URL ที่ Google รู้จักอยู่แล้ว หรือ redirect ด้วย HTTP 301 แบบหนึ่งต่อหนึ่ง
2. ทุกหน้าที่ต้องการให้ Google จัดอันดับต้องมี HTML จาก SSR, status code, canonical และ metadata ที่ถูกต้อง
3. Sitemap ต้องสร้างจากข้อมูลจริง ไม่ใส่ URL parameter, redirect, หน้า 404 หรือหน้าที่ตั้ง `noindex`
4. Structured Data ต้องตรงกับเนื้อหาที่มองเห็นบนหน้าเว็บ
5. เปลี่ยนระบบทีละ Phase และตรวจสอบผลก่อนเริ่ม Phase ถัดไป

---

## Phase 0: Baseline และ URL Inventory

**เป้าหมาย:** บันทึกสถานะก่อนเปลี่ยน เพื่อไม่ทำอันดับและหน้าที่ Google index อยู่แล้วหายโดยไม่ตั้งใจ

**สถานะ:** กำลังดำเนินการ - technical inventory เสร็จแล้ว เหลือข้อมูล Search Console และยืนยันการจับคู่ Real Projects เดิม

### งาน

- [ ] Export URL และ performance จาก Google Search Console
- [ ] บันทึก query, landing page, clicks, impressions, CTR และ average position ย้อนหลังอย่างน้อย 3 เดือน
- [x] ดึง URL ทั้งหมดจาก sitemap logic และข้อมูลเว็บไซต์เดิม
- [ ] Crawl เว็บไซต์ production เพื่อเก็บ title, description, canonical, H1, status code และ structured data
- [ ] แบ่ง URL เป็น `keep`, `redirect`, `remove` และ `new`
- [x] สร้างตาราง redirect ฉบับ technical แบบหนึ่ง URL เดิมต่อหนึ่ง URL ใหม่
- [x] กำหนดรายการคำค้นหลักสำหรับบันทึก baseline เช่น `รับสร้างบ้านอุดรธานี`, `บริษัทรับสร้างบ้านอุดรธานี` และคำค้นแบรนด์

### ไฟล์ผลลัพธ์

- `doc/seo-url-inventory.md`
- `doc/seo-redirect-map.md`
- `doc/seo-baseline.md`

### Definition of Done

- ไม่มี URL เดิมใน sitemap หรือ Search Console ที่ยังไม่มีสถานะว่าจะเก็บ เปลี่ยน หรือยกเลิก
- URL ที่มี traffic หรือ backlink ต้องไม่ถูกลบโดยไม่มีปลายทาง 301 ที่เกี่ยวข้อง

---

## Phase 1: URL Migration และ HTTP Status

**เป้าหมาย:** รักษาสัญญาณอันดับของเว็บเดิมเมื่อเปิดเว็บเวอร์ชันใหม่

**สถานะ:** ดำเนินการส่วนที่ยืนยันแล้ว - เหลือ redirect รายโครงการของ Real Projects เดิม 10 URLs

### Canonical route ที่แนะนำ

| เนื้อหา | Canonical URL | URL ที่ควร 301 |
|---|---|---|
| หน้าแรก | `/` | `/home` |
| เกี่ยวกับเรา | `/about` | `/aboutus` |
| บริการ | `/services` | ไม่มีการเปลี่ยน |
| ผลงาน | `/ourworks` | `/collections` ถ้าไม่ได้ใช้เป็นหน้าจริง |
| ติดต่อเรา | `/contact` | `/contactus` |
| บทความ | `/blogs` | `/blogs/list` |
| บทความรายละเอียด | `/blogs/:slug` | `/blogs/detail/:id` |

เส้นทางรายละเอียด Our Works ต้องตัดสินจาก redirect map ใน Phase 0 โดยให้ความสำคัญกับการรักษา slug เดิม หากจำเป็นต้องใช้โครงสร้างใหม่ ให้ทำ 301 รายโครงการ ไม่ใช้ redirect รวมทุกหน้าไปหน้ารายการ

### งานใน Vercel SSR

- [x] เปลี่ยน root route ให้ render Home ที่ `/`
- [ ] เพิ่ม redirect registry ใน `server.ts` สำหรับ URL เดิมทั้งหมด (เหลือ Real Project detail 10 URLs)
- [x] ส่ง HTTP `301` พร้อม `Location` ที่เป็น canonical URL สำหรับ mapping ที่ยืนยันแล้ว
- [x] ลบ query tracking เช่น `utm_*` ออกจาก canonical แต่ไม่จำเป็นต้อง redirect ทุก query
- [x] ส่ง HTTP `404` จริงสำหรับ route และ slug ที่ไม่มีข้อมูล
- [x] หน้า not-found มี `noindex,follow`
- [x] ป้องกัน redirect chain และ redirect loop
- [x] กำหนดรูปแบบ trailing slash ให้เป็นแบบเดียวกันทั้งเว็บ

### Definition of Done

- URL เดิมทุก URL ตอบ `200` หรือ `301` ไปยังหน้าที่เกี่ยวข้อง
- Redirect ใช้สถานะ HTTP จริง ไม่ใช่ Angular client-side redirect
- URL ที่ไม่มีอยู่ตอบ `404` ไม่ใช่ `200`
- ทุกหน้ามี canonical ปลายทางเดียวและไม่มี redirect chain

---

## Phase 2: SEO Infrastructure กลาง

**เป้าหมาย:** ให้ทุกหน้าใช้ระบบ metadata เดียวกันและไม่เกิด tag ค้างเมื่อเปลี่ยน route

**สถานะ:** เสร็จแล้ว - ตรวจ SSR HTML และ prerender ผ่าน 30 routes

### งาน

- [x] ขยาย `src/app/shared/seo.service.ts` ให้รองรับ title, description, canonical, robots, Open Graph และ Twitter Card
- [x] รองรับ JSON-LD หลายชุดในหน้าเดียวโดยแยก script ID
- [x] ลบ managed meta และ JSON-LD เดิมก่อนใส่ข้อมูลของ route ใหม่
- [x] เพิ่มค่า default สำหรับ site name, locale `th_TH`, domain และ social image
- [x] รองรับ article metadata เช่น `article:published_time` และ `article:modified_time`
- [x] ให้ `AppComponent` อ่าน SEO config จาก activated route chain หลัง `NavigationEnd`
- [x] ให้ component รายละเอียดเป็นเจ้าของ SEO หลังโหลดข้อมูลจาก slug โดยไม่ถูก parent route เขียนทับ
- [x] เปลี่ยน `<html lang="en">` เป็น `<html lang="th">`
- [x] เลิกใช้ `meta keywords` เป็นแกนหลัก และคงรองรับเฉพาะหน้าที่มีข้อมูลประกอบ

### Definition of Done

- เปลี่ยนหน้าภายใน SPA แล้ว metadata ไม่มีค่าค้างจากหน้าก่อน
- View Source จาก SSR มี title, description, canonical, robots, OG และ Twitter ครบ
- หนึ่งหน้าสามารถมี Structured Data หลายประเภทโดยไม่เขียนทับกัน

---

## Phase 3: Robots, Sitemap และ Crawl Control

**เป้าหมาย:** ให้ Bot ค้นพบเฉพาะหน้าที่ควรถูก index ผ่าน Vercel production

**สถานะ:** พัฒนาและตรวจ local SSR เสร็จแล้ว - รอตรวจ Vercel production และส่งเข้า Google Search Console หลัง deploy

### งาน

- [x] เพิ่ม endpoint `/robots.txt` ใน `server.ts`
- [x] ระบุ `Sitemap: https://twentysix.house/sitemap.xml`
- [x] เพิ่ม endpoint `/sitemap.xml` ที่สร้างจาก static routes และข้อมูลจริง
- [x] รวม Blog slug, Completed Homes, Design Portfolio และ House Catalog detail ทุกหน้า
- [x] ไม่รวม redirect, wildcard, URL parameter, not-found และหน้าที่เป็น `noindex`
- [x] ใส่ `lastmod` จากวันที่แก้ข้อมูลจริงเมื่อมีข้อมูลรองรับ
- [x] ทำ XML escaping และ canonical normalization
- [x] ตั้ง Content-Type ให้ถูกต้องสำหรับ robots และ sitemap
- [x] ตรวจว่า sitemap ทุก URL ตอบ `200` และ canonical ตรงกับ URL ใน sitemap

### Definition of Done

- `/robots.txt` และ `/sitemap.xml` เข้าถึงได้บน Vercel production
- Sitemap ไม่มี URL เสีย, URL redirect หรือ URL ซ้ำ
- Google Search Console อ่าน sitemap สำเร็จ

---

## Phase 4: On-page SEO ทุกหน้าหลัก

**เป้าหมาย:** กำหนดหน้าที่รับผิดชอบแต่ละ search intent โดยไม่แย่งคำค้นกันเอง

**สถานะ:** เสร็จแล้ว - ตรวจ local SSR ผ่าน 30 canonical URLs

### งานร่วมทุกหน้า

- [x] มี H1 เพียงหนึ่งรายการ
- [x] Title และ description ไม่ซ้ำกัน
- [x] H1 ตรงกับเจตนาของหน้าและมีคำหลักอย่างเป็นธรรมชาติ
- [x] รูปสำคัญมี alt ที่อธิบายรูปจริง ไม่ยัดคำค้น
- [x] Breadcrumb ที่มองเห็นได้ตรงกับ `BreadcrumbList` ที่ใช้อยู่ใน Phase นี้
- [x] ลิงก์ภายในใช้ anchor text ที่บอกปลายทาง
- [x] ตรวจข้อความไทย การสะกดชื่อแบรนด์ และข้อมูล NAP ให้ตรงกัน

### Page intent ที่แนะนำ

| หน้า | Search intent หลัก |
|---|---|
| Home | รับสร้างบ้านอุดรธานีและภาพรวมแบรนด์ |
| About | ความน่าเชื่อถือ ประวัติ วิสัยทัศน์ และทีมงาน |
| Services | ออกแบบบ้าน รับสร้างบ้าน และขั้นตอนบริการ |
| Our Works | ผลงานออกแบบและผลงานบ้านสร้างจริง |
| House Catalog | แบบบ้าน ฟังก์ชัน พื้นที่ใช้สอย และงบเริ่มต้น |
| Blog | ความรู้เรื่องออกแบบ สร้างบ้าน งบประมาณ และการดูแลบ้าน |
| Contact | ที่อยู่ เบอร์โทร พื้นที่ให้บริการ และช่องทางติดต่อ |

### Definition of Done

- ทุกหน้าหลักผ่าน checklist title, description, canonical, robots, H1, OG image และ internal links
- Home เหลือ H1 เดียว
- หน้าแต่ละประเภทมี intent ชัดเจนและไม่ใช้ title/description ชุดเดียวกัน

---

## Phase 5: Structured Data

**เป้าหมาย:** อธิบาย entity และความสัมพันธ์ของเนื้อหาให้ Search Engine เข้าใจ โดยไม่สร้างข้อมูลเกินจริง

### Schema matrix

| หน้า | Structured Data |
|---|---|
| ทุกหน้า | `Organization` หรือ reference ไปยัง organization `@id` |
| Home | `LocalBusiness`, `WebSite`, `WebPage` และ `FAQPage` เฉพาะเมื่อมี FAQ บนหน้า |
| About | `AboutPage`, `Organization`, `BreadcrumbList` |
| Services | `Service`, `OfferCatalog`, `BreadcrumbList` |
| Our Works list | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| Project detail | `WebPage` หรือ `CreativeWork`, `ImageObject`, `BreadcrumbList` |
| House Catalog list | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| House Catalog detail | `Product` หรือ `CreativeWork` ตามลักษณะข้อเสนอจริง, `BreadcrumbList` |
| Blog list | `Blog`, `ItemList`, `BreadcrumbList` |
| Blog detail | `BlogPosting`, `BreadcrumbList` |
| Contact | `ContactPage`, `LocalBusiness`, `PostalAddress` |

### กติกา

- [x] ใช้ `@id` เดียวกันสำหรับบริษัททุกหน้า
- [x] ข้อมูลชื่อ ที่อยู่ โทรศัพท์ และ social profile ตรงกับข้อมูลที่แสดงบนหน้าเว็บ
- [x] ไม่เพิ่ม review, rating หรือ availability ที่ผู้ใช้มองไม่เห็น และใช้ราคาเฉพาะแบบบ้านที่แสดงราคาเริ่มต้นบนหน้า
- [x] BlogPosting มี headline, image, author, publisher, datePublished, dateModified และ mainEntityOfPage
- [x] ตรวจ JSON-LD จาก production prerender ครบทุก template ด้วย `npm run seo:validate-structured-data`
- [ ] ยืนยันข้อมูลกับ Google Business Profile และตรวจ public URL ด้วย Rich Results Test / Schema Markup Validator หลัง deploy ใน Phase 8

### Definition of Done

- ไม่มี syntax error หรือ schema field ที่ขัดกับข้อมูลบนหน้า
- รายการและรายละเอียดเชื่อมถึงกันด้วย URL canonical เดียวกัน

---

## Phase 6: Blog Slug และ Content Cluster

**เป้าหมาย:** ใช้บทความสร้าง topical authority และส่งความเกี่ยวข้องไปยังหน้าบริการและผลงาน

### งาน

- [x] เพิ่ม slug ที่อ่านเข้าใจได้และไม่เปลี่ยนตาม title โดยไม่จำเป็น
- [x] ใช้ canonical route `/blogs/:slug`
- [x] สร้าง lookup จาก legacy ID ไป slug เพื่อรองรับ 301
- [x] แยกกลุ่มเนื้อหาตามข้อมูลจริงเป็นแนวคิดการออกแบบ และโครงสร้าง/การก่อสร้าง
- [x] เชื่อมบทความไป Services, House Catalog, Completed Homes และ Contact ตามบริบท
- [x] เชื่อมหน้ารายละเอียดกลับไปยังบทความที่ช่วยตัดสินใจ
- [x] เพิ่ม related articles โดยให้น้ำหนัก topic, category และ tags จริง
- [x] กำหนด published/modified date และผู้เขียนอย่างสม่ำเสมอ

### Definition of Done

- ไม่มีบทความ production ที่ canonical เป็น URL แบบ ID
- URL เดิมของบทความ redirect ไป slug ที่ถูกต้อง
- ทุกบทความมี internal link ที่มีประโยชน์อย่างน้อยหนึ่งจุด

---

## Phase 7: Performance และ Media SEO

**เป้าหมาย:** รักษาคุณภาพภาพงานสถาปัตยกรรมโดยไม่ให้ Core Web Vitals เสีย

### งาน

- [x] กำหนด `width` และ `height` หรือ `aspect-ratio` ให้รูปและวิดีโอเพื่อลด CLS
- [x] Preload เฉพาะ hero/LCP image ของหน้าปัจจุบัน
- [x] รูปนอก viewport ใช้ lazy loading
- [x] สร้าง responsive `srcset` สำหรับภาพ card และ hero ที่มีขนาดต่างกันมาก
- [x] ใช้ WebP/AVIF และคงต้นฉบับไว้นอก public build เมื่อจำเป็น
- [x] ใส่ poster ให้ video และไม่ preload วิดีโอทุกคลิปพร้อมกัน
- [x] ตรวจ font loading, CSS/JS budget และ third-party scripts
- [ ] วัด LCP, CLS และ INP ทั้ง desktop/mobile บน production URL

### Definition of Done

- ไม่มี layout shift จาก media หลัก
- Hero ใช้ภาพขนาดเหมาะสมและไม่โหลดรูปทุก collection ตั้งแต่ first viewport
- Core Web Vitals ผ่านในหน้าหลักและ template รายละเอียดสำคัญ

**สถานะ:** งานปรับ source และ media audit เสร็จแล้ว ยังไม่ได้ build ตามคำสั่ง และเหลือวัด Core Web Vitals หลัง deploy รายละเอียดอยู่ที่ `doc/seo-phase-7-performance-media.md`

---

## Phase 8: Validation, Launch และ Monitoring

**เป้าหมาย:** เปิดเว็บใหม่โดยตรวจทั้ง SEO output และผลหลัง Google recrawl

### ก่อน deploy

- [x] รัน production SSR build
- [x] ตรวจ View Source ของทุก template ว่ามีเนื้อหาและ metadata จาก server
- [x] ทดสอบ redirect map แบบอัตโนมัติ
- [x] ทดสอบ status `200`, `301`, `404` และ content type
- [ ] Crawl staging/preview และแก้ duplicate title, missing canonical, orphan page และ broken link (local production SSR ผ่านแล้ว รอ Vercel preview)
- [ ] ตรวจ responsive, accessibility และ Rich Results (static accessibility และ JSON-LD ผ่านแล้ว รอ browser/Google tools)

### หลัง deploy

- [ ] ตรวจ Vercel logs สำหรับ SSR error และ 404 ที่ผิดปกติ
- [ ] ส่ง sitemap ใหม่ใน Google Search Console
- [ ] Request indexing เฉพาะหน้าหลักและหน้าที่เปลี่ยนสำคัญ
- [ ] ตรวจ Pages, Sitemaps, Core Web Vitals และ Enhancements
- [ ] เทียบ clicks, impressions และอันดับกับ baseline รายสัปดาห์
- [ ] รักษา redirect เดิมไว้อย่างน้อย 12 เดือน และควรเก็บระยะยาวหากยังมี traffic/backlink

### Definition of Done

- Production crawl ไม่มี canonical conflict, redirect chain, soft 404 หรือหน้าสำคัญที่เป็น `noindex`
- URL สำคัญเริ่มถูก Google เลือก canonical ตรงตามที่กำหนด
- มีรายงานก่อนและหลัง launch ที่เปรียบเทียบได้

**สถานะ:** Pre-deploy validation บน local production SSR ผ่านแล้ว ยังไม่ deploy และยังเหลือ visual QA, Vercel preview crawl, Core Web Vitals และงานหลัง launch รายละเอียดอยู่ที่ `doc/seo-phase-8-prelaunch-validation.md`

---

## ลำดับการลงมือทำ

1. Phase 0: ทำ URL inventory และ redirect map
2. Phase 1: แก้ route, 301 และ 404 ใน Vercel SSR
3. Phase 2: ทำ SEO service กลาง
4. Phase 3: ทำ robots และ sitemap
5. Phase 4: ปรับ SEO รายหน้า
6. Phase 5: เพิ่ม structured data
7. Phase 6: ปรับ blog slug และ internal linking
8. Phase 7: ตรวจ performance และ media
9. Phase 8: QA, deploy และติดตามผล

## ไฟล์หลักที่จะเกี่ยวข้อง

- `vercel.json`
- `server.ts`
- `src/index.html`
- `src/app/app-routing.module.ts`
- `src/app/app.component.ts`
- `src/app/shared/seo.service.ts`
- routing และ component ของ Blog, Our Works และ House Catalog
- `prerender-routes.txt`

## หมายเหตุเรื่อง Prerender และ SSR

Prerender ช่วยให้ route ที่รู้ล่วงหน้าส่ง HTML ได้เร็ว ส่วน SSR รองรับ route dynamic และการตอบ status/redirect ที่ถูกต้อง ทั้งสองอย่างใช้ร่วมกันได้บน Vercel แต่ต้องตรวจให้ canonical, metadata และ structured data ให้ผลเหมือนกัน ไม่ว่าจะถูก render ตอน build หรือ request time
