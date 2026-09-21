# SEO Phase 8: Pre-launch Validation

วันที่ตรวจ: 21 กันยายน 2026

## สถานะ

Pre-deploy validation บน local production SSR ผ่านในส่วนที่ตรวจอัตโนมัติได้แล้ว ยังไม่ได้ deploy ไป Vercel และยังไม่ถือว่า Phase 8 เสร็จสมบูรณ์จนกว่าจะตรวจ preview/production และติดตามผลใน Google Search Console

## ผล Production Build

- Angular production SSR build: ผ่าน
- Prerender: 30 routes
- Initial browser bundle: 766.26 KB raw / 157.29 KB estimated transfer
- Public output: 606 files / 143.74 MB
- รูปภาพใน output: 49.80 MB
- วิดีโอใน output: 89.15 MB
- Production budget: ผ่าน

## ผลตรวจ Prerender HTML

- 30 canonical routes
- 30 title ที่ไม่ซ้ำกัน
- canonical, meta description, robots และ `lang="th"` ครบ
- ทุกหน้ามี H1 และ main landmark ตามเกณฑ์
- ไม่มี broken internal link
- ไม่มี orphan prerender page
- ปุ่มและลิงก์มี accessible name จาก text, label หรือ image alt
- ลิงก์ `target="_blank"` ใช้ `rel="noopener"`
- local image/srcset/poster ที่อ้างจาก HTML มีไฟล์อยู่ใน build
- preload รูปไม่เกินหนึ่งรายการต่อหน้า

คำสั่งตรวจ:

```bash
npm run seo:validate-prerender
```

## ผลตรวจ Structured Data และ Blog

- Structured data ผ่าน 30 routes
- BlogPosting ผ่าน 5 บทความ
- Blog canonical slug ผ่าน 5 บทความ
- Legacy blog redirect definitions ผ่าน 10 URL

คำสั่งตรวจ:

```bash
npm run seo:validate-structured-data
npm run seo:validate-blog
```

## ผลตรวจ Local SSR ผ่าน HTTP

- canonical route 30 URL ตอบ `200 text/html`
- redirect 23 test cases ตอบ `301` ไปปลายทางเดียว
- URL ไม่มีอยู่ตอบ `404 text/html`
- 404 มี `X-Robots-Tag: noindex, follow`
- `/robots.txt` ตอบ `200 text/plain`
- `/sitemap.xml` ตอบ `200 application/xml`
- sitemap มี canonical routes ครบ 30 URL
- WebP ตอบ `image/webp`
- MP4 ตอบ `video/mp4`

คำสั่งตรวจ:

```bash
npm run seo:validate-http -- http://localhost:4600
npm run seo:validate-blog -- dist/twentysix-house/browser http://localhost:4600
```

## ปัญหาที่พบและแก้ใน Phase 8

- เปลี่ยนโลโก้ใน shared menu จากต้นฉบับที่ถูก exclude เป็น WebP ที่อยู่ใน build
- เพิ่มขนาดและ decoding ให้โลโก้ shared menu/footer
- เพิ่ม `<main>` landmark ให้หน้า Home
- เอา `target="_blank"` ออกจากลิงก์โทรศัพท์ใน footer
- เพิ่ม crawler สำหรับ duplicate title, canonical, internal link, orphan page, accessibility ขั้นพื้นฐาน และ local asset
- เพิ่ม HTTP release test สำหรับ canonical, redirects, 404, robots, sitemap และ media content type

## งานที่ยังรอ

- Browser visual QA ไม่ได้รัน เพราะไม่มี browser backend ใน environment รอบนี้
- ตรวจ responsive และ interaction ที่ desktop/mobile บน Vercel preview
- ตรวจ accessibility ด้วย browser/axe และ keyboard navigation
- ตรวจ Rich Results ด้วย Google Rich Results Test บน URL ที่เข้าถึงได้
- Crawl Vercel preview เพื่อยืนยันว่า CDN/SSR ให้ผลเหมือน local
- วัด Lighthouse และ Core Web Vitals
- Redirect ผลงานจริงเก่า 10 URL ยังรอการจับคู่กับโครงการใหม่จากเจ้าของข้อมูล ห้ามเดาปลายทาง
- งานหลัง deploy ทั้งหมดใน roadmap ยังไม่ได้เริ่ม

## Go/No-Go

สถานะปัจจุบัน: **ผ่านสำหรับสร้าง Vercel preview แต่ยังไม่พร้อมประกาศ production launch**

เงื่อนไขก่อน production:

1. ตรวจหน้า Home, About, Services, House Catalog, Our Works, Blog และ Contact บน mobile/desktop
2. ทดสอบ menu, carousel, video, internal links และ scroll controls
3. ตรวจ Lighthouse/Core Web Vitals และแก้ regression สำคัญ
4. ยืนยัน redirect ผลงานจริงเก่าที่มี traffic/backlink
5. ตรวจ Vercel logs หลัง preview ก่อน promote production
