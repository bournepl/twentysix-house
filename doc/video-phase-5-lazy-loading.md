# Video Phase 5: Lazy Loading and Player States

## Completed

- The initial SSR and prerendered Home HTML contains a poster but no video `src`.
- The video element uses `preload="none"`.
- An `IntersectionObserver` assigns only the active video's URL when the player is within 320px of the viewport.
- Actual loading begins when at least 45% of the player enters the viewport, when the user presses play, or when the user selects another video.
- Changing videos pauses the old player, removes its `src`, calls `load()` to reset/cancel the old resource, and prepares only the selected item.
- Thumbnail cards use poster images with native lazy loading and async decoding.
- Loading, error, and retry states are available without changing the 16:10 player dimensions.
- Playback starts automatically while muted at 45% visibility, pauses after leaving the viewport, and resumes from the previous position when it returns.
- Reduced-motion users do not get automatic playback, and decorative player animation is disabled.
- A conditional Thai captions track is ready for future `.vtt` files.

## Verification

- Angular production build completed successfully.
- 30 routes were prerendered.
- Prerendered `index.html` contains no `.mp4` URL.
- Prerendered `<video>` contains `preload="none"` and a poster but no `src`.
- Production output contains three videos totaling approximately 89.1 MB.
- Original MP4/MOV files are excluded from production output.

## Pending content

- Accurate Thai `.vtt` captions still require transcription and timing review.
- HLS is intentionally not included while the project uses direct MP4 delivery.
