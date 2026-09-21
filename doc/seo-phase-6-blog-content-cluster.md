# SEO Phase 6: Blog Slug และ Content Cluster

สถานะ: implementation และ local production QA เสร็จแล้ว ยังไม่ deploy

## URL และ Redirect

- Canonical ของบทความใช้ `/blogs/:slug` ทั้งหมด
- Slug ทั้ง 5 บทความเป็นคำภาษาไทยที่อ่านเข้าใจได้และไม่ใช่ database ID
- `server.ts` รองรับ HTTP 301 จากทั้ง `/blogs/detail/:id` และ `/blogs/:id`
- Sitemap ใช้ canonical slug และใช้ `modifiedDateFormat` เป็น `lastmod`
- Legacy ID 5 รายการถูกทดสอบ 2 รูปแบบ รวม 10 redirect cases

## Content Cluster

กำหนด topic จากเนื้อหาที่มีจริงใน `src/app/shared/blog-content-clusters.ts`

1. `design-and-living`: แนวคิดการออกแบบและการอยู่อาศัย
2. `construction-structure`: โครงสร้างและการก่อสร้าง

Related articles เรียงลำดับด้วยคะแนนจาก topic เดียวกัน, category เดียวกัน และ tags ที่ตรงกัน ก่อนใช้วันที่เผยแพร่ตัดสินลำดับ

## Internal Links

ทุกบทความมีส่วน “นำข้อมูลไปวางแผนบ้านต่อ” ซึ่งเชื่อมไปยังหน้าที่สัมพันธ์กับเนื้อหา:

- Services
- House Catalog
- Completed Homes หรือ Design Portfolio
- Contact

หน้ารายละเอียดต่อไปนี้มีส่วนบทความช่วยตัดสินใจกลับไปยัง `/blogs/:slug`:

- Completed Home detail ทุกหน้า
- Design Project detail ทุกหน้า
- House Catalog detail ทุกหน้า

## Author และ Date

- ผู้เขียนที่แสดงและใช้ใน BlogPosting คือ `TWENTYSIX.HOUSE`
- เก็บ `dateFormat` และ `modifiedDateFormat` แยกกันในข้อมูลบทความ
- ข้อมูลเดิมใช้วันเผยแพร่เป็นวันแก้ไขล่าสุดจนกว่าจะมีการแก้เนื้อหาจริง
- HTML ใช้ `<time datetime="...">` และ JSON-LD ใช้ ISO date เดียวกับข้อมูลต้นทาง

## Validation

Production build:

```powershell
npx ng build --configuration production --output-path .tmp/build-seo-phase6-final
```

ตรวจ Blog SEO และ internal links:

```powershell
npm run seo:validate-blog -- .tmp/build-seo-phase6-final/browser http://localhost:4502
```

ตัวตรวจครอบคลุม:

- readable/unique slug
- canonical URL ไม่ใช้ ID
- author และ machine-readable date
- contextual internal link อย่างน้อยหนึ่งจุดในทุกบทความ
- backlink จาก House Catalog และ Our Works detail
- HTTP 301 ของ legacy Blog IDs ทั้ง 10 cases

ตรวจ structured data ร่วมกับ Phase 5:

```powershell
npm run seo:validate-structured-data -- .tmp/build-seo-phase6-final/browser
```

## Definition of Done

- บทความ production ทั้ง 5 หน้าใช้ canonical slug
- Legacy ID redirect ไป canonical slug โดยไม่มี redirect chain
- ทุกบทความมีลิงก์ภายในตามบริบท
- หน้ารายละเอียดสำคัญเชื่อมกลับมายังบทความ
- Related articles อิง topic/category/tags จริง
