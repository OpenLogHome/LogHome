// 拆分自 api.js
const articles = {
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
};

export default articles;
