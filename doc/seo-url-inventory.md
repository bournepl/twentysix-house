# SEO Phase 0: URL Inventory

วันที่สำรวจ: 18 กันยายน 2026

## แหล่งข้อมูล

- Production: `https://twentysix.house`
- โปรเจกต์อ้างอิง: `web/twentysix-house`
- โปรเจกต์ใหม่: `website/twentysix-house`
- ข้อมูล route: Angular routing, `server.ts` และ `prerender-routes.txt`
- ข้อมูล dynamic: Blog JSON, Real Projects, House Designs, Completed Homes และ House Catalog

> รายการนี้เป็น technical inventory จากเว็บไซต์และ source code ยังต้องนำ URL จาก Google Search Console มาเทียบก่อนเปลี่ยน production เพื่อค้นหา URL ที่ Google รู้จักแต่ไม่มีอยู่ใน sitemap

## สรุป

| กลุ่ม | URL เดิมที่พบ | URL ใหม่ที่เกี่ยวข้อง | สถานะ |
|---|---:|---:|---|
| หน้าหลัก | 6 | 8 | ตรวจครบจาก routes |
| หน้ารวมผลงาน | 2 | 2 | ต้อง redirect ไปโครงสร้างใหม่ |
| บ้านสร้างจริง | 10 | 7 | ยังจับคู่โครงการไม่ได้ครบ |
| แบบบ้านเดิม | 4 | 4 | จับคู่ House Catalog ได้ครบ |
| บทความ | 5 | 5 | จับคู่ slug และ legacy ID ได้ครบ |

## URL เดิมที่ต้องรักษา

### หน้าหลัก

| URL เดิม | ประเภท | การดำเนินการ |
|---|---|---|
| `/` | Home | Keep เป็น canonical |
| `/about` | About | Keep |
| `/services` | Services | Keep |
| `/ourworks` | Our Works | Keep |
| `/blogs` | Blog list | Keep |
| `/contact` | Contact | Keep |

### หน้ารวมผลงานเดิม

| URL เดิม | เนื้อหาเดิม | ปลายทางใหม่ |
|---|---|---|
| `/ourworks/real-projects` | ผลงานบ้านสร้างจริง | `/ourworks/completed` |
| `/ourworks/house-designs` | แบบบ้านและผลงานออกแบบเดิม | `/house-catalog` |

### รายละเอียดบ้านสร้างจริงเดิม

| ลำดับ | URL เดิม | ชื่อเดิม | สถานะ |
|---:|---|---|---|
| 1 | `/ourworks/real-projects/modern-black-white-single-storey-home-udon-thani` | บ้านชั้นเดียวโมเดิร์นโทนขาว-ดำ 2 ห้องนอน 3 ห้องน้ำ | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 2 | `/ourworks/real-projects/single-storey-warm-family-home-nong-khai` | บ้านพักอาศัยชั้นเดียว 110 ตร.ม. | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 3 | `/ourworks/real-projects/compact-modern-gable-home-two-bedroom` | บ้านชั้นเดียวทรงจั่วโมเดิร์น 2 ห้องนอน 2 ห้องน้ำ | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 4 | `/ourworks/real-projects/earth-tone-nordic-family-home` | บ้านนอร์ดิกโทนเอิร์ท 2 ห้องนอน พร้อมพื้นที่อเนกประสงค์ | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 5 | `/ourworks/real-projects/modern-contemporary-european-home-310sqm` | บ้าน Modern Contemporary กลิ่นอายยุโรป 310 ตร.ม. | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 6 | `/ourworks/real-projects/modern-one-and-half-storey-home-phen-udon-thani` | บ้านพักอาศัย 1 ชั้นครึ่ง Modern Style | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 7 | `/ourworks/real-projects/cozy-modern-two-storey-home-phen-udon-thani` | บ้านสองชั้น Cozy Modern House | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 8 | `/ourworks/real-projects/luxury-modern-single-storey-home-udon-thani` | บ้านชั้นเดียวสไตล์ Luxury Modern | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 9 | `/ourworks/real-projects/modern-minimal-single-storey-home-with-garden-udon-thani` | บ้านชั้นเดียว Modern Minimal พร้อมสนามหน้าบ้าน | ต้องยืนยันโครงการใหม่ที่ตรงกัน |
| 10 | `/ourworks/real-projects/modern-loft-single-storey-home-with-two-car-parking` | บ้านชั้นเดียว Modern Loft พร้อมที่จอดรถ 2 คัน | ต้องยืนยันโครงการใหม่ที่ตรงกัน |

