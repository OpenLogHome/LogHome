export function readingCommentId(query = {}) {
  const id = Number(query.preLoadCommentId || query.comment_id || query.commentId)
  return Number.isSafeInteger(id) && id > 0 ? id : 0
}
export function readingCommentTarget(comment, book, anchor) {
  if (!comment || !book || Number(comment.novelId) !== Number(book.novel_id)) return ''
  const suffix = `preLoadCommentId=${Number(anchor) || Number(comment.commentId)}`
  if (Number(comment.articleId) > 0) {
    if (book.novel_type === 'manga') return `/manga/read/${comment.articleId}?novelId=${book.novel_id}&${suffix}`
    return `/article/${comment.articleId}?${suffix}${Number(comment.paragraphId) > 0 ? `&paragraphId=${comment.paragraphId}` : ''}`
  }
  return `/${book.novel_type === 'manga' ? 'manga' : book.novel_type === 'world' ? 'world' : 'novel'}/${book.novel_id}?${suffix}`
}
export function readingMessageTarget(router) {
  const raw = String(router || '').trim()
  if (!raw || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\x00-\x1f]/i.test(raw)) return null
  const source = raw.replace(/^\/?(?:#\/)?(?:pages\/)?/, '')
  const [path, search = ''] = source.split('?'), query = new URLSearchParams(search)
  const id = Number(query.get('id') || query.get('novelId') || query.get('novel_id'))
  const anchor = readingCommentId(Object.fromEntries(query))
  if (/^readers\/(?:bookInfo|bookComment|mangaInfo|mangaReader|bookEnd|bookExcerpts|newReader\/article)$/.test(path)) {
    const workId = /(?:mangaReader|newReader\/article)$/.test(path) ? Number(query.get('novelId') || query.get('novel_id')) : id
    if (anchor) return { path: `/read/comment/${anchor}${Number.isSafeInteger(workId) && workId > 0 ? `?novelId=${workId}` : ''}` }
    if (!Number.isSafeInteger(id) || id <= 0) return null
    if (path === 'readers/newReader/article') return { path: `/article/${id}` }
    if (path === 'readers/mangaReader') return { path: `/manga/read/${id}${Number(query.get('novelId')) > 0 ? `?novelId=${Number(query.get('novelId'))}` : ''}` }
    return { path: `/${path === 'readers/mangaInfo' ? 'manga' : path === 'readers/bookEnd' ? 'read/end' : 'novel'}/${id}` }
  }
  return null
}
