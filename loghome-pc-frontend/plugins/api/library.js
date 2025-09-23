// 拆分自 api.js
const library = {
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

    // 获取推荐标签
    getSuggestedTags: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_suggested_tags?novel_id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取推荐标签失败:', error)
            return []
        }
    },

    // 添加小说标签
    addNovelTag: async (novelId, tagName) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/library/add_novel_tag?novel_id=${novelId}&tag_name=${encodeURIComponent(tagName)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('添加小说标签失败:', error)
            throw error
        }
    },

    // 删除小说标签
    deleteNovelTag: async (novelId, tagId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/library/delete_novel_tag?novel_id=${novelId}&tag_id=${tagId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('删除小说标签失败:', error)
            throw error
        }
    }
};

export default library;
