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
    },

    // 获取书籍关联的创作活动与活动新闻
    getNovelActivityNews: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_novel_activity_news?novel_id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取创作活动新闻失败:', error)
            return []
        }
    },

    // 获取打赏礼物列表
    getTippingList: async () => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_tipping_list`)
            const data = await response.json()
            if (!Array.isArray(data)) return []
            return data.sort((a, b) => a.sort_id - b.sort_id)
        } catch (error) {
            console.error('获取打赏列表失败:', error)
            return []
        }
    },

    // 打赏作品，由服务端扣减原木/苹果
    tipNovel: async (payload) => {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
        if (!token) throw new Error('用户未登录')

        const response = await fetch(`${process.env.baseUrl}/library/tipping`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.msg || '打赏失败')
        }
        return true
    },

    // 获取自己在该书粉丝榜上的留言
    getFanMessage: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return ''

            const response = await fetch(`${process.env.baseUrl}/library/get_user_fan_message?novel_id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            return (data && data.message) || ''
        } catch (error) {
            console.error('获取粉丝留言失败:', error)
            return ''
        }
    },

    // 更新自己在该书粉丝榜上的留言
    updateFanMessage: async (novelId, message) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            await fetch(`${process.env.baseUrl}/library/update_fan_message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ novel_id: novelId, message })
            })
        } catch (error) {
            console.error('更新粉丝留言失败:', error)
        }
    }
};

export default library;
