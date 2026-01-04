const { query } = require('../sql');

async function run() {
    try {
        const tagName = 'HayCraft2025中文短篇主题文会';
        
        console.log('Checking tags table structure...');
        let tagRows = await query('SELECT * FROM tags LIMIT 1');
        if (tagRows.length === 0) {
            // If table is empty, we can't do much, but let's assume 'name' or 'tag_name' exists if we were to query schema.
            // But if it's empty, we won't find the tag anyway.
            console.log('Tags table is empty.');
        } else {
            const tagCols = Object.keys(tagRows[0]);
            console.log('Tags table columns:', tagCols);
            
            let nameCol = tagCols.includes('tag_name') ? 'tag_name' : (tagCols.includes('name') ? 'name' : null);
            
            if (!nameCol) {
                console.error('Could not find tag name column in tags table. Columns found: ' + tagCols.join(', '));
                // Fallback attempt with 'tag_name'
                nameCol = 'tag_name'; 
            }
            
            console.log(`Using column '${nameCol}' for tag name.`);
            
            const calculationSql = `
                SELECT 
                    n.novel_id, 
                    n.name,
                    u.name as author_name,
                    ROUND(
                        n.clicks * 8 + (
                            SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id AND date < "2026-01-01"
                        )*12 + (
                            SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id
                        )*200 + (
                            SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id AND deleted = 0 and comment_time < "2026-01-01"
                        )*20 + (
                            SELECT IFNULL(
                                SUM(item_amount*item_cost),0
                            ) FROM tipping WHERE novel_id = n.novel_id AND tipping_time < "2026-01-01"
                        )*10
                    ) as score
                FROM novels n
                JOIN novel_tag nt ON n.novel_id = nt.novel_id
                JOIN tags t ON nt.tag_id = t.tag_id
                LEFT JOIN users u ON n.author_id = u.user_id
                WHERE t.${nameCol} = ?
                AND n.deleted = 0
                AND n.novel_id != 602
                ORDER BY score DESC
            `;

            
            
            console.log(`Executing query for tag: ${tagName}`);
            const results = await query(calculationSql, [tagName]);
            
            console.log(`Found ${results.length} novels with tag "${tagName}".`);
            console.log('------------------------------------------------');
            results.forEach((novel, index) => {
                console.log(`${index + 1}. [${novel.novel_id}] ${novel.name} (作者: ${novel.author_name}) - Score: ${novel.score}`);
            });
        }
        
    } catch (err) {
        console.error('Error:', err);
    }
    
    // Force exit as the pool might keep connection open
    process.exit();
}

run();
