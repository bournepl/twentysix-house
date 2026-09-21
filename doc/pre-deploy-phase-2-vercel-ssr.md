# Pre-deploy Phase 2: Vercel SSR Build Pipeline

วันที่ตรวจรับ: 22 กันยายน 2026
สถานะ: เสร็จสมบูรณ์ พร้อมเริ่ม Phase 3
แพลตฟอร์มเป้าหมาย: Vercel + Angular SSR

## ผลลัพธ์

- ใช้ Angular application builder เป็น build pipeline เพียงชุดเดียวสำหรับ browser, server และ prerender
- ลบ legacy `server` target ที่เคยเขียนทับ `dist/twentysix-house/server`
- ทำให้ `build`, `build:ssr` และ `vercel-build` ใช้ output ชุดเดียวกัน
- เปลี่ยน `dev:ssr` ที่เคยอ้าง target ซึ่งไม่มีอยู่ ให้ใช้ Angular dev server
- แยก local static server ออกจาก SSR handler ด้วย `tools/serve-ssr.mjs`
- เพิ่ม Vercel function entry ที่ `api/index.mjs`
- เปลี่ยน `vercel.json` จาก legacy `builds`/`routes` เป็น `functions`/`rewrites`
- ให้ Vercel static output รับผิดชอบ assets และ fallback request ไปยัง SSR function
- จำกัด file trace ของ function ให้รวม HTML/CSS ที่ SSR ต้องใช้ และ exclude `assets`/`media`

## Build Architecture

```text
npm run build / npm run build:ssr / npm run vercel-build
  -> ng build
  -> dist/twentysix-house/browser
  -> dist/twentysix-house/server/server.mjs

Vercel static filesystem
  -> dist/twentysix-house/browser

Vercel fallback rewrite
  -> api/index.mjs
  -> dist/twentysix-house/server/server.mjs
```

`npm run serve:ssr` ใช้ `tools/serve-ssr.mjs` เพื่อเสิร์ฟ static assets ก่อนส่ง request ที่เหลือเข้า Angular SSR handler จึงทดสอบ output เดียวกับ production ได้โดยไม่ทำให้ function ต้องรับภาระ static files

## ผลการตรวจรับ

### Angular build

- `npm run build:ssr`: ผ่าน
- Browser bundle: ผ่าน
- Server bundle: ผ่าน
- Prerender: 36 routes
- `server.mjs`: คงอยู่หลัง build และเรียกใช้ได้

### Local SSR smoke test

| URL | ผลลัพธ์ |
| --- | --- |
| `/` | 200 HTML |
| `/ourworks` | 200 HTML |
| `/aboutus` | 301 ไป `/about` |
| `/sitemap.xml` | 200 XML |
| `/robots.txt` | 200 text |
| hashed CSS asset | 200 CSS |
| unknown route | 404 HTML |

### Vercel build

- `vercel build --yes`: ผ่าน โดยยังไม่มีการ deploy
- Build Output API: version 3
- Function runtime: `nodejs22.x`
- Function handler: `api/index.mjs`
- Function entry import test: ผ่าน และ default export เป็น function
- Function file trace manifest: 32 files และไม่มี browser `assets`/`media`
- Local function output directory: 147.84 MiB เพราะ Vercel CLI 44.2.7 ยังคงคัดลอก static output ทางกายภาพ แม้ trace manifest จะ exclude แล้ว

ประเด็นขนาด local function output ยังไม่ปิดเป็นศูนย์ จึงส่งต่อให้ Phase 3 ตรวจด้วย Vercel CLI รุ่นปัจจุบันและยืนยันขนาด source upload/function bundle ก่อน preview deployment

### SEO regression

- Prerender crawl: 30 routes, 30 titles, ไม่พบ broken link หรือ orphan page
- Structured data: ผ่าน 30 routes และ BlogPosting 5 หน้า
- Blog SEO: ผ่าน 5 canonical articles และ 10 legacy redirects

## ไฟล์ที่เปลี่ยน

- `angular.json`
- `package.json`
- `server.ts`
- `vercel.json`
- `api/index.mjs`
- `tools/serve-ssr.mjs`

## ความเสี่ยงที่ส่งต่อ

1. `.vercel/project.json` ที่เครื่องนี้เป็น link เก่าและ `vercel pull --yes` ดึง Project Settings ไม่สำเร็จ ต้อง `vercel link` กับโปรเจกต์ที่ถูกต้องก่อน Phase 7 Preview
2. Local Vercel CLI เป็นรุ่น 44.2.7 และใช้ Node จำลองรุ่น 24 ระหว่าง install ขณะที่ production function ถูกกำหนดเป็น Node 22
3. Function packaging แจ้งเตือนการแปลง ESM เป็น CommonJS แต่ handler import และ build ผ่าน
4. Angular build ยังมี Sass deprecation warnings ซึ่งไม่ขัดขวาง build แต่ควรวางแผน migrate ภายหลัง
5. การ inline Google Fonts ทำให้ build ต้องเชื่อมต่อ `fonts.googleapis.com`; งานลด network dependency ยังไม่ถูกทำใน Phase นี้

## เงื่อนไขก่อน Preview

- อัปเดตหรือตรวจซ้ำด้วย Vercel CLI รุ่นปัจจุบัน
- เชื่อม `.vercel` กับ project/organization ที่ถูกต้อง
- ยืนยัน function bundle และ source upload ไม่เกินข้อจำกัดของ Vercel plan
- รัน HTTP validator กับ Preview URL ใน Phase 7
- ห้าม deploy production จนกว่า Phase 0-6 จะผ่านครบ
