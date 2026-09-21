# Video Phase 3: Posters and Content

วันที่ดำเนินการ: 18 กันยายน 2026

## สถานะ

สร้าง poster และข้อมูลวิดีโอครบ 6 คลิปแล้ว ส่วน caption `.vtt` ยังรอการถอดเสียงและตรวจทานคำพูดจริง เพื่อไม่เผยแพร่ข้อความที่คลาดเคลื่อนจากเจ้าของบ้าน

## Poster

- สร้างจากไฟล์วิดีโอที่แปลงใน `.tmp/video-optimized`
- รูปแบบ WebP ขนาด 1280x720 อัตราส่วน 16:9
- quality 82 และ compression level 6
- เก็บที่ `src/assets/img/videos/posters`
- ขนาดต่อไฟล์ประมาณ 40-78 KB
- เลือกภาพเจ้าของบ้านสำหรับคลิปสัมภาษณ์ และภาพบ้านที่เห็นโครงการชัดสำหรับคลิปพาชมหรือส่งมอบ

## ข้อมูลวิดีโอ

แต่ละรายการใน `tools/video-manifest.json` มีข้อมูลต่อไปนี้แล้ว:

- `slug`
- `title` ภาษาไทย
- `description` สำหรับแสดงบนหน้าเว็บ
- `transcriptSummary` สรุปสาระของคลิป
- `poster` และ `posterTimeSeconds`
- `captionStatus`
- นโยบายเก็บเสียงด้วย `preserveAudio`

หน้า Home ใช้ poster ใหม่ครบทุกคลิป และแสดง title/description ของคลิปที่กำลังเลือกแบบ dynamic

## การตรวจสอบ

- ตรวจ syntax ของโปรแกรมและ JSON ผ่าน
- `npm run videos:posters:dry-run` อ่าน manifest ครบ 6 รายการ
- poster ทั้ง 6 ไฟล์ตอบกลับจาก dev server ด้วย HTTP 200 และ `Content-Type: image/webp`
- ไม่มี poster ที่หายจาก path ใน manifest
- ขนาด poster รวมประมาณ 336.6 KB
- Angular production build และ prerender 30 routes ผ่าน โดยทดสอบใน `.tmp/build-phase3`

## คำสั่งสร้าง Poster

ตรวจคำสั่งโดยไม่เขียนไฟล์:

```powershell
npm run videos:posters:dry-run
```

สร้าง poster ครบทุกคลิป:

```powershell
npm run videos:posters
```

สร้างเฉพาะคลิป:

```powershell
npm run videos:posters -- --slug khun-fai-testimonial
```

สามารถกำหนดตำแหน่ง optimized video ด้วย `--input` และกำหนด FFmpeg ผ่าน `FFMPEG_PATH`

## Caption ที่ยังค้าง

ทุกคลิปมีเสียงพูด จึงไม่ควรสร้าง `.vtt` จากข้อความสรุปหรือการคาดเดา ขั้นตอนที่เหลือคือ:

1. ถอดเสียงภาษาไทยพร้อม timestamp
2. ตรวจชื่อบุคคล ชื่อสถานที่ และศัพท์งานก่อสร้าง
3. ให้ผู้ดูแลเนื้อหาตรวจทานข้อความ
4. สร้าง UTF-8 WebVTT และเพิ่ม `<track kind="captions">` ใน player

ระหว่างนี้ `captionStatus` ถูกกำหนดเป็น `pending-transcription` และ `captions` เป็น `null` อย่างชัดเจน
