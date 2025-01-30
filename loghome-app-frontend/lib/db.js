// db.js
import Dexie from 'dexie';

const articleDB = new Dexie('loghomeArticleDatabase');
articleDB.version(1).stores({
  articles: 'article_id, article_type, title, content, novel_id, article_chapter, update_time',
  novels: 'novel_id, name, content, author_id, picUrl, create_time, update_time, is_complete, text_count, novel_type'
});

export { articleDB };