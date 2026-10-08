// 漫画详情页专用的补充接口（其余复用 novels / articles / bookcase）
function getToken() {
  try {
    return localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
  } catch (error) {
    return null
  }
}

function authHeaders() {
  const token = getToken()
  if (!token) return null
  return { Authorization: `Bearer ${token}` }
}

const manga = {
  // 读取当前用户在某作品的阅读进度（含 last_article_id / last_page_idx）
  getReadingProgress: async (novelId) => {
    const headers = authHeaders()
    if (!headers) return null
    try {
      const response = await fetch(`${process.env.baseUrl}/library/reading_progress?novel_id=${novelId}`, { headers })
      const data = await response.json()
      return Array.isArray(data) && data.length ? data[0] : null
    } catch (error) {
      console.error('获取阅读进度失败:', error)
      return null
    }
  },

  // 取某作者的所有作品（前端再按 novel_type==='manga' 过滤）
  getNovelsByUser: async (userId) => {
    try {
      const response = await fetch(`${process.env.baseUrl}/library/get_novel_by_user_id?id=${userId}`)
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('获取作者作品失败:', error)
      return []
    }
  }
}

export default manga
