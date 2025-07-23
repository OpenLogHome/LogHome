const express = require('express');
const router = express.Router();
const { query } = require('../../sql.js');
const auth = require('../../bin/auth');
const jwt = require('jsonwebtoken');
const moment = require('moment');

/**
 * @api {get} /community/stickers 获取表情包列表
 * @apiName GetStickers
 * @apiGroup Stickers
 * @apiParam {String} category 分类，可选值：all(全部)、my(我的)、public(公共)
 * @apiParam {Number} page 页码，默认为1
 * @apiParam {Number} limit 每页数量，默认为20
 */
router.get('/', auth, async (req, res) => {
    try {
        const { category = 'all', url, page = 1, limit = 20 } = req.query;
        const userId = req.user[0].user_id;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const pageLimit = parseInt(limit);
        
        // 构建基础查询
        let countSql = `
            SELECT COUNT(*) as total
            FROM stickers s
            WHERE 1=1
        `;
        
        let sql = `
            SELECT s.*, 
                  (SELECT COUNT(*) FROM sticker_favorites WHERE sticker_id = s.sticker_id AND user_id = ?) AS is_favorite
            FROM stickers s
            WHERE 1=1
        `;
        const params = [userId];
        const countParams = [];
        
        // 如果提供了URL参数，则按URL查询
        if (url) {
            sql += ' AND s.url = ?';
            countSql += ' AND s.url = ?';
            params.push(url);
            countParams.push(url);
        } else {
            // 根据分类筛选
            if (category === 'my') {
                sql += ' AND s.user_id = ?';
                countSql += ' AND s.user_id = ?';
                params.push(userId);
                countParams.push(userId);
            } else if (category === 'public') {
                sql += ' AND s.is_private = 0 AND s.user_id != ?';
                countSql += ' AND s.is_private = 0 AND s.user_id != ?';
                params.push(userId);
                countParams.push(userId);
            } else {
                // 全部：显示自己的所有表情包和他人的公开表情包
                sql += ' AND (s.user_id = ? OR s.is_private = 0)';
                countSql += ' AND (s.user_id = ? OR s.is_private = 0)';
                params.push(userId);
                countParams.push(userId);
            }
        }
        
        // 获取总记录数
        const totalResult = await query(countSql, countParams);
        const total = totalResult[0].total;
        
        // 添加排序和分页
        sql += ' ORDER BY s.created_at DESC';
        
        // 只有在非URL查询模式下才应用分页
        if (!url) {
            sql += ' LIMIT ?, ?';
            params.push(offset, pageLimit);
        }
        
        const stickers = await query(sql, params);
        
        // 将布尔值转换为 0/1
        stickers.forEach(sticker => {
            sticker.is_favorite = sticker.is_favorite > 0;
            sticker.is_private = sticker.is_private > 0;
        });
        
        res.json({
            stickers,
            pagination: {
                total,
                page: parseInt(page),
                limit: pageLimit,
                pages: Math.ceil(total / pageLimit)
            }
        });
    } catch (error) {
        console.error('获取表情包列表失败:', error);
        res.status(500).json({ message: '获取表情包列表失败' });
    }
});

/**
 * @api {post} /community/stickers 创建表情包
 * @apiName CreateSticker
 * @apiGroup Stickers
 * @apiParam {String} url 表情包URL
 * @apiParam {Boolean} is_private 是否私密，默认为false
 */
router.post('/', auth, async (req, res) => {
    try {
        const { url, is_private = false } = req.body;
        const userId = req.user[0].user_id;
        
        if (!url) {
            return res.status(400).json({ message: '表情包URL不能为空' });
        }
        
        const sql = `
            INSERT INTO stickers (user_id, url, is_private, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `;
        
        const result = await query(sql, [userId, url, is_private ? 1 : 0]);
        
        if (result.affectedRows > 0) {
            const newSticker = await query('SELECT * FROM stickers WHERE sticker_id = ?', [result.insertId]);
            res.status(201).json(newSticker[0]);
        } else {
            res.status(500).json({ message: '创建表情包失败' });
        }
    } catch (error) {
        console.error('创建表情包失败:', error);
        res.status(500).json({ message: '创建表情包失败' });
    }
});

