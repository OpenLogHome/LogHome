let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 获取圈子总数
router.get('/circles/count', auth, async function (req, res) {
    try {
        let results = await query('SELECT COUNT(*) count FROM comm_circles');
        res.json(results[0]);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取所有圈子列表（分页）
router.get('/circles/list', auth, async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const keyword = req.query.keyword || '';
        const status = req.query.status !== undefined ? parseInt(req.query.status) : -1;
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (keyword) {
            whereClause += ' AND (c.name LIKE ? OR c.description LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        if (status >= 0) {
            whereClause += ' AND c.status = ?';
            params.push(status);
        }
        
        const offset = (page - 1) * pageSize;
        params.push(offset, pageSize);
        
        let results = await query(
            `SELECT c.*, u.name as creator_name, cc.name as category_name 
             FROM comm_circles c
             LEFT JOIN users u ON c.creator_id = u.user_id
             LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
             ${whereClause}
             ORDER BY c.circle_id DESC LIMIT ?, ?`,
            params
        );
        
        // 获取总数
        let countParams = [];
        if (keyword) {
            countParams.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (status >= 0) {
            countParams.push(status);
        }
        
        let countResult = await query(
            `SELECT COUNT(*) as total FROM comm_circles c
             ${whereClause}`,
            countParams
        );
        
        res.json({
            list: results,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取圈子详情
router.get('/circles/detail', auth, async function (req, res) {
    try {
        if (!req.query.circle_id) {
            return res.status(400).json({ msg: 'missing circle_id' });
        }
        
        let results = await query(
            `SELECT c.*, u.name as creator_name, cc.name as category_name 
             FROM comm_circles c
             LEFT JOIN users u ON c.creator_id = u.user_id
             LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
             WHERE c.circle_id = ?`,
            [req.query.circle_id]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        res.json(results[0]);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 审核圈子
router.post('/circles/audit', auth, async function (req, res) {
    try {
        if (!req.body.circle_id || req.body.status === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        const { circle_id, status, reason } = req.body;
        
        // 更新圈子状态
        await query(
            'UPDATE comm_circles SET status = ? WHERE circle_id = ?',
            [status, circle_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 1, ?, ?)`,
            [req.user[0].user_id, circle_id, status === 1 ? 1 : 2, reason || '']
        );
        
        // 获取圈子信息
        const circle = await query(
            'SELECT name, creator_id FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (circle.length > 0) {
            // 发送通知给创建者
            if (status === 1) {
                message.sendMsg(
                    req.user[0].user_id,
                    circle[0].creator_id,
                    `您申请创建的圈子「${circle[0].name}」已审核通过`,
                    `community/circle?id=${circle_id}`,
                    'notification'
                );
            } else if (status === 2) {
                message.sendMsg(
                    req.user[0].user_id,
                    circle[0].creator_id,
                    `您申请创建的圈子「${circle[0].name}」未通过审核，原因：${reason || '未符合要求'}`,
                    '',
                    'notification'
                );
            }
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 禁用/启用圈子
router.post('/circles/toggle-status', auth, async function (req, res) {
    try {
        if (!req.body.circle_id || req.body.status === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        const { circle_id, status, reason } = req.body;
        
        // 更新圈子状态
        await query(
            'UPDATE comm_circles SET status = ? WHERE circle_id = ?',
            [status, circle_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 1, ?, ?)`,
            [req.user[0].user_id, circle_id, status === 1 ? 3 : 4, reason || '']
        );
        
        // 获取圈子信息
        const circle = await query(
            'SELECT name, creator_id FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (circle.length > 0) {
            // 发送通知给创建者
            message.sendMsg(
                req.user[0].user_id,
                circle[0].creator_id,
                `您的圈子「${circle[0].name}」已${status === 1 ? '启用' : '禁用'}${reason ? '，原因：' + reason : ''}`,
                status === 1 ? `community/circle?id=${circle_id}` : '',
                'notification'
            );
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取圈子分类
router.get('/circles/categories', auth, async function (req, res) {
    try {
        let results = await query(
            'SELECT * FROM comm_circle_categories ORDER BY parent_id, sort_order'
        );
        
        res.json(results);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 添加/编辑圈子分类
router.post('/circles/categories/save', auth, async function (req, res) {
    try {
        const { category_id, name, parent_id, sort_order } = req.body;
        
        if (!name) {
            return res.status(400).json({ msg: 'missing name' });
        }
        
        if (category_id) {
            // 更新分类
            await query(
                'UPDATE comm_circle_categories SET name = ?, parent_id = ?, sort_order = ? WHERE category_id = ?',
                [name, parent_id || 0, sort_order || 0, category_id]
            );
        } else {
            // 新增分类
            await query(
                'INSERT INTO comm_circle_categories (name, parent_id, sort_order) VALUES (?, ?, ?)',
                [name, parent_id || 0, sort_order || 0]
            );
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 删除圈子分类
router.post('/circles/categories/delete', auth, async function (req, res) {
    try {
        if (!req.body.category_id) {
            return res.status(400).json({ msg: 'missing category_id' });
        }
        
        // 检查是否有圈子使用该分类
        const circles = await query(
            'SELECT COUNT(*) as count FROM comm_circles WHERE category_id = ?',
            [req.body.category_id]
        );
        
        if (circles[0].count > 0) {
            return res.status(400).json({ msg: '该分类下有圈子，无法删除' });
        }
        
        // 检查是否有子分类
        const children = await query(
            'SELECT COUNT(*) as count FROM comm_circle_categories WHERE parent_id = ?',
            [req.body.category_id]
        );
        
        if (children[0].count > 0) {
            return res.status(400).json({ msg: '该分类下有子分类，无法删除' });
        }
        
        // 删除分类
        await query(
            'DELETE FROM comm_circle_categories WHERE category_id = ?',
            [req.body.category_id]
        );
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取社区帖子统计
router.get('/posts/stats', auth, async function (req, res) {
    try {
        // 获取帖子总数
        const totalPosts = await query('SELECT COUNT(*) as count FROM comm_posts');
        
        // 获取今日新增帖子数
        const todayPosts = await query(
            'SELECT COUNT(*) as count FROM comm_posts WHERE DATE(create_time) = CURDATE()'
        );
        
        // 获取待审核帖子数
        const pendingPosts = await query(
            'SELECT COUNT(*) as count FROM comm_posts WHERE status = 0'
        );
        
        // 获取被举报帖子数
        const reportedPosts = await query(
            'SELECT COUNT(*) as count FROM comm_reports WHERE target_type = "post" AND status = 0'
        );
        
        res.json({
            total: totalPosts[0].count,
            today: todayPosts[0].count,
            pending: pendingPosts[0].count,
            reported: reportedPosts[0].count
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取社区帖子列表
router.get('/posts/list', auth, async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const keyword = req.query.keyword || '';
        const status = req.query.status !== undefined ? parseInt(req.query.status) : -1;
        const circle_id = req.query.circle_id || '';
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (keyword) {
            whereClause += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        if (status >= 0) {
            whereClause += ' AND p.status = ?';
            params.push(status);
        }
        
        if (circle_id) {
            whereClause += ' AND p.circle_id = ?';
            params.push(circle_id);
        }
        
        const offset = (page - 1) * pageSize;
        params.push(offset, pageSize);
        
        let results = await query(
            `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar, 
                   c.name as circle_name
             FROM comm_posts p
             LEFT JOIN users u ON p.user_id = u.user_id
             LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
             ${whereClause}
             ORDER BY p.post_id DESC LIMIT ?, ?`,
            params
        );
        
        // 获取总数
        let countParams = [];
        if (keyword) {
            countParams.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (status >= 0) {
            countParams.push(status);
        }
        if (circle_id) {
            countParams.push(circle_id);
        }
        
        let countResult = await query(
            `SELECT COUNT(*) as total FROM comm_posts p
             ${whereClause}`,
            countParams
        );
        
        res.json({
            list: results,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取帖子详情
router.get('/posts/detail', auth, async function (req, res) {
    try {
        if (!req.query.post_id) {
            return res.status(400).json({ msg: 'missing post_id' });
        }
        
        let results = await query(
            `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar, 
                   c.name as circle_name
             FROM comm_posts p
             LEFT JOIN users u ON p.user_id = u.user_id
             LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
             WHERE p.post_id = ?`,
            [req.query.post_id]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ msg: 'post not found' });
        }
        
        // 处理媒体URL
        if (results[0].media_urls && typeof results[0].media_urls === 'string') {
            try {
                results[0].media_urls = JSON.parse(results[0].media_urls);
            } catch (e) {
                results[0].media_urls = [];
            }
        }
        
        // 获取评论
        const comments = await query(
            `SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
             FROM comm_comments c
             LEFT JOIN users u ON c.user_id = u.user_id
             WHERE c.post_id = ?
             ORDER BY c.comment_id ASC`,
            [req.query.post_id]
        );
        
        results[0].comments = comments;
        
        res.json(results[0]);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 审核帖子
router.post('/posts/audit', auth, async function (req, res) {
    try {
        if (!req.body.post_id || req.body.status === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        const { post_id, status, reason } = req.body;
        
        // 更新帖子状态
        await query(
            'UPDATE comm_posts SET status = ? WHERE post_id = ?',
            [status, post_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, ?, ?)`,
            [req.user[0].user_id, post_id, status === 1 ? 1 : 2, reason || '']
        );
        
        // 获取帖子信息
        const post = await query(
            'SELECT title, user_id FROM comm_posts WHERE post_id = ?',
            [post_id]
        );
        
        if (post.length > 0) {
            // 发送通知给作者
            if (status === 1) {
                message.sendMsg(
                    req.user[0].user_id,
                    post[0].user_id,
                    `您的帖子「${post[0].title}」已审核通过`,
                    `community/postDetail?id=${post_id}`,
                    'notification'
                );
            } else if (status === 2) {
                message.sendMsg(
                    req.user[0].user_id,
                    post[0].user_id,
                    `您的帖子「${post[0].title}」未通过审核，原因：${reason || '违反社区规则'}`,
                    '',
                    'notification'
                );
            }
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 删除帖子
router.post('/posts/delete', auth, async function (req, res) {
    try {
        if (!req.body.post_id) {
            return res.status(400).json({ msg: 'missing post_id' });
        }
        
        // 获取帖子信息
        const post = await query(
            'SELECT title, user_id FROM comm_posts WHERE post_id = ?',
            [req.body.post_id]
        );
        
        // 删除帖子
        await query(
            'UPDATE comm_posts SET status = 3 WHERE post_id = ?',
            [req.body.post_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, 4, ?)`,
            [req.user[0].user_id, req.body.post_id, req.body.reason || '违反社区规则']
        );
        
        if (post.length > 0) {
            // 发送通知给作者
            message.sendMsg(
                req.user[0].user_id,
                post[0].user_id,
                `您的帖子「${post[0].title}」已被管理员删除，原因：${req.body.reason || '违反社区规则'}`,
                '',
                'notification'
            );
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取举报列表
router.get('/reports/list', auth, async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const status = req.query.status !== undefined ? parseInt(req.query.status) : 0;
        const target_type = req.query.target_type || '';
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        whereClause += ' AND r.status = ?';
        params.push(status);
        
        if (target_type) {
            whereClause += ' AND r.target_type = ?';
            params.push(target_type);
        }
        
        const offset = (page - 1) * pageSize;
        params.push(offset, pageSize);
        
        let results = await query(
            `SELECT r.*, u.name as reporter_name, u.avatar_url as reporter_avatar,
                   ru.name as reviewer_name, ru.avatar_url as reviewer_avatar
             FROM comm_reports r
             LEFT JOIN users u ON r.user_id = u.user_id
             LEFT JOIN users ru ON r.reviewer_id = ru.user_id
             ${whereClause}
             ORDER BY r.report_id DESC LIMIT ?, ?`,
            params
        );
        
        // 获取目标内容信息
        for (let i = 0; i < results.length; i++) {
            if (results[i].target_type === 'post') {
                const post = await query(
                    `SELECT p.title, p.content, u.name as author_name
                     FROM comm_posts p
                     LEFT JOIN users u ON p.user_id = u.user_id
                     WHERE p.post_id = ?`,
                    [results[i].target_id]
                );
                if (post.length > 0) {
                    results[i].target_info = post[0];
                }
            } else if (results[i].target_type === 'comment') {
                const comment = await query(
                    `SELECT c.content, u.name as author_name
                     FROM comm_comments c
                     LEFT JOIN users u ON c.user_id = u.user_id
                     WHERE c.comment_id = ?`,
                    [results[i].target_id]
                );
                if (comment.length > 0) {
                    results[i].target_info = comment[0];
                }
            }
        }
        
        // 获取总数
        let countParams = [status];
        if (target_type) {
            countParams.push(target_type);
        }
        
        let countResult = await query(
            `SELECT COUNT(*) as total FROM comm_reports r
             ${whereClause}`,
            countParams
        );
        
        res.json({
            list: results,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 处理举报
router.post('/reports/handle', auth, async function (req, res) {
    try {
        if (!req.body.report_id || req.body.action === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        const { report_id, action, reason } = req.body;
        
        // 获取举报信息
        const report = await query(
            'SELECT * FROM comm_reports WHERE report_id = ?',
            [report_id]
        );
        
        if (report.length === 0) {
            return res.status(404).json({ msg: 'report not found' });
        }
        
        // 更新举报状态
        await query(
            'UPDATE comm_reports SET status = ?, reviewer_id = ?, review_time = NOW(), review_comment = ? WHERE report_id = ?',
            [action === 'ignore' ? 2 : 1, req.user[0].user_id, reason || '', report_id]
        );
        
        // 如果处理举报，则根据举报类型处理目标内容
        if (action === 'handle') {
            if (report[0].target_type === 'post') {
                // 删除帖子
                await query(
                    'UPDATE comm_posts SET status = 3 WHERE post_id = ?',
                    [report[0].target_id]
                );
                
                // 记录审核日志
                await query(
                    `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                     VALUES (?, ?, 2, 4, ?)`,
                    [req.user[0].user_id, report[0].target_id, reason || '违反社区规则']
                );
                
                // 获取帖子信息
                const post = await query(
                    'SELECT title, user_id FROM comm_posts WHERE post_id = ?',
                    [report[0].target_id]
                );
                
                if (post.length > 0) {
                    // 发送通知给作者
                    message.sendMsg(
                        req.user[0].user_id,
                        post[0].user_id,
                        `您的帖子「${post[0].title}」因被举报已被管理员删除，原因：${reason || '违反社区规则'}`,
                        '',
                        'notification'
                    );
                }
            } else if (report[0].target_type === 'comment') {
                // 删除评论
                await query(
                    'UPDATE comm_comments SET status = 0 WHERE comment_id = ?',
                    [report[0].target_id]
                );
                
                // 记录审核日志
                await query(
                    `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                     VALUES (?, ?, 3, 4, ?)`,
                    [req.user[0].user_id, report[0].target_id, reason || '违反社区规则']
                );
                
                // 获取评论信息
                const comment = await query(
                    'SELECT content, user_id, post_id FROM comm_comments WHERE comment_id = ?',
                    [report[0].target_id]
                );
                
                if (comment.length > 0) {
                    // 发送通知给作者
                    message.sendMsg(
                        req.user[0].user_id,
                        comment[0].user_id,
                        `您的评论「${comment[0].content.substring(0, 20)}...」因被举报已被管理员删除，原因：${reason || '违反社区规则'}`,
                        '',
                        'notification'
                    );
                }
            }
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 创建圈子
router.post('/circles/create', auth, async function (req, res) {
    try {
        const { name, description, icon, bg_url, category_id, creator_id, rules, announcement, need_verification, is_official } = req.body;
        
        if (!name || !description || !creator_id) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查创建者是否存在
        const userCheck = await query('SELECT user_id FROM users WHERE user_id = ?', [creator_id]);
        if (userCheck.length === 0) {
            return res.status(400).json({ msg: 'creator not found' });
        }
        
        // 插入圈子
        const result = await query(
            `INSERT INTO comm_circles (name, description, icon, bg_url, category_id, creator_id, rules, announcement, need_verification, is_official, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [name, description, icon || null, bg_url || null, category_id || null, creator_id, rules || '', announcement || '', need_verification ? 1 : 0, is_official ? 1 : 0]
        );
        
        if (result.insertId) {
            // 将创建者添加为圈子成员（管理员）
            await query(
                'INSERT INTO comm_circle_members (circle_id, user_id, role) VALUES (?, ?, 2)',
                [result.insertId, creator_id]
            );
            
            // 记录审核日志
            await query(
                `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                 VALUES (?, ?, 1, 1, ?)`,
                [req.user[0].user_id, result.insertId, '管理员创建']
            );
            
            // 获取创建的圈子信息
            const circle = await query(
                `SELECT c.*, u.name as creator_name, cc.name as category_name 
                 FROM comm_circles c
                 LEFT JOIN users u ON c.creator_id = u.user_id
                 LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
                 WHERE c.circle_id = ?`,
                [result.insertId]
            );
            
            res.json({
                msg: 'success',
                circle: circle[0]
            });
        } else {
            res.status(400).json({ msg: 'create failed' });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 更新圈子信息
router.post('/circles/update', auth, async function (req, res) {
    try {
        const { circle_id, name, description, icon, bg_url, category_id, rules, announcement, need_verification, is_official } = req.body;
        
        if (!circle_id || !name || !description) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查圈子是否存在
        const circleCheck = await query('SELECT circle_id FROM comm_circles WHERE circle_id = ?', [circle_id]);
        if (circleCheck.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        // 更新圈子信息
        await query(
            `UPDATE comm_circles SET 
                name = ?, 
                description = ?, 
                icon = ?, 
                bg_url = ?, 
                category_id = ?, 
                rules = ?, 
                announcement = ?, 
                need_verification = ?, 
                is_official = ?,
                update_time = NOW()
             WHERE circle_id = ?`,
            [
                name, 
                description, 
                icon || null, 
                bg_url || null, 
                category_id || null, 
                rules || '', 
                announcement || '', 
                need_verification ? 1 : 0, 
                is_official ? 1 : 0,
                circle_id
            ]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 1, 5, ?)`,
            [req.user[0].user_id, circle_id, '管理员修改信息']
        );
        
        // 获取更新后的圈子信息
        const circle = await query(
            `SELECT c.*, u.name as creator_name, cc.name as category_name 
             FROM comm_circles c
             LEFT JOIN users u ON c.creator_id = u.user_id
             LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
             WHERE c.circle_id = ?`,
            [circle_id]
        );
        
        res.json({
            msg: 'success',
            circle: circle[0]
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 创建帖子
router.post('/posts/create', auth, async function (req, res) {
    try {
        const { circle_id, user_id, title, content, media_urls } = req.body;
        
        if (!circle_id || !user_id || !title || !content) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查圈子是否存在
        const circleCheck = await query('SELECT circle_id FROM comm_circles WHERE circle_id = ? AND status = 1', [circle_id]);
        if (circleCheck.length === 0) {
            return res.status(400).json({ msg: 'circle not found or not active' });
        }
        
        // 检查用户是否存在
        const userCheck = await query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
        if (userCheck.length === 0) {
            return res.status(400).json({ msg: 'user not found' });
        }
        
        // 处理媒体URL
        let mediaUrlsJson = null;
        if (media_urls && Array.isArray(media_urls) && media_urls.length > 0) {
            mediaUrlsJson = JSON.stringify(media_urls);
        }
        
        // 插入帖子
        const result = await query(
            `INSERT INTO comm_posts (circle_id, user_id, title, content, media_urls, status) 
             VALUES (?, ?, ?, ?, ?, 1)`,
            [circle_id, user_id, title, content, mediaUrlsJson]
        );
        
        if (result.insertId) {
            // 更新圈子帖子数
            await query(
                'UPDATE comm_circles SET post_count = post_count + 1 WHERE circle_id = ?',
                [circle_id]
            );
            
            // 记录审核日志
            await query(
                `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
                 VALUES (?, ?, 2, 1, ?)`,
                [req.user[0].user_id, result.insertId, '管理员创建']
            );
            
            // 获取创建的帖子信息
            const post = await query(
                `SELECT p.*, u.name as author_name, c.name as circle_name
                 FROM comm_posts p
                 LEFT JOIN users u ON p.user_id = u.user_id
                 LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
                 WHERE p.post_id = ?`,
                [result.insertId]
            );
            
            res.json({
                msg: 'success',
                post: post[0]
            });
        } else {
            res.status(400).json({ msg: 'create failed' });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 更新帖子
router.post('/posts/update', auth, async function (req, res) {
    try {
        const { post_id, title, content, media_urls } = req.body;
        
        if (!post_id || !title || !content) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查帖子是否存在
        const postCheck = await query('SELECT post_id FROM comm_posts WHERE post_id = ?', [post_id]);
        if (postCheck.length === 0) {
            return res.status(404).json({ msg: 'post not found' });
        }
        
        // 处理媒体URL
        let mediaUrlsJson = null;
        if (media_urls && Array.isArray(media_urls) && media_urls.length > 0) {
            mediaUrlsJson = JSON.stringify(media_urls);
        }
        
        // 更新帖子
        await query(
            `UPDATE comm_posts SET 
                title = ?, 
                content = ?, 
                media_urls = ?,
                update_time = NOW()
             WHERE post_id = ?`,
            [title, content, mediaUrlsJson, post_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 2, 5, ?)`,
            [req.user[0].user_id, post_id, '管理员修改帖子']
        );
        
        // 获取更新后的帖子信息
        const post = await query(
            `SELECT p.*, u.name as author_name, c.name as circle_name
             FROM comm_posts p
             LEFT JOIN users u ON p.user_id = u.user_id
             LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
             WHERE p.post_id = ?`,
            [post_id]
        );
        
        res.json({
            msg: 'success',
            post: post[0]
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取圈子成员列表
router.get('/circles/members', auth, async function (req, res) {
    try {
        if (!req.query.circle_id) {
            return res.status(400).json({ msg: 'missing circle_id' });
        }
        
        const circle_id = req.query.circle_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const keyword = req.query.keyword || '';
        
        let whereClause = 'WHERE cm.circle_id = ?';
        let params = [circle_id];
        
        if (keyword) {
            whereClause += ' AND u.name LIKE ?';
            params.push(`%${keyword}%`);
        }
        
        const offset = (page - 1) * pageSize;
        params.push(offset, pageSize);
        
        let results = await query(
            `SELECT cm.*, u.name, u.avatar_url, 
                   (SELECT COUNT(*) FROM comm_posts WHERE user_id = cm.user_id AND circle_id = cm.circle_id) as post_count
             FROM comm_circle_members cm
             LEFT JOIN users u ON cm.user_id = u.user_id
             ${whereClause}
             ORDER BY cm.role DESC, cm.join_time ASC LIMIT ?, ?`,
            params
        );
        
        // 获取总数
        let countParams = [circle_id];
        if (keyword) {
            countParams.push(`%${keyword}%`);
        }
        
        let countResult = await query(
            `SELECT COUNT(*) as total FROM comm_circle_members cm
             LEFT JOIN users u ON cm.user_id = u.user_id
             ${whereClause}`,
            countParams
        );
        
        res.json({
            list: results,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 添加圈子成员
router.post('/circles/members/add', auth, async function (req, res) {
    try {
        const { circle_id, user_id, role } = req.body;
        
        if (!circle_id || !user_id) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查圈子是否存在
        const circleCheck = await query('SELECT * FROM comm_circles WHERE circle_id = ?', [circle_id]);
        if (circleCheck.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        // 检查用户是否存在
        const userCheck = await query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        if (userCheck.length === 0) {
            return res.status(404).json({ msg: 'user not found' });
        }
        
        // 检查用户是否已经是成员
        const memberCheck = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circle_id, user_id]
        );
        
        if (memberCheck.length > 0) {
            return res.status(400).json({ msg: 'user is already a member' });
        }
        
        // 添加成员
        await query(
            'INSERT INTO comm_circle_members (circle_id, user_id, role, status, join_time) VALUES (?, ?, ?, 1, NOW())',
            [circle_id, user_id, role || 0]
        );
        
        // 更新圈子成员数
        await query(
            'UPDATE comm_circles SET member_count = member_count + 1 WHERE circle_id = ?',
            [circle_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 8, ?)`,
            [req.user[0].user_id, user_id, '管理员添加成员']
        );
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 更新圈子成员角色
router.post('/circles/members/update-role', auth, async function (req, res) {
    try {
        const { circle_id, user_id, role } = req.body;
        
        if (!circle_id || !user_id || role === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查是否为创建者
        const creatorCheck = await query(
            'SELECT creator_id FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (creatorCheck.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        // 不允许修改创建者角色
        if (user_id == creatorCheck[0].creator_id) {
            return res.status(400).json({ msg: 'cannot change creator role' });
        }
        
        // 更新角色
        await query(
            'UPDATE comm_circle_members SET role = ? WHERE circle_id = ? AND user_id = ?',
            [role, circle_id, user_id]
        );
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 移除圈子成员
router.post('/circles/members/remove', auth, async function (req, res) {
    try {
        const { circle_id, user_id } = req.body;
        
        if (!circle_id || !user_id) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查是否为创建者
        const creatorCheck = await query(
            'SELECT creator_id FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (creatorCheck.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        // 不允许移除创建者
        if (user_id == creatorCheck[0].creator_id) {
            return res.status(400).json({ msg: 'cannot remove creator' });
        }
        
        // 更新成员状态
        await query(
            'UPDATE comm_circle_members SET status = 0 WHERE circle_id = ? AND user_id = ?',
            [circle_id, user_id]
        );
        
        // 更新圈子成员数
        await query(
            'UPDATE comm_circles SET member_count = member_count - 1 WHERE circle_id = ?',
            [circle_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 7, ?)`,
            [req.user[0].user_id, user_id, '管理员移除']
        );
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取圈子禁用用户列表
router.get('/circles/bans', auth, async function (req, res) {
    try {
        if (!req.query.circle_id) {
            return res.status(400).json({ msg: 'missing circle_id' });
        }
        
        const circle_id = req.query.circle_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        
        const offset = (page - 1) * pageSize;
        
        let results = await query(
            `SELECT b.*, u.name as user_name, u.avatar_url, o.name as operator_name
             FROM comm_circle_bans b
             LEFT JOIN users u ON b.user_id = u.user_id
             LEFT JOIN users o ON b.operator_id = o.user_id
             WHERE b.circle_id = ? AND b.status = 1
             ORDER BY b.create_time DESC LIMIT ?, ?`,
            [circle_id, offset, pageSize]
        );
        
        // 获取总数
        let countResult = await query(
            `SELECT COUNT(*) as total FROM comm_circle_bans
             WHERE circle_id = ? AND status = 1`,
            [circle_id]
        );
        
        res.json({
            list: results,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 解除禁用
router.post('/circles/bans/remove', auth, async function (req, res) {
    try {
        const { ban_id } = req.body;
        
        if (!ban_id) {
            return res.status(400).json({ msg: 'missing ban_id' });
        }
        
        // 获取禁用记录
        const banRecord = await query(
            'SELECT * FROM comm_circle_bans WHERE ban_id = ?',
            [ban_id]
        );
        
        if (banRecord.length === 0) {
            return res.status(404).json({ msg: 'ban record not found' });
        }
        
        // 更新禁用记录状态
        await query(
            'UPDATE comm_circle_bans SET status = 0 WHERE ban_id = ?',
            [ban_id]
        );
        
        // 如果是禁言类型，解除用户禁言状态
        if (banRecord[0].ban_type === 0) {
            await query(
                'UPDATE comm_circle_members SET is_banned = 0, ban_end_time = NULL WHERE circle_id = ? AND user_id = ?',
                [banRecord[0].circle_id, banRecord[0].user_id]
            );
        }
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 禁言用户
router.post('/circles/members/ban', auth, async function (req, res) {
    try {
        const { circle_id, user_id, ban_type, duration, reason } = req.body;
        
        if (!circle_id || !user_id || ban_type === undefined) {
            return res.status(400).json({ msg: 'missing required parameters' });
        }
        
        // 检查是否为创建者
        const creatorCheck = await query(
            'SELECT creator_id FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (creatorCheck.length === 0) {
            return res.status(404).json({ msg: 'circle not found' });
        }
        
        // 不允许禁言创建者
        if (user_id == creatorCheck[0].creator_id) {
            return res.status(400).json({ msg: 'cannot ban creator' });
        }
        
        // 计算禁言结束时间
        let endTime = null;
        if (duration && duration > 0) {
            const now = new Date();
            endTime = new Date(now.getTime() + duration * 60000); // 分钟转毫秒
        }
        
        // 插入禁言记录
        await query(
            `INSERT INTO comm_circle_bans (circle_id, user_id, operator_id, ban_type, duration, reason, end_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [circle_id, user_id, req.user[0].user_id, ban_type, duration || null, reason || '', endTime]
        );
        
        // 如果是禁言类型，更新用户禁言状态
        if (ban_type === 0) {
            await query(
                'UPDATE comm_circle_members SET is_banned = 1, ban_end_time = ? WHERE circle_id = ? AND user_id = ?',
                [endTime, circle_id, user_id]
            );
        }
        
        // 如果是踢出类型，更新成员状态
        if (ban_type === 1) {
            await query(
                'UPDATE comm_circle_members SET status = 0 WHERE circle_id = ? AND user_id = ?',
                [circle_id, user_id]
            );
            
            // 更新圈子成员数
            await query(
                'UPDATE comm_circles SET member_count = member_count - 1 WHERE circle_id = ?',
                [circle_id]
            );
        }
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, ?, ?)`,
            [req.user[0].user_id, user_id, ban_type === 0 ? 6 : 7, reason || '']
        );
        
        res.json({ msg: 'success' });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 获取用户列表（用于选择）
router.get('/users/list', auth, async function (req, res) {
    try {
        const keyword = req.query.keyword || '';
        const limit = parseInt(req.query.limit) || 20;
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (keyword) {
            whereClause += ' AND (name LIKE ? OR user_id LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        params.push(limit);
        
        let results = await query(
            `SELECT user_id, name, avatar_url
             FROM users
             ${whereClause}
             ORDER BY user_id DESC LIMIT ?`,
            params
        );
        
        res.json(results);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

module.exports = router;