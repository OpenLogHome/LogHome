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
        const { circle_id, verification_info } = req.body;
        
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
        
        // 检查用户是否被踢出
        const banRecord = await query(
            `SELECT * FROM comm_circle_bans 
             WHERE circle_id = ? AND user_id = ? AND ban_type = 1 AND status = 1`,
            [circle_id, user.user_id]
        );
        
        if (banRecord.length > 0) {
            return res.status(403).json({ msg: '您已被该圈子管理员移出，无法加入' });
        }
        
        // 检查是否需要验证
        if (circle[0].need_verification) {
            // 检查是否已有待审核的申请
            const existingRequest = await query(
                `SELECT * FROM comm_circle_join_requests 
                 WHERE circle_id = ? AND user_id = ? AND status = 0`,
                [circle_id, user.user_id]
            );
            
            if (existingRequest.length > 0) {
                return res.status(400).json({ msg: '您已提交过入圈申请，请等待审核' });
            }
            
            // 创建入圈申请
            await query(
                `INSERT INTO comm_circle_join_requests 
                 (circle_id, user_id, verification_info, status) 
                 VALUES (?, ?, ?, 0)`,
                [circle_id, user.user_id, verification_info || null]
            );
            
            // 通知圈主和管理员
            const admins = await query(
                `SELECT user_id FROM comm_circle_members 
                 WHERE circle_id = ? AND (role = 1 OR role = 2) AND status = 1`,
                [circle_id]
            );
            
            for (const admin of admins) {
                message.sendMsg(
                    user.user_id,
                    admin.user_id,
                    `用户 ${user.name} 申请加入圈子「${circle[0].name}」，请审核`,
                    `community/circle?id=${circle_id}`,
                    'notification'
                );
            }
            
            return res.json({ msg: '入圈申请已提交，请等待审核' });
        }
        
        // 不需要验证，直接加入
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

