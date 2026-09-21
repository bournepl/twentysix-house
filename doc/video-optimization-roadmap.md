# Video Optimization Roadmap

วันที่จัดทำ: 18 กันยายน 2026

## ภาพรวมปัจจุบัน

- หน้า Home ใช้วิดีโอ 6 คลิป
- ขนาดรวมประมาณ 2.05 GB
- ไฟล์ใหญ่ที่สุดประมาณ 844 MB
- มีทั้ง `.mp4`, `.mov` และ `.MOV`
- วิดีโอถูกเก็บอยู่ใน `src/assets` และถูกรวมไปกับ deployment
- เครื่องปัจจุบันยังไม่มีคำสั่ง `ffmpeg` และ `ffprobe`
- หน้า Home โหลดวิดีโอที่เลือกด้วย `preload="metadata"` และเริ่มเล่นเมื่อเลื่อนเข้ามาใน viewport

## เป้าหมาย

1. ลดขนาด deployment และ bandwidth ของ Vercel
2. ให้ผู้ใช้เริ่มดูวิดีโอได้เร็วขึ้นทั้ง Desktop และ Mobile
3. ไม่ดาวน์โหลดวิดีโอที่ผู้ใช้ยังไม่ได้เลือก
4. รักษาคุณภาพภาพบ้าน เสียงสัมภาษณ์ และไฟล์ต้นฉบับ
5. มีขั้นตอนแปลงไฟล์ที่ทำซ้ำได้เมื่อเพิ่มวิดีโอใหม่
6. รองรับ SEO, Accessibility และการวัดผลหลัง deploy

---

## Phase 0: Backup และ Inventory

**เป้าหมาย:** ป้องกันไฟล์ต้นฉบับสูญหายและจัดทำรายการก่อนเริ่มแปลง

**สถานะ:** เสร็จด้าน backup และ technical integrity - content review ของ poster/ช่วงตัดต้องเสร็จก่อน production

### งาน

- [x] สำรองวิดีโอต้นฉบับทั้ง 6 คลิปไว้นอก repository
- [x] ยืนยันว่า FFmpeg decode stream ภาพและเสียงได้ครบจนจบทุกไฟล์ และ backup มี SHA-256 ตรงกับต้นฉบับ
- [x] บันทึกชื่อไฟล์ ขนาด ความยาว ความละเอียด FPS video/audio codec และ bitrate ด้วย FFprobe
- [x] กำหนด slug ภาษาอังกฤษให้แต่ละคลิป
- [x] จับคู่ชื่อโครงการ ชื่อลูกค้า poster และข้อความบนหน้าเว็บ พร้อมบันทึกจุดที่ต้องยืนยัน
- [x] กำหนดให้เก็บเสียงทุกคลิปในรอบแปลงแรก และไม่ตัดช่วงใดอัตโนมัติ

### Definition of Done

- มีไฟล์ต้นฉบับอย่างน้อยหนึ่งชุดนอก repository
- มี inventory ของวิดีโอทุกคลิป
- ยังไม่มีการลบหรือเขียนทับไฟล์ต้นฉบับ

---

## Phase 1: ติดตั้งเครื่องมือและสร้างโปรแกรมแปลง

**เป้าหมาย:** ทำให้การแปลงวิดีโอเป็นขั้นตอนอัตโนมัติและทำซ้ำได้

**สถานะ:** เสร็จแล้ว - probe ครบ 6 ไฟล์และ dry-run ผ่าน

### งาน

- [x] ติดตั้ง FFmpeg ซึ่งมีทั้ง `ffmpeg` และ `ffprobe`
- [x] สร้าง script ใน `tools/` สำหรับอ่านไฟล์จากโฟลเดอร์ต้นทาง
- [x] ให้ script ใช้ `ffprobe` อ่านข้อมูลก่อนแปลง
- [x] ให้ script สร้างชื่อไฟล์มาตรฐานโดยไม่ใช้ช่องว่างหรืออักษรไทย
- [x] ป้องกันการเขียนทับไฟล์ต้นฉบับ
- [x] สร้างรายงานก่อนและหลังแปลง เช่น codec, resolution, duration และขนาดไฟล์
- [x] เพิ่ม npm script `videos:probe`, `videos:optimize` และ `videos:optimize:dry-run`

### ค่าพื้นฐานที่แนะนำ

