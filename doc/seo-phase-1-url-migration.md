# SEO Phase 1: URL Migration และ HTTP Status

วันที่ดำเนินการ: 18 กันยายน 2026

## สิ่งที่ดำเนินการแล้ว

- เปลี่ยน Home canonical route จาก `/home` เป็น `/`
- เปลี่ยน About canonical route จาก `/aboutus` เป็น `/about`
- เปลี่ยน Contact canonical route จาก `/contactus` เป็น `/contact`
- เปลี่ยน internal links ในหน้า redesign, menu, navbar และ footer ให้ชี้ canonical URL โดยตรง
- เปลี่ยน Blog detail ให้ใช้ `/blogs/:slug`
- เปลี่ยนลิงก์บทความ Featured, Card และ Related Articles ให้ใช้ slug
- เพิ่ม canonical metadata สำหรับ Blog detail ผ่าน `SeoService`
- เพิ่มหน้า 404 กลาง พร้อม `noindex, follow`
- เพิ่ม route validation ใน `server.ts` สำหรับ static pages และ dynamic slugs
- เพิ่ม HTTP 301 สำหรับ aliases, legacy Blog IDs และ House Designs เดิม
- Normalize trailing slash ด้วย HTTP 301
- เพิ่ม canonical URL ทั้ง 30 หน้าใน prerender routes
- เปลี่ยน document language จาก `en` เป็น `th`

## Redirects ที่เปิดใช้แล้ว

- `/home` → `/`
- `/aboutus` → `/about`
- `/contactus` → `/contact`
- `/collections` → `/ourworks`
- `/blogs/list` → `/blogs`
- `/รับสร้างบ้าน-อุดรธานี` → `/`
- `/ourworks/real-projects` → `/ourworks/completed`
- `/ourworks/house-designs` → `/house-catalog`
- House Design เดิม 4 URLs → House Catalog detail ที่ตรงกัน
- `/blogs/detail/:id` → `/blogs/:slug`
- `/blogs/:id` → `/blogs/:slug`

## HTTP QA

ทดสอบจาก production SSR build ที่ `.tmp/seo-build` ด้วย server บน local port

| กรณี | ผลลัพธ์ |
|---|---|
| Canonical static route | `200` |
| `/home`, `/aboutus`, `/contactus` | `301` ไป canonical URL |
| Collections และ legacy list routes | `301` |
| House Design legacy detail | `301` ไป House Catalog detail |
| Blog legacy ID | `301` ไป Thai slug |
| Canonical Blog Thai slug | `200` ไม่มี redirect loop |
| URL ที่มี trailing slash | `301` ไป URL ไม่มี slash |
| Invalid global route | `404` |
| Invalid Completed/Design/Catalog slug | `404` |
| หน้า 404 | มี `noindex, follow` และไม่มี canonical |
| Home | มี canonical `https://twentysix.house/` |
| Sitemap | 30 canonical URLs และไม่มี alias เก่า |

ผลทดสอบอัตโนมัติ: 12 HTTP cases, 0 failures

## Build QA

- Angular browser/server compilation ผ่าน
- Prerender สำเร็จ 30 routes
- ใช้ `--optimization=false` สำหรับ QA เนื่องจาก sandbox ไม่สามารถเชื่อม Google Fonts เพื่อ inline font ได้
- `npm run build` ที่ output ปกติถูกขัดขวางโดยไฟล์ build เก่า `dist/twentysix-house/browser/aboutus/index.html` ซึ่งถูก process อื่นล็อกอยู่ ไม่ใช่ compile error

## Pending ก่อน Deploy

- ยืนยัน mapping ของ Real Project detail เดิม 10 URLs กับ Completed Homes ใหม่
- เพิ่ม redirects รายโครงการหลังยืนยันแล้ว
- ตรวจ Google Search Console เพื่อค้นหา legacy URL นอก sitemap
- รัน optimized production build ใน environment ที่เชื่อม Google Fonts ได้ หรือปิด font inlining อย่างเหมาะสม

ห้าม deploy migration นี้จนกว่าจะตัดสินใจเรื่อง Real Project detail เดิม เพราะ URL เหล่านั้นจะตอบ 404 ในระบบใหม่หากยังไม่มี redirect mapping
