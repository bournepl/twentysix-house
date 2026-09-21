# Video Phase 6: Deployment Cleanup

## Backup verification

- External backup: `D:\backup2025\twentysix-house\video-originals-2026-09-18`
- Six unique original videos are present in the backup.
- File sizes and SHA-256 hashes matched the source files before deletion.
- The backup manifest is `video-backup-manifest.csv` in the external backup directory.

## Removed from source assets

- Six original videos under `src/assets/img/Photo/02 ผลงานการส่งมอบจริง`: approximately 2,101 MB.
- Four duplicate original videos under `src/assets/video`: approximately 937.1 MB.
- Total removed from `src/assets`: approximately 3,038.1 MB.
- Images and non-video project files in those directories were not removed.

## Safeguards

- Angular asset rules ignore MP4/MOV files in both legacy source locations.
- `.vercelignore` prevents those locations from being uploaded if an original is accidentally restored.
- Runtime source files contain no references to the removed original video paths.
- The reusable optimization manifest remains available. Future conversion must pass the external backup through the script's `--source` option.

## Final build result

- Production build completed successfully.
- 30 routes were prerendered.
- Browser output decreased from approximately 1,106.9 MB to 169.8 MB.
- Browser output contains 609 files.
- Exactly three videos are present, all under `assets/videos`.
- Published videos total approximately 89.1 MB.
- Largest deployed file is approximately 45.4 MB.
- No unexpected MP4/MOV files remain in build output.
- Local Range Request checks returned `206 Partial Content` and `video/mp4` for all three published clips.

## Deferred to Phase 7

- Vercel production deployment and production URL checks.
- Cross-browser and mobile playback QA.
- Network throttling and Core Web Vitals measurement.
- Git history rewriting, if repository size remains a problem, as a separately approved operation.
