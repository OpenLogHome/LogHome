import { doChapterComprehension } from './tasks/chapter-comprehension/index.js';
import pool from './utils/db.js';

async function main() {
    try {
        console.log("Connecting to database...");

        // Get a valid article ID
        const [rows] = await pool.query('SELECT article_id FROM articles LIMIT 1');
        if (rows.length === 0) {
            console.log("No articles found in database.");
            return;
        }
        const articleId = rows[0].article_id;
        console.log(`Found article ID: ${articleId}, processing...`);

        const result = await doChapterComprehension(articleId);
        console.log("Comprehension Result:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await pool.end();
    }
}

main();
