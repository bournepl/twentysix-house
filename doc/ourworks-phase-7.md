# Our Works Phase 7: QA และเตรียมเผยแพร่

## ขอบเขต

- `/ourworks`
- `/ourworks/completed`
- `/ourworks/completed/:slug`
- `/ourworks/design`
- `/ourworks/design/:slug`

## ดำเนินการแล้ว

- เพิ่มการควบคุมแท็บประเภทผลงานด้วย `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home` และ `End`
- เพิ่มความสัมพันธ์ `tab`, `tabpanel`, `aria-controls` และ `aria-labelledby`
- เพิ่ม focus ring ที่มองเห็นชัดสำหรับลิงก์ การ์ด และปุ่ม
- รองรับ `prefers-reduced-motion` ในสไลด์รายละเอียดและ transition
- ให้ invalid slug แสดงหน้า Project Not Found และตั้ง `robots` เป็น `noindex, follow`
- เพิ่มรายละเอียดผลงานทั้งหมด 12 routes เข้า `prerender-routes.txt`
- แก้ SSR entrypoint จาก CommonJS เป็น ESM และแก้ path `server.mjs` ใน `package.json`
- ตรวจ LINE URL แล้ว ตอบกลับสำเร็จและ redirect ไป LINE Official Account

## ผลตรวจอัตโนมัติ

- ข้อมูล 12 projects มี slug ไม่ซ้ำกัน
- ไฟล์ card, hero, gallery และ thumbnail ครบ 144 variants
- รูป Our Works ทั้ง 149 ไฟล์อ่านได้สมบูรณ์
- ไม่พบ `<img>` ที่ขาด alt หรือ `<button>` ที่ขาด type
- Internal routes ที่ใช้งานใน template มี route รองรับครบ
- Dev server ตอบ `200` สำหรับ route ปกติและ invalid slug
- Invalid slug ทั้ง Completed และ Design มี `noindex, follow` และไม่มี Hero preload ค้าง
- Production build ผ่านและ prerender สำเร็จ 27 routes
- รายละเอียด Our Works ทั้ง 12 หน้า มี canonical, title, optimized Hero และ Hero preload ครบ
- Production SSR เปิดใช้งานได้ และตอบ `200` สำหรับหน้ารวม รายละเอียด และ invalid slug

## รายการที่ต้องตรวจด้วยคนก่อนเผยแพร่จริง

- [ ] ตรวจภาพ Desktop, Tablet และ Mobile จาก browser จริง เนื่องจาก session นี้ไม่มี browser เชื่อมต่อสำหรับ screenshot QA
- [ ] ตรวจยืนยันพื้นที่ใช้สอย จำนวนห้องนอน ห้องน้ำ และที่จอดรถกับข้อมูลโครงการจริง
- [ ] ตรวจยืนยันชื่อเจ้าของบ้าน ที่ตั้งโครงการ ปี และคำบรรยายก่อนเผยแพร่

## คำสั่งตรวจซ้ำ

```bash
npm run images:ourworks
npm run build
npm run serve:ssr
```

Firebase Hosting ใช้ไฟล์ใน `dist/twentysix-house/browser` และมี rewrite กลับไป `index.html` สำหรับ route ที่ไม่ได้ prerender
