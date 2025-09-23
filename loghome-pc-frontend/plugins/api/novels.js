// 拆分自 api.js
const novels = {
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
    },

    // 获取标签信息
    getTagInfo: async (tagId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_tag_info?tag_id=${tagId}`)
            return await response.json()
        } catch (error) {
            console.error('获取标签信息失败:', error)
            return null
        }
    },

    // 获取轮播图数据
    getLibraryRoulousChart: async () => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_library_roulous_chart`)
            return await response.json()
        } catch (error) {
            console.error('获取轮播图数据失败:', error)
            return []
        }
    },

    // 获取Banner数据
    getBanners: async (page) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_banners?page=${page}`)
            return await response.json()
        } catch (error) {
            console.error('获取Banner数据失败:', error)
            return []
        }
    },

    // 获取所有推荐集合
    getLibraryCollections: async () => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/recommand/get_library_collections`)
            return await response.json()
        } catch (error) {
            console.error('获取推荐集合失败:', error)
            return []
        }
    },

    // 获取推荐集合中的小说
    getCollectionNovels: async (title, page = 1, amount = 10) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/recommand/get_library_recommend_titles?title=${encodeURIComponent(title)}&page=${page}&amount=${amount}`)
            return await response.json()
        } catch (error) {
            console.error(`获取集合 ${title} 的小说失败:`, error)
            return []
        }
    },

    // 获取点赞数
    getNicesById: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_nices_by_id?id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取点赞数失败:', error)
            return [{ nices: 0 }]
        }
    },

    // 获取当前用户点赞状态
    getNiceStatus: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return [{ nices: 0 }]

            const response = await fetch(`${process.env.baseUrl}/library/get_nice_status?id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取点赞状态失败:', error)
            return [{ nices: 0 }]
        }
    },

    // 点赞小说
    niceNovel: async (novelId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/library/nice_novel?id=${novelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('点赞小说失败:', error)
            throw error
        }
    },

    // 检查小说排行榜信息
    checkNovelRank: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/recommand/check_novel_rank?id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取小说排名信息失败:', error)
            return []
        }
    },

    // 获取小说粉丝信息
    getNovelFans: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_all_novel_fans?novel_id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取粉丝信息失败:', error)
            return []
        }
    }
};

export default novels;
