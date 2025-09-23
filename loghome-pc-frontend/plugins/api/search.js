// 拆分自 api.js
const search = {
    // 搜索小说
    searchNovels: async (params = {}) => {
      try {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        // 修改为与移动端一致的接口
        const response = await fetch(`${process.env.baseUrl}/community/search?${new URLSearchParams({...params, type: 'books'})}`, {
          headers
        })
        const result = await response.json()
        return result.results ? result.results.books : { list: [], total: 0 }
      } catch (error) {
        console.error('搜索小说失败:', error)
        return { list: [], total: 0 }
      }
    },

    // 搜索帖子
    searchPosts: async (params = {}) => {
      try {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        // 修改为与移动端一致的接口
        const response = await fetch(`${process.env.baseUrl}/community/search?${new URLSearchParams({...params, type: 'posts'})}`, {
          headers
        })
        const result = await response.json()
        return result.results ? result.results.posts : { list: [], total: 0 }
      } catch (error) {
        console.error('搜索帖子失败:', error)
        return { list: [], total: 0 }
      }
    },

    // 搜索圈子
    searchCircles: async (params = {}) => {
      try {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        // 修改为与移动端一致的接口
        const response = await fetch(`${process.env.baseUrl}/community/search?${new URLSearchParams({...params, type: 'circles'})}`, {
          headers
        })
        const result = await response.json()
        return result.results ? result.results.circles : { list: [], total: 0 }
      } catch (error) {
        console.error('搜索圈子失败:', error)
        return { list: [], total: 0 }
      }
    },

    // 搜索用户
    searchUsers: async (params = {}) => {
      try {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        // 修改为与移动端一致的接口
        const response = await fetch(`${process.env.baseUrl}/community/search?${new URLSearchParams({...params, type: 'users'})}`, {
          headers
        })
        const result = await response.json()
        return result.results ? result.results.users : { list: [], total: 0 }
      } catch (error) {
        console.error('搜索用户失败:', error)
        return { list: [], total: 0 }
      }
    },

    // 获取热门搜索
    getHotSearches: async () => {
      try {
        // 修改为与移动端一致的接口
        const response = await fetch(`${process.env.baseUrl}/community/search/hot?category=all&limit=8`)
        const result = await response.json()
        return result || []
      } catch (error) {
        console.error('获取热门搜索失败:', error)
        return [
          { keyword: '修仙' },
          { keyword: '都市' },
          { keyword: '玄幻' },
          { keyword: '言情' },
          { keyword: '历史' },
          { keyword: '科幻' },
          { keyword: '悬疑' },
          { keyword: '武侠' }
        ]
      }
    }
  };

export default search;
