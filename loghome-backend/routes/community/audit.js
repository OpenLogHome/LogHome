// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let adminAuth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 获取待审核圈子列表
router.get('/circles', adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        const circles = await query(
            `SELECT c.*, u.name as creator_name, u.avatar_url as creator_avatar,
                   cc.name as category_name
            FROM comm_circles c
            LEFT JOIN users u ON c.creator_id = u.user_id
            LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
            WHERE c.status = 0
            ORDER BY c.create_time ASC
            LIMIT ?, ?`,
            [(page - 1) * pageSize, pageSize]
        );
        
        const totalResult = await query(
            'SELECT COUNT(*) as total FROM comm_circles WHERE status = 0'
        );
        
        res.json({
            list: circles,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取待审核帖子列表
router.get('/posts', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const circleId = req.query.circle_id;
        
        // 检查用户权限
        let isAdmin = user.is_admin === 1;
        let managedCircles = [];
        
        if (!isAdmin && !circleId) {
            // 获取用户管理的圈子
            const circles = await query(
                'SELECT circle_id FROM comm_circle_members WHERE user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [user.user_id]
            );
            
            if (circles.length === 0) {
                return res.status(403).json({ msg: '您没有权限审核帖子' });
            }
            
            managedCircles = circles.map(c => c.circle_id);
        }
        
        let queryStr = `
            SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
                   c.name as circle_name
            FROM comm_posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
            WHERE p.status = 0
        `;
        let params = [];
        
        if (circleId) {
            // 检查是否有权限审核该圈子的帖子
            if (!isAdmin) {
                const member = await query(
                    'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                    [circleId, user.user_id]
                );
                
                if (member.length === 0) {
                    return res.status(403).json({ msg: '您没有权限审核该圈子的帖子' });
                }
            }
            
            queryStr += ' AND p.circle_id = ?';
            params.push(circleId);
        } else if (!isAdmin && managedCircles.length > 0) {
            queryStr += ' AND p.circle_id IN (?)';
            params.push(managedCircles);
        }
        
        queryStr += ' ORDER BY p.create_time ASC LIMIT ?, ?';
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
        }
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_posts WHERE status = 0';
        const countParams = [];
        
        if (circleId) {
            countQuery += ' AND circle_id = ?';
            countParams.push(circleId);
        } else if (!isAdmin && managedCircles.length > 0) {
            countQuery += ' AND circle_id IN (?)';
            countParams.push(managedCircles);
        }
        
        const totalResult = await query(countQuery, countParams);
        
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

// 审核圈子
router.post('/circles/:id', adminAuth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { status, reason } = req.body;
        
        if (status !== 1 && status !== 2) {
            return res.status(400).json({ msg: '无效的状态值' });
        }
        
        // 检查圈子是否存在
        const circle = await query(
            'SELECT * FROM comm_circles WHERE circle_id = ? AND status = 0',
            [circleId]
        );
        
        if (circle.length === 0) {
            return res.status(404).json({ msg: '圈子不存在或已被审核' });
        }
        
        // 更新圈子状态
        await query(
            'UPDATE comm_circles SET status = ? WHERE circle_id = ?',
            [status, circleId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason, create_time) 
             VALUES (?, ?, 1, ?, ?, NOW())`,
            [user.user_id, circleId, status === 1 ? 1 : 2, reason || '']
        );
        
        // 发送通知给创建者
        if (status === 1) {
            message.sendMsg(
                user.user_id,
                circle[0].creator_id,
                `您申请创建的圈子「${circle[0].name}」已审核通过`,
                `community/circle?id=${circleId}`,
                'notification'
            );
        } else {
            message.sendMsg(
                user.user_id,
                circle[0].creator_id,
                `您申请创建的圈子「${circle[0].name}」未通过审核，原因：${reason || '不符合要求'}`,
                '',
                'notification'
            );
        }
        
        res.json({ msg: status === 1 ? '圈子审核通过' : '圈子审核拒绝' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 审核帖子
router.post('/posts/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const postId = req.params.id;
        const { status, reason } = req.body;
        
        if (status !== 1 && status !== 2) {
            return res.status(400).json({ msg: '无效的状态值' });
        }
        
        // 检查帖子是否存在
        const post = await query(
            'SELECT * FROM comm_posts WHERE post_id = ? AND status = 0',
            [postId]
        );
        
        if (post.length === 0) {
            return res.status(404).json({ msg: '帖子不存在或已被审核' });
        }
        
        // 检查用户权限
        if (user.is_admin !== 1) {
            const member = await query(
                'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
                [post[0].circle_id, user.user_id]
            );
            
            if (member.length === 0) {
                return res.status(403).json({ msg: '您没有权限审核该帖子' });
            }
        }
        
        // 更新帖子状态
        await query(
            'UPDATE comm_posts SET status = ?, audit_user_id = ?, audit_time = NOW(), audit_reason = ? WHERE post_id = ?',
            [status, user.user_id, reason || null, postId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason, create_time) 
             VALUES (?, ?, 2, ?, ?, NOW())`,
            [user.user_id, postId, status === 1 ? 1 : 2, reason || '']
        );
        
        // 发送通知给作者
        if (status === 1) {
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `您的帖子已审核通过`,
                `community/postDetail?id=${postId}`,
                'notification'
            );
            
            // 更新圈子帖子数
            await query(
                'UPDATE comm_circles SET post_count = post_count + 1 WHERE circle_id = ?',
                [post[0].circle_id]
            );
        } else {
            message.sendMsg(
                user.user_id,
                post[0].user_id,
                `您的帖子未通过审核，原因：${reason || '不符合要求'}`,
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

// 获取敏感词列表
router.get('/sensitive-words', adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const keyword = req.query.keyword;
        
        let queryStr = 'SELECT * FROM comm_sensitive_words';
        let params = [];
        
        if (keyword) {
            queryStr += ' WHERE word LIKE ?';
            params.push(`%${keyword}%`);
        }
        
        queryStr += ' ORDER BY level DESC, word ASC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const words = await query(queryStr, params);
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_sensitive_words';
        const countParams = [];
        
        if (keyword) {
            countQuery += ' WHERE word LIKE ?';
            countParams.push(`%${keyword}%`);
        }
        
        const totalResult = await query(countQuery, countParams);
        
        res.json({
            list: words,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 添加敏感词
router.post('/sensitive-words', adminAuth, async (req, res) => {
    try {
        const { word, level } = req.body;
        
        if (!word) {
            return res.status(400).json({ msg: '敏感词不能为空' });
        }
        
        // 检查是否已存在
        const existing = await query(
            'SELECT * FROM comm_sensitive_words WHERE word = ?',
            [word]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ msg: '该敏感词已存在' });
        }
        
        // 添加敏感词
        await query(
            'INSERT INTO comm_sensitive_words (word, level, create_time) VALUES (?, ?, NOW())',
            [word, level || 1]
        );
        
        res.json({ msg: '敏感词添加成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 删除敏感词
router.delete('/sensitive-words/:id', adminAuth, async (req, res) => {
    try {
        const wordId = req.params.id;
        
        await query(
            'DELETE FROM comm_sensitive_words WHERE word_id = ?',
            [wordId]
        );
        
        res.json({ msg: '敏感词删除成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 更新敏感词
router.put('/sensitive-words/:id', adminAuth, async (req, res) => {
    try {
        const wordId = req.params.id;
        const { word, level } = req.body;
        
        // 检查是否存在
        const existing = await query(
            'SELECT * FROM comm_sensitive_words WHERE word_id = ?',
            [wordId]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ msg: '敏感词不存在' });
        }
        
        // 如果修改了词，检查新词是否已存在
        if (word && word !== existing[0].word) {
            const duplicate = await query(
                'SELECT * FROM comm_sensitive_words WHERE word = ? AND word_id != ?',
                [word, wordId]
            );
            
            if (duplicate.length > 0) {
                return res.status(400).json({ msg: '该敏感词已存在' });
            }
        }
        
        // 更新敏感词
        await query(
            'UPDATE comm_sensitive_words SET word = ?, level = ?, update_time = NOW() WHERE word_id = ?',
            [word || existing[0].word, level || existing[0].level, wordId]
        );
        
        res.json({ msg: '敏感词更新成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取审核日志
router.get('/logs', adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const targetType = req.query.target_type;
        const action = req.query.action;
        
        let queryStr = `
            SELECT l.*, u.name as operator_name, u.avatar_url as operator_avatar
            FROM comm_audit_logs l
            LEFT JOIN users u ON l.user_id = u.user_id
            WHERE 1=1
        `;
        let params = [];
        
        if (targetType) {
            queryStr += ' AND l.target_type = ?';
            params.push(parseInt(targetType));
        }
        
        if (action) {
            queryStr += ' AND l.action = ?';
            params.push(parseInt(action));
        }
        
        queryStr += ' ORDER BY l.create_time DESC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const logs = await query(queryStr, params);
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_audit_logs WHERE 1=1';
        const countParams = [];
        
        if (targetType) {
            countQuery += ' AND target_type = ?';
            countParams.push(parseInt(targetType));
        }
        
        if (action) {
            countQuery += ' AND action = ?';
            countParams.push(parseInt(action));
        }
        
        const totalResult = await query(countQuery, countParams);
        
        res.json({
            list: logs,
            total: totalResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 内容检测（敏感词过滤）
router.post('/check-content', async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ msg: '内容不能为空' });
        }
        
        // 获取所有敏感词
        const sensitiveWords = await query('SELECT * FROM comm_sensitive_words ORDER BY level DESC');
        
        const result = {
            pass: true,
            level: 0,
            words: []
        };
        
        // 检查内容是否包含敏感词
        for (const word of sensitiveWords) {
            if (content.includes(word.word)) {
                result.pass = false;
                result.level = Math.max(result.level, word.level);
                result.words.push(word.word);
            }
        }
        
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router; 