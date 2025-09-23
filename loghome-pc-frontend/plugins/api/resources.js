// 拆分自 api.js
const resources = {
    // 获取用户资源信息
    getUserResources: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return { earningsMoney: 0.00 }

            const response = await fetch(`${process.env.baseUrl}/resource/get_resources`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (data && data.length > 0) {
                const resources = data[0]
                return {
                    earningsMoney: parseFloat((resources.cropped_log / 100).toFixed(2))
                }
            } else {
                return { earningsMoney: 0.00 }
            }
        } catch (error) {
            console.error('获取资源信息失败:', error)
            return { earningsMoney: 0.00 }
        }
    }
};

export default resources;
