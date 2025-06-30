// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let adminAuth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 获取圈子分类列表
router.get('/categories', async (req, res) => {
    try {
        const categories = await query(
            'SELECT * FROM comm_circle_categories ORDER BY parent_id, sort_order'
        );
        res.json(categories);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子列表
router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const categoryId = req.query.category_id;
        const keyword = req.query.keyword;
        
        let queryStr = `
            SELECT c.*, u.name as creator_name, u.avatar_url as creator_avatar, 
                  cc.name as category_name
            FROM comm_circles c
            LEFT JOIN users u ON c.creator_id = u.user_id
            LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
            WHERE c.status = 1
        `;
        let params = [];
        
        if (categoryId) {
            queryStr += ' AND c.category_id = ?';
            params.push(categoryId);
        }
        
        if (keyword) {
            queryStr += ' AND (c.name LIKE ? OR c.description LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        queryStr += ' ORDER BY c.is_official DESC, c.member_count DESC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const circles = await query(queryStr, params);
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_circles WHERE status = 1';
        const countParams = [];
        
        if (categoryId) {
            countQuery += ' AND category_id = ?';
            countParams.push(categoryId);
        }
        
        if (keyword) {
            countQuery += ' AND (name LIKE ? OR description LIKE ?)';
            countParams.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        const totalResult = await query(countQuery, countParams);
        const total = totalResult[0].total;
        
        res.json({
            list: circles,
            total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子详情
router.get('/detail/:id', async (req, res) => {
    try {
        const circleId = req.params.id;
        
        const circles = await query(
            `SELECT c.*, u.name as creator_name, u.avatar_url as creator_avatar, 
                   cc.name as category_name
            FROM comm_circles c
            LEFT JOIN users u ON c.creator_id = u.user_id
            LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
            WHERE c.circle_id = ? AND c.status = 1`,
            [circleId]
        );
        
        if (circles.length === 0) {
            return res.status(404).json({ msg: '圈子不存在' });
        }
        
        const circle = circles[0];
        
        // 获取圈子标签
        const tags = await query(
            'SELECT * FROM comm_circle_tags WHERE circle_id = ?',
            [circleId]
        );
        
        circle.tags = tags;
        
        res.json(circle);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 申请创建圈子
router.post('/create', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { name, description, category_id, rules, icon, bg_url } = req.body;
        
        // 验证用户是否符合创建条件
        const userInfo = await query(
            'SELECT register_time, credit FROM users WHERE user_id = ?',
            [user.user_id]
        );
        
        if (userInfo.length === 0) {
            return res.status(403).json({ msg: '用户不存在' });
        }
        
        const registerTime = new Date(userInfo[0].register_time);
        const now = new Date();
        const daysSinceRegister = Math.floor((now - registerTime) / (1000 * 60 * 60 * 24));
        
        if (daysSinceRegister < 30) {
            return res.status(403).json({ msg: '账号注册时间不足30天，暂不能创建圈子' });
        }
        
        if (userInfo[0].credit < 100) {
            return res.status(403).json({ msg: '账号存在违规记录，暂不能创建圈子' });
        }
        
        // 检查圈子名称是否已存在
        const existingCircle = await query(
            'SELECT * FROM comm_circles WHERE name = ?',
            [name]
        );
        
        if (existingCircle.length > 0) {
            return res.status(400).json({ msg: '圈子名称已存在' });
        }
        
        // 创建圈子
        const result = await query(
            `INSERT INTO comm_circles (name, description, category_id, creator_id, rules, icon, bg_url, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
            [name, description, category_id, user.user_id, rules, icon, bg_url || null]
        );
        
        const circleId = result.insertId;
        
        // 将创建者添加为圈主
        await query(
            'INSERT INTO comm_circle_members (circle_id, user_id, role, status) VALUES (?, ?, 2, 1)',
            [circleId, user.user_id]
        );
        
        res.json({ 
            msg: '圈子创建申请已提交，等待审核',
            circle_id: circleId
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 加入圈子
router.post('/join', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id } = req.body;
        
        // 检查圈子是否存在
        const circle = await query(
            'SELECT * FROM comm_circles WHERE circle_id = ? AND status = 1',
            [circle_id]
        );
        
        if (circle.length === 0) {
            return res.status(404).json({ msg: '圈子不存在或已被禁用' });
        }
        
        // 检查用户是否已加入
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
            [circle_id, user.user_id]
        );
        
        if (member.length > 0) {
            return res.status(400).json({ msg: '您已经是该圈子成员' });
        }
        
        // 加入圈子
        await query(
            'INSERT INTO comm_circle_members (circle_id, user_id, role, status) VALUES (?, ?, 0, 1)',
            [circle_id, user.user_id]
        );
        
        // 更新圈子成员数
        await query(
            'UPDATE comm_circles SET member_count = member_count + 1 WHERE circle_id = ?',
            [circle_id]
        );
        
        res.json({ msg: '成功加入圈子' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 退出圈子
router.post('/quit', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id } = req.body;
        
        // 检查用户是否是圈子成员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
            [circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(400).json({ msg: '您不是该圈子成员' });
        }
        
        // 检查是否是圈主
        if (member[0].role === 2) {
            return res.status(403).json({ msg: '圈主不能退出圈子，请先转让圈主权限' });
        }
        
        // 退出圈子
        await query(
            'DELETE FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
            [circle_id, user.user_id]
        );
        
        // 更新圈子成员数
        await query(
            'UPDATE comm_circles SET member_count = member_count - 1 WHERE circle_id = ?',
            [circle_id]
        );
        
        res.json({ msg: '成功退出圈子' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子成员列表
router.get('/:id/members', async (req, res) => {
    try {
        const circleId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const roleFilter = req.query.role;
        
        let queryStr = `
            SELECT m.*, u.name, u.avatar_url, u.motto
            FROM comm_circle_members m
            LEFT JOIN users u ON m.user_id = u.user_id
            WHERE m.circle_id = ? AND m.status = 1
        `;
        let params = [circleId];
        
        if (roleFilter) {
            queryStr += ' AND m.role = ?';
            params.push(roleFilter);
        }
        
        queryStr += ' ORDER BY m.role DESC, m.join_time ASC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const members = await query(queryStr, params);
        
        // 获取总数
        const countResult = await query(
            'SELECT COUNT(*) as total FROM comm_circle_members WHERE circle_id = ? AND status = 1' + 
            (roleFilter ? ' AND role = ?' : ''),
            roleFilter ? [circleId, roleFilter] : [circleId]
        );
        
        res.json({
            list: members,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 圈主转让
router.post('/transfer', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id, new_owner_id } = req.body;
        
        // 检查当前用户是否是圈主
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND role = 2',
            [circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主可以转让圈子' });
        }
        
        // 检查新圈主是否是圈子成员
        const newOwner = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circle_id, new_owner_id]
        );
        
        if (newOwner.length === 0) {
            return res.status(400).json({ msg: '新圈主必须是圈子成员' });
        }
        
        // 更新圈主角色
        await query(
            'UPDATE comm_circle_members SET role = 1 WHERE circle_id = ? AND user_id = ?',
            [circle_id, user.user_id]
        );
        
        // 设置新圈主
        await query(
            'UPDATE comm_circle_members SET role = 2 WHERE circle_id = ? AND user_id = ?',
            [circle_id, new_owner_id]
        );
        
        // 更新圈子表中的创建者
        await query(
            'UPDATE comm_circles SET creator_id = ? WHERE circle_id = ?',
            [new_owner_id, circle_id]
        );
        
        res.json({ msg: '圈主转让成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 设置管理员
router.post('/set-admin', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id, user_id, is_admin } = req.body;
        
        // 检查当前用户是否是圈主
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND role = 2',
            [circle_id, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主可以设置管理员' });
        }
        
        // 检查目标用户是否是圈子成员
        const targetMember = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circle_id, user_id]
        );
        
        if (targetMember.length === 0) {
            return res.status(400).json({ msg: '目标用户不是圈子成员' });
        }
        
        // 检查管理员数量限制
        if (is_admin) {
            const adminCount = await query(
                'SELECT COUNT(*) as count FROM comm_circle_members WHERE circle_id = ? AND role = 1',
                [circle_id]
            );
            
            if (adminCount[0].count >= 5) {
                return res.status(400).json({ msg: '管理员数量已达上限(5名)' });
            }
        }
        
        // 设置或取消管理员
        await query(
            'UPDATE comm_circle_members SET role = ? WHERE circle_id = ? AND user_id = ?',
            [is_admin ? 1 : 0, circle_id, user_id]
        );
        
        res.json({ msg: is_admin ? '设置管理员成功' : '取消管理员成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取用户加入的圈子
router.get('/my-circles', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        const circles = await query(
            `SELECT c.*, m.role, cc.name as category_name
            FROM comm_circles c
            JOIN comm_circle_members m ON c.circle_id = m.circle_id
            LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
            WHERE m.user_id = ? AND m.status = 1 AND c.status = 1
            ORDER BY m.role DESC, m.join_time DESC`,
            [user.user_id]
        );
        
        res.json(circles);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 更新圈子信息
router.put('/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { name, description, icon, rules, announcement, bg_url } = req.body;
        
        // 检查用户权限
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2)',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以更新圈子信息' });
        }
        
        // 准备更新数据
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (icon) updateData.icon = icon;
        if (rules) updateData.rules = rules;
        if (announcement) updateData.announcement = announcement;
        if (bg_url !== undefined) updateData.bg_url = bg_url;
        
        // 只有圈主可以修改名称
        if (name && member[0].role !== 2) {
            return res.status(403).json({ msg: '只有圈主可以修改圈子名称' });
        }
        
        // 检查圈子名称是否已存在
        if (name) {
            const existingCircle = await query(
                'SELECT * FROM comm_circles WHERE name = ? AND circle_id != ?',
                [name, circleId]
            );
            
            if (existingCircle.length > 0) {
                return res.status(400).json({ msg: '圈子名称已存在' });
            }
        }
        
        // 如果没有要更新的数据
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: '没有要更新的数据' });
        }
        
        // 构建SQL更新语句
        const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const updateValues = Object.values(updateData);
        
        await query(
            `UPDATE comm_circles SET ${updateFields}, update_time = NOW() WHERE circle_id = ?`,
            [...updateValues, circleId]
        );
        
        res.json({ msg: '圈子信息更新成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 管理员审核圈子
router.post('/audit', adminAuth, async (req, res) => {
    try {
        const user = req.user[0];
        const { circle_id, status, reason } = req.body;
        
        // 检查圈子是否存在
        const circle = await query(
            'SELECT * FROM comm_circles WHERE circle_id = ?',
            [circle_id]
        );
        
        if (circle.length === 0) {
            return res.status(404).json({ msg: '圈子不存在' });
        }
        
        // 更新圈子状态
        await query(
            'UPDATE comm_circles SET status = ? WHERE circle_id = ?',
            [status, circle_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 1, ?, ?)`,
            [user.user_id, circle_id, status === 1 ? 1 : 2, reason || '']
        );
        
        // 如果审核通过，发送通知给创建者
        if (status === 1) {
            message.sendMsg(
                user.user_id,
                circle[0].creator_id,
                `您申请创建的圈子「${circle[0].name}」已审核通过`,
                `community/circle?id=${circle_id}`,
                'notification'
            );
        } else if (status === 2) {
            message.sendMsg(
                user.user_id,
                circle[0].creator_id,
                `您申请创建的圈子「${circle[0].name}」未通过审核，原因：${reason || '未符合要求'}`,
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

// 获取圈子统计数据
router.get('/:id/stats', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        
        // 检查用户权限
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2)',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以查看统计数据' });
        }
        
        // 获取最近30天的统计数据
        const stats = await query(
            `SELECT * FROM comm_circle_stats 
             WHERE circle_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
             ORDER BY date`,
            [circleId]
        );
        
        // 获取热门帖子
        const hotPosts = await query(
            `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar
             FROM comm_posts p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.circle_id = ? AND p.status = 1
             ORDER BY p.like_count DESC
             LIMIT 10`,
            [circleId]
        );
        
        res.json({
            stats,
            hotPosts
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
