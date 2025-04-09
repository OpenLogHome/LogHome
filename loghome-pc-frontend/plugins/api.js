import Vue from 'vue'

const apiService = {
  // 小说相关接口
  novels: {
    // 获取所有小说
    getAllNovels: async () => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_novels_all`)
        return await response.json()
      } catch (error) {
        console.error('获取小说列表失败:', error)
        return []
      }
    },
    
    // 搜索小说
    searchNovels: async (keyword) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_novels_search?keyword=${encodeURIComponent(keyword)}`)
        return await response.json()
      } catch (error) {
        console.error('搜索小说失败:', error)
        return []
      }
    },
    
    // 获取小说详情
    getNovelById: async (id) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_novel_by_id?id=${id}`)
        return await response.json()
      } catch (error) {
        console.error('获取小说详情失败:', error)
        return null
      }
    },
    
    // 获取小说标签
    getNovelTags: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_novel_tags?novel_id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取小说标签失败:', error)
        return []
      }
    },

    // 获取所有标签
    getAllTags: async () => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_all_tags`)
        return await response.json()
      } catch (error) {
        console.error('获取所有标签失败:', error)
        return []
      }
    },

    // 获取标签相关小说集合
    getTagCollections: async (tagId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_tag_collections?tag_id=${tagId}`)
        return await response.json()
      } catch (error) {
        console.error('获取标签相关小说失败:', error)
        return []
      }
    }
  },
  
  // 文章/章节相关接口
  articles: {
    // 获取小说所有章节
    getArticles: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_articles?id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节列表失败:', error)
        return []
      }
    },
    
    // 获取最新章节
    getLatestArticles: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_latest_articles?id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取最新章节失败:', error)
        return []
      }
    },
    
    // 获取章节内容
    getArticle: async (articleId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_article?id=${articleId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节内容失败:', error)
        return null
      }
    },
    
    // 获取章节评论数量
    getArticleCommentAmount: async (articleId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_article_comment_amount?article_id=${articleId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节评论数量失败:', error)
        return { count: 0 }
      }
    }
  },
  
  // 统计相关接口
  statistics: {
    // 记录阅读量
    novelClicked: async (articleId) => {
      try {
        await fetch(`${process.env.baseUrl}/articles/novel_clicked?id=${articleId}`)
        return true
      } catch (error) {
        console.error('记录阅读统计失败:', error)
        return false
      }
    },
    
    // 获取小说统计数据
    getNovelStatistics: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_novel_statistics?novel_id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取小说统计数据失败:', error)
        return []
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('api', apiService)
}

// 挂载到Vue原型，方便在组件中使用
Vue.prototype.$api = apiService 