// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
// 引入中文分词工具
const nodejieba = require('nodejieba');

// 创建路由对象
let router = express.Router();

// 记录搜索关键词并自动维护热门关键词
async function trackSearchKeyword(keyword, category = 'all', searchResults = null) {
    try {
        // 检查关键词是否已存在
        const existingKeyword = await query(
            'SELECT keyword_id, search_count FROM search_keywords WHERE keyword = ?',
            [keyword]
        );
        
        let keywordId;
        let searchCount = 1;
        
        if (existingKeyword.length > 0) {
            // 已存在，增加搜索次数
            keywordId = existingKeyword[0].keyword_id;
            searchCount = existingKeyword[0].search_count + 1;
            await query(
                'UPDATE search_keywords SET search_count = search_count + 1, last_searched_at = NOW() WHERE keyword_id = ?',
                [keywordId]
            );
        } else {
            // 不存在，创建新记录
            // 如果提供了搜索结果，尝试基于结果自动确定最佳分类
            if (searchResults) {
                category = determineBestCategory(searchResults, category);
            }
            
            const result = await query(
                'INSERT INTO search_keywords (keyword, search_count, category, last_searched_at) VALUES (?, 1, ?, NOW())',
                [keyword, category]
            );
            keywordId = result.insertId;
        }
        
        // 自动推荐热门关键词
        // 当搜索次数达到阈值时，自动将关键词设为推荐
        const RECOMMENDATION_THRESHOLD = 10; // 10次搜索后自动推荐
        if (searchCount >= RECOMMENDATION_THRESHOLD) {
            await query(
                'UPDATE search_keywords SET is_recommended = 1 WHERE keyword_id = ? AND is_recommended = 0',
                [keywordId]
            );
        }
        
    } catch (error) {
        console.error('记录搜索关键词失败:', error);
        // 不中断用户搜索流程，所以这里只记录错误不抛出
    }
}

// 根据搜索结果确定最佳分类
function determineBestCategory(results, defaultCategory) {
    // 如果默认分类已经是特定分类，则保留
    if (defaultCategory !== 'all') {
        return defaultCategory;
    }
    
    // 检查各类别结果的数量
    const counts = {
        books: results.books.total || 0,
        posts: results.posts.total || 0,
        circles: results.circles.total || 0,
        users: results.users.total || 0
    };
    
    // 找出结果最多的分类
    let maxCategory = 'all';
    let maxCount = 0;
    
    for (const [category, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            maxCategory = category;
        }
    }
    
    // 如果没有任何结果或结果分布均匀，保留默认分类
    return maxCount > 0 ? maxCategory : defaultCategory;
}

// 执行搜索的函数，支持完整关键词和分词后的关键词
async function performSearch(keyword, type, page, pageSize, isSegmentedKeyword = false) {
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
    
    // 搜索书籍
    if (type === 'all' || type === 'books') {
        let keyWordToId = parseInt(keyword);
        let booksQuery, booksParams;
        
        if (!isNaN(keyWordToId)) {
            // 如果关键词是数字，尝试按ID搜索
            booksQuery = `
                SELECT n.*, u.name as author_name, u.avatar_url as auther_avatar 
                FROM novels n, users u 
                WHERE u.user_id = n.author_id 
                AND n.deleted = 0
                AND n.is_personal = 0
                AND novel_id = ?
                LIMIT ?, ?
            `;
            booksParams = [keyWordToId, (page - 1) * pageSize, pageSize];
        } else {
            // 否则按名称和内容搜索
            booksQuery = `
                SELECT n.*, u.name as author_name, u.avatar_url as auther_avatar 
                FROM novels n, users u 
                WHERE u.user_id = n.author_id 
                AND n.deleted = 0
                AND n.is_personal = 0
                AND (n.name LIKE ? OR n.content LIKE ?)
                ORDER BY 
                    CASE 
                        WHEN n.name LIKE ? THEN 0
                        ELSE 1
                    END
                LIMIT ?, ?
            `;
            booksParams = [searchKeyword, searchKeyword, `${keyword}%`, (page - 1) * pageSize, pageSize];
        }
        
        const books = await query(booksQuery, booksParams);
        
        // 获取总数量
        let countQuery, countParams;
        if (!isNaN(keyWordToId)) {
            countQuery = `
                SELECT COUNT(*) as total
                FROM novels n, users u 
                WHERE u.user_id = n.author_id 
                AND n.deleted = 0
                AND n.is_personal = 0
                AND novel_id = ?
            `;
            countParams = [keyWordToId];
        } else {
            countQuery = `
                SELECT COUNT(*) as total
                FROM novels n, users u 
                WHERE u.user_id = n.author_id 
                AND n.deleted = 0
                AND n.is_personal = 0
                AND (n.name LIKE ? OR n.content LIKE ?)
            `;
            countParams = [searchKeyword, searchKeyword];
        }
        
        const booksCount = await query(countQuery, countParams);
        
        results.books = {
            list: books,
            total: booksCount[0].total
        };
    }
    
    return results;
}

