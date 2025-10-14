// 拆分自 api.js
const community = {
    getMyCircles: async () => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null;
            if (!token) {
                return [];
            }
            const response = await fetch(`${process.env.baseUrl}/community/circles/my-circles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('获取我的圈子失败');
            }
            return await response.json();
        } catch (error) {
            console.error('获取我的圈子失败:', error);
            throw error;
        }
    },
    // 获取帖子详情
    getPostDetail: async (params = {}) => {
        try {
            const { post_id } = params;
            if (!post_id) throw new Error('缺少必要参数post_id');

            const response = await fetch(`${process.env.baseUrl}/community/posts/detail/${post_id}`);
            return await response.json();
        } catch (error) {
            console.error('获取帖子详情失败:', error);
            throw error;
        }
    },

    getCircleMyStatus: async (params = {}) => {
        try {
            const { circle_id } = params;
            if (!circle_id) throw new Error('缺少必要参数circle_id');
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null;
            if (!token) return null;

            const response = await fetch(`${process.env.baseUrl}/community/circles/${circle_id}/my-status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || '获取圈子状态失败');
            }
            return await response.json();
        } catch (error) {
            console.error('获取圈子状态失败:', error);
            throw error;
        }
    },

    createPost: async (postPayload) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null;
            if (!token) throw new Error('用户未登录');

            const response = await fetch(`${process.env.baseUrl}/community/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postPayload)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || '发布帖子失败');
            }
            return result;
        } catch (error) {
            console.error('发布帖子失败:', error);
            throw error;
        }
    },

    updatePost: async (postPayload) => {
        try {
            const { post_id, ...data } = postPayload;
            if (!post_id) throw new Error('缺少必要参数post_id');
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null;
            if (!token) throw new Error('用户未登录');

            const response = await fetch(`${process.env.baseUrl}/community/posts/${post_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || '更新帖子失败');
            }
            return result;
        } catch (error) {
            console.error('更新帖子失败:', error);
            throw error;
        }
    },

    deletePost: async (postId) => {
        try {
            if (!postId) throw new Error('缺少必要参数post_id');
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null;
            if (!token) throw new Error('用户未登录');

            const response = await fetch(`${process.env.baseUrl}/community/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || '删除帖子失败');
            }
            return result;
        } catch (error) {
            console.error('删除帖子失败:', error);
            throw error;
        }
    },

    // 获取帖子评论列表
    getComments: async (params = {}) => {
        try {
            const { post_id, page = 1, pageSize = 20 } = params;
            if (!post_id) throw new Error('缺少必要参数post_id');

            const response = await fetch(`${process.env.baseUrl}/community/comments/list?post_id=${post_id}&page=${page}&pageSize=${pageSize}`);
            return await response.json();
        } catch (error) {
            console.error('获取帖子评论列表失败:', error);
            throw error;
        }
    },

    // 获取评论回复
    getCommentReplies: async (params = {}) => {
        try {
            const { comment_id, page = 1, pageSize = 3 } = params;
            if (!comment_id) throw new Error('缺少必要参数comment_id');

            const response = await fetch(`${process.env.baseUrl}/community/comments/replies?comment_id=${comment_id}&page=${page}&pageSize=${pageSize}`);
            return await response.json();
        } catch (error) {
            console.error('获取评论回复失败:', error);
            throw error;
        }
    },

    // 获取小说评论数量
    getNovelCommentsAmount: async (novelId, articleId, paragraphId) => {
        try {
            let url = `${process.env.baseUrl}/community/novel_commonts_amount?id=${novelId}`;

            // 如果只提供了文章ID，则获取该文章的所有评论数量
            if (articleId && !paragraphId) {
                url = `${process.env.baseUrl}/community/novel_commonts_amount?id=${novelId}&articleId=${articleId}`;
            }
            // 如果提供了文章ID和段落ID，则获取特定段落的评论数量
            else if (articleId && paragraphId) {
                url = `${process.env.baseUrl}/community/novel_commonts_amount?id=${novelId}&articleId=${articleId}&paragraphId=${paragraphId}`;
            }

            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('获取评论数量失败:', error);
            return [{ 'COUNT(*)': 0 }];
        }
    },

    // 获取小说评论
    getNovelComments: async (novelId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/novel_commonts_all?id=${novelId}`)
            return await response.json()
        } catch (error) {
            console.error('获取评论失败:', error)
            return []
        }
    },

    // 获取评论回复
    novel_commonts_reply_to: async (commentId) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/novel_commonts_reply_to?id=${commentId}`)
            return await response.json()
        } catch (error) {
            console.error('获取评论回复失败:', error)
            return []
        }
    },

    // 获取章节评论
    getArticleComments: async (novelId, articleId, page = 1, pageSize = 10) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/novel_commonts_all?id=${novelId}&articleId=${articleId}&page=${page}&pageSize=${pageSize}`)
            return await response.json()
        } catch (error) {
            console.error('获取章节评论失败:', error)
            return []
        }
    },

    // 获取段落评论
    getParagraphComments: async (novelId, articleId, paragraphId, page = 1, pageSize = 10) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/novel_commonts_all?id=${novelId}&articleId=${articleId}&paragraphId=${paragraphId}&page=${page}&pageSize=${pageSize}`)
            return await response.json()
        } catch (error) {
            console.error('获取段落评论失败:', error)
            return []
        }
    },

    // 提交章节评论
    commentOnArticle: async (novelId, articleId, content, paragraphId = -1) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/comment_on_novel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    novel_id: novelId,
                    article_id: articleId,
                    content: content,
                    paragraph_id: paragraphId
                })
            })
            return await response.json()
        } catch (error) {
            console.error('提交评论失败:', error)
            throw error
        }
    },

    // 回复评论
    replyToComment: async (commentId, content, fatherId = -1, articleId = 0) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/reply_to_novel_comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    essay_comment_id: commentId,
                    content: content,
                    fatherId: fatherId,
                    article_id: articleId
                })
            })
            return await response.json()
        } catch (error) {
            console.error('回复评论失败:', error)
            throw error
        }
    },

    // 获取评论点赞状态
    getCommentPraiseStatus: async (commentId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return []

            const response = await fetch(`${process.env.baseUrl}/community/get_comment_praise_status?essay_comment_id=${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取评论点赞状态失败:', error)
            return []
        }
    },

    // 点赞/取消点赞评论
    praiseComment: async (commentId, type) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/praise_on_comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    essay_comment_id: commentId,
                    type: type // 0点赞，3取消
                })
            })
            return await response.json()
        } catch (error) {
            console.error('操作评论点赞失败:', error)
            throw error
        }
    },

    // 删除评论
    deleteComment: async (commentId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/delete_comment?id=${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('删除评论失败:', error)
            throw error
        }
    },

    // 获取推荐圈子
    getRecommendCircles: async (params = {}) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/circles/list?${new URLSearchParams(params)}`)
            return await response.json()
        } catch (error) {
            console.error('获取推荐圈子失败:', error)
            return { list: [], total: 0, has_more: false }
        }
    },

    // 获取推荐帖子
    getRecommendPosts: async (params = {}) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/posts/recommend?${new URLSearchParams(params)}`)
            return await response.json()
        } catch (error) {
            console.error('获取推荐帖子失败:', error)
            return { list: [], total: 0, has_more: false }
        }
    },

    // 获取点赞状态
    getLikeStatus: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) return { liked: false }

            const { target_id, target_type } = params
            const response = await fetch(`${process.env.baseUrl}/community/interactions/like/status?target_id=${target_id}&target_type=${target_type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取点赞状态失败:', error)
            return { liked: false }
        }
    },

    // 点赞帖子
    likePost: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/interactions/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('点赞操作失败:', error)
            throw error
        }
    },

    // 点赞/取消点赞目标（帖子或评论）
    likeTarget: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const { target_id, target_type } = params
            // 后端的/community/interactions/like接口已经实现了点赞和取消点赞的功能
            // 如果已经点赞，再次调用会取消点赞；如果未点赞，则会添加点赞
            const response = await fetch(`${process.env.baseUrl}/community/interactions/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ target_id, target_type })
            })
            return await response.json()
        } catch (error) {
            console.error('点赞/取消点赞操作失败:', error)
            throw error
        }
    },

    // 创建评论
    createComment: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/comments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('发表评论失败:', error)
            throw error
        }
    },

    // 获取圈子详情
    getCircleDetail: async (params = {}) => {
        try {
            const { circle_id } = params
            const response = await fetch(`${process.env.baseUrl}/community/circles/detail/${circle_id}`)
            return await response.json()
        } catch (error) {
            console.error('获取圈子详情失败:', error)
            throw error
        }
    },

    // 获取圈子成员列表
    getCircleMembers: async (params = {}) => {
        try {
            const { circle_id, ...queryParams } = params
            const response = await fetch(`${process.env.baseUrl}/community/circles/${circle_id}/members?${new URLSearchParams(queryParams)}`)
            return await response.json()
        } catch (error) {
            console.error('获取圈子成员失败:', error)
            return { list: [], total: 0 }
        }
    },

    // 加入圈子
    joinCircle: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('加入圈子失败:', error)
            throw error
        }
    },

    // 退出圈子
    quitCircle: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/quit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('退出圈子失败:', error)
            throw error
        }
    },

    // 获取圈子验证问题
    getVerificationQuestions: async (params = {}) => {
        try {
            const { circle_id } = params
            const response = await fetch(`${process.env.baseUrl}/community/circles/${circle_id}/verification-questions`)
            return await response.json()
        } catch (error) {
            console.error('获取验证问题失败:', error)
            return null
        }
    },

    // 创建分享口令
    createShareCode: async (params = {}) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/share/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(params)
            })
            return await response.json()
        } catch (error) {
            console.error('创建分享口令失败:', error)
            throw error
        }
    },

    // 获取帖子列表
    getPostsList: async (params = {}) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/posts/list?${new URLSearchParams(params)}`)
            return await response.json()
        } catch (error) {
            console.error('获取帖子列表失败:', error)
            return { list: [], total: 0, has_more: false }
        }
    },

    // 获取消息列表
    getMessageList: async (targetUserId, page = 1, pageSize = 20) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/messages/list?target_user_id=${targetUserId}&page=${page}&pageSize=${pageSize}`, {
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取消息列表失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取消息列表失败'
            }
        }
    },

    // 发送消息
    sendMessage: async (targetUserId, content, messageType = 'text') => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    target_user_id: targetUserId,
                    content: content,
                    message_type: messageType
                })
            })
            const data = await response.json()
            return {
                code: 0,
                data: data,
                message: '发送成功'
            }
        } catch (error) {
            console.error('发送消息失败:', error)
            return {
                code: -1,
                data: null,
                message: error.message || '发送消息失败'
            }
        }
    },

    // 获取会话列表
    getConversationList: async (page = 1, pageSize = 20) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/conversations/list?page=${page}&pageSize=${pageSize}`, {
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()
            return {
                code: 0,
                data: data || [],
                message: 'success'
            }
        } catch (error) {
            console.error('获取会话列表失败:', error)
            return {
                code: -1,
                data: [],
                message: error.message || '获取会话列表失败'
            }
        }
    },

    // 标记消息为已读
    markMessageAsRead: async (targetUserId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/messages/mark-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    target_user_id: targetUserId
                })
            })
            const data = await response.json()
            return {
                code: 0,
                data: data,
                message: '标记成功'
            }
        } catch (error) {
            console.error('标记消息已读失败:', error)
            return {
                code: -1,
                data: null,
                message: error.message || '标记消息已读失败'
            }
        }
    },

    // 获取圈子分类
    getCircleCategories: async () => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/circles/categories`)
            return await response.json()
        } catch (error) {
            console.error('获取圈子分类失败:', error)
            return []
        }
    },

    // 获取圈子列表（按分类）
    getCirclesList: async (params = {}) => {
        try {
            const response = await fetch(`${process.env.baseUrl}/community/circles/list?${new URLSearchParams(params)}`)
            return await response.json()
        } catch (error) {
            console.error('获取圈子列表失败:', error)
            return { list: [], total: 0, has_more: false }
        }
    },

    // 创建圈子
    createCircle: async (circleData) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(circleData)
            })
            return await response.json()
        } catch (error) {
            console.error('创建圈子失败:', error)
            throw error
        }
    },

    // 更新圈子信息
    updateCircle: async (circleId, circleData) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/${circleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(circleData)
            })
            return await response.json()
        } catch (error) {
            console.error('更新圈子失败:', error)
            throw error
        }
    },

    // 获取圈子设置
    getCircleSettings: async (circleId) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/${circleId}/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.error('获取圈子设置失败:', error)
            throw error
        }
    },

    // 更新圈子设置
    updateCircleSettings: async (circleId, settings) => {
        try {
            const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).tk : null
            if (!token) throw new Error('用户未登录')

            const response = await fetch(`${process.env.baseUrl}/community/circles/${circleId}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            })
            return await response.json()
        } catch (error) {
            console.error('更新圈子设置失败:', error)
            throw error
        }
    }
};

export default community;