- Container: MP4
- Video codec: H.264
- Audio codec: AAC
- Resolution: สูงสุด 1920x1080
- Frame rate: สูงสุด 30fps
- Pixel format: `yuv420p`
- Web optimization: `faststart`
- Audio bitrate: 128kbps
- Constant Rate Factor เริ่มต้น: CRF 23

ควรทดสอบ CRF 21, 23 และ 25 กับคลิปตัวอย่างก่อนเลือกค่ากลาง เพราะภาพสถาปัตยกรรมมีเส้นตรงและรายละเอียดวัสดุที่ไม่ควรเสียมากเกินไป

### Definition of Done

- รันคำสั่งเดียวแล้วแปลงวิดีโอได้
- ไฟล์ผลลัพธ์เปิดเล่นได้บน Chrome, Safari และ Mobile
- โปรแกรมไม่ลบหรือแก้ไขไฟล์ต้นฉบับ

---

## Phase 2: แปลงและตรวจคุณภาพวิดีโอ

**เป้าหมาย:** ลดขนาดไฟล์โดยรักษาคุณภาพที่เหมาะกับเว็บไซต์

**สถานะ:** งานแปลงและตรวจสอบเชิงเทคนิคเสร็จแล้ว - รอทดสอบ lip-sync ด้วยการฟังและตรวจบนอุปกรณ์จริงก่อนนำขึ้น production

### งาน

- [x] แปลงคลิปตัวอย่างหนึ่งคลิปเป็น 1080p
- [x] เปรียบเทียบคุณภาพกับต้นฉบับในฉากภายนอก ภายใน และฉากที่มีการเคลื่อนไหว
- [x] ตรวจจุดเริ่มต้นและระยะเวลาของ stream ภาพและเสียง (เหลือฟัง lip-sync บนอุปกรณ์จริงก่อน production)
- [x] ทดสอบ CRF 21, 23 และ 25 แล้วเลือก CRF 23
- [x] แปลงครบทั้ง 6 คลิป
- [ ] สร้างรุ่น 720p สำหรับ Mobile หากไม่เลือกใช้ HLS (รอตัดสินใจร่วมกับ Phase 4)
- [x] ยืนยันว่า metadata สำคัญและ orientation ถูกต้อง
- [x] บันทึกขนาดรวมก่อนและหลังแปลง

ผลการดำเนินงานโดยละเอียดอยู่ใน `doc/video-phase-2-quality-and-conversion.md`

### เป้าหมายขนาด

- คลิปทั่วไปประมาณ 15–60 MB ต่อคลิป ขึ้นอยู่กับความยาว
- ขนาดรวมควรลดลงอย่างมีนัยสำคัญจาก 2.05 GB
- ไม่กำหนดเป้าขนาดตายตัวหากทำให้ตัวหนังสือ เส้นอาคาร หรือรายละเอียดวัสดุแตก

### Definition of Done

- วิดีโอทุกคลิปเล่นได้ตั้งแต่ต้นจนจบ
- ไม่มีเสียงหาย ภาพกลับด้าน ภาพกระตุก หรือสีผิดปกติ
- ได้รับการตรวจภาพด้วยสายตาก่อนนำขึ้น production

---

## Phase 3: Poster, Caption และข้อมูลวิดีโอ

**เป้าหมาย:** ให้หน้าวิดีโอแสดงผลเร็ว อ่านง่าย และรองรับผู้ใช้มากขึ้น

**สถานะ:** Poster และข้อมูลวิดีโอเสร็จแล้ว - รอถอดเสียงที่ถูกต้องก่อนสร้างไฟล์ `.vtt`

### งาน

- [x] เลือกเฟรมปกที่สื่อถึงแต่ละโครงการ
- [x] สร้าง poster เป็น WebP ขนาดเหมาะกับพื้นที่แสดงผล
- [x] ใช้อัตราส่วน 16:9 ขนาด 1280x720 เหมือนกันทุกคลิปเพื่อลด layout shift
- [x] ตั้งชื่อและคำอธิบายภาษาไทยให้แต่ละคลิป
- [ ] สร้างคำบรรยาย `.vtt` สำหรับคลิปสัมภาษณ์หรือคลิปที่มีเสียงพูด (รอถอดเสียงที่ตรวจทานแล้ว)
- [x] เพิ่มสรุปเนื้อหาสั้นสำหรับทุกคลิป
- [x] ตรวจว่า poster ไม่มืด ไม่เบลอ และเห็นเนื้อหาหลักชัดเจน

