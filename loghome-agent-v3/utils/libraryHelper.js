import pool from './db.js';

export async function getNovelInfo(novelId) {
    try {
        const sql = `
            SELECT n.novel_id, n.name, n.content, u.name as author
            FROM novels n
            LEFT JOIN users u ON n.author_id = u.user_id
            WHERE n.novel_id = ?
        `;
        const [rows] = await pool.query(sql, [novelId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error getting novel info:", error);
        return null;
    }
}

export async function searchNovelsByName(name) {
    try {
        const sql = `SELECT novel_id, name, content FROM novels WHERE name LIKE ? LIMIT 5`;
        const [rows] = await pool.query(sql, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error searching novels by name:", error);
        return [];
    }
}

export async function searchNovelsByKeyword(keywordInput) {
    try {
        // Split keywords by space and filter out empty strings
        const keywords = keywordInput.split(/\s+/).filter(k => k.trim().length > 0);
        
        if (keywords.length === 0) return [];

        // Build dynamic WHERE clause for multiple keywords (OR logic)
        // We want to count matches for ANY of the keywords
        const conditions = keywords.map(() => `a.content LIKE ?`).join(' OR ');
        const params = keywords.map(k => `%${k}%`);

        const sql = `
            SELECT n.novel_id, n.name, COUNT(a.article_id) as match_count
            FROM articles a
            JOIN novels n ON a.novel_id = n.novel_id
            WHERE (${conditions}) AND a.deleted = 0 AND a.is_draft = 0
            GROUP BY n.novel_id
            ORDER BY match_count DESC
            LIMIT 5
        `;
        
        // Use a longer timeout (60s) for this potentially slow query
        const [rows] = await pool.query({
            sql: sql,
            timeout: 60000,
            values: params
        });
        return rows;
    } catch (error) {
        console.error("Error searching novels by keyword:", error);
        return [];
    }
}
