import axios from 'axios'

// Discovery requests reject on failure so callers can distinguish an empty list from an outage.
export function readingToken() {
  try {
    return typeof localStorage === 'undefined' ? null : (JSON.parse(localStorage.getItem('token') || 'null') || {}).tk || null
  } catch (_) { return null }
}

export async function readingRequest(path, params = {}, options = {}) {
  try {
    const response = await axios.request({
      url: `${process.env.baseUrl}${path}`, params, timeout: 12000,
      method: options.method || 'GET', headers: options.headers || {}, data: options.body
    })
    return response.data
  } catch (failure) {
    const data = failure.response && failure.response.data
    const error = new Error((data && (data.message || data.msg)) || '请求失败，请稍后重试')
    error.status = failure.response && failure.response.status
    throw error
  }
}

function authenticated(path, params = {}) {
  const token = readingToken()
  if (!token) return Promise.resolve([])
  return readingRequest(path, params, { headers: { Authorization: `Bearer ${token}` } })
}

const progressQueues = new Map()
// Serialize writes for a book so a slow response cannot leave an older chapter as the final cloud progress.
export function saveReadingProgress(payload) {
  const token = readingToken()
  if (!token) return Promise.resolve(null)
  const key = `${token}:${Number(payload.novel_id)}`
  const previous = progressQueues.get(key) || Promise.resolve()
  const request = previous.catch(() => {}).then(() => {
    if (readingToken() !== token) return null
    return readingRequest('/library/update_reading_progress', {}, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
  })
  progressQueues.set(key, request)
  request.finally(() => { if (progressQueues.get(key) === request) progressQueues.delete(key) }).catch(() => {})
  return request
}

const reading = {
  getIndexTags: () => readingRequest('/library/get_index_tags'),
  getTags: () => readingRequest('/library/get_all_tags'),
  getTag: tagId => readingRequest('/library/get_tag_by_id', { tag_id: tagId }),
  getTagBooks: tagId => readingRequest('/library/get_tag_collections', { tag_id: tagId }),
  getCollections: () => readingRequest('/library/recommand/get_library_collections'),
  getCollectionBooks: (title, page = 1, amount = 12) => readingRequest('/library/recommand/get_library_recommend_titles', { title, page, amount }),
  getBooks: (page = 1, amount = 24) => readingRequest('/library/get_novels_all', { page, amount }),
  getRank: params => readingRequest('/library/rank/get_rank_board', params),
  getShelf: () => authenticated('/bookcase/get_likes_of'),
  getHistory: () => authenticated('/library/reading_history', { limit: 100 }),
  getProgress: novelId => authenticated('/library/reading_progress', { novel_id: novelId }),
  getUpdates: books => readingRequest('/library/check_novel_updates_batch', { books: JSON.stringify(books) }),
  saveProgress: saveReadingProgress,
  addFavorite: novelId => {
    const token = readingToken()
    if (!token) return Promise.reject(new Error('请先登录'))
    return readingRequest('/bookcase/like_novel', {}, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ novel_id: Number(novelId) })
    })
  },
  removeFavorite: novelId => {
    const token = readingToken()
    if (!token) return Promise.reject(new Error('请先登录'))
    return readingRequest('/bookcase/remove_like_novel', {}, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ novel_id: novelId })
    })
  }
}
export default reading
