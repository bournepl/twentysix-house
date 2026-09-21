# Video Phase 0: Backup และ Inventory

วันที่ตรวจสอบ: 18 กันยายน 2026

## สถานะ

สำรองและตรวจสอบความสมบูรณ์ทางเทคนิคเสร็จแล้วทั้ง 6 รายการ FFmpeg สามารถ decode stream ภาพและเสียงได้จนจบทุกไฟล์โดยไม่มี error

## ตำแหน่งข้อมูล

- ต้นฉบับในโปรเจกต์: `src/assets/img/Photo/02 ผลงานการส่งมอบจริง`
- สำเนานอก repository: `D:\backup2025\twentysix-house\video-originals-2026-09-18`
- Backup manifest: `D:\backup2025\twentysix-house\video-originals-2026-09-18\video-backup-manifest.csv`
- จำนวนวิดีโอ: 6 ไฟล์
- ขนาดรวม: ประมาณ 2.05 GB

ไม่มีการลบ ย้าย เขียนทับ หรือแก้ไขไฟล์ต้นฉบับใน Phase นี้

## ผลตรวจ Backup

- คัดลอกครบ 6 จาก 6 ไฟล์
- ตรวจ SHA-256 ต้นฉบับเทียบสำเนาครบ 6 ไฟล์
- SHA-256 ตรงกันทุกไฟล์
- ขนาดสำเนารวม 2.05 GB
- FFprobe อ่าน container, duration, codec, resolution, pixel format, frame rate และข้อมูลเสียงได้ทุกไฟล์
- FFmpeg decode stream ภาพและเสียงของต้นฉบับจนจบครบ 6 ไฟล์โดยไม่มี error
- สำเนามี SHA-256 ตรงกับต้นฉบับ จึงเป็นข้อมูลชุดเดียวกับไฟล์ที่ผ่านการ decode

## Technical Inventory

ค่าด้านล่างยืนยันด้วย FFprobe 9.0.1

| Slug ที่กำหนด | ไฟล์ | ขนาด | ความยาว | ความละเอียด | FPS | Video | Audio | Total bitrate |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | ---: |
| `khun-fai-testimonial` | `01 VDO Khun win Fai/K Fai Testimonial 2k 30fbs.mp4` | 286.4 MB | 02:47 | 2560x1440 | 30 | H.264 Main, yuv420p | AAC, 44.1kHz, stereo | 14,299 kbps |
| `khun-kak-home-handover` | `03 VDO Khun Kak/ส่งมอบบ้านคุณกั๊ก.mp4` | 267.5 MB | 03:14 | 1920x1080 | 60 | H.264 Main, yuv420p | AAC, 44.1kHz, stereo | 11,558 kbps |
| `khun-jane-finishing` | `05 VDO Khun Jane บ้านดุง/คลิป finishing khun Jane.MOV` | 200.3 MB | 01:29 | 2560x1440 | 30 | H.264 High, yuv420p | AAC, 44.1kHz, stereo | 18,660 kbps |
| `khun-pui-home-handover` | `06 VDO Khun Pui/คลิปส่งมอบคุณปุ้ย.mp4` | 182.9 MB | 02:14 | 1920x1080 | 24 | H.264 High, yuv420p | AAC, 48kHz, stereo | 11,360 kbps |
| `khun-tae-home-handover` | `09 VDO Khun Tae/คลิปส่งมอบคุณเท่.mov` | 844.4 MB | 02:39 | 1920x1080 | 100 | H.264 High, yuv420p | AAC, 48kHz, stereo | 44,259 kbps |
| `khun-looknam-interview` | `11 VDO Khun Looknam/VDO สัมภาษณ์คุณบูม และคุณลูกน้ำ.mov` | 319.4 MB | 04:01 | 1920x1080 | 24 | H.264 High, yuv420p | AAC, 48kHz, stereo | 11,068 kbps |

ทุกไฟล์มี video codec H.264, pixel format `yuv420p` และ audio codec AAC แบบ stereo จึงรองรับแนวทางแปลงเป็น MP4 H.264/AAC สำหรับเว็บได้โดยตรง

## SHA-256

