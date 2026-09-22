# Phase 6: Test, Accessibility และ Legal Readiness

วันที่ตรวจ: 22 กันยายน 2569

## สถานะ

**อยู่ระหว่างดำเนินการ**

ส่วนของ code, automated tests, SSR build, SEO และ HTTP regression ผ่านแล้ว แต่ยังไม่ควรปิด Phase 6 จนกว่าจะทำสองรายการต่อไปนี้:

1. เพิ่ม caption ภาษาไทยจาก transcript ที่ตรงกับเสียงจริงและผ่านการตรวจทาน สำหรับวิดีโอทั้ง 3 รายการ
2. ตรวจ contrast, focus order, layout ที่ zoom 200% และ responsive overflow ด้วย browser จริงบน Vercel Preview

## งานที่เสร็จแล้ว

- เพิ่ม unit tests สำหรับ redirects, 404, canonical, social metadata และ JSON-LD
- เพิ่ม data integrity tests สำหรับ house catalog, completed homes และ design portfolio
- เพิ่ม Karma CI launcher สำหรับ Windows headless test
- เพิ่ม skip link ไปยัง main content
- เพิ่ม focus trap, Escape close, focus restore และ body scroll lock ให้ site menu
- หยุด auto-scroll ของ portfolio และ house catalog carousel เมื่อ keyboard focus อยู่ภายใน
- รองรับ Arrow keys, Home และ End ใน tab เลือกประเภทผลงานหน้า Our Works
- ยืนยันว่า gallery, carousel และ scroll-to-top ใช้ native button/link พร้อม accessible label
- เพิ่ม global `:focus-visible` และ `prefers-reduced-motion`
- สร้างหน้า `/privacy-policy` และ `/terms-of-use` พร้อม footer links, canonical, social metadata และ schema
- ตรวจ source code แล้วไม่พบ analytics, advertising pixel, cookie, local storage หรือ third-party embed จึงเพิ่ม Cookie Notice โดยยังไม่แสดง consent banner ที่ไม่จำเป็น
- เพิ่ม legal routes ใน prerender routes และ sitemap

## ผลการตรวจอัตโนมัติ

| รายการ | ผล |
| --- | --- |
| `npm run test:ci` | ผ่าน 17 tests |
| `npm run build` | ผ่าน, prerender 38 routes |
| `npm run seo:audit-media` | ผ่าน |
| `npm run seo:validate-structured-data` | ผ่าน 32 routes และ 5 BlogPosting pages |
| `npm run seo:validate-blog` | ผ่าน 5 canonical articles และ 10 legacy redirects |
| `npm run seo:validate-prerender` | ผ่าน 32 routes, title ไม่ซ้ำ, ไม่มี broken/orphan link |
| `npm run security:validate` | ผ่าน |
| `npm run videos:probe` | ผ่าน, 3 วิดีโอรวม 93.48 MB |
| `npm run seo:validate-http -- http://localhost:3000` | ผ่าน 32 canonical pages, 23 redirects, robots, sitemap และ 404 |

Build ยังรายงาน Sass deprecation warnings จาก Now UI Kit และ Bootstrap เดิม แต่ไม่มี compile error และไม่ใช่ blocker ของ Phase 6

## Caption ที่ยังขาด

ไฟล์ที่เผยแพร่และมีเสียงพูด:

- `khun-fai-testimonial-1080p.mp4`
- `khun-pui-home-handover-1080p.mp4`
- `khun-tae-home-handover-720p.mp4`

ใน `tools/video-manifest.json` ทั้งสามรายการยังมี `captions: null` และ `captionStatus: pending-transcription` จึงไม่ควรสร้างข้อความแทนจาก summary เพราะเวลาและเนื้อหาอาจไม่ตรงกับเสียงจริง

ไฟล์ caption ที่รับได้ควรเป็น WebVTT (`.vtt`) ภาษาไทย มี timecode ตรงกับเสียง และผ่านการตรวจชื่อบุคคล/คำเฉพาะก่อนผูกเข้ากับ `featureVideos`

## เงื่อนไขที่ต้องเพิ่ม Cookie Consent

ต้องเพิ่ม consent manager ก่อนโหลดเครื่องมือที่ไม่จำเป็น หากภายหลังติดตั้ง Google Analytics, Google Tag Manager, Meta/TikTok Pixel, session recording, embedded YouTube หรือบริการภายนอกอื่นที่ติดตามผู้ใช้ โดยต้องมีตัวเลือกยอมรับ ปฏิเสธ ตั้งค่า และถอนความยินยอมได้

## งานตรวจบน Preview

- ใช้ keyboard เดินจาก skip link, menu, carousel, gallery, CTA และ footer โดยไม่ติด focus trap
- ตรวจ focus indicator บนพื้นหลังมืดและสว่าง
- ตรวจสีข้อความและปุ่มตาม WCAG contrast
- zoom 200% ที่ความกว้าง desktop และตรวจว่าไม่มีข้อความหรือ control ถูกตัด
- เปิด `prefers-reduced-motion: reduce` และยืนยันว่า auto-scroll/animation ไม่รบกวนผู้ใช้
- ตรวจ Privacy Policy และ Terms of Use กับผู้รับผิดชอบด้านกฎหมาย/ธุรกิจก่อน Production

## เกณฑ์ปิด Phase 6

- caption ทั้ง 3 วิดีโอผ่านการตรวจทานและทำงานใน Chrome/Safari
- visual accessibility checklist บน Preview ผ่าน
- ไม่มี keyboard blocker หรือ horizontal overflow ที่ zoom 200%
