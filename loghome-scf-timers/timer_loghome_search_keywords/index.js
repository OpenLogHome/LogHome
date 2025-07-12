let { query } = require('./sql.js');

/**
 * 搜索关键词自动维护函数
 * 用于定期维护热门搜索关键词、推荐状态和清理过期数据
 */
async function maintainSearchKeywords() {
    try {
        console.log('开始执行搜索关键词自动维护任务');
        
        // 1. 自动推荐搜索次数最多的前20个关键词
        const topKeywordsResult = await query(`
            UPDATE search_keywords SET is_recommended = 1
            WHERE keyword_id IN (
                SELECT keyword_id FROM (
                    SELECT keyword_id
                    FROM search_keywords
                    WHERE status = 1
                    ORDER BY search_count DESC
                    LIMIT 20
                ) AS top_keywords
            ) AND is_recommended = 0
        `);
        
        console.log(`已将热门关键词设为推荐状态，影响行数: ${topKeywordsResult.affectedRows || 0}`);
        
        // 2. 取消推荐搜索次数较少且较长时间未搜索的关键词
        const removeRecommendationResult = await query(`
            UPDATE search_keywords SET is_recommended = 0
            WHERE is_recommended = 1
            AND search_count < 5
            AND last_searched_at < DATE_SUB(NOW(), INTERVAL 14 DAY)
        `);
        
        console.log(`已取消不活跃关键词的推荐状态，影响行数: ${removeRecommendationResult.affectedRows || 0}`);
        
        // 3. 清理长期未被搜索的关键词
        const cleanupResult = await query(`
            UPDATE search_keywords SET status = 0
            WHERE status = 1 
            AND last_searched_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
        `);
        
        console.log(`已清理长期未使用的关键词，影响行数: ${cleanupResult.affectedRows || 0}`);
        
        // 4. 自动分类：根据搜索结果比例调整分类
        // 获取分类不明确的关键词
        const ambiguousKeywords = await query(`
            SELECT keyword_id, keyword, category 
            FROM search_keywords 
            WHERE status = 1 
            AND category = 'all' 
            AND search_count > 10
            LIMIT 100
        `);
        
        // 对每个关键词检查搜索结果分布
        for (const keyword of ambiguousKeywords) {
            // 获取该关键词在各分类中的搜索结果数量
            const searchResults = await query(`
                SELECT 
                    SUM(CASE WHEN n.name LIKE ? OR n.content LIKE ? THEN 1 ELSE 0 END) as books_count,
                    (SELECT COUNT(*) FROM comm_posts p WHERE p.status = 1 AND (p.title LIKE ? OR p.content LIKE ?)) as posts_count,
                    (SELECT COUNT(*) FROM comm_circles c WHERE c.status = 1 AND (c.name LIKE ? OR c.description LIKE ?)) as circles_count,
                    (SELECT COUNT(*) FROM users u WHERE u.name LIKE ? OR u.account LIKE ?) as users_count
                FROM novels n, users u
                WHERE u.user_id = n.author_id
                AND n.deleted = 0
                AND n.is_personal = 0
            `, [`%${keyword.keyword}%`, `%${keyword.keyword}%`, `%${keyword.keyword}%`, `%${keyword.keyword}%`, 
                `%${keyword.keyword}%`, `%${keyword.keyword}%`, `%${keyword.keyword}%`, `%${keyword.keyword}%`]);
            
            if (searchResults && searchResults.length > 0) {
                const result = searchResults[0];
                const counts = {
                    books: result.books_count || 0,
                    posts: result.posts_count || 0,
                    circles: result.circles_count || 0,
                    users: result.users_count || 0
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
                
                // 如果有明显偏向的分类，则更新关键词分类
                const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
                if (maxCount > 0 && maxCount / totalCount > 0.5) {
                    await query(
                        'UPDATE search_keywords SET category = ? WHERE keyword_id = ?',
                        [maxCategory, keyword.keyword_id]
                    );
                    console.log(`已将关键词 "${keyword.keyword}" 的分类从 "${keyword.category}" 更新为 "${maxCategory}"`);
                }
            }
        }
        
        return {
            success: true,
            message: '搜索关键词自动维护任务执行成功'
        };
    } catch (error) {
        console.error('搜索关键词自动维护任务执行失败:', error);
        return {
            success: false,
            message: '搜索关键词自动维护任务执行失败',
            error: error.message
        };
    }
}

/**
 * 云函数入口函数
 */
exports.main_handler = async (event, context, callback) => {
    try {
        const result = await maintainSearchKeywords();
        console.log("搜索关键词维护操作执行完成。", result);
        event.result = "success";
        return event;
    } catch (error) {
        console.error("搜索关键词维护操作执行失败:", error);
        event.result = "failed";
        event.error = error.message;
        return event;
    }
}; 