# SEO Phase 7: Performance และ Media SEO

วันที่ตรวจและปรับปรุง: 21 กันยายน 2026

## ขอบเขตที่ดำเนินการ

- เพิ่ม WebP สำหรับ hero ของ Home, About, Services, Contact และ Blog โดยมีขนาดสำหรับ mobile/desktop
- หน้า Home ใช้ `srcset` และ `sizes` กับภาพ LCP โดยตรง ส่วนภาพ card ใช้ WebP 960px ที่ตรงกับขนาดแสดงผล จึงไม่สร้าง variant ที่เบากว่าโดยไม่จำเป็น
- CSS hero เลือกไฟล์ 960px บนจอเล็ก และไฟล์ใหญ่บน desktop
- `SeoService` รองรับ `imagesrcset` และ `imagesizes` ใน preload
- preload เฉพาะภาพ hero/LCP ของ route ปัจจุบัน
- เพิ่ม `width`, `height`, `decoding` และ `loading` ให้ภาพใน template สาธารณะ
- เปลี่ยนภาพ Portfolio, โลโก้ และภาพ CTA ที่ใช้ซ้ำเป็น WebP ขนาดเหมาะสม
- เก็บต้นฉบับไว้ใน source แต่ exclude จาก public build เมื่อมี WebP ทดแทนแล้ว
- เพิ่ม `font-display: swap` ให้ฟอนต์ local และระบุน้ำหนัก Kanit ที่ใช้งานจริง
- เอา Google Maps bootstrap ที่ไม่ได้ใช้ในหน้าใหม่ออกจาก `index.html`
- เอา Material Icons และ Font Awesome 4 stylesheet ที่ไม่จำเป็นออก
- เปลี่ยนไอคอน Company Facts ไปใช้ Font Awesome 5 ที่เว็บโหลดอยู่แล้ว
- เอา global JavaScript ที่หน้าใหม่ไม่ใช้ ได้แก่ AOS, jQuery, Rellax, Slick และ Bootstrap JS
- เอา global CSS ของ Material theme, Perfect Scrollbar, Toastr, Slick และ AOS ที่ไม่ได้ใช้ในหน้าใหม่
- ปรับ production budget จาก 5 MB ให้แจ้งเตือน initial ที่ 1,250 KB และ error ที่ 1,500 KB
- ตั้ง component style budget ให้แจ้งเตือนที่ 60 KB และ error ที่ 90 KB
- เพิ่ม `npm run images:seo` สำหรับสร้างไฟล์ภาพที่ optimize ซ้ำได้
- เพิ่ม `npm run seo:audit-media` สำหรับตรวจ attribute ของภาพและรายงาน asset ขนาดใหญ่

## ผลตรวจระดับ source

- `npm run seo:audit-media`: ผ่าน
- `npx tsc -p tsconfig.app.json --noEmit`: ผ่าน
- ภาพใน template สาธารณะมี `alt`, `width`, `height` และ `decoding` ครบ
- ภาพนอก viewport มี `loading="lazy"`; โลโก้และ LCP image เป็นข้อยกเว้นที่ตั้งใจไว้
- ไม่พบการอ้างภาพต้นฉบับที่ถูกแทนที่แล้วในหน้า redesigned
- ไม่พบ Google Maps API bootstrap และ API key ใน `src/index.html`
- วิดีโอใช้ poster และ lazy source ตามงาน Video Phase 5-7 ที่ทำไว้ก่อนหน้า

## ตัวอย่างขนาดไฟล์หลังปรับ

| Asset | ก่อน | WebP ที่ใช้ |
| --- | ---: | ---: |
| Home hero desktop | ประมาณ 2.41 MB | ประมาณ 169 KB |
| Home hero mobile | ประมาณ 2.41 MB | ประมาณ 46 KB |
| Brand mark | ประมาณ 462 KB | 14-34 KB |
| Services hero desktop | ประมาณ 613 KB | ประมาณ 120 KB |
| Blog hero desktop | ประมาณ 399 KB | ประมาณ 52 KB |

## งานที่ตั้งใจเลื่อนไปหลัง build/deploy

- ยังไม่ได้รัน Angular production build ตามคำสั่งของผู้ใช้
- ตัวตรวจ structured data และ blog prerender ยังสรุปผลไม่ได้ เพราะต้องอ่านไฟล์จาก production build ซึ่งรอบนี้ตั้งใจไม่สร้างใหม่
- ยังไม่ได้ยืนยัน budget กับ output bundle จริง
- ยังไม่ได้ตรวจ SSR output และ preload tag จาก build ล่าสุด
- ยังไม่ได้วัด Lighthouse และ Core Web Vitals บน production URL
- ต้องเก็บค่า LCP, CLS และ INP ทั้ง mobile/desktop หลัง deploy ไป Vercel

## เกณฑ์ตรวจรอบถัดไป

1. รัน production SSR build และแก้เฉพาะ warning/error ที่เกิดจาก budget ใหม่
2. ตรวจ View Source ว่าแต่ละ route preload เพียง LCP image ของตัวเอง
3. ตรวจ Network ว่า mobile ไม่ดาวน์โหลด hero desktop ซ้ำ
4. รัน Lighthouse อย่างน้อย `/`, `/about`, `/house-catalog`, `/ourworks`, `/blogs` และ detail อย่างละหนึ่งหน้า
5. บันทึก LCP, CLS, INP และ transferred bytes ก่อน deploy จริง
