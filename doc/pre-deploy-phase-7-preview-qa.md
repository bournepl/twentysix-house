# Phase 7: Vercel Preview QA

วันที่เริ่ม: 22 กันยายน 2569

## สถานะ

**Local preflight ผ่าน - พร้อม push branch เพื่อสร้าง Preview**

โปรเจกต์เชื่อมกับ Vercel project ID แล้วผ่าน `.vercel/project.json` และกำหนด Node.js 20.x พร้อมตั้ง `origin` เป็น `https://github.com/bournepl/twentysix-house.git` แล้ว การ push ครั้งแรกถูก GitHub ปฏิเสธเพราะ LFS budget เต็ม จึงสำรองประวัติเดิมไว้ใน local branch `pre-deploy-remediation-lfs-backup` และย้ายวิดีโอ 3 ไฟล์ออกจาก LFS เฉพาะ branch ที่ยังไม่เคย push โดย hash ของไฟล์หลังย้ายตรงกับต้นฉบับทั้งหมด

จะไม่ใช้ `vercel deploy` โดยตรง เนื่องจาก workflow ของโปรเจกต์ใช้ GitHub integration

## ข้อมูลก่อนสร้าง Preview

- Branch: `pre-deploy-remediation`
- Phase 6 checkpoint หลัง LFS migration: `9e8157f`
- Vercel project: `prj_RgZPxTuE3AwZfWQcn9E7lrUeapKP`
- Build command: `npm run vercel-build`
- Node.js: `20.x`
- Production ยังไม่ถูกแก้ไขหรือ promote

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

## Blockers ก่อนปิด Phase 7

- ยังไม่มี Preview URL จนกว่า branch หลัง LFS migration จะถูก push และ Vercel build เสร็จ
- Caption ภาษาไทยของวิดีโอ 3 คลิปยังรอ transcript ที่ตรวจทานแล้วจาก Phase 6
- Privacy Policy และ Terms of Use ยังควรได้รับการตรวจข้อความจากผู้รับผิดชอบด้านกฎหมาย/ธุรกิจ
