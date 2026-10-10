// The draft itself is sent only after the desktop parent confirms its origin.
export function readerPreviewParentOrigin(origin) {
  try {
    const url = new URL(origin)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    if (url.protocol === 'https:' && ['loghome.ink', 'www.loghome.ink'].includes(url.hostname)) return url.origin
    if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return url.origin
  } catch (_) {}
  return ''
}
export function sendReaderPreview(parent, currentWindow, origin, preview) {
  const target = readerPreviewParentOrigin(origin)
  if (!target || !parent || parent === currentWindow) return false
  parent.postMessage({type:'reader_preview',source:'chapterEditor',data:preview},target)
  return true
}
