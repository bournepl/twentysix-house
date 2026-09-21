# Pre-deploy Phase 0: Baseline and Recovery Point

วันที่ตรวจ: 21 กันยายน 2026
Branch: `pre-deploy-remediation`
สถานะ: เสร็จสมบูรณ์

## สรุป

Phase 0 เก็บ baseline ด้าน environment, build, SEO, security, routes และขนาด deployment แล้ว พร้อมสร้าง Git repository และ branch สำหรับงาน remediation

workspace เดิมมีเพียงโฟลเดอร์ `.git` ว่างและไม่มี commit history จึงได้ initialize repository ใหม่ พร้อมใช้ initial baseline commit บน branch นี้เป็น recovery point ก่อนเริ่มแก้ Phase 1

## Git Baseline

- Repository เดิม: ไม่มี metadata และไม่มี commit history
- Repository ปัจจุบัน: initialize แล้ว
- Branch: `pre-deploy-remediation`
- Recovery point: initial baseline commit ของ Phase 0
- Production MP4: จัดเก็บด้วย Git LFS

เพิ่ม ignore rules เพื่อไม่ให้ข้อมูล local ขนาดใหญ่เข้า Git โดยไม่ตั้งใจ:

- `.tmp`: ประมาณ 25.8 GB
- `source-media`: ประมาณ 215 MB
- `.firebase`
- Firebase emulator/debug logs
- Angular dev-server logs
- `src/environment.ts` ซึ่งมี local browser API key; ใช้ `src/environment.example.ts` เป็น template แทน

## Environment Baseline

| รายการ | เวอร์ชัน |
| --- | --- |
| Node.js | 20.10.0 |
| npm | 10.2.3 |
| Angular CLI | 17.3.11 |
| Angular runtime | 17.3.12 |
| Angular SSR | 17.3.11 |
| TypeScript | 5.4.5 |
| RxJS | 7.8.1 |
| Vercel CLI | 44.2.7 |

## Source และ Asset Baseline

| รายการ | จำนวน | ขนาดรวม |
| --- | ---: | ---: |
| ไฟล์ใต้ `src` | 693 | 167.06 MB |
| ไฟล์ใต้ `src/assets` | 570 | 166.42 MB |
| Production videos | 3 | 89.15 MB |
| `.tmp` local workspace | 10,931 | 25,775.58 MB |
| `source-media` | 443 | 215.26 MB |

Production videos:

| ไฟล์ | ขนาด |
| --- | ---: |
| `khun-fai-testimonial-1080p.mp4` | 45.44 MB |
| `khun-pui-home-handover-1080p.mp4` | 30.97 MB |
| `khun-tae-home-handover-720p.mp4` | 12.74 MB |

## Production Build Baseline

คำสั่ง `npm run build` ผ่านและ prerender สำเร็จ 30 routes

| รายการ | ค่า |
| --- | ---: |
| Browser output files | 624 |
| Browser output size | 146.69 MB |
| Largest deployed file | 45.44 MB |
| Initial bundle raw | 824.73 KB |
| Initial bundle estimated transfer | 167.71 KB |
| Global CSS raw | 381.74 KB |
| Main application bundle raw | 51.02 KB |
| Largest lazy chunk raw | 215.58 KB |

หมายเหตุ: `npm run build:ssr` มี pipeline inconsistency ตามรายงาน audit และจะจัดการใน Phase 2 ไม่ถือเป็น build baseline ที่ผ่าน

## SEO และ Routing Baseline

- Canonical/prerender routes: 30
- Unique titles: 30
- H1: หนึ่งรายการต่อ canonical page
- Legacy redirects ที่ตรวจ: 23
- Canonical blog articles: 5
- Legacy blog redirect definitions: 10
- Structured data: ผ่านเชิง syntax 30 routes และ 5 `BlogPosting`
- Broken internal links: ไม่พบ
- Orphan pages: ไม่พบ
- 404: ตอบ HTTP 404 พร้อม `noindex, follow`
- `robots.txt` และ `sitemap.xml`: ผ่าน local HTTP validation

รายการ canonical URL ใช้ไฟล์ [prerender-routes.txt](../prerender-routes.txt) เป็น source of truth

SHA-256:

```text
prerender-routes.txt
EF1CBAA50252FC888C1D12621E1745B7943AE4A40841C4F30467B193202E184D

package-lock.json
3C8939B2808BB6F7377703625F8E1FA3E3EA7F068EC1EC53FB67A05BB0201A71
```

## Security Baseline

ผล `npm audit` ทั้ง dependency tree:

| Severity | จำนวน |
| --- | ---: |
| Critical | 4 |
| High | 43 |
| Moderate | 24 |
| Low | 8 |
| รวม | 79 |

ผลเฉพาะ production dependencies (`npm audit --omit=dev`):

| Severity | จำนวน |
| --- | ---: |
| Critical | 1 |
| High | 8 |
| Moderate | 3 |
| Low | 1 |
| รวม | 13 |

Direct production packages ที่ต้องตรวจใน Phase 1:

- `@angular/ssr`: Critical
- `@angular/core`: High
- `@angular/common`: High
- `@angular/compiler`: High
- `@angular/platform-server`: High
- `express`: High
- `quill`: Moderate
- `sweetalert2`: Low

## Known Failing Gates

- `npm test -- --watch=false --browsers=ChromeHeadless`: ไม่มี test inputs
- `npm run videos:probe`: อ้าง source video path ที่ไม่มีแล้ว
- `npm run build:ssr`: จบด้วย exit code 0 แต่เขียนทับ `server.mjs` ทำให้ `serve:ssr` ใช้งานไม่ได้
- `vercel build`: ยังไม่มี local Project Settings จาก `vercel pull`
- Structured data logo URL ตอบ 404

รายการเหล่านี้เป็น baseline ที่จะจัดการใน Phase ถัดไป ไม่ได้แก้ใน Phase 0

## Phase 0 Checklist

- [x] ตรวจสถานะ Git repository
- [x] Initialize Git repository เมื่อยืนยันว่า `.git` เดิมว่าง
- [x] สร้าง branch `pre-deploy-remediation`
- [x] ป้องกัน local/generated files ขนาดใหญ่ด้วย `.gitignore`
- [x] บันทึก environment versions
- [x] บันทึก build และ bundle baseline
- [x] บันทึก source, asset และ video sizes
- [x] บันทึก production security baseline
- [x] ยืนยัน canonical routes 30 หน้า
- [x] กำหนด production MP4 ให้จัดเก็บด้วย Git LFS
- [x] ตรวจ staged files และสแกนข้อมูลลับก่อน commit
- [x] สร้าง initial recovery commit

## ผลการปิด Phase 0

- เลือกใช้ Git LFS สำหรับ `src/assets/videos/*.mp4`
- Local environment file ที่มี browser API key ถูก ignore และมี `environment.example.ts` แทน
- มี recovery point ก่อนเริ่ม dependency migration
- พร้อมเริ่ม Phase 1: Production Dependency Security