ผลการดำเนินงานโดยละเอียดอยู่ใน `doc/video-phase-3-posters-and-content.md`

### Definition of Done

- ทุกคลิปมี poster, title และ description
- คลิปที่มีบทพูดสำคัญมี caption หรือ transcript

---

## Phase 4: เลือก Video Hosting และ CDN

**เป้าหมาย:** ไม่ให้ Vercel เป็นผู้ส่งวิดีโอขนาดใหญ่โดยตรง

**สถานะ:** พักไว้ชั่วคราว ผู้ใช้เลือกส่ง optimized MP4 จาก Vercel static assets ก่อน โดยเผยแพร่ 3 คลิปรวมประมาณ 89.1 MB และยังไม่ deploy จนกว่าเว็บไซต์จะเสร็จทั้งหมด รายละเอียดอยู่ที่ `doc/video-direct-vercel-deployment.md`

### ตัวเลือก

1. **Cloudflare Stream หรือ Bunny Stream**
   - เหมาะกับ adaptive streaming และการจัดการวิดีโอแบบครบวงจร
   - รองรับคุณภาพตามความเร็วอินเทอร์เน็ต

2. **Cloudflare R2 พร้อม CDN**
   - เหมาะกับไฟล์ MP4 ที่แปลงไว้แล้ว
   - ควบคุมชื่อไฟล์และ URL ได้ง่าย
   - ต้องจัดการการแปลงไฟล์และคุณภาพเอง

3. **YouTube หรือ Vimeo Embed**
   - ดูแลง่าย แต่มี branding, cookie และรูปแบบ player ของผู้ให้บริการ

### งาน

- [ ] เลือกผู้ให้บริการ
- [ ] กำหนด domain หรือ URL สำหรับวิดีโอ production
- [ ] อัปโหลดไฟล์ที่ผ่านการตรวจคุณภาพแล้ว
- [ ] ตั้ง Content-Type, CORS และ cache headers
- [ ] ตรวจ Range Request เพื่อให้เลื่อนไปช่วงต่าง ๆ ของคลิปได้
- [ ] ทดสอบ URL จาก Desktop และ Mobile
- [ ] เก็บ URL ในข้อมูลวิดีโอแทน path ภายใน `src/assets`

### Definition of Done

- วิดีโอ production ไม่ถูกส่งจาก Angular bundle หรือ Vercel static assets
- CDN ตอบสนองการเล่นและ seek ได้ถูกต้อง

---

## Phase 5: ปรับ Frontend ให้โหลดเมื่อจำเป็น

**เป้าหมาย:** ไม่ดาวน์โหลดวิดีโอจนกว่าผู้ใช้กำลังจะดู

### งาน

- [x] เปลี่ยน video element เป็น `preload="none"`
- [x] แสดง poster โดยยังไม่กำหนด `src` ตอน SSR และ initial render
- [x] กำหนด `src` เมื่อ section ใกล้เข้า viewport หรือผู้ใช้กดเล่น
- [x] โหลดเพียงคลิปที่กำลังเลือก
- [x] Carousel thumbnail ใช้เฉพาะ poster และไม่ preload video
- [x] ยกเลิก request หรือ reset player อย่างเหมาะสมเมื่อเปลี่ยนคลิป
- [x] แสดง loading, error และ retry state
- [x] รองรับ `prefers-reduced-motion`
- [x] รองรับ `<track kind="captions">` แบบ conditional เมื่อมีไฟล์ `.vtt` (ไฟล์คำบรรยายจริงยังรอ transcription)
- [x] ไม่เพิ่ม HLS player เพราะ production รอบนี้ใช้ direct MP4

### Definition of Done

- เปิดหน้า Home แล้วยังไม่มีการดาวน์โหลดไฟล์วิดีโอเต็มทันที
- คลิปเริ่มเล่นได้หลังเลือกโดยไม่มี layout shift
- เปลี่ยนคลิปแล้ว player, poster, title และ caption ตรงกัน

**สถานะ:** พัฒนาและตรวจ production build แล้ว รายละเอียดอยู่ที่ `doc/video-phase-5-lazy-loading.md`

---

## Phase 6: ลบไฟล์หนักออกจาก Deployment

