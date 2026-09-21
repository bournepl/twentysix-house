# Video Phase 7: Pre-deploy QA

## Scope

This pass intentionally excludes Vercel deployment and production URL verification until the SEO Roadmap is complete.

## Production build and SSR

- Angular production build passed.
- 30 routes were prerendered.
- Local production SSR ran at `http://localhost:4500/`.
- Home, About, Services, Our Works, House Catalog, Blogs, Contact, `robots.txt`, and `sitemap.xml` returned HTTP 200.
- Initial Home HTML contains a poster and `preload="none"`, but no video `src` and no `.mp4` URL.
- The fixed 16:10 player dimensions prevent poster/player layout changes at the CSS level.

## Video delivery

All three published videos returned:

- HTTP `206 Partial Content`
- `Content-Type: video/mp4`
- `Accept-Ranges: bytes`
- `Cache-Control: public, max-age=31536000`
- Correct `Content-Range` values

The local production server returned HTTP 404 for a missing video URL, and the Angular player includes error and retry UI.

## Codec and integrity

All published videos completed a full FFmpeg decode without errors.

| Video | Video | Pixel format | Resolution | FPS | Audio | Duration |
| --- | --- | --- | --- | --- | --- | --- |
| `khun-fai-testimonial-1080p.mp4` | H.264 High | yuv420p | 1920x1080 | 30 | AAC, 48kHz, stereo | 168.0s |
| `khun-pui-home-handover-1080p.mp4` | H.264 High | yuv420p | 1920x1080 | 24 | AAC, 48kHz, stereo | 134.9s |
| `khun-tae-home-handover-720p.mp4` | H.264 High | yuv420p | 1280x720 | 30 | AAC, 48kHz, stereo | 159.8s |

## Network smoke test

A 512KB Range Request for the 720p video completed successfully under three transport profiles:

| Profile | HTTP | Effective rate | Time |
| --- | --- | --- | --- |
| Local/Wi-Fi | 206 | ~91.8 MB/s | ~0.006s |
| Fast 4G simulation | 206 | ~1.15 MB/s | ~0.46s |
| Slow 4G simulation | 206 | ~225 KB/s | ~2.33s |

This validates byte-range delivery under throttling, not visual playback quality or buffering behavior in a real browser.

## Before and after

- Browser build output: approximately 1,106.9 MB before source cleanup, 169.8 MB after cleanup.
- Build output reduction: approximately 84.7%.
- Source videos removed from deployment paths: approximately 3,038.1 MB including duplicate originals.
- Published video payload: 3 files, approximately 89.1 MB total.
- Largest published file: approximately 45.4 MB.
- Initial SSR video request count: zero because no video URL appears in initial HTML.

## Pending after SEO completion

- Chrome and Edge interaction QA.
- Safari desktop and iOS playback QA.
- Android browser playback QA.
- Real Wi-Fi, Fast 4G, and Slow 4G playback/buffering tests.
- Carousel controls, video switching, autoplay, pause/resume, and retry UI verification in browsers.
- Lighthouse or equivalent LCP, CLS, and INP measurements on production-like and production URLs.
- Accurate Thai `.vtt` captions and caption control verification.
- Vercel deployment and production URL verification.
