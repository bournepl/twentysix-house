# SEO Phase 4: On-page SEO

วันที่ดำเนินการ: 18 กันยายน 2026

## สถานะ

ดำเนินการและตรวจสอบผ่าน local SSR ครบ 30 canonical URLs แล้ว

## สิ่งที่ปรับปรุง

- ปรับหน้า Home ให้เหลือ H1 เดียวคือ `รับสร้างบ้านอุดรธานี`
- คงข้อความอังกฤษ `Luxury Custom Home Builders` เป็นข้อความประกอบโดยไม่ใช้ H1 ซ้ำ
- ปรับ H1 หน้า Services ให้สื่อถึงบริการออกแบบและสร้างบ้านโดยตรง
- ปรับ H1 หน้า Our Works ให้สื่อถึงผลงานออกแบบและสร้างบ้าน
- ทำ route title ของ Completed Homes และ Design Portfolio detail ให้ใช้ชื่อโครงการจริง
- ทำ route title ของ Blog detail ให้ใช้ชื่อบทความจริงทั้ง slug route และ legacy ID route
- ปรับ title ของหน้ารายการ Our Works ให้แยก intent ระหว่างบ้านสร้างจริงและผลงานออกแบบ
- เพิ่ม breadcrumb หน้าแรกใน Project detail และ House Catalog detail
- เพิ่ม breadcrumb ที่มองเห็นได้ใน House Catalog list ให้ตรงกับ `BreadcrumbList` ที่มีอยู่
- เพิ่ม alt ให้โลโก้ใน footer และตรวจ alt ของรูปจาก SSR HTML ทุกหน้า
- เปลี่ยนลิงก์ CTA หน้า Home ให้ไป LINE และหน้า Contact จริง
- เอา `javascript:void(0)` ออกจากทุก canonical page
- เปลี่ยน Privacy Policy และ Terms of Use ที่ยังไม่มีหน้าปลายทางจากลิงก์หลอกเป็นข้อความ
- ปรับชื่อบริษัทและที่อยู่ใน footer ให้ตรงกับข้อมูลหน้า Contact
- ปรับชื่อแบรนด์ใน SEO title ของ House Catalog เป็น `Twentysix House` ให้สอดคล้องกับหน้าหลัก

## Search Intent ของหน้าหลัก

| หน้า | H1 / Intent หลัก |
| --- | --- |
| Home | รับสร้างบ้านอุดรธานี |
| About | รู้จักบริษัทรับสร้างบ้านอุดรธานี |
| Services | บริการออกแบบและสร้างบ้านครบทุกขั้นตอน |
| Our Works | ผลงานออกแบบและสร้างบ้านจากการใช้งานจริง |
| House Catalog | แบบบ้านที่นำไปปรับให้เหมาะกับเจ้าของบ้านได้ |
| Blog | ความรู้สำหรับคนกำลังสร้างบ้าน |
| Contact | เริ่มต้นปรึกษาเรื่องบ้านกับทีมงาน |

## ผลตรวจ Local SSR

- ตรวจ 30 canonical URLs
- หน้าไม่ตอบ `200`: 0
- หน้าที่มี H1 ไม่เท่ากับหนึ่งรายการ: 0
- Title ซ้ำ: 0
- Description ซ้ำ: 0
- Canonical/robots/OG title/OG image ขาดหรือซ้ำ: 0
- รูปที่ไม่มี alt: 0
- ลิงก์ `javascript:void(0)`: 0
- Angular SSR build ผ่าน
- Prerender ผ่าน 30 routes

## หมายเหตุสำหรับ Phase 5

Phase 5 จะเพิ่ม Structured Data ให้ทุก template และทำให้ breadcrumb ของหน้าที่เหลือเชื่อมกับ `BreadcrumbList` ผ่าน canonical URL เดียวกัน
