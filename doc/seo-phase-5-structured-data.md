# SEO Phase 5: Structured Data

สถานะ: เสร็จส่วน implementation และ pre-deploy validation แล้ว ยังไม่ deploy

## สิ่งที่ทำ

- สร้าง schema กลางใน `src/app/shared/structured-data.ts`
- ใช้ organization `@id` เดียวกันทุกหน้า: `https://twentysix.house/#organization`
- ใช้ข้อมูลชื่อบริษัท ที่อยู่ เบอร์โทร อีเมล แผนที่ และ social links จาก Contact/Footer
- เพิ่ม `Organization` + `LocalBusiness`, `WebSite` และ schema ตามประเภทหน้า
- เพิ่ม `BreadcrumbList` ให้หน้าหลักระดับรอง หน้ารายการ และหน้ารายละเอียด
- เพิ่ม `ItemList` ให้ Our Works, Completed Homes, Design Portfolio, House Catalog และ Blog
- เพิ่ม `CreativeWork` + `ImageObject` ให้รายละเอียดผลงาน
- เพิ่ม `Product` ให้รายละเอียดแบบบ้าน โดยใช้ราคาเฉพาะที่แสดงจริงและไม่ระบุ availability
- เพิ่ม `BlogPosting` พร้อม author/publisher เป็น Twentysix House และวันที่จากข้อมูลบทความ
- ไม่เพิ่ม FAQ, review หรือ rating เพราะหน้าเว็บไม่มีข้อมูลดังกล่าวให้ผู้ใช้เห็น

## Schema Matrix ที่ใช้งานจริง

| Template | Schema หลัก |
|---|---|
| Home | `Organization`, `LocalBusiness`, `WebSite`, `WebPage` |
| About | `AboutPage`, `Organization`, `BreadcrumbList` |
| Services | `Service`, `OfferCatalog`, `BreadcrumbList` |
| Contact | `ContactPage`, `LocalBusiness`, `PostalAddress`, `BreadcrumbList` |
| Our Works และหน้ารายการ | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| รายละเอียดผลงาน | `WebPage`, `CreativeWork`, `ImageObject`, `BreadcrumbList` |
| House Catalog | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| รายละเอียดแบบบ้าน | `WebPage`, `Product`, `BreadcrumbList` |
| Blog list | `Blog`, `ItemList`, `BreadcrumbList` |
| Blog detail | `WebPage`, `BlogPosting`, `BreadcrumbList` |

## Validation

Production SSR/prerender build:

```powershell
npx ng build --configuration production --output-path .tmp/build-seo-phase5
```

ผล: build สำเร็จและ prerender 30 routes

ตรวจ JSON-LD ใน HTML ที่ prerender แล้ว:

```powershell
npm run seo:validate-structured-data -- .tmp/build-seo-phase5/browser
```

ผล: `Structured data valid: 30 prerendered routes, 5 BlogPosting pages.`

ตัวตรวจครอบคลุม JSON syntax, schema ที่ต้องมีตาม route, organization `@id`, ความสอดคล้องของ organization ทุกหน้า, canonical URL, required fields ของ BlogPosting และตรวจไม่ให้มี review/rating/availability ที่ไม่มีบนหน้า

## งานหลังเปิด Public URL

- ยืนยันชื่อ ที่อยู่ เบอร์โทร และ profile URL กับ Google Business Profile
- ตรวจ template ตัวอย่างด้วย Google Rich Results Test
- ตรวจ generic schema ด้วย Schema Markup Validator
- ตรวจ URL Inspection หลัง deploy และส่ง sitemap เมื่อพร้อมเปิดเว็บไซต์
