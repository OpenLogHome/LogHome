import { doChapterComprehension } from './tasks/chapter-comprehension/index.js';
import { getPriorityNovels, getPendingChapters } from './utils/memoryManager.js';
import pool, { memoryPool } from './utils/db.js';

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    try {
        console.log("Starting Agent...");

        // 1. Get priority novels
        const novels = await getPriorityNovels(100);
        if (novels.length === 0) {
            console.log("No active novels found.");
            return;
        }
        console.log(`Found ${novels.length} active novels.`);

        let processedNovel = false;

        for (const novel of novels) {
            // 2. Get pending chapters
            const chapters = await getPendingChapters(novel.novel_id);
            if (chapters.length === 0) {
                // Try next novel
                continue;
            }
            
            console.log(`Selected Novel: ${novel.name} (ID: ${novel.novel_id}) - ${chapters.length} pending chapters.`);
            processedNovel = true;

            // 3. Process chapters sequentially
            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];
                console.log(`Processing Chapter ${chapter.article_chapter}: ${chapter.title} (Article ID: ${chapter.article_id})...`);

                try {
                    await doChapterComprehension(chapter.article_id);
                    console.log(`Finished processing Chapter ${chapter.article_chapter}.`);
                } catch (err) {
                    console.error(`Error processing Chapter ${chapter.article_chapter}:`, err);
                    // Continue to next chapter
                }

                // Delay between chapters (except after the last one)
                if (i < chapters.length - 1) {
                    console.log("Waiting 5 seconds...");
                    await delay(5000);
                }
            }
            
            // Found and processed a novel, break the loop
            break;
        }

        if (!processedNovel) {
            console.log("Checked all active novels, no pending chapters found.");
        } else {
            console.log("Task completed for the selected novel.");
        }

    } catch (error) {
        console.error("Main loop error:", error);
    }
}

// Global flag to prevent concurrent execution
let isRunning = false;

async function scheduleLoop() {
    console.log("Scheduler started. Will run main() every hour.");
    
    const run = async () => {
        if (isRunning) {
            console.log("Skipping run: main() is already running.");
            return;
        }

        isRunning = true;
        try {
            await main();
        } catch (e) {
            console.error("Unexpected error in scheduled run:", e);
        } finally {
            isRunning = false;
        }
    };

    // Run immediately on start
    await run();

    // Schedule every hour (3600000 ms)
    setInterval(run, 3600 * 1000);
}

// Handle graceful shutdown to close pools
process.on('SIGINT', async () => {
    console.log("Shutting down...");
    await pool.end();
    await memoryPool.end();
    process.exit(0);
});

scheduleLoop();
