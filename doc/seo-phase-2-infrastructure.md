# SEO Phase 2: Infrastructure กลาง

วันที่ดำเนินการ: 18 กันยายน 2026

## สิ่งที่ดำเนินการแล้ว

### SeoService กลาง

- รวมการจัดการ title, description, robots, canonical, Open Graph และ Twitter Card
- เพิ่ม default social image ที่เป็น absolute URL
- Normalize canonical โดยตัด query string, hash และ trailing slash
- รองรับการปิด canonical สำหรับหน้า 404
- รองรับ `article:published_time` และ `article:modified_time`
- รองรับ preload เฉพาะภาพ Hero ที่ component ระบุ
- ล้าง managed metadata ก่อนใส่ค่าของหน้าใหม่ ป้องกัน tag ค้างและ tag ซ้ำ
- ลบ keywords เดิมเมื่อหน้าถัดไปไม่ได้กำหนด keywords
- รองรับ JSON-LD หนึ่งชุดหรือหลายชุดในหน้าเดียว
- กำหนด script ID แยกกันและล้าง JSON-LD จากหน้าก่อนหน้า

### Route SEO

- ให้ `AppComponent` อ่าน SEO config จาก route chain หลัง `NavigationEnd`
- รองรับทั้ง route config แบบ `seo` และ metadata เดิมระหว่าง migration
- หน้าคงที่ใช้ SEO จาก route ผ่าน `SeoService` กลาง
- หน้าที่ต้องโหลดข้อมูลจาก slug ใช้ `seoManagedByComponent`
- Our Works, House Catalog และ Blog detail ไม่ถูก metadata ของ parent route เขียนทับ
- หน้า 404 กลางและ invalid detail slug ใช้ `noindex, follow` และไม่มี canonical

### Blog Article Metadata

- Blog detail ใช้ canonical slug
- เพิ่ม published time จากข้อมูลบทความ
- ใช้ `og:type=article`
- Social title, description และ image สร้างผ่าน service เดียวกัน

### Document Language

- กำหนด `<html lang="th">` ให้ตรงกับภาษาหลักของเว็บไซต์

## QA

ตรวจ SSR HTML ของ template ต่อไปนี้:

- Home
- About
- Services
- Our Works
- Completed Home detail
- House Catalog list
- House Catalog detail
- Blog list/detail
- Contact
- Global 404
- Invalid House Catalog slug
- Invalid Completed Home slug

### ผลตรวจ

| รายการ | ผลลัพธ์ |
|---|---|
| Title | หนึ่งรายการต่อหน้า |
| Description | หนึ่งรายการต่อหน้า |
| Robots | หนึ่งรายการต่อหน้า |
| Canonical | หนึ่งรายการในหน้าปกติ ไม่มีในหน้า 404 |
| Open Graph title | หนึ่งรายการต่อหน้า |
| Twitter title | หนึ่งรายการต่อหน้า |
| Default social image | Absolute URL ถูกต้อง |
| Blog article date | แสดงใน SSR HTML |
| Existing JSON-LD | ยังแสดงถูกต้อง |
| QA failures | 0 |

## Build

- Angular browser/server compilation ผ่าน
- Prerender สำเร็จ 30 routes
- ใช้ `.tmp/seo-build --optimization=false` เนื่องจาก environment ทดสอบไม่สามารถเชื่อม Google Fonts สำหรับ font inlining

## ไฟล์หลักที่แก้ไข

- `src/app/shared/seo.service.ts`
- `src/app/app.component.ts`
- `src/app/app-routing.module.ts`
- `src/app/new-ourworks/new-ourworks-routing.module.ts`
- `src/app/house-catalog/house-catalog-routing.module.ts`
- `src/app/blog/blog-routing.module.ts`
- `src/app/new-blog-detail/new-blog-detail.component.ts`

## งานถัดไป

Phase 3 จะจัดการ `robots.txt`, ตรวจ sitemap schema/escaping, เพิ่ม `lastmod` จากข้อมูลที่เชื่อถือได้ และทำ crawl-control QA บน Vercel SSR
