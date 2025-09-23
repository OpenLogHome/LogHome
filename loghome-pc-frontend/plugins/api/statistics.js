// 拆分自 api.js
const statistics = {
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
};

export default statistics;
