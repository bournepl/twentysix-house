# Pre-deploy Remediation Roadmap

วันที่จัดทำ: 21 กันยายน 2026
สถานะ: Phase 3 เสร็จสมบูรณ์ - พร้อมเริ่ม Phase 4
แพลตฟอร์มเป้าหมาย: Vercel + Angular SSR

## เป้าหมาย

จัดการความเสี่ยงที่พบจากการตรวจทั้งเว็บก่อนสร้าง Vercel Preview และก่อนเปิด Production โดยเรียงงานจากสิ่งที่อาจทำให้ deployment ไม่ปลอดภัยหรือใช้งานไม่ได้ ไปจนถึงงานคุณภาพ SEO, accessibility และ performance

## กติกาการดำเนินงาน

- ทำและตรวจรับทีละ Phase
- ห้าม deploy Production จนกว่า Phase 0-6 จะผ่าน
- ใช้ Vercel Preview สำหรับ Phase 7 เท่านั้น
- สำรองหรือสร้าง branch ก่อนอัปเกรด dependency ครั้งใหญ่
- ห้ามใช้ `npm audit fix --force` โดยไม่ตรวจ breaking changes
- หลังแต่ละ Phase ต้องรัน production build และชุดตรวจที่เกี่ยวข้อง

## Phase 0: Baseline และ Recovery Point

**เป้าหมาย:** เก็บสถานะก่อนแก้เพื่อเปรียบเทียบและย้อนกลับได้

**สถานะ:** เสร็จสมบูรณ์ มี baseline, Git LFS และ initial recovery point
**รายงาน:** [pre-deploy-phase-0-baseline.md](./pre-deploy-phase-0-baseline.md)

### งาน

- ยืนยันว่า Git repository ใช้งานได้และตรวจ `git status` ได้
- สร้าง branch สำหรับงาน pre-deploy remediation
- บันทึกเวอร์ชัน Node, npm, Angular CLI และ Vercel CLI
- บันทึกผล build, จำนวน prerender routes, bundle size และขนาด assets ปัจจุบัน
- เก็บผล `npm audit --omit=dev` เป็น baseline
- ยืนยันรายการ URL canonical ทั้ง 30 หน้า

### ผ่านเมื่อ

- มี recovery point ที่ชัดเจน
- มี baseline สำหรับ security, build, SEO และขนาด deployment

## Phase 1: Production Dependency Security

**เป้าหมาย:** ปิดช่องโหว่ Critical/High ที่อยู่ใน production dependency tree

**สถานะ:** เสร็จสมบูรณ์ อัปเกรดเป็น Angular 20 LTS และ production audit เหลือ 0 vulnerabilities
**รายงาน:** [pre-deploy-phase-1-security.md](./pre-deploy-phase-1-security.md)

### งาน

- วางแผนอัปเกรด Angular จาก 17 ไปยังรุ่นที่ยังได้รับ security support
- อัปเกรด Angular packages ให้เป็น major/minor เดียวกันทั้งหมด
- อัปเกรด `@angular/ssr`, `@angular/platform-server`, `@angular/core`, `@angular/common` และ `@angular/compiler`
- อัปเกรด Express และ dependency ที่เกี่ยวข้อง
- ตรวจว่า `quill`, `ngx-quill` และ `sweetalert2` ยังถูกใช้งานจริงหรือไม่
- ลบ dependency เก่าที่ไม่มี route ใหม่ใช้งาน หรืออัปเกรดหากยังต้องใช้
- ตรวจ hydration, routing, lazy loading และ SSR หลัง migration

### คำสั่งตรวจรับ

```bash
npm audit --omit=dev
npm run build
npm run seo:validate-prerender
npm run seo:validate-structured-data
```

### ผ่านเมื่อ

- ไม่มี Critical หรือ High vulnerability ใน production dependencies
- Production build และ prerender ผ่านครบ
- หน้าใหม่ทั้งหมดเปิดได้โดยไม่มี hydration/runtime error

## Phase 2: Vercel SSR Build Pipeline

**เป้าหมาย:** ให้มี SSR build pipeline เพียงแบบเดียวและ output ใช้งานได้จริง

**สถานะ:** เสร็จสมบูรณ์ ใช้ Angular application builder เป็น pipeline เดียวและ `vercel build` ผ่าน
**รายงาน:** [pre-deploy-phase-2-vercel-ssr.md](./pre-deploy-phase-2-vercel-ssr.md)

### ปัญหาปัจจุบัน

- `npm run build:ssr` เรียกทั้ง application builder และ legacy server builder
- legacy server builder เขียนทับ `dist/twentysix-house/server`
- `server.mjs` หายหลัง build แม้คำสั่งจบด้วย exit code 0
- `npm run serve:ssr` จึงหา entry file ไม่พบ

### งาน

