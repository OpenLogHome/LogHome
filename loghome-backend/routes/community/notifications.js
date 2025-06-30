// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');

// 创建路由对象
let router = express.Router();

// 获取通知列表
router.get('/list', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const type = req.query.type; // 可选，按类型筛选
        
        let queryStr = `
            SELECT n.*, u.name as sender_name, u.avatar_url as sender_avatar
            FROM comm_notifications n
            LEFT JOIN users u ON n.sender_id = u.user_id
            WHERE n.user_id = ?
        `;
        let params = [user.user_id];
        
        if (type) {
            queryStr += ' AND n.type = ?';
            params.push(parseInt(type));
        }
        
        queryStr += ' ORDER BY n.create_time DESC LIMIT ?, ?';
        params.push((page - 1) * pageSize, pageSize);
        
        const notifications = await query(queryStr, params);
        
        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM comm_notifications WHERE user_id = ?';
        const countParams = [user.user_id];
        
        if (type) {
            countQuery += ' AND type = ?';
            countParams.push(parseInt(type));
        }
        
        const totalResult = await query(countQuery, countParams);
        
        // 获取未读数量
        const unreadCount = await query(
            'SELECT COUNT(*) as count FROM comm_notifications WHERE user_id = ? AND is_read = 0',
            [user.user_id]
        );
        
        res.json({
            list: notifications,
            total: totalResult[0].total,
            unread: unreadCount[0].count,
            page,
            pageSize
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 标记通知为已读
router.post('/read', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const { notification_id } = req.body;
        
        if (notification_id) {
            // 标记单个通知为已读
            await query(
                'UPDATE comm_notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
                [notification_id, user.user_id]
            );
        } else {
            // 标记所有通知为已读
            await query(
                'UPDATE comm_notifications SET is_read = 1 WHERE user_id = ?',
                [user.user_id]
            );
        }
        
        res.json({ msg: '标记已读成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 删除通知
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = req.user[0];
        const notificationId = req.params.id;
        
        // 检查通知是否存在且属于当前用户
        const notification = await query(
            'SELECT * FROM comm_notifications WHERE notification_id = ? AND user_id = ?',
            [notificationId, user.user_id]
        );
        
        if (notification.length === 0) {
            return res.status(404).json({ msg: '通知不存在或无权限删除' });
        }
        
        // 删除通知
        await query(
            'DELETE FROM comm_notifications WHERE notification_id = ?',
            [notificationId]
        );
        
        res.json({ msg: '通知删除成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取未读通知数量
router.get('/unread/count', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        const result = await query(
            'SELECT COUNT(*) as count FROM comm_notifications WHERE user_id = ? AND is_read = 0',
            [user.user_id]
        );
        
        res.json({ count: result[0].count });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 创建通知（内部使用，不暴露为API）
async function createNotification(userId, senderId, type, targetId, targetType, content) {
    try {
        await query(
            `INSERT INTO comm_notifications 
             (user_id, sender_id, type, target_id, target_type, content, is_read, create_time) 
             VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
            [userId, senderId, type, targetId, targetType, content]
        );
        
        return true;
    } catch (e) {
        console.error('创建通知失败:', e);
        return false;
    }
}

module.exports = router;
module.exports.createNotification = createNotification; 