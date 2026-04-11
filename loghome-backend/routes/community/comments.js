// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let achievements = require('../../bin/achievements.js');

// 创建路由对象
let router = express.Router();

// 获取帖子评论列表
router.get('/list', async (req, res) => {
    try {
        const postId = req.query.post_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        
        if (!postId) {
            return res.status(400).json({ msg: '缺少必要参数post_id' });
        }
        
        const comments = await query(
            `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
             FROM comm_comments c
             LEFT JOIN users u ON c.user_id = u.user_id
             WHERE c.post_id = ? AND c.parent_id = 0 AND c.status = 1
             ORDER BY c.create_time ASC
             LIMIT ?, ?`,
            [postId, (page - 1) * pageSize, pageSize]
        );
        
        // 获取每个评论用户的勋章
        for (let comment of comments) {
            comment.user_badge = await achievements.getUserBadge(comment.user_id);
            comment.user_title = await achievements.getUserTitleProfile(comment.user_id);
            comment.user_title_text = comment.user_title.display_text;
        }
        
        const commentIds = comments.map(c => c.comment_id);
        
        if (commentIds.length > 0) {
            const countsResult = await query(
                `SELECT root_id, COUNT(*) as count FROM comm_comments 
                 WHERE root_id IN (${commentIds.map(() => '?').join(',')}) AND status = 1 GROUP BY root_id`,
                commentIds
            );
            const countMap = {};
            countsResult.forEach(r => { countMap[r.root_id] = r.count; });
            comments.forEach(c => { c.reply_count = countMap[c.comment_id] || 0; });
            
            let userId = null;
            try {
                const authReq = require('../../bin/auth.js');
                const token = req.headers.authorization?.replace('Bearer ', '');
                if (token) {
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.verify(token, 'loghome-secret');
                    const userResult = await query('SELECT user_id FROM users WHERE user_id = ?', [decoded.user_id]);
                    if (userResult.length > 0) {
                        userId = userResult[0].user_id;
                    }
                }
            } catch (e) {}
            
            if (userId) {
                const likeStatus = await getLikesStatus(userId, commentIds, 2);
                comments.forEach(c => { c.is_liked = likeStatus[c.comment_id] || false; });
            }
        }
        
        const totalResult = await query(
            'SELECT COUNT(*) as total FROM comm_comments WHERE post_id = ? AND parent_id = 0 AND status = 1',
            [postId]
        );
        
        res.json({
            list: comments,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取评论回复列表
router.get('/replies', async (req, res) => {
    try {
        const commentId = req.query.comment_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        
        if (!commentId) {
            return res.status(400).json({ msg: '缺少必要参数comment_id' });
        }
        
        const replies = await query(
            `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar,
                    ru.name as reply_user_name
             FROM comm_comments c
             LEFT JOIN users u ON c.user_id = u.user_id
             LEFT JOIN users ru ON c.reply_to_user_id = ru.user_id
             WHERE c.root_id = ? AND c.status = 1
             ORDER BY c.create_time ASC
             LIMIT ?, ?`,
            [commentId, (page - 1) * pageSize, pageSize]
        );
        
        // 获取每个回复用户的勋章
        for (let reply of replies) {
            reply.user_badge = await achievements.getUserBadge(reply.user_id);
            reply.user_title = await achievements.getUserTitleProfile(reply.user_id);
            reply.user_title_text = reply.user_title.display_text;
        }
        
        const replyIds = replies.map(r => r.comment_id);
        
        if (replyIds.length > 0) {
            let userId = null;
            try {
                const token = req.headers.authorization?.replace('Bearer ', '');
                if (token) {
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.verify(token, 'loghome-secret');
                    const userResult = await query('SELECT user_id FROM users WHERE user_id = ?', [decoded.user_id]);
                    if (userResult.length > 0) {
                        userId = userResult[0].user_id;
                    }
                }
            } catch (e) {}
            
            if (userId) {
                const likeStatus = await getLikesStatus(userId, replyIds, 2);
                replies.forEach(r => { r.is_liked = likeStatus[r.comment_id] || false; });
            }
        }
        
        const totalResult = await query(
            'SELECT COUNT(*) as total FROM comm_comments WHERE root_id = ? AND status = 1',
            [commentId]
        );
        
        res.json({
            list: replies,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 发表评论
router.post('/create', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { post_id, content, image_url, parent_id = 0, reply_to_user_id, mention_ids } = req.body;
        
        if (!post_id || content == undefined) {
            return res.status(400).json({ msg: '缺少必要参数' });
        }
        
        if (content.length > 500) {
            return res.status(400).json({ msg: '评论内容不能超过500字' });
        }
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ? AND status = 1',
            [post_id]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被删除' });
        }
        
        // 确定根评论ID
        let rootId = 0;
        if (parent_id > 0) {
            const parentComment = await query(
                'SELECT * FROM comm_comments WHERE comment_id = ? AND status = 1',
                [parent_id]
            );
            
            if (parentComment.length === 0) {
                return res.status(404).json({ msg: '回复的评论不存在或已被删除' });
            }
            
            // 如果父评论是根评论，则根评论ID就是父评论ID
            // 否则使用父评论的根评论ID
            rootId = parentComment[0].parent_id === 0 ? parent_id : parentComment[0].root_id;
        }
        
        // 创建评论
        const result = await query(
            `INSERT INTO comm_comments (post_id, user_id, content, image_url, parent_id, root_id, reply_to_user_id, create_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [post_id, user.user_id, content, image_url || null, parent_id, rootId, reply_to_user_id || null]
        );
        
        const commentId = result.insertId;
        await achievements.recordMetricProgress(user.user_id, 'comment_count', 1, {
            reason: '社区评论',
            suppressNotification: true,
        });
        
        // 更新帖子评论数
        await query(
            'UPDATE comm_posts SET comment_count = comment_count + 1 WHERE post_id = ?',
            [post_id]
        );
        
        // 处理@用户
        if (mention_ids && mention_ids.length > 0) {
            for (const mentionId of mention_ids) {
                await query(
                    'INSERT INTO comm_comment_mentions (comment_id, user_id, create_time) VALUES (?, ?, NOW())',
                    [commentId, mentionId]
                );
                
                // 发送通知
                message.sendMsg(
                    user.user_id,
                    mentionId,
                    `在评论中提到了你：${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
                    `community/postDetail?id=${post_id}&comment=${commentId}`,
                    'notification'
                );
            }
        }
        
        // 发送通知
        if (parent_id === 0) {
            // 如果是主评论，通知帖子作者
            if (post[0].user_id !== user.user_id) {
                message.sendMsg(
                    user.user_id,
                    post[0].user_id,
                    `评论了你的帖子：${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
                    `community/postDetail?id=${post_id}&comment=${commentId}`,
                    'comment'
                );
            }
        } else {
            // 如果是回复，通知被回复的用户
            if (reply_to_user_id && reply_to_user_id !== user.user_id) {
                message.sendMsg(
                    user.user_id,
                    reply_to_user_id,
                    `回复了你的评论：${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
                    `community/postDetail?id=${post_id}&comment=${rootId}`,
                    'comment'
                );
            }
        }
        
        // 返回新创建的评论
        const newComment = await query(
            `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
             FROM comm_comments c
             LEFT JOIN users u ON c.user_id = u.user_id
             WHERE c.comment_id = ?`,
            [commentId]
        );
        if (newComment && newComment[0]) {
            newComment[0].user_badge = await achievements.getUserBadge(newComment[0].user_id);
            newComment[0].user_title = await achievements.getUserTitleProfile(newComment[0].user_id);
            newComment[0].user_title_text = newComment[0].user_title.display_text;
        }
        
        res.json({
            msg: '评论发表成功',
            comment: newComment[0]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 删除评论
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const commentId = req.params.id;
        
        // 检查评论是否存在
        const comment = await query(
            'SELECT * FROM comm_comments WHERE comment_id = ?',
            [commentId]
        );
        
        if (comment.length === 0) {
            return res.status(404).json({ msg: '评论不存在' });
        }
        
        // 检查权限
        if (comment[0].user_id !== user.user_id) {
            // 检查是否是圈主或管理员
            const post = await query(
                'SELECT circle_id FROM comm_posts WHERE post_id = ?',
                [comment[0].post_id]
            );
            
            if (post.length === 0) {
                return res.status(404).json({ msg: '关联的帖子不存在' });
            }
            
            const member = await query(
                'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [post[0].circle_id, user.user_id]
            );
            
            if (member.length === 0) {
                return res.status(403).json({ msg: '只有评论作者、圈主或管理员可以删除评论' });
            }
        }
        
        // 记录删除原因（如果是管理操作）
        if (comment[0].user_id !== user.user_id) {
            const reason = req.body.reason || '违反社区规则';
            
            await query(
                'UPDATE comm_comments SET status = 2, delete_reason = ? WHERE comment_id = ?',
                [reason, commentId]
            );
            
            // 记录审核日志
            await query(
                `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                 VALUES (?, ?, 3, 3, ?)`,
                [user.user_id, commentId, reason]
            );
            
            // 通知作者
            message.sendMsg(
                user.user_id,
                comment[0].user_id,
                `您的评论已被删除，原因：${reason}`,
                '',
                'notification'
            );
        } else {
            // 如果是作者自己删除
            await query(
                'UPDATE comm_comments SET status = 0 WHERE comment_id = ?',
                [commentId]
            );
        }
        
        // 更新帖子评论数
        await query(
            'UPDATE comm_posts SET comment_count = comment_count - 1 WHERE post_id = ?',
            [comment[0].post_id]
        );
        
        res.json({ msg: '评论删除成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

async function getLikesStatus(userId, targetIds, targetType) {
    if (!targetIds || targetIds.length === 0) {
        return {};
    }
    
    const placeholders = targetIds.map(() => '?').join(',');
    const likes = await query(
        `SELECT target_id FROM comm_likes 
         WHERE user_id = ? AND target_type = ? AND target_id IN (${placeholders})`,
        [userId, targetType, ...targetIds]
    );
    
    const likedSet = new Set(likes.map(l => l.target_id));
    const result = {};
    targetIds.forEach(id => {
        result[id] = likedSet.has(id);
    });
    
    return result;
}

module.exports = router;
