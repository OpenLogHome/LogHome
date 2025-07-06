// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');
let message = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 点赞帖子
router.post('/like', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { target_id, target_type } = req.body;
        
        // 检查目标是否存在
        let targetExists = false;
        let targetOwnerId = null;
        let targetTitle = '';
        
        if (target_type === 1) { // 帖子
            const post = await query(
                'SELECT * FROM comm_posts WHERE post_id = ? AND status = 1',
                [target_id]
            );
            
            if (post.length > 0) {
                targetExists = true;
                targetOwnerId = post[0].user_id;
                targetTitle = post[0].title;
            }
        } else if (target_type === 2) { // 评论
            const comment = await query(
                'SELECT * FROM comm_comments WHERE comment_id = ? AND status = 1',
                [target_id]
            );
            
            if (comment.length > 0) {
                targetExists = true;
                targetOwnerId = comment[0].user_id;
                targetTitle = comment[0].content.substring(0, 20) + (comment[0].content.length > 20 ? '...' : '');
            }
        }
        
        if (!targetExists) {
            return res.status(404).json({ msg: '点赞目标不存在或已被删除' });
        }
        
        // 检查是否已点赞
        const existingLike = await query(
            'SELECT * FROM comm_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
            [user.user_id, target_id, target_type]
        );
        
        if (existingLike.length > 0) {
            // 已点赞，取消点赞
            await query(
                'DELETE FROM comm_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
                [user.user_id, target_id, target_type]
            );
            
            // 更新点赞数
            if (target_type === 1) { // 帖子
                await query(
                    'UPDATE comm_posts SET like_count = like_count - 1 WHERE post_id = ?',
                    [target_id]
                );
            } else if (target_type === 2) { // 评论
                await query(
                    'UPDATE comm_comments SET like_count = like_count - 1 WHERE comment_id = ?',
                    [target_id]
                );
            }
            
            res.json({ 
                msg: '取消点赞成功',
                liked: false
            });
        } else {
            // 未点赞，添加点赞
            await query(
                'INSERT INTO comm_likes (user_id, target_id, target_type, create_time) VALUES (?, ?, ?, NOW())',
                [user.user_id, target_id, target_type]
            );
            
            // 更新点赞数
            if (target_type === 1) { // 帖子
                await query(
                    'UPDATE comm_posts SET like_count = like_count + 1 WHERE post_id = ?',
                    [target_id]
                );
            } else if (target_type === 2) { // 评论
                await query(
                    'UPDATE comm_comments SET like_count = like_count + 1 WHERE comment_id = ?',
                    [target_id]
                );
            }
            
            // 发送通知（不给自己发）
            if (targetOwnerId !== user.user_id) {
                const targetTypeStr = target_type === 1 ? '帖子' : '评论';
                const url = target_type === 1 
                    ? `community/post?id=${target_id}` 
                    : `community/post?id=${await getPostIdFromComment(target_id)}&comment=${target_id}`;
                
                message.sendMsg(
                    user.user_id,
                    targetOwnerId,
                    `点赞了你的${targetTypeStr}：${targetTitle}`,
                    url,
                    'like_collect'
                );
            }
            
            res.json({ 
                msg: '点赞成功',
                liked: true
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取点赞状态
router.get('/like/status', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { target_id, target_type } = req.query;
        
        const like = await query(
            'SELECT * FROM comm_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
            [user.user_id, target_id, target_type]
        );
        
        res.json({ 
            liked: like.length > 0
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取收藏夹列表
router.get('/collections', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        const collections = await query(
            'SELECT * FROM comm_collections WHERE user_id = ? ORDER BY create_time DESC',
            [user.user_id]
        );
        
        res.json(collections);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 创建收藏夹
router.post('/collections', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ msg: '收藏夹名称不能为空' });
        }
        
        // 检查同名收藏夹
        const existingCollection = await query(
            'SELECT * FROM comm_collections WHERE user_id = ? AND name = ?',
            [user.user_id, name]
        );
        
        if (existingCollection.length > 0) {
            return res.status(400).json({ msg: '已存在同名收藏夹' });
        }
        
        const result = await query(
            'INSERT INTO comm_collections (user_id, name, description, create_time) VALUES (?, ?, ?, NOW())',
            [user.user_id, name, description || null]
        );
        
        res.json({
            msg: '收藏夹创建成功',
            collection_id: result.insertId
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 更新收藏夹
router.put('/collections/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const collectionId = req.params.id;
        const { name, description } = req.body;
        
        // 检查收藏夹是否存在且属于当前用户
        const collection = await query(
            'SELECT * FROM comm_collections WHERE collection_id = ? AND user_id = ?',
            [collectionId, user.user_id]
        );
        
        if (collection.length === 0) {
            return res.status(404).json({ msg: '收藏夹不存在或无权限修改' });
        }
        
        if (name) {
            // 检查同名收藏夹
            const existingCollection = await query(
                'SELECT * FROM comm_collections WHERE user_id = ? AND name = ? AND collection_id != ?',
                [user.user_id, name, collectionId]
            );
            
            if (existingCollection.length > 0) {
                return res.status(400).json({ msg: '已存在同名收藏夹' });
            }
        }
        
        await query(
            'UPDATE comm_collections SET name = ?, description = ?, update_time = NOW() WHERE collection_id = ?',
            [name || collection[0].name, description !== undefined ? description : collection[0].description, collectionId]
        );
        
        res.json({ msg: '收藏夹更新成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 删除收藏夹
router.delete('/collections/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const collectionId = req.params.id;
        
        // 检查收藏夹是否存在且属于当前用户
        const collection = await query(
            'SELECT * FROM comm_collections WHERE collection_id = ? AND user_id = ?',
            [collectionId, user.user_id]
        );
        
        if (collection.length === 0) {
            return res.status(404).json({ msg: '收藏夹不存在或无权限删除' });
        }
        
        // 删除收藏夹中的所有收藏
        await query(
            'DELETE FROM comm_favorites WHERE collection_id = ?',
            [collectionId]
        );
        
        // 删除收藏夹
        await query(
            'DELETE FROM comm_collections WHERE collection_id = ?',
            [collectionId]
        );
        
        res.json({ msg: '收藏夹删除成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 收藏帖子
router.post('/favorite', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { post_id, collection_id } = req.body;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ? AND status = 1',
            [post_id]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被删除' });
        }
        
        // 检查收藏夹是否存在且属于当前用户
        const collection = await query(
            'SELECT * FROM comm_collections WHERE collection_id = ? AND user_id = ?',
            [collection_id, user.user_id]
        );
        
        if (collection.length === 0) {
            return res.status(404).json({ msg: '收藏夹不存在或无权限使用' });
        }
        
        // 检查是否已收藏
        const existingFavorite = await query(
            'SELECT * FROM comm_favorites WHERE user_id = ? AND post_id = ?',
            [user.user_id, post_id]
        );
        
        if (existingFavorite.length > 0) {
            // 已收藏，更新收藏夹
            await query(
                'UPDATE comm_favorites SET collection_id = ? WHERE user_id = ? AND post_id = ?',
                [collection_id, user.user_id, post_id]
            );
            
            res.json({ 
                msg: '更新收藏成功',
                favorited: true
            });
        } else {
            // 未收藏，添加收藏
            await query(
                'INSERT INTO comm_favorites (user_id, post_id, collection_id, create_time) VALUES (?, ?, ?, NOW())',
                [user.user_id, post_id, collection_id]
            );
            
            // 发送通知（不给自己发）
            if (post[0].user_id !== user.user_id) {
                message.sendMsg(
                    user.user_id,
                    post[0].user_id,
                    `收藏了你的帖子：${post[0].title}`,
                    `community/post?id=${post_id}`,
                    'like_collect'
                );
            }
            
            res.json({ 
                msg: '收藏成功',
                favorited: true
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 取消收藏
router.delete('/favorite', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { post_id } = req.body;
        
        // 删除收藏
        await query(
            'DELETE FROM comm_favorites WHERE user_id = ? AND post_id = ?',
            [user.user_id, post_id]
        );
        
        res.json({ 
            msg: '取消收藏成功',
            favorited: false
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取收藏状态
router.get('/favorite/status', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { post_id } = req.query;
        
        const favorite = await query(
            'SELECT * FROM comm_favorites WHERE user_id = ? AND post_id = ?',
            [user.user_id, post_id]
        );
        
        res.json({ 
            favorited: favorite.length > 0,
            collection_id: favorite.length > 0 ? favorite[0].collection_id : null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取收藏夹内容
router.get('/collections/:id/posts', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const collectionId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        // 检查收藏夹是否存在且属于当前用户
        const collection = await query(
            'SELECT * FROM comm_collections WHERE collection_id = ? AND user_id = ?',
            [collectionId, user.user_id]
        );
        
        if (collection.length === 0) {
            return res.status(404).json({ msg: '收藏夹不存在或无权限访问' });
        }
        
        // 获取收藏的帖子
        const posts = await query(
            `SELECT p.*, f.create_time as favorite_time, u.name as author_name, u.avatar_url as author_avatar,
                   c.name as circle_name
            FROM comm_favorites f
            JOIN comm_posts p ON f.post_id = p.post_id
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            WHERE f.collection_id = ? AND p.status = 1
            ORDER BY f.create_time DESC
            LIMIT ?, ?`,
            [collectionId, (page - 1) * pageSize, pageSize]
        );
        
        // 处理媒体URL
        for (let post of posts) {
            if (post.media_urls) {
                try {
                    post.media_urls = JSON.parse(post.media_urls);
                } catch (e) {
                    post.media_urls = [];
                }
            } else {
                post.media_urls = [];
            }
        }
        
        // 获取总数
        const totalResult = await query(
            `SELECT COUNT(*) as total 
             FROM comm_favorites f
             JOIN comm_posts p ON f.post_id = p.post_id
             WHERE f.collection_id = ? AND p.status = 1`,
            [collectionId]
        );
        
        res.json({
            list: posts,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 辅助函数：从评论ID获取帖子ID
async function getPostIdFromComment(commentId) {
    const comment = await query(
        'SELECT post_id FROM comm_comments WHERE comment_id = ?',
        [commentId]
    );
    
    return comment.length > 0 ? comment[0].post_id : null;
}

module.exports = router; 