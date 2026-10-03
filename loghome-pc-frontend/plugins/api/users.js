// 拆分自 api.js
const users = {
    // 获取当前登录用户信息
    getUserProfile: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/userprofile`, {
                headers: {
                    'Authorization': token
                }
            })

            const data = await response.json()

            // 缓存用户信息到本地
            localStorage.setItem('LogHomeUserInfo', JSON.stringify(data))

            return data
        } catch (error) {
            console.error('获取用户个人资料失败:', error)

            // 如果网络请求失败，尝试从缓存获取
            const cachedUserInfo = localStorage.getItem('LogHomeUserInfo')
            if (cachedUserInfo) {
                return JSON.parse(cachedUserInfo)
            }

            throw error
        }
    },

    // 检查账号是否存在
    checkAccount: async (account) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/check_account?account=${account}`)
            const data = await response.json()
            return data.length > 0
        } catch (error) {
            console.error('检查账号失败:', error)
            throw error
        }
    },

    // 检查邮箱是否存在
    checkEmail: async (email) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/check_email?email=${email}`)
            const data = await response.json()
            return data.length > 0
        } catch (error) {
            console.error('检查邮箱失败:', error)
            throw error
        }
    },

    // 发送邮箱验证码
    sendEmailVerifyCode: async (email) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/send_email_verify_code?email=${email}`)
            return await response.json()
        } catch (error) {
            console.error('发送验证码失败:', error)
            throw error
        }
    },

    // 使用邮箱验证验证码
    registerWithEmail: async (email, vcode) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/register_with_email?email=${email}&vcode=${vcode}`)
            return await response.json()
        } catch (error) {
            console.error('验证码验证失败:', error)
            throw error
        }
    },

    // 用户登录
    login: async (username, password) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const data = await response.json()

            console.log(data);

            if (data.token) {
                localStorage.setItem('token', JSON.stringify(data.token))

                // 登录成功后立即获取用户信息
                try {
                    const userResponse = await fetch(`${process.env.baseUrl}/users/userprofile`, {
                        headers: {
                            'Authorization': data.token.tk
                        }
                    })
                    const userData = await userResponse.json()
                    localStorage.setItem('LogHomeUserInfo', JSON.stringify(userData))

                    // 触发一个自定义事件，通知布局组件刷新用户状态
                    if (process.client) {
                        window.dispatchEvent(new CustomEvent('auth-state-changed'))
                    }
                } catch (err) {
                    console.error('登录后获取用户信息失败:', err)
                }
            } else {
                throw error
            }

            return data
        } catch (error) {
            console.error('登录失败:', error)
            throw error
        }
    },

    // 用户注册
    register: async (username, password, email, verifyCode) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, verifyCode })
            })
            const data = await response.json()

            if (data.token) {
                localStorage.setItem('token', JSON.stringify(data.token))

                // 注册成功后立即获取用户信息
                try {
                    const userResponse = await fetch(`${process.env.baseUrl}/users/userprofile`, {
                        headers: {
                            'Authorization': data.token.tk
                        }
                    })
                    const userData = await userResponse.json()
                    localStorage.setItem('LogHomeUserInfo', JSON.stringify(userData))

                    // 触发一个自定义事件，通知布局组件刷新用户状态
                    if (process.client) {
                        window.dispatchEvent(new CustomEvent('auth-state-changed'))
                    }
                } catch (err) {
                    console.error('注册后获取用户信息失败:', err)
                }
            }

            return data
        } catch (error) {
            console.error('注册失败:', error)
            throw error
        }
    },

    // 更新昵称和简介
    updateUserInfo: async (name, motto) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/update_userinfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ name, motto })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.msg || '保存失败')
            return { code: 0, data, message: '保存成功' }
        } catch (error) {
            console.error('更新用户信息失败:', error)
            return { code: -1, data: null, message: error.message || '更新用户信息失败' }
        }
    },

    // 上传 base64 图片更换头像
    changeAvatar: async (img) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/change_avater`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ img })
            })
            const data = await response.json()
            if (!response.ok || data.msg !== 'ok') throw new Error(data.msg || '头像上传失败')
            return { code: 0, data, message: '头像已更新' }
        } catch (error) {
            console.error('更换头像失败:', error)
            return { code: -1, data: null, message: error.message || '更换头像失败' }
        }
    },

    // 上传 base64 图片更换封面
    changeTopCover: async (img) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/change_top_cover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ img })
            })
            const data = await response.json()
            if (!response.ok || data.msg !== 'ok') throw new Error(data.msg || '封面上传失败')
            return { code: 0, data, message: '封面已更新' }
        } catch (error) {
            console.error('更换封面失败:', error)
            return { code: -1, data: null, message: error.message || '更换封面失败' }
        }
    },

    // 获取当前登录用户信息
    generateCrossSiteToken: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/generate_cross_site_token`, {
                headers: {
                    'Authorization': token
                }
            })

            const data = await response.json()

            return data
        } catch (error) {
            console.error('生成跨站登录token失败:', error)

            // 如果网络请求失败，尝试从缓存获取
            const cachedUserInfo = localStorage.getItem('LogHomeUserInfo')
            if (cachedUserInfo) {
                return JSON.parse(cachedUserInfo)
            }

            throw error
        }
    },

    // 获取指定用户的详细信息
    getUserInfo: async (userId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/users/user_profile_of?id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data[0] || null,
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户信息失败:', error)
            return {
                code: -1,
                data: null,
                message: error.message || '获取用户信息失败'
            }
        }
    },

    // 获取用户的小说作品
    getUserNovels: async (userId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/library/get_novel_by_user_id?id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户作品失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取用户作品失败'
            }
        }
    },

    // 获取用户的世界设定
    getUserWorlds: async (userId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/world/get_worlds_by_author?user_id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户世界失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取用户世界失败'
            }
        }
    },

    // 获取用户的帖子动态
    getUserPosts: async (userId, params = {}) => {
        try {
            const { page = 1, pageSize = 10 } = params
            const response = await fetch(`${process.env.baseUrl}/community/posts/list?page=${page}&pageSize=${pageSize}&user_id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data || { list: [], total: 0 },
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户帖子失败:', error)
            return {
                code: -1,
                data: { list: [], total: 0 },
                message: error.message || '获取用户帖子失败'
            }
        }
    },

    // 获取用户粉丝数
    getUserFans: async (userId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/get_fans_of?id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户粉丝失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取用户粉丝失败'
            }
        }
    },

    // 获取用户关注数
    getUserFollows: async (userId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/get_follows_of?id=${userId}`)
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取用户关注失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取用户关注失败'
            }
        }
    },

    // 获取系统消息（服务端会在返回后标记为已读）
    getHistoryMessages: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/users/get_history_message`, {
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error('获取系统消息失败:', error)
            return []
        }
    },

    // 获取未读系统消息数量
    getUnreadSystemMessageCount: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return { count: 0 }

            const response = await fetch(`${process.env.baseUrl}/users/unread_message_count`, {
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()
            return { count: Number(data.count) || 0 }
        } catch (error) {
            console.error('获取未读系统消息数失败:', error)
            return { count: 0 }
        }
    },

    // 关注用户
    followUser: async (userId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ follow_id: userId })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.msg || '关注失败')
            return {
                code: 0,
                data: data,
                message: '关注成功'
            }
        } catch (error) {
            console.error('关注用户失败:', error)
            return {
                code: -1,
                data: null,
                message: error.message || '关注用户失败'
            }
        }
    },

    // 取消关注用户
    unfollowUser: async (userId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/unfollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ follow_id: userId })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.msg || '取消关注失败')
            return {
                code: 0,
                data: data,
                message: '取消关注成功'
            }
        } catch (error) {
            console.error('取消关注失败:', error)
            return {
                code: -1,
                data: null,
                message: error.message || '取消关注失败'
            }
        }
    },

    // 检查关注状态
    checkFollowStatus: async (userId, myUserId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token || !myUserId) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/follow_status?user_id=${myUserId}&target_id=${userId}`, {
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()
            return {
                code: 0,
                data: { isFollowing: Number(data.status) > 0 },
                message: 'success'
            }
        } catch (error) {
            console.error('检查关注状态失败:', error)
            return {
                code: -1,
                data: { isFollowing: false },
                message: error.message || '检查关注状态失败'
            }
        }
    },
};

export default users;