ห้าม redirect ทั้ง 10 URL ไปหน้า `/ourworks` รวมกันจนกว่าจะตรวจว่าไม่มีหน้ารายละเอียดที่เกี่ยวข้อง เพราะจะลดความตรงของเนื้อหาและอาจถูกมองเป็น soft 404

### รายละเอียดแบบบ้านเดิม

| URL เดิม | Canonical URL ใหม่ | สถานะ |
|---|---|---|
| `/ourworks/house-designs/yu-plearn-nature-connected-home` | `/house-catalog/yu-plearn` | จับคู่แล้ว |
| `/ourworks/house-designs/yu-yen-compact-single-storey-home` | `/house-catalog/yu-yen` | จับคู่แล้ว |
| `/ourworks/house-designs/yu-sabai-modern-character-home` | `/house-catalog/yu-sabai` | จับคู่แล้ว |
| `/ourworks/house-designs/yu-sook-private-open-plan-family-home` | `/house-catalog/yu-sook` | จับคู่แล้ว |

### บทความเดิม

| Legacy ID | Canonical slug |
|---|---|
| `6835731ec9e09972e8cfa0f8` | `/blogs/บ้านแนวทรอปิคอล-ออกแบบให้อยู่สบายกับอากาศเมืองไทย` |
| `68357423c9e09972e8cfa0fa` | `/blogs/บ้านโมเดิร์น-รูปแบบบ้านเรียบง่ายที่ตอบโจทย์การใช้ชีวิตจริง` |
| `68357566c9e09972e8cfa0fb` | `/blogs/บ้านโมเดิร์นคลาสสิก-ความเรียบหรูที่ยังอยู่สบายในระยะยาว` |
| `68357698c9e09972e8cfa0fc` | `/blogs/คอนกรีต-วัสดุหลักที่เจ้าของบ้านควรรู้ก่อนเริ่มก่อสร้าง` |
| `685a508c1a01381cb711b0ab` | `/blogs/เสาเข็มตอก-เสาเข็มเจาะ-และฐานราก-ต่างกันอย่างไร` |

## URL ของโปรเจกต์ใหม่

### Static routes

- `/home`
- `/aboutus`
- `/services`
- `/contactus`
- `/ourworks`
- `/house-catalog`
- `/collections`
- `/blogs`

### Completed Homes

- `/ourworks/completed`
- `/ourworks/completed/khun-aod-residence`
- `/ourworks/completed/khun-jane-ban-dung-residence`
- `/ourworks/completed/khun-pui-residence`
- `/ourworks/completed/khun-tae-residence`
- `/ourworks/completed/khun-looknam-residence`
- `/ourworks/completed/khun-chart-residence`
- `/ourworks/completed/khun-pla-residence`

### Design Portfolio

- `/ourworks/design`
- `/ourworks/design/khun-jane-ban-dung-design`
- `/ourworks/design/khun-preaw-design`
- `/ourworks/design/khun-vijit-design`
- `/ourworks/design/khun-win-design`
- `/ourworks/design/khun-fai-interior-design`

### House Catalog

- `/house-catalog/yu-yen`
- `/house-catalog/yu-plearn`
- `/house-catalog/yu-sabai`
- `/house-catalog/yu-sook`

### Blog implementation ปัจจุบัน

โปรเจกต์ใหม่ยังเปิดหน้ารายละเอียดด้วย `/blogs/detail/:id` แม้ข้อมูลทั้ง 5 บทความมี slug แล้ว เส้นทาง ID จึงต้องเป็น legacy URL และ 301 ไป `/blogs/:slug`

## URL ที่ต้องค้นหาเพิ่มจาก Search Console

- URL ที่มี impressions/clicks แต่ไม่ได้อยู่ใน sitemap
- URL เก่าที่มี query string หรือ trailing slash
- URL รูปภาพที่มี organic traffic
- URL ที่ Google เลือก canonical ต่างจากที่เว็บไซต์กำหนด
- URL 404 และ soft 404 ย้อนหลัง
- URL ที่มี external links แต่ไม่อยู่ใน route ปัจจุบัน

## Phase 0 Status

- [x] เก็บ URL จากโปรเจกต์อ้างอิง
- [x] เก็บ URL จากโปรเจกต์ใหม่
- [x] ระบุ Blog legacy ID และ slug
- [x] จับคู่ House Designs เดิมกับ House Catalog ใหม่
- [ ] Export และเทียบ Google Search Console
- [ ] ยืนยันการจับคู่ Real Projects เดิม 10 หน้า
