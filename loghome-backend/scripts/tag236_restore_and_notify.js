const fs = require('fs');
const path = require('path');
const { query } = require('../sql.js');
const message = require('../bin/message.js');

const BACKUP_FILE = path.resolve(__dirname, '../log/tag236_author_backup_20260121-000046.json');

const NOTIFICATION_CONTENT = '干草块文会评审结束，您的作品已恢复，感谢您参与本活动，期待下次再会！';

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    if (dryRun) {
        console.log('=== DRY RUN MODE: No changes will be made ===');
    }

    // 1. Load backup data
    if (!fs.existsSync(BACKUP_FILE)) {
        console.error(`Backup file not found: ${BACKUP_FILE}`);
        process.exit(1);
    }
    const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
    const backupData = JSON.parse(raw);
    
    if (!backupData || !Array.isArray(backupData.novels)) {
        console.error('Invalid backup file format.');
        process.exit(1);
    }

    const novels = backupData.novels;
    console.log(`Loaded ${novels.length} novels from backup.`);

    let restoredCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // 2. Process each novel
    for (const novel of novels) {
        const { novel_id, author_id: originalAuthorId, name } = novel;
        
        console.log(`Processing "${name}" (Novel ID: ${novel_id}, Original Author: ${originalAuthorId})...`);

        try {
            // Check current status
            const rows = await query('SELECT author_id FROM novels WHERE novel_id = ?', [novel_id]);
            if (rows.length === 0) {
                console.warn(`  - Novel ${novel_id} not found in database.`);
                errorCount++;
                continue;
            }

            const currentAuthorId = rows[0].author_id;

            if (currentAuthorId !== -1) {
                console.log(`  - Current author is ${currentAuthorId} (not -1). Skipping restoration.`);
                skippedCount++;
                continue;
            }

            // Restore author
            if (dryRun) {
                console.log(`  [DRY RUN] Would update novel ${novel_id} author_id to ${originalAuthorId}`);
                console.log(`  [DRY RUN] Would send notification to ${originalAuthorId}: "${NOTIFICATION_CONTENT}"`);
                restoredCount++; // Count as if restored for summary
                continue;
            }

            const updateResult = await query('UPDATE novels SET author_id = ? WHERE novel_id = ? AND author_id = -1', [originalAuthorId, novel_id]);
            
            if (updateResult.affectedRows > 0) {
                console.log(`  - Restored author_id to ${originalAuthorId}.`);
                restoredCount++;

                // Send notification
                try {
                    // sendMsg(fromId, toId, content, router, type, force)
                    await message.sendMsg(-1, originalAuthorId, NOTIFICATION_CONTENT, '', 'notification', true);
                    console.log(`  - Notification sent to author ${originalAuthorId}.`);
                } catch (msgErr) {
                    console.error(`  - Failed to send notification to author ${originalAuthorId}:`, msgErr);
                }

            } else {
                console.warn(`  - Failed to update author_id (affectedRows=0). maybe changed concurrently.`);
                skippedCount++;
            }

        } catch (err) {
            console.error(`  - Error processing novel ${novel_id}:`, err);
            errorCount++;
        }
    }

    console.log('------------------------------------------------');
    console.log(`Summary:`);
    console.log(`  Total: ${novels.length}`);
    console.log(`  Restored & Notified: ${restoredCount}`);
    console.log(`  Skipped (Not -1 or not found): ${skippedCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log('------------------------------------------------');
    
    process.exit(0);
}

main().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
