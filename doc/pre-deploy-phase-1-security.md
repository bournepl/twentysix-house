# Pre-deploy Phase 1: Production Dependency Security

วันที่ตรวจ: 21 กันยายน 2026
Branch: `pre-deploy-remediation`
สถานะ: เสร็จสมบูรณ์

## สรุป

Phase 1 อัปเกรด production stack จาก Angular 17 เป็น Angular 20 LTS และแก้ compatibility changes ที่เกี่ยวข้องกับ SSR, NgModule components, HTTP client และ `DOCUMENT` injection แล้ว

ช่องโหว่ production dependency ลดจาก 13 รายการเหลือ 0 รายการ พร้อมยืนยัน production build, prerender, SSR runtime, hydration smoke test และชุดตรวจ SEO สำเร็จ

## Dependency Migration

| รายการ | ก่อน | หลัง |
| --- | --- | --- |
| Node.js requirement | Node 20 | `>=20.19.0 <21` หรือ `>=22.12.0 <23` |
| Angular runtime | 17.3.12 | 20.3.31 |
| Angular CLI | 17.3.11 | 20.3.37 |
| Angular SSR | 17.3.11 | 20.3.37 |
| Angular Material/CDK | 17.3.10 | 20.2.14 |
| TypeScript | 5.4.5 | 5.9.3 |
| Zone.js | 0.14.x | 0.15.1 |
| Express | 4.18.x | 4.22.3 |

ใช้ Node.js 20.19.5 ชั่วคราวในการติดตั้ง dependency, build และตรวจรับ เนื่องจาก Node.js 20.10.0 เดิมต่ำกว่าข้อกำหนดของ Angular 20

แพ็กเกจ UI ที่สัมพันธ์กับ Angular ถูกยกระดับให้รองรับ Angular 20 ได้แก่ `@ng-bootstrap/ng-bootstrap`, `ngx-bootstrap`, `ngx-fast-marquee`, `ngx-slick-carousel` และ `ngx-toastr`

## Security Result

ผล `npm audit --omit=dev`:

| Severity | ก่อน | หลัง |
| --- | ---: | ---: |
| Critical | 1 | 0 |
| High | 8 | 0 |
| Moderate | 3 | 0 |
| Low | 1 | 0 |
| รวม | 13 | 0 |

การจัดการ dependency สำคัญ:

- อัปเกรด Angular framework และ SSR packages เป็นชุด 20.x ที่เข้ากัน
- อัปเกรด Express และ SweetAlert2
- ลบ `quill` และ `ngx-quill` ซึ่งเหลือใช้งานเฉพาะ legacy blog template
- เปลี่ยน legacy blog content เป็น `[innerHTML]` ซึ่งยังผ่าน Angular sanitizer
- ลบ `HttpClientModule` ที่เลิกแนะนำและคง `provideHttpClient(withFetch())`

## Angular 20 Compatibility

- เพิ่ม `standalone: false` ให้ components ที่ประกาศผ่าน NgModule ทั้งหมด
- ย้าย `CommonEngine` ไป import จาก `@angular/ssr/node`
- ย้าย `DOCUMENT` ไป import จาก `@angular/core`
- เพิ่ม SSR host allowlist สำหรับ `localhost`, `127.0.0.1`, production domain และ Vercel preview domains
- คง host validation ของ Angular ไว้เพื่อป้องกัน Host Header Injection

## Verification

### Production build

- Angular production build: ผ่าน
- Browser และ server bundles: สร้างสำเร็จ
- Prerender output: 36 static routes
- Initial browser bundle: 863.51 KB raw, 178.32 KB estimated transfer

### SEO validators

- Prerender crawl: 30 canonical routes, 30 unique titles
- Broken internal links: ไม่พบ
- Orphan pages: ไม่พบ
- Structured data: ผ่าน 30 routes และ 5 `BlogPosting` pages
- Blog SEO: ผ่าน 5 canonical articles และ 10 legacy redirects
- Media attributes: ผ่าน

### SSR และ hydration smoke test

- SSR ตอบ HTTP 200 และ render title เฉพาะหน้าครบ 9 เส้นทางหลัก
- Chrome headless hydration ผ่านหน้า `/`, `/ourworks` และ `/house-catalog`
- ไม่พบ `Uncaught`, `TypeError`, `ReferenceError` หรือ Angular runtime error ใน smoke test
- ไม่พบ SSR error หลังเพิ่ม host allowlist

## Remaining Warnings

รายการต่อไปนี้ไม่ใช่ security blocker ของ Phase 1 และเก็บไว้จัดการใน Phase ถัดไป:

- Sass legacy `@import`, global color functions และ mixed declarations มี deprecation warnings
- Initial bundle และ global CSS ยังมีขนาดค่อนข้างสูง
- มี public image assets เก่าบางไฟล์ขนาดเกิน 1 MiB แม้ไม่ได้ถูกอ้างอิงทุกไฟล์
- Angular 20 LTS สิ้นสุดเดือนพฤศจิกายน 2026 จึงควรวางแผนอัปเกรด Angular 21 หลัง production stabilization

## Phase 1 Checklist

- [x] อัปเกรด Angular framework และ SSR เป็นรุ่นที่ยังได้รับ security support
- [x] ปรับ Angular ecosystem packages ให้รองรับ Angular 20
- [x] อัปเกรด Express และ SweetAlert2
- [x] ลบ Quill dependencies ที่ไม่จำเป็น
- [x] แก้ Angular 20 compatibility changes
- [x] รัน production audit และยืนยัน 0 vulnerabilities
- [x] รัน production build และ prerender สำเร็จ
- [x] ตรวจ prerender crawl, structured data, blog SEO และ media attributes
- [x] ตรวจ SSR runtime และ hydration smoke test
- [x] ยืนยันว่าไม่มี server process จากการทดสอบค้างอยู่

## ผลการปิด Phase 1

Production dependency tree ไม่มีช่องโหว่ที่ npm audit รายงาน และ Angular SSR สามารถ build, prerender และ render runtime ได้บน Node.js ที่รองรับ พร้อมเริ่ม Phase 2: Vercel SSR Build Pipeline
