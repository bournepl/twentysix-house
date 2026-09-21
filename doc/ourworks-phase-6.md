# Our Works Phase 6: Performance และการจัดการรูป

## ขอบเขต

ครอบคลุมหน้า `/ourworks` และหน้าภายใต้เส้นทางต่อไปนี้

- `/ourworks/completed`
- `/ourworks/completed/:slug`
- `/ourworks/design`
- `/ourworks/design/:slug`

## สิ่งที่ดำเนินการแล้ว

- ย้ายภาพต้นฉบับ 389 ไฟล์ออกจาก `src/assets` ไปไว้ที่ `source-media/ourworks`
- คงโฟลเดอร์วิดีโอส่งมอบจริงไว้ที่ตำแหน่งเดิม เพื่อไม่กระทบ Video Carousel หน้า Home
- สร้างภาพ WebP แยกตามการใช้งานด้วยคำสั่ง `npm run images:ourworks`
- สร้างภาพ Card ขนาดสูงสุด 960x600
- สร้างภาพ Hero ขนาดสูงสุด 1920x1080
- สร้างภาพ Gallery ขนาดสูงสุด 1600x1000
- สร้างภาพ Thumbnail ขนาดสูงสุด 320x200
- ให้หน้า Home ใช้ Video Poster จากชุดภาพ optimized เดียวกัน
- เพิ่ม `loading="lazy"`, `decoding="async"`, `width` และ `height` ให้ภาพนอก viewport
- ให้ Hero หน้ารายละเอียดใช้ `fetchpriority="high"` และ preload เพียงภาพเดียว
- เพิ่ม metadata และภาพแชร์สำหรับหน้า Our Works, หน้ารวม และหน้ารายละเอียด

## ตำแหน่งไฟล์

- ต้นฉบับ: `source-media/ourworks/design` และ `source-media/ourworks/completed`
- ไฟล์สำหรับเว็บไซต์: `src/assets/img/ourworks`
- Script สร้างภาพ: `tools/generate-ourworks-images.mjs`

เมื่อต้องเปลี่ยนภาพต้นฉบับ ให้แก้ไฟล์ใน `source-media/ourworks` แล้วรัน:

```bash
npm run images:ourworks
```

## ผลลัพธ์

- ภาพต้นฉบับ: 389 ไฟล์ รวม 203.48 MB
- ภาพที่ใช้ deploy: 149 ไฟล์ รวม 9.83 MB
- ลดขนาดชุดภาพที่เข้า build ประมาณ 95%
- Production build และ prerender 15 routes ผ่าน
- ไม่พบ reference ไปยังโฟลเดอร์ภาพเดิมใน JavaScript, CSS หรือ HTML ของ production build

## หมายเหตุ

วิดีโอ 6 ไฟล์ใน `src/assets/img/Photo/02 ผลงานการส่งมอบจริง` ยังมีขนาดรวมสูงมาก และควรแยกทำ video optimization ในงานถัดไป โดยไม่รวมอยู่ใน Phase 6 ของรูปภาพนี้
