const fs = require('fs');
const path = require('path');
const { query } = require('../sql.js');
const message = require('../bin/message.js');

const TARGET_NOVELS = [
    '真实频率'
];

const BACKUP_FILE = path.resolve(__dirname, '../log/tag236_author_backup_20260121-000046.json');

async function main() {
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

    const targets = [];
    
    // Find target novels in backup
    for (const novelName of TARGET_NOVELS) {
        // Find by name exactly
        const entry = backupData.novels.find(n => n.name === novelName);
        if (!entry) {
            console.warn(`Warning: Novel "${novelName}" not found in backup.`);
            continue;
        }
        targets.push(entry);
    }

    console.log(`Found ${targets.length} novels to process out of ${TARGET_NOVELS.length} requested.`);

    // 2. Process each novel
    for (const target of targets) {
        console.log(`Processing "${target.name}" (Novel ID: ${target.novel_id}, Original Author ID: ${target.author_id})...`);

        // 2.1 Restore author_id
        // We only restore if author_id is currently -1 or we just force overwrite to original?
        // The user said "return to original author", so setting to original author_id is correct.
        const updateSql = `UPDATE novels SET author_id = ? WHERE novel_id = ?`;
        try {
            const updateResult = await query(updateSql, [target.author_id, target.novel_id]);
            if (updateResult.affectedRows > 0) {
                console.log(`  - Restored author_id to ${target.author_id}.`);
            } else {
                console.warn(`  - Database reported no rows affected for novel ${target.novel_id} (Maybe author was already correct?).`);
            }
        } catch (err) {
            console.error(`  - Database error for novel ${target.novel_id}:`, err);
            continue; // Skip notification if DB update fails? Or try anyway? Better to skip if we can't restore.
        }

        // 2.2 Send notification
        const msgContent = `很遗憾地通知您，您的作品《${target.name}》经组委会审查，存在严重的AI代笔情况，根据评审”一票否决“补充条款已退回。感谢您参与干草块征文主题活动，期待下次再见！`;
        const fromId = -1; // System
        const toId = target.author_id;
        
        try {
             // sendMsg(fromId, toId, content, router, type, force)
             // force = true to ensure it sends even if recently sent
             await message.sendMsg(fromId, toId, msgContent, '', 'notification', true);
             console.log(`  - Notification sent to author ${toId}.`);
        } catch (e) {
            console.error(`  - Failed to send notification to author ${toId}:`, e);
        }
    }
    
    console.log('All operations completed.');
    process.exit(0);
}

main().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