- เลือก Angular application SSR builder เป็นแนวทางหลัก
- ปรับ `build:ssr`, `vercel-build`, `serve:ssr` และ `main` ให้ใช้ output ชุดเดียวกัน
- ทบทวน `angular.json` และลบ server target แบบเก่าหากไม่จำเป็น
- ตรวจ `vercel.json` ว่า route และ function entry ตรงกับ output จริง
- รัน `vercel pull` หลังได้รับอนุญาต เพื่อดึง Project Settings
- รัน `vercel build` แบบ local โดยยังไม่ deploy
- ลดการพึ่ง network ตอน build โดยพิจารณาเก็บ Kanit font แบบ local

### ผ่านเมื่อ

- `npm run vercel-build` ผ่าน
- `npm run serve:ssr` ทำงานได้ทันทีจาก output เดียวกัน
- `vercel build` ผ่านจาก clean checkout
- ไม่เกิด `MODULE_NOT_FOUND` และไม่มี output ถูกเขียนทับ

## Phase 3: Deployment Size และ Video Delivery

**เป้าหมาย:** ไม่ชนข้อจำกัด source upload และไม่ส่งไฟล์หนักผ่าน function โดยไม่ตั้งใจ

**สถานะ:** เสร็จสมบูรณ์สำหรับ workflow GitHub → Vercel และพร้อมตรวจซ้ำบน Preview ใน Phase 7
**รายงาน:** [pre-deploy-phase-3-video-delivery.md](./pre-deploy-phase-3-video-delivery.md)

### งาน

- ลบกฎ `.vercelignore` ที่เขียนผิดเป็น `src/assets/video` และเก็บ `src/assets/videos` ไว้ใน build เพราะเป็นไฟล์ production ที่ Angular ต้องคัดลอก
- ตรวจว่าไฟล์ที่ ignore ยังถูกสร้างหรือคัดลอกใน Vercel build ได้อย่างถูกต้อง
- ตัดสินใจว่าจะเก็บวิดีโอบน Vercel static assets หรือย้ายไป media CDN
- หากใช้ Vercel Hobby ต้องลด source upload ให้ต่ำกว่า 100 MB
- ตรวจว่า static assets ถูกส่งผ่าน Vercel Edge CDN ไม่ใช่ Node function
- ตรวจ byte-range, cache headers และ playback ของวิดีโอทั้งสามคลิป
- แก้ config ของ `videos:probe` ให้ใช้ source path ที่มีอยู่จริง หรือให้ตรวจ production outputs โดยตรง

### ผ่านเมื่อ

- ขนาด source upload อยู่ภายใน limit ของแผน Vercel
- วิดีโอทุกไฟล์ตอบ `206 Partial Content`
- ไม่มีไฟล์ต้นฉบับขนาดใหญ่ถูกอัปโหลดโดยไม่จำเป็น
- `npm run videos:probe` ผ่าน

## Phase 4: SEO Asset และ Metadata Integrity

**เป้าหมาย:** ให้ metadata และ structured data อ้างถึง URL ที่เข้าถึงได้จริงทั้งหมด

### งาน

- เปลี่ยน schema logo จาก `/assets/img/home/LOGO.png` ที่ตอบ 404 ไปใช้ optimized logo ที่ deploy จริง
- เปลี่ยน watermark ของ shared menu ให้ใช้ asset ที่ deploy จริง
- เพิ่ม asset URL validation ใน structured-data validator
- ลดความยาว title และ meta description โดยเฉพาะหน้าบทความ
- ตรวจขนาดและอัตราส่วน OG images สำหรับ social sharing
- ประเมินการย้าย OG images ของบทความจาก Firebase token URLs ไปยัง URL ที่ควบคุมได้ถาวร
- ตรวจ canonical, Open Graph, Twitter Card และ JSON-LD ทุก route อีกครั้ง

### ผ่านเมื่อ

- ไม่มี metadata หรือ schema URL ตอบ 404
- ทุกหน้า indexable มี title, description, canonical และ OG image ที่ถูกต้อง
- Rich Results validation ไม่มี error
- SEO validators ผ่านทั้งหมด

## Phase 5: Security Headers และ Cache Policy

**เป้าหมาย:** ลดความเสี่ยงจาก browser-side attack และป้องกัน stale assets

### งาน

- ปิด `X-Powered-By`
- เพิ่ม `Content-Security-Policy`
- เพิ่ม `X-Content-Type-Options: nosniff`
- เพิ่ม `Referrer-Policy`
- เพิ่ม frame protection ผ่าน CSP `frame-ancestors` หรือ header ที่เหมาะสม
- ตรวจ HSTS บน Vercel HTTPS production
- แยก cache policy ระหว่าง hashed assets กับไฟล์ชื่อคงที่
- หลีกเลี่ยง cache 1 ปีสำหรับไฟล์ชื่อเดิมที่มีโอกาสเปลี่ยนเนื้อหา

