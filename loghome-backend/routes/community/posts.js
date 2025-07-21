// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');
let message = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 获取帖子列表
router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const circleId = req.query.circle_id;
        const userId = req.query.user_id;
        const keyword = req.query.keyword;
        
        let queryStr = `
            SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
                   c.name as circle_name
            FROM comm_posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            WHERE p.status = 1
        `;
        let params = [];
        
        if (circleId) {
            queryStr += ' AND p.circle_id = ?';
            params.push(circleId);
        }
        
        if (userId) {
            queryStr += ' AND p.user_id = ?';
            params.push(userId);
        }
        
        if (keyword) {
            queryStr += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        // 先显示置顶帖，再按时间倒序
        queryStr += ' ORDER BY p.is_top DESC, p.create_time DESC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const posts = await query(queryStr, params);
        
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
            
            // 获取帖子标签
            const tags = await query(
                `SELECT t.* FROM comm_post_tags pt
                 JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
                 WHERE pt.post_id = ?`,
                [post.post_id]
            );
            
            post.tags = tags;
        }
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_posts WHERE status = 1';
        const countParams = [];
        
        if (circleId) {
            countQuery += ' AND circle_id = ?';
            countParams.push(circleId);
        }
        
        if (userId) {
            countQuery += ' AND user_id = ?';
            countParams.push(userId);
        }
        
        if (keyword) {
            countQuery += ' AND (title LIKE ? OR content LIKE ?)';
            countParams.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        const totalResult = await query(countQuery, countParams);
        const total = totalResult[0].total;
        
        res.json({
            list: posts,
            total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取帖子详情
router.get('/detail/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        
        // 更新浏览数
        await query(
            'UPDATE comm_posts SET view_count = view_count + 1 WHERE post_id = ?',
            [postId]
        );
        
        const posts = await query(
            `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar, u.motto as author_motto,
                   c.name as circle_name, c.circle_id
            FROM comm_posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            WHERE p.post_id = ? AND p.status = 1`,
            [postId]
        );
        
        if (posts.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被删除' });
        }
        
        const post = posts[0];
        
        // 处理媒体URL
        if (post.media_urls) {
            try {
                post.media_urls = JSON.parse(post.media_urls);
            } catch (e) {
                post.media_urls = [];
            }
        } else {
            post.media_urls = [];
        }
        
        // 获取帖子标签
        const tags = await query(
            `SELECT t.* FROM comm_post_tags pt
             JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
             WHERE pt.post_id = ?`,
            [postId]
        );
        
        post.tags = tags;
        
        // 获取@的用户
        const mentions = await query(
            `SELECT m.*, u.name, u.avatar_url
             FROM comm_post_mentions m
             JOIN users u ON m.user_id = u.user_id
             WHERE m.post_id = ?`,
            [postId]
        );
        
        post.mentions = mentions;
        
        // 如果帖子绑定了作品，获取作品信息
        if (post.novel_id) {
            const novel = await query(
                `SELECT n.*, u.name as author_name, u.avatar_url as auther_avatar
                 FROM novels n
                 LEFT JOIN users u ON n.author_id = u.user_id
                 WHERE n.novel_id = ? AND n.deleted = 0`,
                [post.novel_id]
            );
            
            if (novel.length > 0) {
                post.novel_info = novel[0];
            }
        }
        
        res.json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 发布帖子
router.post('/create', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id, title, content, type, media_urls, tag_ids, mention_ids, novel_id } = req.body;
        
        // 检查圈子是否存在
        const circle = await query(
            'SELECT * FROM comm_circles WHERE circle_id = ? AND status = 1',
            [circle_id]
        );
        
        if (circle.length === 0) {
            return res.status(404).json({ msg: '圈子不存在或已被禁用' });
        }
        
        // 检查用户是否是圈子成员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '您不是该圈子成员，无法发布帖子' });
        }
        
        // 检查用户是否被禁言
        if (member[0].is_banned === 1) {
            // 获取禁言详情
            const banInfo = await query(
                `SELECT * FROM comm_circle_bans 
                 WHERE circle_id = ? AND user_id = ? AND ban_type = 0 AND status = 1
                 ORDER BY create_time DESC LIMIT 1`,
                [circle_id, user.user_id]
            );
            
            if (banInfo.length > 0) {
                // 检查禁言是否已过期
                if (banInfo[0].end_time) {
                    const endTime = new Date(banInfo[0].end_time);
                    const now = new Date();
                    
                    if (endTime > now) {
                        return res.status(403).json({ 
                            msg: '您已被禁言，无法发布帖子',
                            ban_info: banInfo[0]
                        });
                    } else {
                        // 禁言已过期，更新状态
                        await query(
                            'UPDATE comm_circle_members SET is_banned = 0, ban_end_time = NULL WHERE circle_id = ? AND user_id = ?',
                            [circle_id, user.user_id]
                        );
                        
                        await query(
                            'UPDATE comm_circle_bans SET status = 0 WHERE ban_id = ?',
                            [banInfo[0].ban_id]
                        );
                    }
                } else {
                    // 永久禁言
                    return res.status(403).json({ 
                        msg: '您已被永久禁言，无法发布帖子',
                        ban_info: banInfo[0]
                    });
                }
            }
        }
        
        // 检查标签是否属于该圈子
        if (tag_ids && tag_ids.length > 0) {
            for (const tagId of tag_ids) {
                const tag = await query(
                    'SELECT * FROM comm_circle_tags WHERE tag_id = ? AND circle_id = ?',
                    [tagId, circle_id]
                );
                
                if (tag.length === 0) {
                    return res.status(400).json({ msg: '标签不存在或不属于该圈子' });
                }
            }
            
            if (tag_ids.length > 3) {
                return res.status(400).json({ msg: '最多只能添加3个标签' });
            }
        }
        
        // 处理媒体URL
        let mediaUrlsJson = null;
        if (media_urls && media_urls.length > 0) {
            if (type === 0 && media_urls.length > 9) {
                return res.status(400).json({ msg: '图文类型最多只能上传9张图片' });
            }
            mediaUrlsJson = JSON.stringify(media_urls);
        }
        
        // 判断是否需要审核 - 改为用户加入圈子后直接发布，无需审核
        const initialStatus = 1; // 直接发布
        
        // 检查如果提供了novel_id，确认该小说存在且用户有权限绑定
        if (novel_id) {
            const novel = await query(
                'SELECT * FROM novels WHERE novel_id = ? AND deleted = 0',
                [novel_id]
            );
            
            if (novel.length === 0) {
                return res.status(404).json({ msg: '作品不存在或已被删除' });
            }
            
            // 验证用户是否有权限绑定该作品（作者本人）
            if (novel[0].author_id !== user.user_id) {
                return res.status(403).json({ msg: '您只能绑定自己创作的作品' });
            }
        }
        
        // 创建帖子
        const result = await query(
            `INSERT INTO comm_posts (circle_id, user_id, title, content, type, media_urls, status, create_time, novel_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
            [circle_id, user.user_id, title, content, type || 0, mediaUrlsJson, initialStatus, novel_id || null]
        );
        
        const postId = result.insertId;
        
        // 添加标签关联
        if (tag_ids && tag_ids.length > 0) {
            for (const tagId of tag_ids) {
                await query(
                    'INSERT INTO comm_post_tags (post_id, tag_id) VALUES (?, ?)',
                    [postId, tagId]
                );
            }
        }
        
        // 处理@用户
        if (mention_ids && mention_ids.length > 0) {
            for (const mentionId of mention_ids) {
                await query(
                    'INSERT INTO comm_post_mentions (post_id, user_id, create_time) VALUES (?, ?, NOW())',
                    [postId, mentionId]
                );
                
                // 发送通知
                message.sendMsg(
                    user.user_id,
                    mentionId,
                    `在帖子《${title}》中提到了你`,
                    `community/postDetail?id=${postId}`,
                    'notification'
                );
            }
        }
        
        // 更新圈子帖子数
        await query(
            'UPDATE comm_circles SET post_count = post_count + 1 WHERE circle_id = ?',
            [circle_id]
        );
        
        // 如果需要审核，通知管理员
        if (initialStatus === 1) { // 直接发布，不通知管理员
            res.json({ 
                msg: '帖子发布成功',
                post_id: postId,
                status: initialStatus
            });
        } else { // 需要审核，通知管理员
            // 获取圈主和管理员
            const admins = await query(
                'SELECT user_id FROM comm_circle_members WHERE circle_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [circle_id]
            );
            
            for (const admin of admins) {
                message.sendMsg(
                    user.user_id,
                    admin.user_id,
                    `圈子「${circle[0].name}」有新帖子待审核：${title}`,
                    `community/circle/admin?id=${circle_id}`,
                    'notification'
                );
            }
            
            res.json({ 
                msg: '帖子已提交，等待审核',
                post_id: postId,
                status: initialStatus
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 编辑帖子
router.put('/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        const { title, content, media_urls, tag_ids, novel_id } = req.body;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ?',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在' });
        }
        
        // 检查是否是帖子作者
        if (post[0].user_id !== user.user_id) {
            // 检查是否是圈主或管理员
            const member = await query(
                'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [post[0].circle_id, user.user_id]
            );
            
            if (member.length === 0) {
                return res.status(403).json({ msg: '只有帖子作者、圈主或管理员可以编辑帖子' });
            }
        }
        
        // 处理媒体URL
        let mediaUrlsJson = post[0].media_urls;
        if (media_urls) {
            if (post[0].type === 0 && media_urls.length > 9) {
                return res.status(400).json({ msg: '图文类型最多只能上传9张图片' });
            }
            mediaUrlsJson = JSON.stringify(media_urls);
        }
        
        // 检查如果提供了novel_id，确认该小说存在且用户有权限绑定
        if (novel_id) {
            const novel = await query(
                'SELECT * FROM novels WHERE novel_id = ? AND deleted = 0',
                [novel_id]
            );
            
            if (novel.length === 0) {
                return res.status(404).json({ msg: '作品不存在或已被删除' });
            }
            
            // 验证用户是否有权限绑定该作品（作者本人）
            if (novel[0].author_id !== user.user_id) {
                return res.status(403).json({ msg: '您只能绑定自己创作的作品' });
            }
        }
        
        // 更新帖子
        await query(
            'UPDATE comm_posts SET title = ?, content = ?, media_urls = ?, novel_id = ?, update_time = NOW() WHERE post_id = ?',
            [title, content, mediaUrlsJson, novel_id || null, postId]
        );
        
        // 更新标签关联
        if (tag_ids) {
            // 删除旧标签关联
            await query(
                'DELETE FROM comm_post_tags WHERE post_id = ?',
                [postId]
            );
            
            // 添加新标签关联
            if (tag_ids.length > 0) {
                if (tag_ids.length > 3) {
                    return res.status(400).json({ msg: '最多只能添加3个标签' });
                }
                
                for (const tagId of tag_ids) {
                    // 检查标签是否属于该圈子
                    const tag = await query(
                        'SELECT * FROM comm_circle_tags WHERE tag_id = ? AND circle_id = ?',
                        [tagId, post[0].circle_id]
                    );
                    
                    if (tag.length === 0) {
                        return res.status(400).json({ msg: '标签不存在或不属于该圈子' });
                    }
                    
                    await query(
                        'INSERT INTO comm_post_tags (post_id, tag_id) VALUES (?, ?)',
                        [postId, tagId]
                    );
                }
            }
        }
        
        res.json({ msg: '帖子更新成功', post_id: postId, status: 1 });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 删除帖子
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ?',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在' });
        }
        
        // 检查权限
        if (post[0].user_id !== user.user_id) {
            // 检查是否是圈主或管理员
            const member = await query(
                'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [post[0].circle_id, user.user_id]
            );
            
            if (member.length === 0) {
                return res.status(403).json({ msg: '只有帖子作者、圈主或管理员可以删除帖子' });
            }
        }
        
        // 软删除帖子
        await query(
            'UPDATE comm_posts SET status = 3 WHERE post_id = ?',
            [postId]
        );
        
        // 记录审核日志（如果是管理操作）
        if (post[0].user_id !== user.user_id) {
            const reason = req.body.reason || '违反社区规则';
            
            await query(
                `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                 VALUES (?, ?, 2, 3, ?)`,
                [user.user_id, postId, reason]
            );
            
            // 通知作者
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `您的帖子《${post[0].title}》已被删除，原因：${reason}`,
                '',
                'notification'
            );
        }
        
        // 更新圈子帖子数
        await query(
            'UPDATE comm_circles SET post_count = post_count - 1 WHERE circle_id = ?',
            [post[0].circle_id]
        );
        
        res.json({ msg: '帖子删除成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 置顶帖子
router.post('/:id/top', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        const { is_top } = req.body;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ? AND status = 1',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被删除' });
        }
        
        // 检查是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [post[0].circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以置顶帖子' });
        }
        
        if (is_top) {
            // 检查置顶帖子数量
            const topCount = await query(
                'SELECT COUNT(*) as count FROM comm_posts WHERE circle_id = ? AND is_top = 1 AND status = 1',
                [post[0].circle_id]
            );
            
            if (topCount[0].count >= 5) {
                return res.status(400).json({ msg: '置顶帖子数量已达上限(5个)' });
            }
        }
        
        // 更新置顶状态
        await query(
            'UPDATE comm_posts SET is_top = ? WHERE post_id = ?',
            [is_top ? 1 : 0, postId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, 4, ?)`,
            [user.user_id, postId, is_top ? '置顶帖子' : '取消置顶']
        );
        
        res.json({ msg: is_top ? '帖子置顶成功' : '取消置顶成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 加精帖子
router.post('/:id/essence', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        const { is_essence } = req.body;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ? AND status = 1',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被删除' });
        }
        
        // 检查是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [post[0].circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以加精帖子' });
        }
        
        // 更新加精状态
        await query(
            'UPDATE comm_posts SET is_essence = ? WHERE post_id = ?',
            [is_essence ? 1 : 0, postId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, 5, ?)`,
            [user.user_id, postId, is_essence ? '加精帖子' : '取消加精']
        );
        
        // 通知作者
        if (is_essence) {
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `恭喜！您的帖子《${post[0].title}》被设为精华帖`,
                `community/postDetail?id=${postId}`,
                'notification'
            );
        }
        
        res.json({ msg: is_essence ? '帖子加精成功' : '取消加精成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 审核帖子
router.post('/:id/audit', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        const { status, reason } = req.body;
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ?',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在' });
        }
        
        // 检查是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [post[0].circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以审核帖子' });
        }
        
        // 更新帖子状态
        await query(
            'UPDATE comm_posts SET status = ?, audit_user_id = ?, audit_time = NOW(), audit_reason = ? WHERE post_id = ?',
            [status, user.user_id, reason || null, postId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, ?, ?)`,
            [user.user_id, postId, status === 1 ? 1 : 2, reason || '']
        );
        
        // 通知作者
        if (status === 1) {
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `您的帖子《${post[0].title}》已审核通过`,
                `community/postDetail?id=${postId}`,
                'notification'
            );
        } else {
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `您的帖子《${post[0].title}》未通过审核，原因：${reason || '不符合规则'}`,
                '',
                'notification'
            );
        }
        
        res.json({ msg: status === 1 ? '帖子审核通过' : '帖子审核拒绝' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取推荐帖子
router.get('/recommend', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const sort = req.query.sort || 'hot';
        
        let queryStr = `
            SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
                   c.name as circle_name
            FROM comm_posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            WHERE p.status = 1
        `;
        
        // 根据排序类型添加不同的排序条件
        if (sort === 'hot') {
            queryStr += `
                ORDER BY 
                    p.is_top DESC,
                    p.is_essence DESC,
                    (p.like_count * 2 + p.comment_count * 3 + p.view_count) DESC,
                    p.create_time DESC
            `;
        } else {
            queryStr += ' ORDER BY p.is_top DESC, p.create_time DESC';
        }
        
        queryStr += ' LIMIT ?, ?';
        
        const posts = await query(queryStr, [(page - 1) * pageSize, pageSize]);
        
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
            
            // 获取帖子标签
            const tags = await query(
                `SELECT t.* FROM comm_post_tags pt
                 JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
                 WHERE pt.post_id = ?`,
                [post.post_id]
            );
            
            post.tags = tags;
        }
        
        // 获取总数
        const totalResult = await query(
            'SELECT COUNT(*) as total FROM comm_posts WHERE status = 1'
        );
        const total = totalResult[0].total;
        
        res.json({
            list: posts,
            total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取关注的圈子帖子
router.get('/following', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const sort = req.query.sort || 'new';
        
        let queryStr = `
            SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
                   c.name as circle_name
            FROM comm_posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            JOIN comm_circle_members m ON p.circle_id = m.circle_id
            WHERE p.status = 1 AND m.user_id = ? AND m.status = 1
        `;
        
        // 根据排序类型添加不同的排序条件
        if (sort === 'hot') {
            queryStr += `
                ORDER BY 
                    p.is_top DESC,
                    p.is_essence DESC,
                    (p.like_count * 2 + p.comment_count * 3 + p.view_count) DESC,
                    p.create_time DESC
            `;
        } else {
            queryStr += ' ORDER BY p.is_top DESC, p.create_time DESC';
        }
        
        queryStr += ' LIMIT ?, ?';
        
        const posts = await query(queryStr, [user.user_id, (page - 1) * pageSize, pageSize]);
        
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
            
            // 获取帖子标签
            const tags = await query(
                `SELECT t.* FROM comm_post_tags pt
                 JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
                 WHERE pt.post_id = ?`,
                [post.post_id]
            );
            
            post.tags = tags;
        }
        
        // 获取总数
        const totalResult = await query(
            `SELECT COUNT(*) as total 
             FROM comm_posts p
             JOIN comm_circle_members m ON p.circle_id = m.circle_id
             WHERE p.status = 1 AND m.user_id = ? AND m.status = 1`,
            [user.user_id]
        );
        const total = totalResult[0].total;
        
        res.json({
            list: posts,
            total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