// 禁言用户
router.post('/:id/ban-user', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { user_id, duration, reason } = req.body;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以禁言用户' });
        }
        
        // 检查目标用户是否是圈子成员
        const targetMember = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circleId, user_id]
        );
        
        if (targetMember.length === 0) {
            return res.status(400).json({ msg: '目标用户不是圈子成员' });
        }
        
        // 检查目标用户是否是圈主或管理员
        if (targetMember[0].role > 0) {
            // 如果当前用户是管理员，不能禁言圈主或其他管理员
            if (member[0].role === 1) {
                return res.status(403).json({ msg: '管理员不能禁言圈主或其他管理员' });
            }
            
            // 如果当前用户是圈主，可以禁言管理员，但不能禁言自己
            if (user_id === user.user_id) {
                return res.status(400).json({ msg: '不能禁言自己' });
            }
        }
        
        // 计算禁言结束时间
        let endTime = null;
        const durationInt = parseInt(duration);
        
        if (durationInt > 0) {
            endTime = new Date();
            endTime.setMinutes(endTime.getMinutes() + durationInt);
            console.log(`Setting ban duration for ${durationInt} minutes, end time: ${endTime}`);
        }
        
        // 添加禁言记录
        await query(
            `INSERT INTO comm_circle_bans 
             (circle_id, user_id, operator_id, ban_type, duration, reason, end_time) 
             VALUES (?, ?, ?, 0, ?, ?, ?)`,
            [circleId, user_id, user.user_id, durationInt || null, reason || '违反社区规则', endTime]
        );
        
        // 更新成员禁言状态
        await query(
            'UPDATE comm_circle_members SET is_banned = 1, ban_end_time = ? WHERE circle_id = ? AND user_id = ?',
            [endTime, circleId, user_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 6, ?)`,
            [user.user_id, user_id, reason || '违反社区规则']
        );
        
        // 通知被禁言用户
        const circle = await query('SELECT name FROM comm_circles WHERE circle_id = ?', [circleId]);
        const durationText = durationInt > 0 ? `${durationInt}分钟` : '永久';
        
        message.sendMsg(
            user.user_id,
            user_id,
            `您在圈子「${circle[0].name}」中被禁言${durationText}，原因：${reason || '违反社区规则'}`,
            '',
            'notification'
        );
        
        res.json({ msg: '禁言用户成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 解除禁言
router.post('/:id/unban-user', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { user_id } = req.body;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以解除禁言' });
        }
        
        // 检查目标用户是否被禁言
        const targetMember = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND is_banned = 1',
            [circleId, user_id]
        );
        
        if (targetMember.length === 0) {
            return res.status(400).json({ msg: '该用户未被禁言' });
        }
        
        // 更新禁言记录
        await query(
            'UPDATE comm_circle_bans SET status = 0 WHERE circle_id = ? AND user_id = ? AND ban_type = 0 AND status = 1',
            [circleId, user_id]
        );
        
        // 更新成员禁言状态
        await query(
            'UPDATE comm_circle_members SET is_banned = 0, ban_end_time = NULL WHERE circle_id = ? AND user_id = ?',
            [circleId, user_id]
        );
        
        // 通知用户
        const circle = await query('SELECT name FROM comm_circles WHERE circle_id = ?', [circleId]);
        
        message.sendMsg(
            user.user_id,
            user_id,
            `您在圈子「${circle[0].name}」中的禁言已被解除`,
            `community/circle?id=${circleId}`,
            'notification'
        );
        
        res.json({ msg: '解除禁言成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 踢出用户
router.post('/:id/kick-user', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { user_id, reason } = req.body;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以踢出用户' });
        }
        
        // 检查目标用户是否是圈子成员
        const targetMember = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND status = 1',
            [circleId, user_id]
        );
        
        if (targetMember.length === 0) {
            return res.status(400).json({ msg: '目标用户不是圈子成员' });
        }
        
        // 检查目标用户是否是圈主或管理员
        if (targetMember[0].role > 0) {
            // 如果当前用户是管理员，不能踢出圈主或其他管理员
            if (member[0].role === 1) {
                return res.status(403).json({ msg: '管理员不能踢出圈主或其他管理员' });
            }
            
            // 如果当前用户是圈主，可以踢出管理员，但不能踢出自己
            if (user_id === user.user_id) {
                return res.status(400).json({ msg: '不能踢出自己' });
            }
        }
        
        // 添加踢出记录
        await query(
            `INSERT INTO comm_circle_bans 
             (circle_id, user_id, operator_id, ban_type, reason) 
             VALUES (?, ?, ?, 1, ?)`,
            [circleId, user_id, user.user_id, reason || '违反社区规则']
        );
        
        // 删除成员关系
        await query(
            'DELETE FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
            [circleId, user_id]
        );
        
        // 更新圈子成员数
        await query(
            'UPDATE comm_circles SET member_count = member_count - 1 WHERE circle_id = ?',
            [circleId]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 7, ?)`,
            [user.user_id, user_id, reason || '违反社区规则']
        );
        
        // 通知被踢出用户
        const circle = await query('SELECT name FROM comm_circles WHERE circle_id = ?', [circleId]);
        
        message.sendMsg(
            user.user_id,
            user_id,
            `您已被移出圈子「${circle[0].name}」，原因：${reason || '违反社区规则'}`,
            '',
            'notification'
        );
        
        res.json({ msg: '踢出用户成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 审核入圈申请
router.post('/:id/review-join', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { request_id, status, comment } = req.body;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以审核入圈申请' });
        }
        
        // 检查申请是否存在
        const request = await query(
            'SELECT * FROM comm_circle_join_requests WHERE request_id = ? AND circle_id = ? AND status = 0',
            [request_id, circleId]
        );
        
        if (request.length === 0) {
            return res.status(404).json({ msg: '申请不存在或已被处理' });
        }
        
        // 更新申请状态
        await query(
            `UPDATE comm_circle_join_requests 
             SET status = ?, reviewer_id = ?, review_time = NOW(), review_comment = ? 
             WHERE request_id = ?`,
            [status, user.user_id, comment || null, request_id]
        );
        
        // 如果通过申请，添加成员
        if (status === 1) {
            // 检查用户是否已是成员
            const existingMember = await query(
                'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
                [circleId, request[0].user_id]
            );
            
            if (existingMember.length === 0) {
                // 添加成员
                await query(
                    'INSERT INTO comm_circle_members (circle_id, user_id, role, status) VALUES (?, ?, 0, 1)',
                    [circleId, request[0].user_id]
                );
                
                // 更新圈子成员数
                await query(
                    'UPDATE comm_circles SET member_count = member_count + 1 WHERE circle_id = ?',
                    [circleId]
                );
            }
        }
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 8, ?)`,
            [user.user_id, request[0].user_id, comment || (status === 1 ? '通过申请' : '拒绝申请')]
        );
        
        // 通知申请用户
        const circle = await query('SELECT name FROM comm_circles WHERE circle_id = ?', [circleId]);
        
        if (status === 1) {
            message.sendMsg(
                user.user_id,
                request[0].user_id,
                `您加入圈子「${circle[0].name}」的申请已通过`,
                `community/circle?id=${circleId}`,
                'notification'
            );
        } else {
            message.sendMsg(
                user.user_id,
                request[0].user_id,
                `您加入圈子「${circle[0].name}」的申请未通过${comment ? '，原因：' + comment : ''}`,
                '',
                'notification'
            );
        }
        
        res.json({ msg: status === 1 ? '已通过申请' : '已拒绝申请' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取入圈申请列表
router.get('/:id/join-requests', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const status = req.query.status !== undefined ? parseInt(req.query.status) : 0;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以查看入圈申请' });
        }
        
        // 查询申请列表
        const requests = await query(
            `SELECT r.*, u.name, u.avatar_url, u.motto,
                    ru.name as reviewer_name, ru.avatar_url as reviewer_avatar
             FROM comm_circle_join_requests r
             LEFT JOIN users u ON r.user_id = u.user_id
             LEFT JOIN users ru ON r.reviewer_id = ru.user_id
             WHERE r.circle_id = ? AND r.status = ?
             ORDER BY r.create_time DESC
             LIMIT ?, ?`,
            [circleId, status, (page - 1) * pageSize, pageSize]
        );
        
        // 获取总数
        const countResult = await query(
            'SELECT COUNT(*) as total FROM comm_circle_join_requests WHERE circle_id = ? AND status = ?',
            [circleId, status]
        );
        
        res.json({
            list: requests,
            total: countResult[0].total,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 更新圈子设置
router.put('/:id/settings', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { need_verification, verification_questions, auto_ban_keywords } = req.body;
        
        // 检查当前用户是否是圈主
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND role = 2',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主可以更新圈子设置' });
        }
        
        // 检查设置是否存在
        const settings = await query(
            'SELECT * FROM comm_circle_settings WHERE circle_id = ?',
            [circleId]
        );
        
        if (settings.length === 0) {
            // 创建设置
            await query(
                `INSERT INTO comm_circle_settings 
                 (circle_id, need_verification, verification_questions, auto_ban_keywords) 
                 VALUES (?, ?, ?, ?)`,
                [
                    circleId, 
                    need_verification !== undefined ? need_verification : 0, 
                    verification_questions || null, 
                    auto_ban_keywords || null
                ]
            );
        } else {
            // 更新设置
            const updateData = {};
            if (need_verification !== undefined) updateData.need_verification = need_verification;
            if (verification_questions !== undefined) updateData.verification_questions = verification_questions;
            if (auto_ban_keywords !== undefined) updateData.auto_ban_keywords = auto_ban_keywords;
            
            if (Object.keys(updateData).length > 0) {
                const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
                const updateValues = Object.values(updateData);
                
                await query(
                    `UPDATE comm_circle_settings SET ${updateFields} WHERE circle_id = ?`,
                    [...updateValues, circleId]
                );
            }
        }
        
        // 更新圈子表中的need_verification字段
        if (need_verification !== undefined) {
            await query(
                'UPDATE comm_circles SET need_verification = ? WHERE circle_id = ?',
                [need_verification, circleId]
            );
        }
        
        res.json({ msg: '圈子设置更新成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子设置
router.get('/:id/settings', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以查看圈子设置' });
        }
        
        // 获取圈子设置
        const settings = await query(
            'SELECT * FROM comm_circle_settings WHERE circle_id = ?',
            [circleId]
        );
        
        if (settings.length === 0) {
            // 如果设置不存在，返回默认设置
            return res.json({
                circle_id: parseInt(circleId),
                need_verification: 0,
                verification_questions: null,
                auto_ban_keywords: null
            });
        }
        
        res.json(settings[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子加入验证问题（公开接口）
router.get('/:id/verification-questions', async (req, res) => {
    try {
        const circleId = req.params.id;
        
        // 检查圈子是否存在
        const circle = await query(
            'SELECT need_verification FROM comm_circles WHERE circle_id = ? AND status = 1',
            [circleId]
        );
        
        if (circle.length === 0) {
            return res.status(404).json({ msg: '圈子不存在或已被禁用' });
        }
        
        // 如果圈子不需要验证，直接返回
        if (!circle[0].need_verification) {
            return res.json({
                need_verification: 0,
                verification_questions: null
            });
        }
        
        // 获取验证问题
        const settings = await query(
            'SELECT verification_questions FROM comm_circle_settings WHERE circle_id = ?',
            [circleId]
        );
        
        // 返回验证问题
        return res.json({
            need_verification: 1,
            verification_questions: settings.length > 0 ? settings[0].verification_questions : null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取圈子禁言名单
router.get('/:id/banned-users', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以查看禁言名单' });
        }
        
        // 获取禁言和踢出记录
        const bannedUsers = await query(
            `SELECT b.*, u.name, u.avatar_url, u.motto
             FROM comm_circle_bans b
             LEFT JOIN users u ON b.user_id = u.user_id
             WHERE b.circle_id = ? AND b.status = 1
             ORDER BY b.create_time DESC`,
            [circleId]
        );
        
        res.json({
            list: bannedUsers
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 取消踢出用户
router.post('/:id/cancel-kick', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        const { user_id } = req.body;
        
        // 检查当前用户是否是圈主或管理员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ? AND (role = 1 OR role = 2) AND status = 1',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.status(403).json({ msg: '只有圈主或管理员可以取消踢出' });
        }
        
        // 检查是否存在踢出记录
        const banRecord = await query(
            `SELECT * FROM comm_circle_bans 
             WHERE circle_id = ? AND user_id = ? AND ban_type = 1 AND status = 1`,
            [circleId, user_id]
        );
        
        if (banRecord.length === 0) {
            return res.status(404).json({ msg: '未找到踢出记录' });
        }
        
        // 更新踢出记录状态
        await query(
            'UPDATE comm_circle_bans SET status = 0 WHERE ban_id = ?',
            [banRecord[0].ban_id]
        );
        
        // 记录审核日志
        await query(
            `INSERT INTO comm_audit_logs (user_id, target_id, target_type, action, reason) 
             VALUES (?, ?, 4, 9, ?)`,
            [user.user_id, user_id, '取消踢出']
        );
        
        // 通知被取消踢出的用户
        const circle = await query('SELECT name FROM comm_circles WHERE circle_id = ?', [circleId]);
        
        message.sendMsg(
            user.user_id,
            user_id,
            `您已被允许重新加入圈子「${circle[0].name}」`,
            `community/circle?id=${circleId}`,
            'notification'
        );
        
        res.json({ msg: '已取消踢出' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取用户在圈子中的状态（包括禁言状态）
router.get('/:id/my-status', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const circleId = req.params.id;
        
        // 检查用户是否是圈子成员
        const member = await query(
            'SELECT * FROM comm_circle_members WHERE circle_id = ? AND user_id = ?',
            [circleId, user.user_id]
        );
        
        if (member.length === 0) {
            return res.json({
                is_member: false,
                is_banned: false
            });
        }
        
        // 获取用户禁言信息
        const banInfo = await query(
            `SELECT * FROM comm_circle_bans 
             WHERE circle_id = ? AND user_id = ? AND ban_type = 0 AND status = 1
             ORDER BY create_time DESC LIMIT 1`,
            [circleId, user.user_id]
        );
        
        const isBanned = member[0].is_banned === 1;
        
        res.json({
            is_member: true,
            is_banned: isBanned,
            role: member[0].role,
            ban_info: banInfo.length > 0 ? banInfo[0] : null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
