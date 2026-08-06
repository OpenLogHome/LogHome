const READER_PREVIEW_STORAGE_PREFIX = "writerReaderPreview:";
const READER_PREVIEW_VERSION = 1;
const READER_PREVIEW_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getStorageKey(previewKey) {
  return `${READER_PREVIEW_STORAGE_PREFIX}${String(previewKey || "")}`;
}

function createPreviewKey() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function clearExpiredReaderPreviews(now = Date.now()) {
  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const storageKey = window.localStorage.key(index);
    if (!storageKey || !storageKey.startsWith(READER_PREVIEW_STORAGE_PREFIX)) {
      continue;
    }
    try {
      const payload = JSON.parse(window.localStorage.getItem(storageKey));
      if (
        !payload ||
        Number(payload.version) !== READER_PREVIEW_VERSION ||
        now - Number(payload.createdAt || 0) > READER_PREVIEW_MAX_AGE_MS
      ) {
        window.localStorage.removeItem(storageKey);
      }
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }
  }
}

export function storeReaderPreview(preview) {
  clearExpiredReaderPreviews();
  const previewKey = createPreviewKey();
  window.localStorage.setItem(
    getStorageKey(previewKey),
    JSON.stringify({
      version: READER_PREVIEW_VERSION,
      createdAt: Date.now(),
      ...preview,
    })
  );
  return previewKey;
}

export function readReaderPreview(previewKey) {
  if (!previewKey) return null;
  try {
    const storageKey = getStorageKey(previewKey);
    const payload = JSON.parse(window.localStorage.getItem(storageKey));
    if (
      !payload ||
      Number(payload.version) !== READER_PREVIEW_VERSION ||
      Date.now() - Number(payload.createdAt || 0) > READER_PREVIEW_MAX_AGE_MS ||
      !payload.article
    ) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}
