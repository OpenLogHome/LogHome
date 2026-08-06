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
  startParagraphId: '7', // Optional. Omit to prepare without autoplay.
  bookTitle: 'Book title',
  coverUrl: 'https://example.com/cover.jpg'
});
```

Opening the same ordered article list again reuses the active native queue.
Passing `startParagraphId` seeks to that paragraph and begins playback.

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
