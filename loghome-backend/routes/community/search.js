// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');

// 创建路由对象
let router = express.Router();

// 全局搜索
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const type = req.query.type || 'all'; // all, circles, posts, users
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        if (!keyword) {
            return res.status(400).json({ msg: '搜索关键词不能为空' });
        }
        
        let results = {};
        const searchKeyword = `%${keyword}%`;
        
        // 搜索圈子
        if (type === 'all' || type === 'circles') {
            const circles = await query(
                `SELECT c.*, u.name as creator_name, u.avatar_url as creator_avatar,
                        cc.name as category_name
                 FROM comm_circles c
                 LEFT JOIN users u ON c.creator_id = u.user_id
                 LEFT JOIN comm_circle_categories cc ON c.category_id = cc.category_id
                 WHERE c.status = 1 AND (c.name LIKE ? OR c.description LIKE ?)
                 ORDER BY 
                    CASE 
                        WHEN c.name LIKE ? THEN 0
                        ELSE 1
                    END,
                    c.member_count DESC
                 LIMIT ?, ?`,
                [searchKeyword, searchKeyword, `${keyword}%`, (page - 1) * pageSize, pageSize]
            );
            
            const circlesCount = await query(
                `SELECT COUNT(*) as total
                 FROM comm_circles
                 WHERE status = 1 AND (name LIKE ? OR description LIKE ?)`,
                [searchKeyword, searchKeyword]
            );
            
            results.circles = {
                list: circles,
                total: circlesCount[0].total
            };
        }
        
        // 搜索帖子
        if (type === 'all' || type === 'posts') {
            const posts = await query(
                `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
                        c.name as circle_name
                 FROM comm_posts p
                 LEFT JOIN users u ON p.user_id = u.user_id
                 LEFT JOIN comm_circles c ON p.circle_id = c.circle_id
                 LEFT JOIN comm_post_tags pt ON p.post_id = pt.post_id
                 LEFT JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
                 WHERE p.status = 1 
                       AND (p.title LIKE ? OR p.content LIKE ? OR t.name LIKE ?)
                 GROUP BY p.post_id
                 ORDER BY 
                    CASE 
                        WHEN p.title LIKE ? THEN 0
                        ELSE 1
                    END,
                    p.create_time DESC
                 LIMIT ?, ?`,
                [searchKeyword, searchKeyword, searchKeyword, `${keyword}%`, (page - 1) * pageSize, pageSize]
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
            
            const postsCount = await query(
                `SELECT COUNT(DISTINCT p.post_id) as total
                 FROM comm_posts p
                 LEFT JOIN comm_post_tags pt ON p.post_id = pt.post_id
                 LEFT JOIN comm_circle_tags t ON pt.tag_id = t.tag_id
                 WHERE p.status = 1 
                       AND (p.title LIKE ? OR p.content LIKE ? OR t.name LIKE ?)`,
                [searchKeyword, searchKeyword, searchKeyword]
            );
            
            results.posts = {
                list: posts,
                total: postsCount[0].total
            };
        }
        
        // 搜索用户
        if (type === 'all' || type === 'users') {
            const users = await query(
                `SELECT user_id, name, avatar_url, motto, user_group
                 FROM users
                 WHERE name LIKE ? OR account LIKE ?
                 ORDER BY 
                    CASE 
                        WHEN name LIKE ? THEN 0
                        ELSE 1
                    END
                 LIMIT ?, ?`,
                [searchKeyword, searchKeyword, `${keyword}%`, (page - 1) * pageSize, pageSize]
            );
            
            const usersCount = await query(
                `SELECT COUNT(*) as total
                 FROM users
                 WHERE name LIKE ? OR account LIKE ?`,
                [searchKeyword, searchKeyword]
            );
            
            results.users = {
                list: users,
                total: usersCount[0].total
            };
        }
        
        res.json({
            keyword,
            type,
            page,
            pageSize,
            results
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 搜索圈子标签
router.get('/tags', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const circleId = req.query.circle_id;
        
        if (!keyword) {
            return res.status(400).json({ msg: '搜索关键词不能为空' });
        }
        
        let queryStr = `
            SELECT * FROM comm_circle_tags
            WHERE name LIKE ?
        `;
        let params = [`%${keyword}%`];
        
        if (circleId) {
            queryStr += ' AND circle_id = ?';
            params.push(circleId);
        }
        
        queryStr += ' ORDER BY name LIMIT 10';
        
        const tags = await query(queryStr, params);
        
        res.json(tags);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 搜索用户（用于@功能）
router.get('/users', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        
        if (!keyword) {
            return res.status(400).json({ msg: '搜索关键词不能为空' });
        }
        
        const users = await query(
            `SELECT user_id, name, avatar_url
             FROM users
             WHERE name LIKE ? OR account LIKE ?
             ORDER BY 
                CASE 
                    WHEN name LIKE ? THEN 0
                    ELSE 1
                END
             LIMIT 10`,
            [`%${keyword}%`, `%${keyword}%`, `${keyword}%`]
        );
        
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取热门搜索
router.get('/hot', async (req, res) => {
    try {
        // 这里可以实现热门搜索词的逻辑
        // 例如从搜索历史记录中统计最常搜索的关键词
        
        // 示例返回一些热门搜索词
        const hotSearches = [
            { keyword: '热门话题', count: 120 },
            { keyword: '新功能', count: 98 },
            { keyword: '活动', count: 85 },
            { keyword: '公告', count: 76 },
            { keyword: '反馈', count: 65 }
        ];
        
        res.json(hotSearches);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router; 