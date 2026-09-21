# Video Phase 2: Quality Test and Full Conversion

วันที่ดำเนินการ: 18 กันยายน 2026

## สถานะ

งานแปลงและตรวจสอบเชิงเทคนิคเสร็จแล้ว ไฟล์ผลลัพธ์ยังอยู่ใน `.tmp/video-optimized` และยังไม่ถูกนำไปแทนไฟล์ต้นฉบับใน `src/assets`

ก่อนนำขึ้น production ยังต้องเปิดฟัง lip-sync และทดสอบการเล่นจริงบน Chrome, Safari, iOS และ Android

## การเลือกคุณภาพ

ใช้ช่วงวิดีโอ 30 วินาทีของ `khun-jane-finishing` ทดสอบด้วย preset `slow` ที่ 1080p โดยเทียบ CRF 21, 23 และ 25

| ค่า | ขนาดตัวอย่าง | Video bitrate | SSIM | PSNR |
| --- | ---: | ---: | ---: | ---: |
| CRF 21 | 19.61 MB | 5,351 kbps | 0.9923 | 44.93 dB |
| CRF 23 | 14.55 MB | 3,935 kbps | 0.9908 | 43.76 dB |
| CRF 25 | 10.95 MB | 2,927 kbps | 0.9889 | 42.59 dB |

เลือก **CRF 23** เพราะยังรักษาขอบอาคาร รอยต่อวัสดุ ตัวหนังสือ และโทนสีได้ใกล้ต้นฉบับ แต่ลดขนาดจาก CRF 21 ได้ประมาณ 26%

ภาพเปรียบเทียบอยู่ใน `.tmp/video-quality-tests/frames` และไฟล์ทดสอบอยู่ใน `.tmp/video-quality-tests`

## ค่าที่ใช้แปลง

- Container: MP4
- Video: H.264 (`libx264`), CRF 23, preset `slow`
- Resolution: สูงสุด 1920x1080 และรักษาอัตราส่วนเดิม
- Frame rate: รักษา 24/30fps เดิม และลด source ที่สูงกว่า 30fps เป็น 30fps
- Pixel format: `yuv420p`
- Audio: AAC 128kbps, 48kHz, stereo
- Web playback: `faststart`
- ไม่ตัดความยาวและไม่ลบเสียง

## ผลลัพธ์

| Slug | ก่อนแปลง | หลังแปลง | ลดลง | ผลลัพธ์ |
| --- | ---: | ---: | ---: | --- |
| `khun-fai-testimonial` | 286.4 MB | 45.4 MB | 84.1% | 1080p, 30fps |
| `khun-kak-home-handover` | 267.5 MB | 65.7 MB | 75.4% | 1080p, 30fps |
| `khun-jane-finishing` | 200.3 MB | 53.2 MB | 73.5% | 1080p, 30fps |
| `khun-pui-home-handover` | 182.9 MB | 31.0 MB | 83.1% | 1080p, 24fps |
| `khun-tae-home-handover` | 844.4 MB | 41.0 MB | 95.1% | 1080p, 30fps |
| `khun-looknam-interview` | 319.4 MB | 66.8 MB | 79.1% | 1080p, 24fps |

ขนาดรวมลดจาก **2,101 MB** เหลือ **303 MB** หรือลดลง **85.6%**

## การตรวจสอบ

- FFmpeg decode-check ผ่านครบ 6/6 ไฟล์ทั้ง video และ audio stream
- ไม่เหลือไฟล์ `.partial.mp4`
- video/audio start time เป็น `0.000s` ทุกคลิป
- ระยะเวลา video/audio ต่างกันสูงสุดประมาณ `0.04s`
- ตรวจ contact sheet ที่ตำแหน่ง 20%, 50% และ 80% ของทุกคลิปแล้ว ไม่พบภาพกลับด้าน สัดส่วนผิด หรือสีผิดปกติ
- contact sheet อยู่ใน `.tmp/video-optimized/contact-sheets`
- รายงาน metadata อยู่ใน `.tmp/video-optimized/video-optimization-report.json`

## งานที่ยังไม่ทำ

- ยังไม่แทนที่หรือลบไฟล์ต้นฉบับ
- ยังไม่ย้ายไฟล์ผลลัพธ์เข้า `src/assets`
- ยังไม่สร้างรุ่น 720p เพราะต้องตัดสินใจเรื่อง CDN/HLS ใน Phase 4 ก่อน
- ยังไม่ตรวจ lip-sync ด้วยการฟังและยังไม่ทดสอบบน browser/mobile จริง

## ขั้นต่อไป

ดำเนินการ Phase 3 เพื่อจัดทำ poster, caption และข้อมูลวิดีโอ จากนั้นจึงตัดสินใจระบบจัดเก็บและส่งวิดีโอใน Phase 4
