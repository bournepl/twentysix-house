# Direct Video Deployment on Vercel

## Decision

Phase 4 (external video hosting/CDN) is temporarily skipped. The website serves the optimized MP4 files from Vercel static assets.

## Production assets

- Source directory: `src/assets/videos`
- Format: MP4 (H.264/AAC)
- Resolution: 1080p for two videos and 720p for one video
- Published videos: 3
- Total published video size: approximately 89.1 MB
- The third video uses a 720p rendition to keep the combined video payload below 100 MB.
- The remaining optimized outputs are retained outside `src/assets/videos` for future use.
- Original videos were removed from `src/assets` in Phase 6 after SHA-256 verification. The verified originals remain in the external backup directory.

## Build safeguards

- `angular.json` excludes original MP4/MOV files under both legacy source locations if files are accidentally restored later.
- `.vercelignore` prevents the original videos, temporary outputs, and local build outputs from being uploaded by the Vercel CLI.
- The Home video carousel references only files under `assets/videos`.

## Trade-offs

- There is no adaptive bitrate streaming.
- Video transfer is counted as Vercel bandwidth.
- A slow connection may take longer to start a 1080p file than an HLS rendition.
- If Vercel plan limits or bandwidth become restrictive, move the same optimized files to a video CDN and replace only the `src` URLs.

## Deployment checks

1. Run the production Angular build.
2. Confirm three optimized MP4 files are present under `browser/assets/videos` and their combined size is below 100 MB.
3. Confirm no original MP4/MOV files are present under the original Photo directory in build output.
4. Deploy to Vercel production.
5. Check the Home page, video playback, seeking, posters, `robots.txt`, and `sitemap.xml` on the production URL.
