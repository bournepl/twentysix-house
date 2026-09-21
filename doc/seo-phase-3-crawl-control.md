# SEO Phase 3: Robots, Sitemap และ Crawl Control

วันที่ดำเนินการ: 18 กันยายน 2026

## สถานะ

พัฒนาและตรวจสอบใน local SSR เสร็จแล้ว รอตรวจซ้ำบน Vercel production และส่ง sitemap เข้า Google Search Console หลัง deploy

## สิ่งที่ดำเนินการ

- เพิ่ม endpoint `GET /robots.txt` ใน `server.ts`
- อนุญาตให้ crawler เข้าถึงเว็บไซต์ และประกาศ `Sitemap: https://twentysix.house/sitemap.xml`
- ปรับ endpoint `GET /sitemap.xml` ให้สร้างจาก route และข้อมูลจริงที่เว็บไซต์ใช้งาน
- รวมหน้าหลัก, Blog slug, Completed Homes, Design Portfolio และ House Catalog detail
- ตัด redirect, wildcard, URL parameter, not-found และหน้า `noindex` ออกจาก sitemap
- ใช้ `dateFormat` ของบทความสร้าง `lastmod` ในรูปแบบ `YYYY-MM-DD`
- ทำ canonical path normalization, ป้องกัน URL ซ้ำ และ XML escaping
- ตั้ง Content-Type และ cache header ให้เหมาะกับ `robots.txt` และ `sitemap.xml`
- เพิ่ม `X-Robots-Tag: noindex, follow` ให้ response ที่เป็น HTTP 404
- ลบ `src/sitemap.xml` แบบ static ซึ่งมี URL เก่าและ URL redirect

## แหล่งข้อมูล Sitemap

| กลุ่ม | แหล่งข้อมูล |
| --- | --- |
| หน้าหลัก | รายการ static canonical routes ใน `server.ts` |
| บทความ | `src/assets/json/blog.json` |
| บ้านสร้างจริง | `src/app/new-ourworks/completed-homes.data.ts` |
| ผลงานออกแบบ | `src/app/new-ourworks/design-projects.data.ts` |
| แบบบ้านของเรา | `src/app/house-catalog/house-catalog.data.ts` |

การเพิ่มรายการใหม่ใน data ข้างต้นจะทำให้ sitemap รวม URL ใหม่ให้อัตโนมัติเมื่อ build/deploy รุ่นใหม่

## ผลตรวจ Local SSR

- Angular SSR build ผ่าน
- Prerender ผ่าน 30 routes
- `robots.txt` ตอบ `200` และ Content-Type เป็น `text/plain; charset=utf-8`
- `sitemap.xml` ตอบ `200` และ Content-Type เป็น `application/xml; charset=utf-8`
- Sitemap มี 30 URL
- URL ซ้ำ 0 รายการ
- Redirect/parameter URL ใน sitemap 0 รายการ
- URL ที่ตอบไม่ใช่ `200` หรือ canonical ไม่ตรง 0 รายการ
- บทความที่มี `lastmod` 5 รายการ
- URL ที่ไม่มีอยู่ตอบ `404` พร้อม `X-Robots-Tag: noindex, follow`
- URL เก่า `/aboutus` ตอบ `301` ไป `/about`

## ตรวจหลัง Deploy บน Vercel

1. เปิด `https://twentysix.house/robots.txt`
2. เปิด `https://twentysix.house/sitemap.xml`
3. ตรวจ Content-Type, status และตัวอย่าง canonical อีกครั้ง
4. ส่ง `https://twentysix.house/sitemap.xml` ใน Google Search Console
5. ตรวจผลการอ่าน sitemap และหน้า discovered URLs หลัง Google ประมวลผล
