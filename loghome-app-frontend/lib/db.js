// db.js
import Dexie from 'dexie';

const articleDB = new Dexie('loghomeArticleDatabase');
articleDB.version(1).stores({
  articles: 'article_id, article_type, title, content, novel_id, article_chapter, update_time',
  novels: 'novel_id, name, content, author_id, picUrl, create_time, update_time, is_complete, text_count, novel_type'
});

const imgDB = new Dexie('loghomeImgDatabase');
imgDB.version(1).stores({
  imgs: 'img_url, img_hash, img_blob, last_accessed_time',
});

const writerArticleDB = new Dexie('writerArticleDB');
writerArticleDB.version(1).stores({
  articles: `article_id, article_type, title, content, novel_id, article_chapter, create_time`
})

export { articleDB, imgDB, writerArticleDB };
