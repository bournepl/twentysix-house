# Video Phase 1: FFmpeg Tooling

วันที่ดำเนินการ: 18 กันยายน 2026

## สถานะ

เสร็จแล้ว พร้อมเริ่มทดสอบการแปลงใน Phase 2

## เครื่องมือ

- FFmpeg 9.0.1 full build
- FFprobe 9.0.1
- ติดตั้งผ่าน Winget package `Gyan.FFmpeg` สำหรับผู้ใช้ปัจจุบัน

หลังติดตั้งควรเปิด terminal ใหม่เพื่อให้คำสั่ง `ffmpeg` และ `ffprobe` อยู่ใน PATH

## ไฟล์ที่เพิ่ม

- `tools/video-manifest.json` กำหนด source, slug, title, poster และนโยบายเสียง
- `tools/optimize-videos.mjs` อ่าน metadata และแปลงวิดีโอ
- npm script ใน `package.json`

## คำสั่ง

ตรวจ metadata โดยไม่สร้างไฟล์:

```powershell
npm run videos:probe
```

ดูคำสั่งแปลงโดยไม่สร้างไฟล์:

```powershell
npm run videos:optimize:dry-run
```

Dry-run เฉพาะคลิป:

```powershell
npm run videos:optimize:dry-run -- --slug khun-tae-home-handover
```

แปลงทุกคลิปด้วยค่าพื้นฐาน:

```powershell
npm run videos:optimize
```

แปลงเฉพาะคลิปและเปลี่ยน CRF/preset:

```powershell
npm run videos:optimize -- --slug khun-fai-testimonial --crf 23 --preset slow
```

หาก terminal ยังไม่เห็น FFmpeg สามารถกำหนด `FFMPEG_PATH` และ `FFPROBE_PATH` เป็น absolute path ก่อนรัน script

## ค่าการแปลงพื้นฐาน

- MP4
- H.264 `libx264`
- สูงสุด 1920px และรักษาอัตราส่วนภาพ
- ลด frame rate เป็น 30fps เฉพาะ source ที่เกิน 30fps
- รักษา 24fps และ 30fps เดิม
- CRF 23
- preset `slow`
- pixel format `yuv420p`
- AAC 128kbps, 48kHz, stereo
- `faststart` สำหรับเริ่มเล่นผ่านเว็บก่อนดาวน์โหลดครบ
- output เริ่มต้นที่ `.tmp/video-optimized`

## มาตรการป้องกัน

- อ่าน source จาก manifest เท่านั้น
- ตรวจว่า source อยู่ภายในโฟลเดอร์ที่กำหนด
- ไม่แก้ไขหรือลบไฟล์ต้นฉบับ
- ปฏิเสธทันทีเมื่อ output หรือไฟล์ `.partial.mp4` มีอยู่แล้ว
- สร้างไฟล์ `.partial.mp4` ก่อนและ rename หลัง FFmpeg สำเร็จ
- map เฉพาะ video stream แรกและ audio stream แรก
- สร้าง `video-optimization-report.json` หลังแปลงจริง
- รายงาน metadata ก่อนและหลังแปลง

## ผลทดสอบ

- `npm run videos:probe` อ่านครบ 6 manifest entries
- ยืนยัน H.264 + AAC และรายละเอียด stream ทุกคลิป
- Dry-run คลิปคุณเท่สร้างคำสั่งลด 100fps เป็น 30fps ถูกต้อง
- Dry-run ไม่สร้างไฟล์ผลลัพธ์
- FFmpeg decode ต้นฉบับครบ 6 คลิปจนจบโดยไม่มี error

## Phase ถัดไป

Phase 2 จะเริ่มจากคลิปตัวอย่างหนึ่งคลิปและสร้าง CRF 21, 23 และ 25 เพื่อเปรียบเทียบคุณภาพกับขนาด ก่อนเลือกค่าที่ใช้กับทั้งชุด
