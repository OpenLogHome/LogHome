import Vue from 'vue'

const apiService = {
  // 小说相关接口
  novels: {
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
  },
  
  // 文章/章节相关接口
  articles: {
    // 获取小说所有章节
    getArticles: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_articles?id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节列表失败:', error)
        return []
      }
    },
    
    // 获取最新章节
    getLatestArticles: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/library/get_latest_articles?id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取最新章节失败:', error)
        return []
      }
    },
    
    // 获取章节内容
    getArticle: async (articleId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_article?id=${articleId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节内容失败:', error)
        return null
      }
    },
    
    // 获取章节评论数量
    getArticleCommentAmount: async (articleId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_article_comment_amount?article_id=${articleId}`)
        return await response.json()
      } catch (error) {
        console.error('获取章节评论数量失败:', error)
        return { count: 0 }
      }
    }
  },
  
  // 统计相关接口
  statistics: {
    // 记录阅读量
    novelClicked: async (articleId) => {
      try {
        await fetch(`${process.env.baseUrl}/articles/novel_clicked?id=${articleId}`)
        return true
      } catch (error) {
        console.error('记录阅读统计失败:', error)
        return false
      }
    },
    
    // 获取小说统计数据
    getNovelStatistics: async (novelId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/articles/get_novel_statistics?novel_id=${novelId}`)
        return await response.json()
      } catch (error) {
        console.error('获取小说统计数据失败:', error)
        return []
      }
    }
  },

  // 社区相关接口
  community: {
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
    }
  },

  // 书架相关接口
  bookcase: {
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
  },
  
  // 世界设定相关接口
  worlds: {
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
  },
  
  // 图书馆/标签相关接口
  library: {
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
    }
  },
  
  // 树场相关接口
  treePlant: {
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
  },
  
  // 资源相关接口
  resources: {
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
  },
  
  // 用户相关接口
  users: {
    // 获取用户信息
    getUserById: async (userId) => {
      try {
        const response = await fetch(`${process.env.baseUrl}/users/get_user_by_id?id=${userId}`)
        return await response.json()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },
    
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
  },
    // 创作中心相关接口
  essays: {
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
    }
  }
}

export default ({ app }, inject) => {
  inject('api', apiService)
}

// 挂载到Vue原型，方便在组件中使用
Vue.prototype.$api = apiService