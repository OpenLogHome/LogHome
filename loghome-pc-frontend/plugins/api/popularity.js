// 拆分自 api.js：人气票相关
function getAuthToken() {
    return localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
}

const popularity = {
    // 查询当前用户在各创作活动中的投票状态
    getNovelStatus: async (novelId) => {
        try {
            const token = getAuthToken()
            if (!token) return []
            const response = await fetch(`${process.env.baseUrl}/popularity/novel_status?novel_id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取人气票状态失败:', error)
            return []
        }
    },

    // 为作品投人气票
    vote: async (novelId, tagId) => {
        const token = getAuthToken()
        if (!token) throw new Error('用户未登录')
        const response = await fetch(`${process.env.baseUrl}/popularity/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ novel_id: novelId, tag_id: tagId })
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            throw new Error(data.msg || '投票失败')
        }
        return data
    }
};

export default popularity;
