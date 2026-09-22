# Phase 7: Vercel Preview QA

วันที่เริ่ม: 22 กันยายน 2569

## สถานะ

**Preview build ผ่าน - Remote QA รอสิทธิ์ผ่าน Deployment Protection**

โปรเจกต์เชื่อมกับ GitHub repository `bournepl/twentysix-house` และ Vercel Git Integration แล้ว การ push ครั้งแรกถูก GitHub ปฏิเสธเพราะ LFS budget เต็ม จึงสำรองประวัติเดิมไว้ใน local branch `pre-deploy-remediation-lfs-backup` และย้ายวิดีโอ 3 ไฟล์ออกจาก LFS เฉพาะ branch ที่ยังไม่เคย push โดย hash ของไฟล์หลังย้ายตรงกับต้นฉบับทั้งหมด

Branch ที่ย้าย LFS แล้วถูก push สำเร็จ และ Vercel รายงานว่า Preview Deployment เสร็จสมบูรณ์ อย่างไรก็ตาม Preview เปิด Deployment Protection และ redirect ทุก request ไปยัง Vercel SSO จึงยังไม่สามารถใช้ automated HTTP validator หรือ browser ที่ไม่ได้ลงชื่อเข้าใช้ตรวจเนื้อหาเว็บไซต์ได้

จะไม่ใช้ `vercel deploy` โดยตรง เนื่องจาก workflow ของโปรเจกต์ใช้ GitHub integration

## ข้อมูลก่อนสร้าง Preview

- Branch: `pre-deploy-remediation`
- Phase 6 checkpoint หลัง LFS migration: `9e8157f`
- Vercel project: `prj_RgZPxTuE3AwZfWQcn9E7lrUeapKP`
- Build command: `npm run vercel-build`
- Node.js: `20.x`
- Production ยังไม่ถูกแก้ไขหรือ promote

## Preview Deployment

- Repository: `https://github.com/bournepl/twentysix-house.git`
- Branch: `pre-deploy-remediation`
- Commit: `f2bf20f67d522d571b6db4ba495de81bdb760e07`
- Vercel status: `success` (`Deployment has completed`)
- Environment: `Preview`
- Preview URL: `https://twentysix-house-pscf59smw-bournepls-projects.vercel.app`
- Production deployment: ไม่ได้ดำเนินการ

ยืนยัน branch บน GitHub ด้วย `git ls-remote` แล้วพบ hash ตรงกับ local HEAD และยืนยัน deployment ผ่าน GitHub Deployments API ซึ่งสร้างโดย `vercel[bot]`

Local `vercel build` ผ่านและสร้าง `.vercel/output` สำเร็จ ระหว่างตรวจพบว่า Node engine เดิมเปิดให้เลือกทั้ง 20 และ 22 ทำให้ Vercel ข้าม Project Setting `20.x`; จึงปรับ engine เป็น `>=20.19.0 <21` ให้ build environment ตรงกัน

## Local preflight ที่ต้องผ่านก่อน push

- `npm run test:ci`
- `npm run videos:probe`
- `npm run build`
- `npm run seo:audit-media`
- `npm run seo:validate-structured-data`
- `npm run seo:validate-blog`
- `npm run seo:validate-prerender`
- `npm run security:validate`
- `npm run serve:ssr`
- `npm run seo:validate-http -- http://localhost:3000`
- `vercel build`

## ขั้นตอนสร้าง Preview ผ่าน GitHub

1. ยืนยัน GitHub repository URL ที่เชื่อมกับ Vercel project นี้
2. เพิ่ม `origin` ให้ local repository หากยังไม่มี
3. Push เฉพาะ branch `pre-deploy-remediation`
4. รอ Vercel Git integration สร้าง Preview Deployment
5. บันทึก Preview URL และ deployment commit SHA ในรายงานนี้
6. ห้าม merge เข้า production branch จนกว่า QA จะผ่าน

## Preview QA Checklist

- Crawl canonical routes ทั้ง 32 หน้า
- ตรวจ redirects 23 รายการ, custom 404, robots.txt และ sitemap.xml
- ตรวจ metadata, JSON-LD และ social preview
- ตรวจ desktop และ mobile ด้วย Chrome, Safari และ mobile browser
- ตรวจ keyboard, focus order, skip link, menu focus trap และ zoom 200%
- ตรวจวิดีโอด้วย Wi-Fi, Fast 4G และ Slow 4G
- ตรวจ hydration/runtime errors และ Vercel logs
- รัน Lighthouse หน้า Home, About, Services, Our Works, House Catalog, Blog และ Contact
- บันทึก LCP, CLS และ INP

## ผลการตรวจ Preview รอบแรก

- GitHub push: ผ่าน
- Vercel build/deployment: ผ่าน
- Commit-to-deployment traceability: ผ่าน
- `npm run seo:validate-http -- <preview-url>`: ยังประเมินผลเว็บไม่ได้
- สาเหตุ: ทุก route, asset, `robots.txt` และ `sitemap.xml` ตอบ `302` ไป `https://vercel.com/sso-api` เพราะ Deployment Protection
- จำนวน issue 562 รายการจากรอบนี้เป็นผลต่อเนื่องจาก SSO redirect และไม่ควรตีความว่าเป็น regression ของเว็บไซต์
- วิธีตรวจต่อ: ใช้บัญชีที่มีสิทธิ์เปิด Preview ใน browser หรือสร้าง Vercel Protection Bypass token สำหรับ QA แล้วรัน validator ใหม่

## Blockers ก่อนปิด Phase 7

- Automated remote crawl, visual QA, Lighthouse และ network throttling ยังติด Vercel Deployment Protection
- Vercel CLI ปัจจุบันลงชื่อเข้าใช้ workspace `atlas-projects-10d77616` ซึ่งไม่ใช่ owner ของ Preview project `bournepls-projects` จึงไม่สามารถอ่าน project settings หรือสร้าง bypass token ได้
- Caption ภาษาไทยของวิดีโอ 3 คลิปยังรอ transcript ที่ตรวจทานแล้วจาก Phase 6
- Privacy Policy และ Terms of Use ยังควรได้รับการตรวจข้อความจากผู้รับผิดชอบด้านกฎหมาย/ธุรกิจ