// 合并多个搜索结果
function mergeSearchResults(resultsArray) {
    if (resultsArray.length === 0) return {};
    
    const merged = {
        circles: { list: [], total: 0 },
        posts: { list: [], total: 0 },
        users: { list: [], total: 0 },
        books: { list: [], total: 0 }
    };
    
    // 用于去重的ID集合
    const idSets = {
        circles: new Set(),
        posts: new Set(),
        users: new Set(),
        books: new Set()
    };
    
    // 合并所有结果
    for (const results of resultsArray) {
        // 合并圈子结果
        if (results.circles) {
            for (const circle of results.circles.list) {
                if (!idSets.circles.has(circle.circle_id)) {
                    merged.circles.list.push(circle);
                    idSets.circles.add(circle.circle_id);
                }
            }
            merged.circles.total = Math.max(merged.circles.total, results.circles.total);
        }
        
        // 合并帖子结果
        if (results.posts) {
            for (const post of results.posts.list) {
                if (!idSets.posts.has(post.post_id)) {
                    merged.posts.list.push(post);
                    idSets.posts.add(post.post_id);
                }
            }
            merged.circles.total = Math.max(merged.posts.total, results.posts.total);
        }
        
        // 合并用户结果
        if (results.users) {
            for (const user of results.users.list) {
                if (!idSets.users.has(user.user_id)) {
                    merged.users.list.push(user);
                    idSets.users.add(user.user_id);
                }
            }
            merged.users.total = Math.max(merged.users.total, results.users.total);
        }
        
        // 合并书籍结果
        if (results.books) {
            for (const book of results.books.list) {
                if (!idSets.books.has(book.novel_id)) {
                    merged.books.list.push(book);
                    idSets.books.add(book.novel_id);
                }
            }
            merged.books.total = Math.max(merged.books.total, results.books.total);
        }
    }
    
    return merged;
}