### ผ่านเมื่อ

- HTML และ static responses มี headers ตามนโยบายที่กำหนด
- ไม่มี `X-Powered-By`
- CSP ไม่ทำให้ font, image, video หรือ external links ที่จำเป็นเสีย
- ไฟล์ชื่อคงที่สามารถอัปเดตโดยไม่ติด cache เก่าเป็นเวลาหนึ่งปี

## Phase 6: Test, Accessibility และ Legal Readiness

**เป้าหมาย:** มี regression gate และรองรับผู้ใช้ก่อนสร้าง Preview

### งาน

- เพิ่ม unit tests ขั้นต่ำให้ routing, SEO service และ data lookup
- เพิ่ม test สำหรับ redirects, 404, canonical และ schema asset URLs
- ทำให้ `npm test -- --watch=false` ผ่าน
- เพิ่ม caption ภาษาไทยให้วิดีโอที่มีบทสนทนา
- เพิ่ม skip link ไปยัง main content
- เพิ่ม focus trap, focus restore และ body scroll lock ให้ site menu
- ตรวจ keyboard navigation ของ carousel, gallery, menu และ scroll-top buttons
- สร้างหน้าหรือลิงก์ Privacy Policy และ Terms of Use ที่ใช้งานได้จริง
- ตรวจ contrast, focus indicator, zoom 200% และ reduced motion

### ผ่านเมื่อ

- ชุดทดสอบรันได้และผ่าน
- workflow สำคัญใช้งานได้ด้วย keyboard
- วิดีโอที่มีเสียงพูดมี caption
- Footer ไม่มี legal label ที่กดไม่ได้

## Phase 7: Vercel Preview QA

**เป้าหมาย:** ตรวจสภาพแวดล้อมจริงโดยยังไม่ promote เป็น Production

### งาน

- Deploy เฉพาะ Vercel Preview
- Crawl Preview ทุก canonical route
- ตรวจ redirect, 404, robots และ sitemap บน Preview
- ตรวจ desktop/mobile ด้วย browser จริง
- ทดสอบ Chrome, Safari และ mobile browser อย่างน้อยหนึ่งรุ่น
- ตรวจ video buffering บน Wi-Fi, Fast 4G และ Slow 4G
- ตรวจ LINE/Facebook share preview
- รัน Lighthouse สำหรับหน้า Home, About, Services, Our Works, House Catalog, Blog และ Contact
- ตรวจ Vercel function logs, 404 logs และ runtime errors
- ตรวจ Core Web Vitals: LCP, CLS และ INP

### ผ่านเมื่อ

- Preview ไม่มี SSR/hydration error
- ไม่พบ broken asset, broken link หรือ layout overflow
- Social preview แสดง title, description และ image ถูกต้อง
- ไม่มี blocker จาก Lighthouse หรือ Vercel logs

## Phase 8: Production Launch Checklist

**เป้าหมาย:** เปิด Production อย่างมี rollback plan

### งาน

- ยืนยันว่า Phase 0-7 ผ่านทั้งหมด
- บันทึก deployment SHA/version และเวลาปล่อย
- เตรียม rollback deployment
- Promote Preview ที่ผ่านการตรวจไป Production
- ตรวจ canonical domain และ HTTPS
- ส่ง sitemap ใน Google Search Console
- ตรวจ URL Inspection ของหน้าหลักและหน้ารายละเอียดตัวอย่าง
- ตรวจ Vercel logs และ 404 หลังเปิดจริง
- ติดตาม Core Web Vitals และ indexing ต่อเนื่อง

### ผ่านเมื่อ

- Production ตอบสถานะและ metadata เหมือน Preview
- Google เข้าถึง robots, sitemap และ canonical pages ได้
- ไม่มี error เพิ่มขึ้นหลัง launch

## ชุดคำสั่ง Final Gate

```bash
npm audit --omit=dev
npm test -- --watch=false --browsers=ChromeHeadless
npm run videos:probe
npm run build
npm run seo:audit-media
npm run seo:validate-structured-data
npm run seo:validate-blog
npm run seo:validate-prerender
npm run serve:ssr
npm run seo:validate-http -- http://localhost:4600
vercel build
```

## ลำดับแนะนำ

1. Phase 0: Baseline
2. Phase 1: Dependency security
3. Phase 2: Vercel SSR pipeline
4. Phase 3: Deployment size และ video
5. Phase 4: SEO integrity
6. Phase 5: Headers และ cache
7. Phase 6: Tests, accessibility และ legal
8. Phase 7: Vercel Preview
9. Phase 8: Production launch

สถานะปัจจุบัน: **ยังไม่พร้อม deploy Production** และควรเริ่มจาก Phase 0 ก่อน
