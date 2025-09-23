// 拆分自 api.js
const worlds = {
    // 获取关联世界设定
    getAssoWorldByNovelId: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/world/get_asso_world_by_novel_id?novel_id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取关联世界设定失败:', error)
            return []
        }
    },

    // 根据世界ID获取关联作品
    getAssoWorldByWorldId: async (worldId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/world/get_asso_world_by_world_id?world_id=${worldId}`)
            return await response.json()
        } catch (error) {
            console.error('获取关联世界设定失败:', error)
            return []
        }
    },

    // 获取我的世界设定
    getMyWorlds: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/world/get_my_worlds`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取我的世界设定失败:', error)
            return []
        }
    },

    // 添加世界与小说的关联
    addWorldNovelAsso: async (worldId, novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/world/add_world_novel_asso?world_id=${worldId}&novel_id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('添加世界与小说关联失败:', error)
            throw error
        }
    },

    // 删除世界与小说的关联
    deleteWorldNovelAsso: async (worldId, novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/world/delete_world_novel_asso?world_id=${worldId}&novel_id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('删除世界与小说关联失败:', error)
            throw error
        }
    }
};

export default worlds;
