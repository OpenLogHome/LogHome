// 拆分自 api.js
const bookcase = {
    // 获取收藏状态
    getLikesOf: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return []

            const response = await fetch(`${process.env.baseUrl}/bookcase/get_likes_of`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取收藏状态失败:', error)
            return []
        }
    },

    // 收藏小说
    likeNovel: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/bookcase/like_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ novel_id: novelId })
            })
            return await response.json()
        } catch (error) {
            console.error('收藏小说失败:', error)
            throw error
        }
    },

    // 取消收藏
    removeLikeNovel: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/bookcase/remove_like_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ novel_id: novelId })
            })
            return await response.json()
        } catch (error) {
            console.error('取消收藏失败:', error)
            throw error
        }
    }
};

export default bookcase;
