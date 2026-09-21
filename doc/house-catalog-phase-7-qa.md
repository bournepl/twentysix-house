# House Catalog Phase 7 QA

วันที่ตรวจ: 18 กันยายน 2026

## ผลที่ผ่าน

- Production build ผ่านและ prerender สำเร็จ 15 routes
- Firebase Hosting emulator เปิดจาก `dist/twentysix-house/browser` ได้สำเร็จ
- `/house-catalog` และรายละเอียด `yu-yen`, `yu-plearn`, `yu-sabai`, `yu-sook` ตอบ HTTP 200 เมื่อเปิด URL โดยตรง
- หน้า prerender ทั้ง 5 URL มี title และ structured data เฉพาะหน้า
- invalid slug แสดงหน้า House Design Not Found และกำหนด `noindex` หลัง Angular เริ่มทำงาน
- ตรวจ local assets ใน prerender HTML 93 รายการ ไม่พบไฟล์หาย
- ตรวจเมนูหลัก `/home`, `/aboutus`, `/services`, `/house-catalog`, `/ourworks`, `/blogs`, `/contactus` ผ่าน Firebase emulator และตอบ HTTP 200
- ลิงก์ LINE, Facebook, Instagram, TikTok และโทรศัพท์มี URI format ถูกต้อง
- เพิ่ม focus ring ให้ collection card, house card, gallery controls, CTA, related card และปุ่ม scroll to top
- menu panel ถูกนำออกจาก keyboard navigation เมื่อปิด และยังรองรับ Escape เพื่อปิดเมนู
- ลิงก์ภายนอกที่เปิดแท็บใหม่เพิ่ม `noopener noreferrer`

## รายการรอตรวจรับ

- ตรวจ layout และ horizontal overflow ที่ viewport Desktop, Tablet และ Mobile ผ่าน browser จริง
- เดิน Tab order และทดลองปุ่มลูกศรของ gallery ผ่าน browser จริง
- ยืนยันจำนวนชั้น ห้องนอน ห้องน้ำ ที่จอดรถ และราคาเริ่มต้นกับทีม
- ตรวจปลายทาง external social links จริงหลังมี network และทดสอบ LINE/Facebook share preview หลัง deploy

## หมายเหตุ

สภาพแวดล้อม QA รอบนี้ไม่มี browser instance ให้เชื่อมต่อ จึงตรวจ route, HTML, assets, accessibility semantics, production build และ Firebase Hosting emulator แบบอัตโนมัติแทน โดยไม่ได้ทำเครื่องหมาย visual QA และข้อมูลธุรกิจว่าเสร็จจนกว่าจะมีการตรวจรับจริง