// 全局搜索
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const type = req.query.type || 'all'; // all, circles, posts, users, books
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        if (!keyword) {
            return res.status(400).json({ msg: '搜索关键词不能为空' });
        }
        
        // 1. 先使用完整关键词搜索
        const fullKeywordResults = await performSearch(keyword, type, page, pageSize);
        
        // 2. 使用分词工具对关键词进行分词
        const segmentedKeywords = nodejieba.cut(keyword, true);

        console.log(segmentedKeywords);
        
        // 过滤掉停用词和过短的词（如单个字符）
        const filteredKeywords = segmentedKeywords.filter(word => {
            return word.length > 1 && 
                   !/^[a-zA-Z0-9]+$/.test(word) && // 过滤掉纯数字和字母
                   word !== keyword; // 过滤掉与原始关键词相同的词
        });
        
        // 3. 使用分词后的关键词进行搜索
        const segmentedResults = [];
        for (const segmentedKeyword of filteredKeywords) {
            // 对每个分词进行搜索，并标记为分词结果（不计入热门搜索）
            const result = await performSearch(segmentedKeyword, type, page, pageSize, true);
            segmentedResults.push(result);
        }
        
        // 4. 合并所有搜索结果
        const allResults = [fullKeywordResults, ...segmentedResults];
        const mergedResults = mergeSearchResults(allResults);
        
        // 5. 只记录完整关键词的搜索统计
        trackSearchKeyword(keyword, type, fullKeywordResults);
        
        res.json({
            keyword,
            type,
            page,
            pageSize,
            results: mergedResults
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
        const category = req.query.category || 'all';
        const limit = parseInt(req.query.limit) || 10;
        
        // 构建查询参数
        let whereClause = 'status = 1';
        let params = [];
        
        // 根据类别筛选
        if (category !== 'all') {
            whereClause += ' AND (category = ? OR category = \'all\')';
            params.push(category);
        }
        
        // 获取热门搜索词
        let hotSearches = await query(
            `SELECT keyword, search_count, category 
             FROM search_keywords 
             WHERE ${whereClause}
             ORDER BY is_recommended DESC, search_count DESC
             LIMIT ?`,
            [...params, limit]
        );
        
        // 如果结果不足，则用推荐的搜索词补充
        if (hotSearches.length < limit) {
            const recommended = await query(
                `SELECT keyword, search_count, category 
                 FROM search_keywords 
                 WHERE is_recommended = 1 AND status = 1
                 AND keyword NOT IN (${hotSearches.map(item => '?').join(',') || '\'\''})`
                + ` ORDER BY search_count DESC
                   LIMIT ?`,
                [...hotSearches.map(item => item.keyword), limit - hotSearches.length]
            );
            
            hotSearches = [...hotSearches, ...recommended];
        }
        
        res.json(hotSearches);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 获取搜索关键词统计信息（需要管理员权限）
router.get('/stats', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        // 检查是否是管理员
        if (user.user_group !== 'admin' && user.user_group !== 'super_admin') {
            return res.status(403).json({ msg: '权限不足' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const category = req.query.category || null;
        const sort = req.query.sort || 'count'; // count, recent, alpha
        const isRecommended = req.query.is_recommended !== undefined ? 
                             parseInt(req.query.is_recommended) : null;
        
        // 构建查询条件
        let whereClause = 'status = 1';
        let params = [];
        
        if (category) {
            whereClause += ' AND category = ?';
            params.push(category);
        }
        
        if (isRecommended !== null) {
            whereClause += ' AND is_recommended = ?';
            params.push(isRecommended);
        }
        
        // 构建排序条件
        let orderBy;
        switch (sort) {
            case 'recent':
                orderBy = 'last_searched_at DESC';
                break;
            case 'alpha':
                orderBy = 'keyword ASC';
                break;
            case 'count':
            default:
                orderBy = 'search_count DESC';
                break;
        }
        
        // 获取关键词列表
        const keywords = await query(
            `SELECT keyword_id, keyword, search_count, category, 
                    is_recommended, last_searched_at, created_at
             FROM search_keywords
             WHERE ${whereClause}
             ORDER BY ${orderBy}
             LIMIT ?, ?`,
            [...params, (page - 1) * pageSize, pageSize]
        );
        
        // 获取总数
        const totalCount = await query(
            `SELECT COUNT(*) as total
             FROM search_keywords
             WHERE ${whereClause}`,
            params
        );
        
        // 获取分类统计
        const categoryStats = await query(`
            SELECT category, COUNT(*) as count, SUM(search_count) as total_searches
            FROM search_keywords
            WHERE status = 1
            GROUP BY category
            ORDER BY total_searches DESC
        `);
        
        // 获取总体统计
        const overallStats = await query(`
            SELECT 
                COUNT(*) as total_keywords,
                SUM(search_count) as total_searches,
                SUM(CASE WHEN is_recommended = 1 THEN 1 ELSE 0 END) as recommended_count,
                MAX(last_searched_at) as last_search_time
            FROM search_keywords
            WHERE status = 1
        `);
        
        res.json({
            keywords,
            pagination: {
                total: totalCount[0].total,
                page,
                pageSize,
                pages: Math.ceil(totalCount[0].total / pageSize)
            },
            stats: {
                categories: categoryStats,
                overall: overallStats[0]
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 管理接口：添加或更新推荐搜索词（需要管理员权限）
router.post('/recommend', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        // 检查是否是管理员
        if (user.user_group !== 'admin' && user.user_group !== 'super_admin') {
            return res.status(403).json({ msg: '权限不足' });
        }
        
        const { keyword, category = 'all', is_recommended = 1 } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ msg: '关键词不能为空' });
        }
        
        // 查询关键词是否存在
        const existingKeyword = await query(
            'SELECT keyword_id FROM search_keywords WHERE keyword = ?',
            [keyword]
        );
        
        if (existingKeyword.length > 0) {
            // 更新已存在的关键词
            await query(
                'UPDATE search_keywords SET is_recommended = ?, category = ? WHERE keyword_id = ?',
                [is_recommended, category, existingKeyword[0].keyword_id]
            );
        } else {
            // 创建新的推荐关键词
            await query(
                'INSERT INTO search_keywords (keyword, search_count, category, is_recommended) VALUES (?, 0, ?, ?)',
                [keyword, category, is_recommended]
            );
        }
        
        res.json({ msg: '推荐关键词设置成功' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// 管理接口：删除关键词（需要管理员权限）
router.delete('/keyword/:keywordId', auth, async (req, res) => {
    try {
        const user = req.user[0];
        
        // 检查是否是管理员
        if (user.user_group !== 'admin' && user.user_group !== 'super_admin') {
            return res.status(403).json({ msg: '权限不足' });
        }
        
        const keywordId = req.params.keywordId;
        
        // 更新关键词状态为无效
        await query(
            'UPDATE search_keywords SET status = 0 WHERE keyword_id = ?',
            [keywordId]
        );
        
        res.json({ msg: '关键词已删除' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router; 