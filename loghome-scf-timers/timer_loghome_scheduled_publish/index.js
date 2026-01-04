const { query, transition } = require('./sql.js');

exports.main_handler = async (event, context, callback) => {
    try {
        console.log("开始检查定时发布任务...");
        
        // 1. 获取所有待执行且时间已到的任务
        const tasks = await query(
            'SELECT t.*, a.novel_id, a.title as article_title, n.name as novel_name, n.author_id FROM scheduled_publish_tasks t JOIN articles a ON t.article_id = a.article_id JOIN novels n ON a.novel_id = n.novel_id WHERE t.status = "pending" AND t.publish_time <= CURRENT_TIMESTAMP'
        );

        console.log(`找到 ${tasks.length} 个待执行任务`);

        for (const task of tasks) {
            console.log(`正在执行任务: ${task.task_id}, 文章: ${task.article_title}`);
            try {
                await transition(async (trx) => {
                    // 1. 更新文章状态为已发布
                    await trx(
                        'UPDATE articles SET is_draft = 0, audit_status = "Uncheck", update_time = CURRENT_TIMESTAMP WHERE article_id = ?',
                        [task.article_id]
                    );

                    // 2. 更新小说更新时间
                    await trx(
                        'UPDATE novels SET update_time = CURRENT_TIMESTAMP WHERE novel_id = ?',
                        [task.novel_id]
                    );

                    // 3. 更新全本字数
                    // 先获取小说所有已发布章节的字数
                    const articles = await trx(
                        'SELECT text_count FROM articles WHERE novel_id = ? AND is_draft = 0 AND deleted = 0',
                        [task.novel_id]
                    );
                    let novelTextCount = 0;
                    for (const item of articles) {
                        novelTextCount += item.text_count;
                    }
                    await trx(
                        'UPDATE novels SET text_count = ? WHERE novel_id = ?',
                        [novelTextCount, task.novel_id]
                    );

                    // 4. 更新任务状态为已执行
                    await trx(
                        'UPDATE scheduled_publish_tasks SET status = "executed", executed_time = CURRENT_TIMESTAMP WHERE task_id = ?',
                        [task.task_id]
                    );
                    
                    // 5. 推送到最近更新 (statistics.push_to_newly_modified逻辑)
                    // 如果不是私人作品
                    const novelInfo = await trx('SELECT is_personal FROM novels WHERE novel_id = ?', [task.novel_id]);
                    if (novelInfo.length > 0 && novelInfo[0].is_personal == 0) {
                        await trx(
                            'DELETE FROM library_recommend WHERE title = \'最近更新\' AND novel_id = ?',
                            [task.novel_id]
                        );
                        await trx(
                            'INSERT INTO novel_updates (novel_id, time) VALUES (?, CURRENT_TIMESTAMP)',
                            [task.novel_id]
                        );
                        await trx('INSERT INTO library_recommend(novel_id,title) VALUES(?,?)', [
                            task.novel_id,
                            '最近更新',
                        ]);
                    }

                    // 6. 发送通知给收藏用户 (message.sendMsg逻辑)
                    const users = await trx(
                        'SELECT user_id FROM bookcase WHERE novel_id = ?',
                        [task.novel_id]
                    );
                    
                    for (const u of users) {
                        // 检查是否在1小时内已发送过相同消息
                        const content = '你收藏的作品《' + task.novel_name + '》更新了，快去看看吧！';
                        const existingMsg = await trx(
                            'SELECT * FROM user_message WHERE from_id = ? AND to_id = ? AND message_content = ? AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(`time`) < 3600',
                            [task.author_id, u.user_id, content]
                        );
                        
                        if (existingMsg.length == 0) {
                            await trx(
                                'INSERT INTO user_message(from_id,to_id,message_content,router,message_type) VALUES(?,?,?,?,?)',
                                [task.author_id, u.user_id, content, 'readers/bookInfo?id=' + task.novel_id, 'followed']
                            );
                        }
                    }

                }, `Scheduled Publish Task ${task.task_id}`);
                console.log(`任务 ${task.task_id} 执行成功`);
            } catch (error) {
                console.error(`任务 ${task.task_id} 执行失败:`, error);
                // 标记任务失败，避免重复执行
                await query(
                    'UPDATE scheduled_publish_tasks SET status = "failed" WHERE task_id = ?',
                    [task.task_id]
                );
            }
        }
        
        event.result = "success";
        return event;
    } catch (e) {
        console.error("定时发布任务执行出错:", e);
        event.result = "error";
        return event;
    }
};