| Slug | SHA-256 |
| --- | --- |
| `khun-fai-testimonial` | `3AC1E1450B840EFFA6987B15E508562C01FDA8DA2AF31BBE27C0035EE9090AFC` |
| `khun-kak-home-handover` | `31BA6DEB7E5BA5F139BD0E6100619D917052DA668D96495227EFCE1816B75FC2` |
| `khun-jane-finishing` | `8E04E14F32D3BDB0003F57212B4525AB6FFD7BA8FD7AB5D8DFB976E24C109E28` |
| `khun-pui-home-handover` | `0EDAFDDF9CAA24F5135ED09BC415E8B35191E113C69099ECBD49EEF75EA0E4EA` |
| `khun-tae-home-handover` | `678C837F0F0661E3D1D0573F53068D7CF958218FB186C7318EE1745A0D84C932` |
| `khun-looknam-interview` | `6B8DF4BB2981043B26D684510029D70810A6A61B0CF5BABA3CE2B7D782AC8A4E` |

## การจับคู่ข้อมูลหน้า Home ปัจจุบัน

| Slug | Title ปัจจุบัน | Poster ปัจจุบัน | แนวทางเสียง |
| --- | --- | --- | --- |
| `khun-fai-testimonial` | K Fai Testimonial | `assets/img/Collection/collection1.jpg` | ต้องเก็บเสียงสัมภาษณ์ |
| `khun-kak-home-handover` | ส่งมอบบ้านคุณกั๊ก | `assets/img/ourworks/posters/khun-aod.webp` | เก็บเสียงไว้จนกว่าจะตรวจเนื้อหา |
| `khun-jane-finishing` | ส่งมอบบ้านคุณเจน | `assets/img/ourworks/posters/khun-jane.webp` | เก็บเสียงไว้จนกว่าจะตรวจเนื้อหา |
| `khun-pui-home-handover` | ส่งมอบบ้านคุณปุ้ย | `assets/img/ourworks/posters/khun-pui.webp` | เก็บเสียงไว้จนกว่าจะตรวจเนื้อหา |
| `khun-tae-home-handover` | ส่งมอบบ้านคุณเท่ | `assets/img/ourworks/posters/khun-tae.webp` | เก็บเสียงไว้จนกว่าจะตรวจเนื้อหา |
| `khun-looknam-interview` | สัมภาษณ์คุณบูมและคุณลูกน้ำ | `assets/img/ourworks/posters/khun-looknam.webp` | ต้องเก็บเสียงสัมภาษณ์ |

Poster ของ `khun-kak-home-handover` อ้างถึงไฟล์ `khun-aod.webp` จึงต้องเปิดตรวจว่าเป็นภาพโครงการเดียวกันหรือเป็นการจับคู่ผิดก่อน Phase 3

## ข้อสังเกตสำหรับการแปลง

1. `khun-tae-home-handover` เป็น 100fps และ bitrate สูงถึงประมาณ 44 Mbps ควรทดสอบลดเป็น 30fps ก่อน เพราะเป็นต้นเหตุหลักของขนาดไฟล์
2. คลิป 1440p สองรายการสามารถสร้างรุ่นเว็บไซต์ 1080p โดยเก็บต้นฉบับ 1440p ไว้ใน backup
3. คลิป 60fps ของคุณกั๊กควรเปรียบเทียบ 30fps กับต้นฉบับก่อนเลือกค่าจริง
4. ทุกคลิปต้องเก็บ audio track ในรอบแปลงแรก การตัดเสียงหรือช่วงว่างต้องเป็นงานแก้เนื้อหาแยกต่างหาก
5. ห้ามใช้โปรแกรมแปลงเขียนผลลัพธ์กลับทับ path ของต้นฉบับ

## งานตรวจเนื้อหาก่อนเผยแพร่

- [x] ตรวจว่า FFmpeg decode ภาพและเสียงได้จนจบทั้ง 6 คลิป
- [ ] เปิดดูด้วยสายตาและฟังเสียงเพื่ออนุมัติเนื้อหาก่อนเผยแพร่
- [ ] ยืนยันว่า poster ของคุณกั๊กตรงกับโครงการ
- [ ] ยืนยันช่วงที่ต้องตัดออก หากมีช่วงดำ ช่วงว่าง หรือภาพที่ไม่ต้องการเผยแพร่

รายการที่เหลือเป็น content review และไม่ขัดขวางการทดสอบค่าการแปลงใน Phase 2 แต่ต้องเสร็จก่อนนำไฟล์ขึ้น production