/**
 * @api {put} /community/stickers/:id 更新表情包
 * @apiName UpdateSticker
 * @apiGroup Stickers
 * @apiParam {Number} id 表情包ID
 * @apiParam {Boolean} is_private 是否私密
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_private } = req.body;
        const userId = req.user[0].user_id;
        
        // 检查表情包是否存在且属于当前用户
        const sticker = await query('SELECT * FROM stickers WHERE sticker_id = ?', [id]);
        
        if (sticker.length === 0) {
            return res.status(404).json({ message: '表情包不存在' });
        }
        
        if (sticker[0].user_id !== userId) {
            return res.status(403).json({ message: '无权修改此表情包' });
        }
        
        const sql = `
            UPDATE stickers
            SET is_private = ?, updated_at = NOW()
            WHERE sticker_id = ?
        `;
        
        const result = await query(sql, [is_private ? 1 : 0, id]);
        
        if (result.affectedRows > 0) {
            const updatedSticker = await query('SELECT * FROM stickers WHERE sticker_id = ?', [id]);
            res.json(updatedSticker[0]);
        } else {
            res.status(500).json({ message: '更新表情包失败' });
        }
    } catch (error) {
        console.error('更新表情包失败:', error);
        res.status(500).json({ message: '更新表情包失败' });
    }
});

/**
 * @api {delete} /community/stickers/:id 删除表情包
 * @apiName DeleteSticker
 * @apiGroup Stickers
 * @apiParam {Number} id 表情包ID
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user[0].user_id;
        
        // 检查表情包是否存在且属于当前用户
        const sticker = await query('SELECT * FROM stickers WHERE sticker_id = ?', [id]);
        
        if (sticker.length === 0) {
            return res.status(404).json({ message: '表情包不存在' });
        }
        
        if (sticker[0].user_id !== userId) {
            return res.status(403).json({ message: '无权删除此表情包' });
        }
        
        // 先删除相关的收藏记录
        await query('DELETE FROM sticker_favorites WHERE sticker_id = ?', [id]);
        
        // 再删除表情包
        const result = await query('DELETE FROM stickers WHERE sticker_id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ message: '删除成功' });
        } else {
            res.status(500).json({ message: '删除表情包失败' });
        }
    } catch (error) {
        console.error('删除表情包失败:', error);
        res.status(500).json({ message: '删除表情包失败' });
    }
});

/**
 * @api {get} /community/stickers/favorites 获取收藏的表情包
 * @apiName GetFavoriteStickers
 * @apiGroup Stickers
 * @apiParam {Number} page 页码，默认为1
 * @apiParam {Number} limit 每页数量，默认为20
 */
router.get('/favorites', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const userId = req.user[0].user_id;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const pageLimit = parseInt(limit);
        
        // 获取总记录数
        const countSql = `
            SELECT COUNT(*) as total
            FROM stickers s
            JOIN sticker_favorites sf ON s.sticker_id = sf.sticker_id
            WHERE sf.user_id = ?
        `;
        
        const totalResult = await query(countSql, [userId]);
        const total = totalResult[0].total;
        
        const sql = `
            SELECT s.*, 1 as is_favorite
            FROM stickers s
            JOIN sticker_favorites sf ON s.sticker_id = sf.sticker_id
            WHERE sf.user_id = ?
            ORDER BY sf.created_at DESC
            LIMIT ?, ?
        `;
        
        const stickers = await query(sql, [userId, offset, pageLimit]);
        
        // 将布尔值转换为 0/1
        stickers.forEach(sticker => {
            sticker.is_favorite = sticker.is_favorite > 0;
            sticker.is_private = sticker.is_private > 0;
        });
        
        res.json({
            stickers,
            pagination: {
                total,
                page: parseInt(page),
                limit: pageLimit,
                pages: Math.ceil(total / pageLimit)
            }
        });
    } catch (error) {
        console.error('获取收藏表情包失败:', error);
        res.status(500).json({ message: '获取收藏表情包失败' });
    }
});

/**
 * @api {post} /community/stickers/favorites 收藏表情包
 * @apiName AddFavoriteSticker
 * @apiGroup Stickers
 * @apiParam {Number} sticker_id 表情包ID
 */
router.post('/favorites', auth, async (req, res) => {
    try {
        const { sticker_id } = req.body;
        const userId = req.user[0].user_id;
        
        if (!sticker_id) {
            return res.status(400).json({ message: '表情包ID不能为空' });
        }
        
        // 检查表情包是否存在
        const sticker = await query('SELECT * FROM stickers WHERE sticker_id = ?', [sticker_id]);
        
        if (sticker.length === 0) {
            return res.status(404).json({ message: '表情包不存在' });
        }
        
        // 检查是否已收藏
        const favorite = await query(
            'SELECT * FROM sticker_favorites WHERE sticker_id = ? AND user_id = ?', 
            [sticker_id, userId]
        );
        
        if (favorite.length > 0) {
            return res.status(400).json({ message: '已收藏此表情包' });
        }
        
        // 添加收藏
        const sql = `
            INSERT INTO sticker_favorites (user_id, sticker_id, created_at)
            VALUES (?, ?, NOW())
        `;
        
        const result = await query(sql, [userId, sticker_id]);
        
        if (result.affectedRows > 0) {
            res.status(201).json({ message: '收藏成功' });
        } else {
            res.status(500).json({ message: '收藏表情包失败' });
        }
    } catch (error) {
        console.error('收藏表情包失败:', error);
        res.status(500).json({ message: '收藏表情包失败' });
    }
});

/**
 * @api {delete} /community/stickers/favorites/:id 取消收藏表情包
 * @apiName RemoveFavoriteSticker
 * @apiGroup Stickers
 * @apiParam {Number} id 表情包ID
 */
router.delete('/favorites/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user[0].user_id;
        
        // 检查是否已收藏
        const favorite = await query(
            'SELECT * FROM sticker_favorites WHERE sticker_id = ? AND user_id = ?', 
            [id, userId]
        );
        
        if (favorite.length === 0) {
            return res.status(404).json({ message: '未收藏此表情包' });
        }
        
        // 取消收藏
        const result = await query(
            'DELETE FROM sticker_favorites WHERE sticker_id = ? AND user_id = ?', 
            [id, userId]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: '取消收藏成功' });
        } else {
            res.status(500).json({ message: '取消收藏失败' });
        }
    } catch (error) {
        console.error('取消收藏失败:', error);
        res.status(500).json({ message: '取消收藏失败' });
    }
});

module.exports = router;