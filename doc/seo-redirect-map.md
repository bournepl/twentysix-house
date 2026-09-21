# SEO Phase 0: Redirect Map

วันที่จัดทำ: 18 กันยายน 2026

## กติกา

- ใช้ HTTP `301` จาก `server.ts` บน Vercel SSR
- Redirect ต้องไปยังหน้าที่มีเนื้อหาใกล้เคียงที่สุด
- Canonical URL ตอบ `200` และไม่ redirect ต่อ
- ไม่สร้าง redirect chain เช่น `/home -> /index -> /`
- Normalize trailing slash ให้ `/path/ -> /path`
- เก็บ query string ที่มีประโยชน์ แต่ canonical ต้องไม่มี tracking parameters

## Redirect ที่พร้อมใช้งาน

### Static และ legacy aliases

| Source | Destination | เหตุผล |
|---|---|---|
| `/home` | `/` | รักษา Home canonical เดิม |
| `/aboutus` | `/about` | ใช้ URL เดิมที่มีประวัติ |
| `/contactus` | `/contact` | ใช้ URL เดิมที่มีประวัติ |
| `/collections` | `/ourworks` | Alias เดิมของผลงาน |
| `/blogs/list` | `/blogs` | Legacy blog list |
| `/รับสร้างบ้าน-อุดรธานี` | `/` | Legacy keyword route |
| `/ourworks/real-projects` | `/ourworks/completed` | โครงสร้างหน้ารวมบ้านจริงใหม่ |
| `/ourworks/house-designs` | `/house-catalog` | แบบบ้านเดิมย้ายไป House Catalog |

### House Designs ไป House Catalog

| Source | Destination |
|---|---|
| `/ourworks/house-designs/yu-plearn-nature-connected-home` | `/house-catalog/yu-plearn` |
| `/ourworks/house-designs/yu-yen-compact-single-storey-home` | `/house-catalog/yu-yen` |
| `/ourworks/house-designs/yu-sabai-modern-character-home` | `/house-catalog/yu-sabai` |
| `/ourworks/house-designs/yu-sook-private-open-plan-family-home` | `/house-catalog/yu-sook` |

### Blog legacy IDs ไป canonical slugs

ต้องรองรับทั้ง `/blogs/detail/:id` และ `/blogs/:id` เพราะโปรเจกต์อ้างอิงเคย resolve ได้ทั้งสองรูปแบบ

| ID | Destination |
|---|---|
| `6835731ec9e09972e8cfa0f8` | `/blogs/บ้านแนวทรอปิคอล-ออกแบบให้อยู่สบายกับอากาศเมืองไทย` |
| `68357423c9e09972e8cfa0fa` | `/blogs/บ้านโมเดิร์น-รูปแบบบ้านเรียบง่ายที่ตอบโจทย์การใช้ชีวิตจริง` |
| `68357566c9e09972e8cfa0fb` | `/blogs/บ้านโมเดิร์นคลาสสิก-ความเรียบหรูที่ยังอยู่สบายในระยะยาว` |
| `68357698c9e09972e8cfa0fc` | `/blogs/คอนกรีต-วัสดุหลักที่เจ้าของบ้านควรรู้ก่อนเริ่มก่อสร้าง` |
| `685a508c1a01381cb711b0ab` | `/blogs/เสาเข็มตอก-เสาเข็มเจาะ-และฐานราก-ต่างกันอย่างไร` |

## Redirect ที่รอยืนยัน

รายละเอียด Real Projects เดิม 10 หน้าไม่สามารถจับคู่กับ Completed Homes ใหม่ 7 หน้าได้อย่างปลอดภัยจากชื่อเพียงอย่างเดียว ต้องตรวจรูปและข้อมูลโครงการกับเจ้าของข้อมูลก่อนกำหนด 301

| Source | Destination | สถานะ |
|---|---|---|
| `/ourworks/real-projects/modern-black-white-single-storey-home-udon-thani` | TBD | รอยืนยัน |
| `/ourworks/real-projects/single-storey-warm-family-home-nong-khai` | TBD | รอยืนยัน |
| `/ourworks/real-projects/compact-modern-gable-home-two-bedroom` | TBD | รอยืนยัน |
| `/ourworks/real-projects/earth-tone-nordic-family-home` | TBD | รอยืนยัน |
| `/ourworks/real-projects/modern-contemporary-european-home-310sqm` | TBD | รอยืนยัน |
| `/ourworks/real-projects/modern-one-and-half-storey-home-phen-udon-thani` | TBD | รอยืนยัน |
| `/ourworks/real-projects/cozy-modern-two-storey-home-phen-udon-thani` | TBD | รอยืนยัน |
| `/ourworks/real-projects/luxury-modern-single-storey-home-udon-thani` | TBD | รอยืนยัน |
| `/ourworks/real-projects/modern-minimal-single-storey-home-with-garden-udon-thani` | TBD | รอยืนยัน |
| `/ourworks/real-projects/modern-loft-single-storey-home-with-two-car-parking` | TBD | รอยืนยัน |

## Canonical routes หลัง migration

- `/`
- `/about`
- `/services`
- `/ourworks`
- `/ourworks/completed`
- `/ourworks/completed/:slug`
- `/ourworks/design`
- `/ourworks/design/:slug`
- `/house-catalog`
- `/house-catalog/:slug`
- `/blogs`
- `/blogs/:slug`
- `/contact`

## Test cases สำหรับ Phase 1

- Source ทุก URL ตอบ `301` พร้อม `Location` ที่ถูกต้อง
- Destination ทุก URL ตอบ `200`
- Source ที่เติม `/` ท้าย URL ไม่เกิด redirect เกินหนึ่งครั้ง
- Invalid slug ตอบ `404` และมี `noindex,follow`
- Sitemap มีเฉพาะ destination และไม่มี source redirect
- Canonical ของ destination ตรงกับ destination URL
