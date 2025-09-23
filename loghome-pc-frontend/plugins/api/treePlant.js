// 拆分自 api.js
const treePlant = {
    // 获取用户树场信息
    getTreePlantInfo: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return { treeState: "未登录" }

            const response = await fetch(`${process.env.baseUrl}/treePlant/get_treePlant_of`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (data.length > 0) {
                return { treeState: data[0].tree_status }
            } else {
                return { treeState: "未种植" }
            }
        } catch (error) {
            console.error('获取树场信息失败:', error)
            return { treeState: "获取失败" }
        }
    }
};

export default treePlant;
