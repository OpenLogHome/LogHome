/**
 * Library helper functions for novel information.
 */

const { query } = require('../sql');

function parseTags(tagString) {
  if (!tagString) return [];
  return tagString
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeNovelRow(row) {
  return {
    novel_id: Number(row.novel_id),
    name: row.name,
    description: row.content || '',
    author: row.author || null,
    update_time: row.update_time || null,
    is_complete: Number(row.is_complete || 0),
    is_personal: Number(row.is_personal || 0),
    text_count: Number(row.text_count || 0),
    chapter_count: Number(row.chapter_count || 0),
    latest_chapter: row.latest_chapter === null || row.latest_chapter === undefined
      ? null
      : Number(row.latest_chapter),
    bookcase_count: Number(row.bookcase_count || 0),
    comment_count: Number(row.comment_count || 0),
    pending_feedback_count: Number(row.pending_feedback_count || 0),
    tags: parseTags(row.tags),
  };
}

async function getNovelInfo(novelId) {
  try {
    const sql = `
      SELECT
        n.novel_id,
        n.name,
        n.content,
        n.update_time,
        n.is_complete,
        n.is_personal,
        n.text_count,
        u.name AS author,
        (
          SELECT COUNT(*)
          FROM articles a
          WHERE a.novel_id = n.novel_id
            AND a.deleted = 0
            AND a.is_draft = 0
            AND a.article_type = 'richtext'
        ) AS chapter_count,
        (
          SELECT MAX(a.article_chapter)
          FROM articles a
          WHERE a.novel_id = n.novel_id
            AND a.deleted = 0
            AND a.is_draft = 0
            AND a.article_type = 'richtext'
        ) AS latest_chapter,
        (
          SELECT COUNT(*)
          FROM bookcase b
          WHERE b.novel_id = n.novel_id
        ) AS bookcase_count,
        (
          SELECT COUNT(*)
          FROM novel_comments nc
          WHERE nc.novel_id = n.novel_id
            AND nc.deleted = 0
            AND nc.reply_to_id = -1
        ) AS comment_count,
        (
          SELECT COUNT(*)
          FROM article_feedback af
          INNER JOIN articles a2 ON a2.article_id = af.article_id
          WHERE a2.novel_id = n.novel_id
            AND a2.deleted = 0
            AND af.status = 0
        ) AS pending_feedback_count,
        (
          SELECT GROUP_CONCAT(DISTINCT t.tag_name ORDER BY t.tag_name SEPARATOR ', ')
          FROM novel_tag nt
          INNER JOIN tags t ON t.tag_id = nt.tag_id
          WHERE nt.novel_id = n.novel_id
        ) AS tags
      FROM novels n
      LEFT JOIN users u ON n.author_id = u.user_id
      WHERE n.novel_id = ?
        AND n.deleted = 0
      LIMIT 1
    `;
    const rows = await query(sql, [novelId]);
    return rows.length > 0 ? serializeNovelRow(rows[0]) : null;
  } catch (error) {
    console.error("Error getting novel info:", error);
    return null;
  }
}

module.exports = {
  getNovelInfo,
};