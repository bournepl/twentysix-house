# Pre-deploy Phase 3: Deployment Size and Video Delivery

วันที่ตรวจรับ: 22 กันยายน 2026
สถานะ: เสร็จสมบูรณ์สำหรับ GitHub → Vercel และพร้อมตรวจซ้ำบน Preview

## ข้อสรุป

วิดีโอ production ยังคงเก็บเป็น Vercel static assets เพราะมีเพียง 3 ไฟล์ รวม `93.48 MB` (`89.15 MiB`) และแต่ละไฟล์มีขนาดต่ำกว่า 100 MB การย้ายไป media CDN ยังไม่จำเป็นในขณะนี้

โปรเจกต์ใช้ GitHub integration ไม่ได้ส่ง source ด้วย Vercel CLI ดังนั้นข้อจำกัด source upload 100 MB ของ Hobby CLI ไม่ใช่เส้นทาง deployment หลัก อย่างไรก็ตาม วิดีโอถูกเก็บด้วย Git LFS จึงต้องเปิด Git LFS support ใน Vercel Project Settings เพื่อให้ build จาก GitHub ดึงไฟล์จริงแทน pointer

อ้างอิง:

- [Vercel Limits](https://vercel.com/docs/limits)
- [Vercel Git LFS settings](https://vercel.com/docs/project-configuration/git-settings)

## สิ่งที่เปลี่ยน

- ลบกฎ `.vercelignore` ที่สะกด path ผิดเป็น `src/assets/video`
- ไม่ ignore `src/assets/videos` เพราะเป็น optimized production assets ที่ Angular ต้องใช้ตอน build
- คงการ ignore วิดีโอต้นฉบับใน `source-media` และ `src/assets/img/Photo/02 ผลงานการส่งมอบจริง`
- เปลี่ยน `npm run videos:probe` ให้ตรวจไฟล์ production ใน `src/assets/videos` โดยตรง
- เก็บตัวตรวจ source ต้นฉบับเดิมไว้เป็น `npm run videos:probe:sources`
- เพิ่มเพดานรวมวิดีโอ production ที่ 100,000,000 bytes
- เพิ่มการตรวจ MP4 container, H.264, AAC, `yuv420p`, resolution, frame rate และ fast-start
- เพิ่ม `--require-build-output` สำหรับยืนยันว่าไฟล์ใน Angular build ตรงกับ source ทุกไบต์
- เพิ่ม cache policy สำหรับ `/assets/videos/(.*)` ใน `vercel.json`

## Video Inventory

| File | Size | Resolution | FPS | Codec | Fast-start |
| --- | ---: | --- | ---: | --- | --- |
| `khun-fai-testimonial-1080p.mp4` | 47.64 MB | 1920×1080 | 30 | H.264/AAC | ผ่าน |
| `khun-pui-home-handover-1080p.mp4` | 32.48 MB | 1920×1080 | 24 | H.264/AAC | ผ่าน |
| `khun-tae-home-handover-720p.mp4` | 13.36 MB | 1280×720 | 30 | H.264/AAC | ผ่าน |

รวม `93.48 MB` หรือ `89.15 MiB`

## Vercel Build Output

- `vercel build --yes`: ผ่าน โดยไม่มีการ deploy
- Static video output: 3 files, `89.15 MiB`
- Route order: video cache header → filesystem → SSR fallback
- Function file trace map: 32 entries
- Video entries ใน function file trace map: 0
- Local Vercel CLI 44.2.7 ยังคัดลอก static tree ไว้ใน `.func` directory ทางกายภาพ แต่ไฟล์วิดีโอไม่อยู่ใน function trace map และ URL ถูก filesystem route รับก่อน SSR

Cache policy:

```text
public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400
```

ไม่ได้ใช้ `immutable` เพราะชื่อไฟล์วิดีโอยังไม่ได้ทำ content hashing และอาจมีการแทนไฟล์ชื่อเดิมในอนาคต

## HTTP Validation

Range request `bytes=0-1023` ผ่านครบทั้งสามไฟล์:

- HTTP `206 Partial Content`
- `Content-Length: 1024`
- `Content-Range` ตรงกับขนาดไฟล์จริง
- `Content-Type: video/mp4`

Browser automation ไม่พร้อมใช้งานในสภาพแวดล้อมตรวจครั้งนี้ จึงยังไม่ได้ตรวจภาพและเสียงด้วย browser จริง การตรวจ playback บน Vercel Preview ยังคงเป็น gate ใน Phase 7

## Regression Checks

- Production/prerender build: ผ่าน 36 routes
- `npm run videos:probe -- --require-build-output`: ผ่าน
- Prerender crawl: ผ่าน 30 canonical routes
- Structured data: ผ่าน 30 routes และ BlogPosting 5 หน้า
- Blog SEO: ผ่าน 5 canonical articles และ 10 redirects
- Media attributes: ผ่าน

## Checklist บน Vercel Dashboard

1. เปิด Git LFS support ที่ Project Settings → Git
2. ตรวจว่า Production Branch และ repository ถูกต้อง
3. หลังมี Preview ให้ตรวจ response `206`, cache header และ playback ของทั้งสามคลิป
4. หากเพิ่มคลิปแล้วรวมเกิน 100 MB ให้ลด bitrate/resolution หรือย้ายวิดีโอไป media CDN
5. ห้าม deploy production จนกว่า Phase 0-6 จะผ่านครบ
