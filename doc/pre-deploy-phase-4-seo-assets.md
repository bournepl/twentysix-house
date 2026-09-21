# Pre-deploy Phase 4: SEO Asset and Metadata Integrity

วันที่ตรวจรับ: 22 กันยายน 2026
สถานะ: เสร็จสมบูรณ์สำหรับ local production build

## ผลลัพธ์

- เปลี่ยน Organization schema logo จากไฟล์ต้นฉบับที่ถูก exclude เป็น `assets/img/seo/brand-mark-640.webp`
- เปลี่ยน watermark ของ shared menu ให้ใช้ optimized logo เดียวกัน
- เปลี่ยน fallback Open Graph image ใน `index.html` เป็น URL บน `twentysix.house`
- ย้ายภาพบทความ 5 รายการจาก Firebase token URLs มาเป็น local assets
- เพิ่มชื่อและคำอธิบาย SEO แบบย่อโดยไม่เปลี่ยนหัวข้อและข้อความที่ผู้ใช้อ่านบนหน้าเว็บ
- สร้าง social images ขนาด `1200×630` สำหรับบทความ 5 หน้า
- สร้าง social crop `1200×630` ให้บ้านคุณอ๊อด โดยไม่เปลี่ยนภาพ hero ที่แสดงบนหน้า
- ทำให้ BlogPosting schema ใช้ absolute image URL
- ลบ Firebase Storage URL ที่เหลือจาก component เก่า

## Social Image Inventory

| Asset | Size |
| --- | ---: |
| `blog-tropical-1200x630.webp` | 92.7 KiB |
| `blog-modern-1200x630.webp` | 68.7 KiB |
| `blog-modern-classic-1200x630.webp` | 178.4 KiB |
| `blog-concrete-1200x630.webp` | 70.0 KiB |
| `blog-foundation-1200x630.webp` | 29.5 KiB |
| `completed-khun-aod-1200x630.webp` | 87.6 KiB |

รวมประมาณ `526.9 KiB`

## Validator Guardrails

`tools/validate-prerender-site.mjs` ตรวจเพิ่มดังนี้:

- title ไม่เกิน 65 ตัวอักษร
- meta description ไม่เกิน 160 ตัวอักษร
- Open Graph และ Twitter metadata ต้องมีครบ
- title, description, canonical และ social metadata ต้องสอดคล้องกัน
- OG/Twitter image ต้องเป็น URL บน `https://twentysix.house`
- URL รูปต้องไม่มี query string หรือ hash
- ไฟล์รูปต้องมีจริงใน browser build
- social image ต้องกว้างอย่างน้อย 1200px สูงอย่างน้อย 600px และมีอัตราส่วน 1.5-2.1

`tools/validate-structured-data.mjs` ตรวจเพิ่มดังนี้:

- Organization logo ต้องใช้ optimized asset ที่กำหนด
- schema ต้องไม่มี Firebase token URL
- `image`, `logo`, `contentUrl` และ `thumbnailUrl` ต้องอยู่บนโดเมนเรา
- local schema assets ทุกไฟล์ต้องมีจริงใน browser build

## ผลการตรวจรับ

- Production build: ผ่าน และ prerender 36 routes
- Canonical routes ที่ตรวจ: 30
- Unique titles: 30
- BlogPosting: 5
- Broken links/orphan pages: 0
- Firebase Storage URL ใน prerender HTML: 0
- Local social/logo assets ทดสอบผ่าน HTTP `200 image/webp` ครบ 7 ไฟล์
- Prerender metadata validator: ผ่าน
- Structured data validator: ผ่าน
- Blog SEO validator: ผ่าน
- Media attributes audit: ผ่าน

## ข้อจำกัดที่ส่งต่อ

- ยังไม่ได้ส่ง Preview URL เข้า Google Rich Results Test เพราะเฟสนี้ไม่ deploy
- หลังมี Preview ใน Phase 7 ต้องตรวจ Rich Results, social share preview และ response ของ asset URLs จาก Vercel จริง
- Angular build ยังมี Sass deprecation warnings ซึ่งไม่เกี่ยวกับ metadata แต่ยังเป็น technical debt

## เงื่อนไขก่อน Production

1. Google Rich Results Test ต้องไม่มี blocking error
2. ตรวจ Open Graph preview อย่างน้อย Facebook และ LINE บน Preview/production URL
3. ตรวจว่า schema logo และ social images ตอบ `200` จาก Vercel
4. ห้าม deploy production จนกว่า Phase 0-6 จะผ่านครบ
