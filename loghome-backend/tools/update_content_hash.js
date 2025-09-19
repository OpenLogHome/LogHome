const { query } = require('../sql.js');
const crypto = require('crypto');

/**
 * 计算内容的MD5哈希值
 * @param {string} content - 要计算哈希的内容
 * @returns {string} MD5哈希值
 */
function calculateContentHash(content) {
    if (!content) return '';
    return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 更新articles_writer表中所有记录的content_hash
 */
async function updateArticlesWriterContentHash() {
    try {
        console.log('开始更新articles_writer表的content_hash...');
        
        // 获取所有articles_writer记录
        const articles = await query('SELECT id, content FROM articles_writer WHERE content IS NOT NULL');
        console.log(`找到 ${articles.length} 条articles_writer记录需要更新`);
        
        let updatedCount = 0;
        
        for (const article of articles) {
            const contentHash = calculateContentHash(article.content);
            
            // 更新content_hash字段
            await query(
                'UPDATE articles_writer SET content_hash = ? WHERE id = ?',
                [contentHash, article.id]
            );
            
            updatedCount++;
            
            // 每处理100条记录输出一次进度
            if (updatedCount % 100 === 0) {
                console.log(`已更新 ${updatedCount}/${articles.length} 条articles_writer记录`);
            }
        }
        
        console.log(`articles_writer表更新完成，共更新 ${updatedCount} 条记录`);
        
    } catch (error) {
        console.error('更新articles_writer表content_hash时出错:', error);
        throw error;
    }
}

/**
 * 更新articles表中所有记录的content_hash
 */
async function updateArticlesContentHash() {
    try {
        console.log('开始更新articles表的content_hash...');
        
        // 获取所有articles记录
        const articles = await query('SELECT article_id, content FROM articles WHERE content IS NOT NULL');
        console.log(`找到 ${articles.length} 条articles记录需要更新`);
        
        let updatedCount = 0;
        
        for (const article of articles) {
            const contentHash = calculateContentHash(article.content);
            
            // 更新content_hash字段
            await query(
                'UPDATE articles SET content_hash = ? WHERE article_id = ?',
                [contentHash, article.article_id]
            );
            
            updatedCount++;
            
            // 每处理100条记录输出一次进度
            if (updatedCount % 100 === 0) {
                console.log(`已更新 ${updatedCount}/${articles.length} 条articles记录`);
            }
        }
        
        console.log(`articles表更新完成，共更新 ${updatedCount} 条记录`);
        
    } catch (error) {
        console.error('更新articles表content_hash时出错:', error);
        throw error;
    }
}

/**
 * 主函数 - 更新所有表的content_hash
 */
async function main() {
    try {
        console.log('开始批量更新content_hash...');
        console.log('时间:', new Date().toLocaleString());
        
        // 更新articles_writer表
        await updateArticlesWriterContentHash();
        
        // 更新articles表
        await updateArticlesContentHash();
        
        console.log('所有表的content_hash更新完成!');
        console.log('完成时间:', new Date().toLocaleString());
        
    } catch (error) {
        console.error('批量更新content_hash失败:', error);
        process.exit(1);
    }
    
    // 关闭数据库连接
    process.exit(0);
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
    main();
}

module.exports = {
    calculateContentHash,
    updateArticlesWriterContentHash,
    updateArticlesContentHash,
    main
};