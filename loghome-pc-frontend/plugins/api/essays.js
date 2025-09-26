// 拆分自 api.js
const essays = {
    // 获取用户的所有作品
    getNovelsOf: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/get_novels_of`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取用户作品列表失败:', error)

            // 如果网络请求失败，尝试从缓存获取
            const cachedWorks = localStorage.getItem('LogHomeUserEssay')
            if (cachedWorks) {
                return JSON.parse(cachedWorks)
            }

            return []
        }
    },

    // 获取小说详情
    getNovelById: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/essays/get_novel_by_id?id=${novelId}`)
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

    // 添加新作品
    addNovel: async (name, content) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/add_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, content })
            })
            return await response.json()
        } catch (error) {
            console.error('添加新作品失败:', error)
            throw error
        }
    },

    // 修改作品信息
    modifyNovel: async (novelId, name, content) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/modify_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ novel_id: novelId, name, content })
            })
            return await response.json()
        } catch (error) {
            console.error('修改作品信息失败:', error)
            throw error
        }
    },

    // 设置作品状态（公开/私有）
    setNovelStatus: async (params) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/set_novel_status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('设置作品状态失败:', error)
            throw error
        }
    },

    // 设置作品更新状态（连载/完结）
    setNovelUpdateStatus: async (params) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/set_novel_update_status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('设置作品更新状态失败:', error)
            throw error
        }
    },

    // 修改作品封面
    changeCover: async (params) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/change_cover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('修改作品封面失败:', error)
            throw error
        }
    },

    // 删除作品
    deleteNovel: async (params) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/delete_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('删除作品失败:', error)
            throw error
        }
    },

    // 获取作品章节列表
    getArticles: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/get_articles?id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取作品章节列表失败:', error)
            return []
        }
    },

    // 获取小说活动信息
    getNovelActivity: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/get_novel_activity?novel_id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取小说活动信息失败:', error)
            return null
        }
    },

    // 提交活动信息
    submitActivityInfo: async (novelId, tagId, formData) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/essays/submit_activity_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    novel_id: novelId,
                    tag_id: tagId,
                    form_data: formData
                })
            })
            return await response.json()
        } catch (error) {
            console.error('提交活动信息失败:', error)
            throw error
        }
    }
};

export default essays;
