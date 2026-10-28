# Native audiobook player

The Android layer owns audiobook playback, queueing, TTS selection, playback
speed, seeking, sleep timers, MediaSession integration, and player UI.

The reader H5 page has only two responsibilities:

1. Open the native player with the ordered article IDs.
2. Highlight and navigate to the paragraph reported by Android.

This contract is used by both the paginated reader
(`pages/readers/newReader/article.vue`) and the scrolling reader
(`pages/readers/article_rich.vue`). The scrolling reader starts from the first
visible paragraph and loads the target chapter before scrolling when playback
crosses a chapter boundary.

## Open the player

```javascript
await window.jsBridge.openNativeAudiobookPlayer({
  articleIds: ['1001', '1002'],
  startArticleId: '1001',
  startParagraphId: '7', // Optional initial paragraph.
  forceSeek: true, // Use only for an explicit 'listen from this paragraph' action.
  bookTitle: 'Book title',
  coverUrl: 'https://example.com/cover.jpg'
});
```

Opening the same ordered article list again reuses the active native queue.
Opening the player restores the last selected voice and starts playback.
`startParagraphId` chooses the initial paragraph for a new queue. Reopening an
existing queue preserves both its paragraph and position unless `forceSeek: true`
explicitly requests a jump. The scrolling reader sends its visible paragraph as
an initial hint without forcing a seek; paragraph actions explicitly force it.
Login-token rotation is revalidated against the backend user ID, preserving the
queue when the user is unchanged and resetting it on an actual account switch.

## Paragraph progress event

Android emits a browser event only when the active paragraph changes:

```javascript
window.addEventListener('loghome:audiobook-progress', event => {
  const { articleId, paragraphId, chapterTitle, isPlaying } = event.detail;
  // Navigate/highlight only. Do not drive playback from this callback.
});
```

Continuous position updates stay inside the native player and are not sent to
H5, avoiding polling and unnecessary WebView work.

## Unified online TTS

Configure the LogHome backend in `loghome-android/gradle.properties`:

```properties
backend_endpoint=https://api.loghome.ink
# To use the development machine's backend from an Android emulator:
# backend_endpoint=http://10.0.2.2:9000
```

Rebuild and reinstall the app after changing the value. A physical device should
use the development machine's reachable LAN address instead of `10.0.2.2`.
Both debug and release builds use this setting for native token and chapter
requests. The address is also injected as `window.jsBridge.backendEndpoint`,
which the WebView frontend uses for its backend requests. Rebuild the H5 bundle
as well when updating an older frontend that does not yet read this property.

The player exposes four free voices: 温润君子 (default), 阳光少年, 青春女神,
and 软糯萝莉. Edge, Android system speech, local model downloads, and offline
fallbacks have been removed, along with their bundled native runtimes.
Starting the service removes old `tts_models` and legacy audio cache files.

The injected `jsbridge.js` adds the current LogHome login token to native player
entry points. `openNativeAudiobookPlayer` accepts `loginToken` in its payload;
legacy `replacePlaylist` accepts it as the third argument. The H5 component also
supplies it explicitly for compatibility. Tokens must never be logged.

Before opening a queue, Android authenticates with `POST /tts/session` on the
LogHome backend. It retains the returned user token and resolved voice IDs only
in memory. Synthesis then goes directly to the TTS site with the user token.
The request omits `model` to follow the deployed default. A TTS 401 refreshes the
session once; temporary queue saturation has bounded retries. There are no old
engine fallbacks. Text is split below the upstream 1000-character limit without
breaking surrogate pairs. WAV headers are rebuilt when combining chunks to keep
duration and seeking correct. Audio is written atomically and cached per user and
resolved voice in `audio_cache_tts_v1`.

Backend deployment and the response contract are documented in
`loghome-backend/docs/tts.md` at the repository root.

## Playback experience

- `native_audiobook` preferences retain the selected voice across service and app
  restarts. Removed or unknown voice IDs fall back to 温润君子.
- A single prefetch worker caches the current paragraph and the next three. It
  rechecks the current queue after each download, so seeking refills the new
  window. The player and worker share per-file synthesis locks, and voice changes
  preserve completed caches for reuse.
- The book cover supplies the square cover, a small filtered background thumbnail,
  and MediaItem artwork metadata for notifications and the lock screen.
- The player uses a fixed layout. The cover shrinks to available height on compact
  screens, keeping controls on screen without vertical scrolling.
- While the player is visible, volume keys bypass the H5 reader listener and use
  the system media volume controls. Collapsing the player restores the reader's
  existing key handling.