**เป้าหมาย:** ลดขนาด source และ deployment หลัง CDN ทำงานสมบูรณ์

### งาน

- [ ] ยืนยัน production URL ทุกคลิป (รอ deploy ใน Phase 7; local URLs ผ่าน 206 Partial Content แล้ว)
- [x] ยืนยันว่าไฟล์ต้นฉบับมี backup ภายนอก repositoryและ SHA-256 ตรงกัน
- [x] ลบวิดีโอขนาดใหญ่ออกจาก `src/assets`
- [x] ตรวจว่าไม่มี runtime path เก่าเหลือใน TypeScript, HTML, SCSS หรือ JSON
- [x] ตรวจขนาด build และจำนวนไฟล์ก่อน deploy
- [x] พิจารณา Git history แล้วและแยกเป็นงานภายหลัง ไม่ rewrite history ใน Phase นี้

> การล้าง Git history เป็นงานที่มีผลกับทุก branch และผู้ร่วมงาน ไม่ควรทำพร้อมกับการลบไฟล์ทั่วไปโดยไม่มี backup และแผนแจ้งทีม

### Definition of Done

- Build ไม่มีวิดีโอต้นฉบับขนาดใหญ่
- หน้า Home ยังเล่นวิดีโอครบทุกคลิปจาก optimized static assets

**สถานะ:** งาน local และ build cleanup เสร็จแล้ว เหลือ production URL verification ใน Phase 7 รายละเอียดอยู่ที่ `doc/video-phase-6-deployment-cleanup.md`

---

## Phase 7: QA, Performance และ Production Verification

**เป้าหมาย:** ตรวจว่าการปรับวิดีโอช่วยเว็บไซต์จริงและไม่สร้าง regression

### งาน

- [ ] ทดสอบ Chrome, Edge, Safari และเบราว์เซอร์ Mobile (รอ browser QA)
- [ ] ทดสอบ Wi-Fi, Fast 4G และ Slow 4G (HTTP transport smoke test ผ่าน; รอ browser playback QA)
- [x] ตรวจ autoplay implementation, muted, controls และ playsinline (caption track พร้อม แต่ `.vtt` ยังรอ transcription)
- [x] ตรวจ Network ว่า SSR/initial HTML ไม่มี video `src` หรือ `.mp4`
- [ ] ตรวจ LCP, CLS และ INP ใน browser (บันทึก build size และ transferred video range แล้ว)
- [ ] ทดสอบ video carousel, ปุ่มก่อนหน้า/ถัดไป และการเลือกคลิปใน browser
- [x] ตรวจ fallback implementation และยืนยัน missing video ตอบ HTTP 404
- [ ] Deploy บน Vercel และตรวจ production URL จริง (พักไว้จนกว่า SEO Roadmap เสร็จ)
- [x] บันทึกตัวเลขก่อนและหลังปรับปรุง

### Definition of Done

- ไม่มีวิดีโอ request ที่ไม่จำเป็นตอนเปิดหน้า
- Mobile เล่นคลิปได้โดยไม่ดาวน์โหลดไฟล์คุณภาพสูงเกินความจำเป็น
- ไม่มี layout shift จาก poster หรือ player
- Deployment และ Core Web Vitals ดีขึ้นจากค่าก่อนปรับ

**สถานะ:** QA ระดับ production build, SSR, HTTP, codec และ full decode เสร็จแล้ว ยังไม่ deploy และยังเหลือ browser/Core Web Vitals QA รายละเอียดอยู่ที่ `doc/video-phase-7-predeploy-qa.md`

---

## ลำดับดำเนินการที่แนะนำ

1. Phase 0 สำรองและทำ inventory
2. Phase 1 ติดตั้ง FFmpeg และสร้าง script
3. Phase 2 แปลงและตรวจคุณภาพ
4. Phase 3 สร้าง poster/caption
5. Phase 4 อัปโหลด CDN
6. Phase 5 ปรับ Angular lazy loading
7. Phase 6 ลบไฟล์หนักออกจาก deployment
8. Phase 7 ตรวจ performance และ production

ไฟล์ต้นฉบับถูกนำออกจาก `src/assets` ใน Phase 6 หลัง Phase 5 ผ่านการทดสอบและ SHA-256 ของ backup ภายนอกตรงกันครบแล้ว
