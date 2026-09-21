# Pre-deploy Phase 5: Security Headers and Cache Policy

วันที่ตรวจรับ: 22 กันยายน 2026
สถานะ: เสร็จสมบูรณ์สำหรับ local production และ Vercel build

## ผลลัพธ์

- ปิด Express `X-Powered-By` ทั้ง SSR handler และ local release server
- เพิ่ม Content Security Policy ที่จำกัด resource ไว้กับเว็บไซต์และ Google Fonts ที่ใช้งานจริง
- ปิดการฝังเว็บผ่าน `frame-ancestors 'none'` และ `X-Frame-Options: DENY`
- ปิด object/embed ผ่าน `object-src 'none'`
- เพิ่ม `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` และ HSTS
- กำหนด HTML และ 404 เป็น `private, no-store`
- แยก cache ระหว่าง hashed bundles, hashed fonts/media และไฟล์ชื่อคงที่
- ลด browser cache ของวิดีโอจากนโยบายเดิมที่มี CDN TTL 1 ปี เหลือ browser 1 ชั่วโมงและ Vercel CDN 1 วัน
- เพิ่ม validator สำหรับ config และ HTTP response จริง

## Security Headers

| Header | Policy |
| --- | --- |
| `Content-Security-Policy` | self-first, ปิด object/frame, อนุญาต Google Fonts และ data/blob เฉพาะชนิดที่จำเป็น |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | ปิด camera, microphone, geolocation, payment และ USB |
| `Strict-Transport-Security` | 2 ปี พร้อม `includeSubDomains` |

`script-src` และ `style-src` ยังมี `'unsafe-inline'` เพราะ Angular production output ใช้ inline critical CSS, component styles และ `onload` สำหรับ stylesheet optimization หากตัดออกทันที style และ hydration บางส่วนอาจเสีย การย้ายไป nonce/hash CSP ควรทำเป็นงานแยกหลังเปิด Preview และมี browser console สำหรับตรวจ violation

ไม่ได้ใช้ `upgrade-insecure-requests` ใน CSP เพื่อให้ local HTTP development ทำงานตามปกติ โดย production บังคับ HTTPS ผ่าน Vercel และ HSTS อยู่แล้ว

## Cache Matrix

| Resource | Browser Cache |
| --- | --- |
| SSR HTML และ 404 | `private, no-store` |
| `main-*`, `polyfills-*`, `chunk-*`, `styles-*` | 1 ปี, `immutable` |
| `/media/*` ซึ่ง Angular ตั้งชื่อด้วย content hash | 1 ปี, `immutable` |
| `/assets/*` ที่ชื่อไฟล์คงที่ | 1 ชั่วโมง, `must-revalidate` |
| `/assets/videos/*` | Browser 1 ชั่วโมง, Vercel CDN 1 วัน |
| `/favicon.ico` | 1 ชั่วโมง, `must-revalidate` |
| `robots.txt` และ `sitemap.xml` | Browser 1 ชั่วโมง, Vercel cache 1 วันตาม SSR response |

ไฟล์ชื่อคงที่ไม่มี `immutable` หรือ browser cache 1 ปี จึงสามารถเปลี่ยนเนื้อหาโดยใช้ชื่อเดิมได้โดยไม่ค้างระยะยาว

## Guardrails

- `npm run security:validate` ตรวจ `vercel.json`, CSP, HSTS, cache tiers และการปิด `X-Powered-By`
- `npm run seo:validate-http -- <base-url>` ตรวจ headers จริงของ canonical routes, redirects, 404, รูป, วิดีโอ, hashed JS/CSS และ hashed font/media
- `tools/serve-ssr.mjs` จำลอง security/cache policy ของ Vercel สำหรับ local release test
- Vercel CLI build ใช้ยืนยันว่า source patterns ถูก compile เป็น route regex ที่ match output ของ Angular จริง

## ผลการตรวจรับ

- Angular production build: ผ่าน และ prerender 36 routes
- Vercel local build: ผ่าน โดยไม่มีการ deploy
- Vercel compiled header routes: ผ่าน
- HTTP release validation: ผ่าน 30 canonical pages, 23 redirects, robots, sitemap และ 404
- Prerender crawl: ผ่าน 30 routes, 30 unique titles, ไม่มี broken links หรือ orphan pages
- Security policy validator: ผ่าน
- `X-Powered-By`: ไม่พบใน response ที่ตรวจ
- Fixed-name assets: ไม่พบ cache 1 ปีหรือ `immutable`

## ข้อจำกัดที่ส่งต่อ

- Browser automation ไม่พร้อมใช้งานในรอบตรวจนี้ จึงยังไม่ได้ตรวจ CSP violation ใน browser console
- ต้องตรวจ response headers จาก Vercel Preview จริง เพราะ Vercel อาจประมวลผล CDN-specific headers ก่อนส่งถึง client
- Vercel Preview Toolbar อาจต้องใช้ CSP เพิ่มเติมหากเปิดใช้งาน แต่ไม่ใช่ dependency ของเว็บไซต์
- HSTS ต้องยืนยันอีกครั้งบน production domain แม้ Vercel มี HSTS เริ่มต้นและโครงการกำหนด policy ไว้เองแล้ว
- Angular build ยังมี Sass deprecation warnings เดิม ซึ่งไม่ใช่ blocking issue ของ Phase 5

## เอกสารอ้างอิง

- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel Cache-Control headers](https://vercel.com/docs/caching/cache-control-headers)
- [Vercel response headers and HSTS](https://vercel.com/docs/headers/response-headers)

## เงื่อนไขก่อน Production

1. ตรวจ CSP console บน Vercel Preview ทั้ง desktop และ mobile
2. ตรวจ headers ของ HTML, JS/CSS, image และ video ผ่าน Preview URL
3. ยืนยันว่า external LINE, Facebook, Instagram, TikTok และ Google Maps links ยังเปิดได้
4. ห้าม deploy production จนกว่า Phase 6 ผ่านและ Phase 7 ตรวจ Preview สำเร็จ
