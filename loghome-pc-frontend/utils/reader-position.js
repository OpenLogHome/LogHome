export function normalizeReaderPosition(value = {}) {
  const integer = value => Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? Number(value) : 0
  return { paragraphId: integer(value.paragraphId ?? value.last_paragraph_id), charOffset: integer(value.charOffset ?? value.last_char_offset), pageIndex: integer(value.pageIndex ?? value.last_page_idx) }
}
export function initialReaderPosition(query = {}, saved, articleId) {
  if (Number(query.paragraphId) > 0) return normalizeReaderPosition({ paragraphId: query.paragraphId, charOffset: query.charOffset })
  if (query.edge === 'end') return { paragraphId: 0, charOffset: 0, pageIndex: Number.MAX_SAFE_INTEGER }
  if (query.start === '1') return normalizeReaderPosition()
  if (query.pageIdx != null) return normalizeReaderPosition({ pageIndex: query.pageIdx })
  if (saved && Number(saved.last_article_id) === Number(articleId)) return normalizeReaderPosition(saved)
  return normalizeReaderPosition({ pageIndex: query.pageIdx })
}
export function pageCount(scrollWidth, width, gap = 40) {
  return Math.max(1, Math.ceil((scrollWidth + gap - 1) / (width + gap)))
}
export function pageAtCoordinate(coordinate, origin, currentPage, width, gap = 40) {
  return Math.max(0, Math.floor((coordinate - origin + currentPage * (width + gap) + .5) / (width + gap)))
}
export function textReaderResumeUrl(record) {
  const id = Number(record && record.last_article_id)
  if (!(id > 0)) return ''
  const position = normalizeReaderPosition(record)
  const params = new URLSearchParams({ resume: '1' })
  if (position.paragraphId) { params.set('paragraphId', position.paragraphId); if (position.charOffset) params.set('charOffset', position.charOffset) }
  else params.set('pageIdx', position.pageIndex)
  return `/article/${id}?${params}`
}
