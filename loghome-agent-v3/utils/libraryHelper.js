import pool from './db.js';

function normalizeKeywords(input) {
    const values = Array.isArray(input) ? input : [input];
    return [...new Set(
        values
            .flatMap((value) => String(value || '').split(/\s+/))
            .map((item) => item.trim())
            .filter(Boolean)
    )];
}

function parseTags(tagString) {
    if (!tagString) return [];
    return tagString
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function collectTextFragments(node, fragments = [], depth = 0) {
    if (depth > 6 || node === null || node === undefined) {
        return fragments;
    }

    if (typeof node === 'string') {
        const text = node.trim();
        if (text) {
            fragments.push(text);
        }
        return fragments;
    }

    if (typeof node === 'number' || typeof node === 'boolean') {
        fragments.push(String(node));
        return fragments;
    }

    if (Array.isArray(node)) {
        for (const item of node) {
            collectTextFragments(item, fragments, depth + 1);
        }
        return fragments;
    }

    if (typeof node === 'object') {
        for (const value of Object.values(node)) {
            collectTextFragments(value, fragments, depth + 1);
        }
    }

    return fragments;
}

function extractPlainText(content) {
    if (content === null || content === undefined) {
        return '';
    }

    if (typeof content !== 'string') {
        return collectTextFragments(content).join(' ').replace(/\s+/g, ' ').trim();
    }

    const trimmed = content.trim();
    if (!trimmed) {
        return '';
    }

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
            const parsed = JSON.parse(trimmed);
            return collectTextFragments(parsed).join(' ').replace(/\s+/g, ' ').trim();
        } catch (error) {
            // Fall through to raw text when the content is not valid JSON.
        }
    }

    return trimmed.replace(/\s+/g, ' ').trim();
}

function countKeywordMatches(text, keywords) {
    const lower = String(text || '').toLowerCase();
    let count = 0;
    for (const keyword of keywords) {
        const needle = keyword.toLowerCase();
        if (!needle) continue;
        count += lower.split(needle).length - 1;
    }
    return count;
}

function buildSnippet(text, keywords, maxLength = 180) {
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return '';

    const lower = normalized.toLowerCase();
    let index = -1;
    for (const keyword of keywords) {
        const foundIndex = lower.indexOf(keyword.toLowerCase());
        if (foundIndex !== -1 && (index === -1 || foundIndex < index)) {
            index = foundIndex;
        }
    }

    if (index === -1) {
        return normalized.slice(0, maxLength);
    }

    const start = Math.max(0, index - 40);
    const end = Math.min(normalized.length, start + maxLength);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < normalized.length ? '...' : '';
    return `${prefix}${normalized.slice(start, end)}${suffix}`;
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

export async function getNovelProfile(novelId) {
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
        const [rows] = await pool.query(sql, [novelId]);
        return rows.length > 0 ? serializeNovelRow(rows[0]) : null;
    } catch (error) {
        console.error("Error getting novel profile:", error);
        return null;
    }
}

export async function getNovelInfo(novelId) {
    return getNovelProfile(novelId);
}

export async function searchNovelsByName(name) {
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
            WHERE n.deleted = 0
                AND n.name LIKE ?
            ORDER BY n.update_time DESC
            LIMIT 5
        `;
        const [rows] = await pool.query(sql, [`%${name}%`]);
        return rows.map(serializeNovelRow);
    } catch (error) {
        console.error("Error searching novels by name:", error);
        return [];
    }
}

export async function searchNovelsByKeyword(keywordInput) {
    try {
        const keywords = normalizeKeywords(keywordInput);
        if (keywords.length === 0) return [];

        const conditions = keywords.map(() => `(a.title LIKE ? OR a.content LIKE ? OR n.name LIKE ? OR n.content LIKE ?)`).join(' OR ');
        const params = [];
        for (const keyword of keywords) {
            const like = `%${keyword}%`;
            params.push(like, like, like, like);
        }

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
                m.match_count,
                (
                    SELECT COUNT(*)
                    FROM articles a2
                    WHERE a2.novel_id = n.novel_id
                        AND a2.deleted = 0
                        AND a2.is_draft = 0
                        AND a2.article_type = 'richtext'
                ) AS chapter_count,
                (
                    SELECT MAX(a2.article_chapter)
                    FROM articles a2
                    WHERE a2.novel_id = n.novel_id
                        AND a2.deleted = 0
                        AND a2.is_draft = 0
                        AND a2.article_type = 'richtext'
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
                    INNER JOIN articles a3 ON a3.article_id = af.article_id
                    WHERE a3.novel_id = n.novel_id
                        AND a3.deleted = 0
                        AND af.status = 0
                ) AS pending_feedback_count,
                (
                    SELECT GROUP_CONCAT(DISTINCT t.tag_name ORDER BY t.tag_name SEPARATOR ', ')
                    FROM novel_tag nt
                    INNER JOIN tags t ON t.tag_id = nt.tag_id
                    WHERE nt.novel_id = n.novel_id
                ) AS tags
            FROM novels n
            INNER JOIN (
                SELECT a.novel_id, COUNT(DISTINCT a.article_id) AS match_count
                FROM articles a
                INNER JOIN novels n ON n.novel_id = a.novel_id
                WHERE a.deleted = 0
                    AND a.is_draft = 0
                    AND a.article_type = 'richtext'
                    AND (${conditions})
                GROUP BY a.novel_id
            ) m ON m.novel_id = n.novel_id
            LEFT JOIN users u ON n.author_id = u.user_id
            WHERE n.deleted = 0
            ORDER BY m.match_count DESC, n.update_time DESC
            LIMIT 5
        `;

        const [rows] = await pool.query({
            sql,
            timeout: 60000,
            values: params,
        });

        return rows.map((row) => ({
            ...serializeNovelRow(row),
            match_count: Number(row.match_count || 0),
        }));
    } catch (error) {
        console.error("Error searching novels by keyword:", error);
        return [];
    }
}

export async function searchChapters(novelId, queryInput, page = 1, limit = 5) {
    try {
        const keywords = normalizeKeywords(queryInput);
        if (keywords.length === 0) {
            return { page, total: 0, count: 0, results: [] };
        }

        const conditions = keywords.map(() => `(a.title LIKE ? OR a.content LIKE ?)`).join(' OR ');
        const params = [novelId];
        for (const keyword of keywords) {
            const like = `%${keyword}%`;
            params.push(like, like);
        }

        const sql = `
            SELECT
                a.article_id,
                a.article_chapter,
                a.title,
                a.content,
                a.update_time
            FROM articles a
            WHERE a.novel_id = ?
                AND a.deleted = 0
                AND a.is_draft = 0
                AND a.article_type = 'richtext'
                AND (${conditions})
            ORDER BY a.article_chapter DESC
            LIMIT 120
        `;

        const [rows] = await pool.query({
            sql,
            timeout: 60000,
            values: params,
        });

        const rankedRows = rows.map((row) => {
            const title = row.title || '';
            const plainText = extractPlainText(row.content);
            const titleMatches = countKeywordMatches(title, keywords);
            const contentMatches = countKeywordMatches(plainText, keywords);
            const matchedFields = [];

            if (titleMatches > 0) matchedFields.push('title');
            if (contentMatches > 0) matchedFields.push('content');

            const allKeywordsCovered = keywords.every((keyword) => {
                const lower = keyword.toLowerCase();
                return title.toLowerCase().includes(lower) || plainText.toLowerCase().includes(lower);
            });

            const score = (titleMatches * 6) + (contentMatches * 2) + (allKeywordsCovered ? 4 : 0);

            return {
                article_id: Number(row.article_id),
                chapter: Number(row.article_chapter),
                title,
                update_time: row.update_time || null,
                matched_fields: matchedFields,
                matched_keywords: keywords.filter((keyword) => {
                    const lower = keyword.toLowerCase();
                    return title.toLowerCase().includes(lower) || plainText.toLowerCase().includes(lower);
                }),
                score,
                snippet: buildSnippet(plainText, keywords),
            };
        });

        rankedRows.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.chapter - a.chapter;
        });

        const start = Math.max(0, (page - 1) * limit);
        const results = rankedRows.slice(start, start + limit);
        return {
            page,
            total: rankedRows.length,
            count: results.length,
            results,
        };
    } catch (error) {
        console.error("Error searching chapters:", error);
        return { page, total: 0, count: 0, results: [], error: 'search failed' };
    }
}

export async function getFullChapter(novelId, options = {}) {
    try {
        const articleId = Number(options.article_id || 0);
        const chapter = Number(options.chapter || 0);

        if (!articleId && !chapter) {
            return {
                success: false,
                error: 'article_id or chapter is required',
            };
        }

        const whereClause = articleId ? 'a.article_id = ?' : 'a.article_chapter = ?';
        const value = articleId || chapter;
        const sql = `
            SELECT
                a.article_id,
                a.article_chapter,
                a.title,
                a.content,
                a.update_time
            FROM articles a
            WHERE a.novel_id = ?
                AND ${whereClause}
                AND a.deleted = 0
                AND a.is_draft = 0
                AND a.article_type = 'richtext'
            LIMIT 1
        `;

        const [rows] = await pool.query(sql, [novelId, value]);
        if (rows.length === 0) {
            return {
                success: false,
                error: 'chapter not found',
            };
        }

        const row = rows[0];
        const fullText = extractPlainText(row.content);
        return {
            success: true,
            article_id: Number(row.article_id),
            chapter: Number(row.article_chapter),
            title: row.title || '',
            update_time: row.update_time || null,
            text_length: fullText.length,
            full_text: fullText,
        };
    } catch (error) {
        console.error("Error getting full chapter:", error);
        return {
            success: false,
            error: 'get full chapter failed',
        };
    }
}

export async function getReaderFeedbackSummary(novelId, limit = 5) {
    try {
        const [statsRows] = await pool.query(
            `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM article_feedback af
                        INNER JOIN articles a ON a.article_id = af.article_id
                        WHERE a.novel_id = ?
                            AND a.deleted = 0
                    ) AS total_feedback_count,
                    (
                        SELECT COUNT(*)
                        FROM article_feedback af
                        INNER JOIN articles a ON a.article_id = af.article_id
                        WHERE a.novel_id = ?
                            AND a.deleted = 0
                            AND af.status = 0
                    ) AS pending_feedback_count,
                    (
                        SELECT COUNT(*)
                        FROM novel_comments nc
                        WHERE nc.novel_id = ?
                            AND nc.deleted = 0
                            AND nc.reply_to_id = -1
                    ) AS total_comment_count
            `,
            [novelId, novelId, novelId]
        );

        const [feedbackRows] = await pool.query(
            `
                SELECT
                    af.feedback_id,
                    af.article_id,
                    af.feedback_content,
                    af.paragraph_text,
                    af.status,
                    af.create_time,
                    a.article_chapter,
                    a.title
                FROM article_feedback af
                INNER JOIN articles a ON a.article_id = af.article_id
                WHERE a.novel_id = ?
                    AND a.deleted = 0
                ORDER BY af.status ASC, af.create_time DESC
                LIMIT ?
            `,
            [novelId, limit]
        );

        const [commentRows] = await pool.query(
            `
                SELECT
                    nc.essay_comment_id,
                    nc.article_id,
                    nc.content,
                    nc.comment_time,
                    nc.user_id,
                    nc.reply_to_id,
                    a.article_chapter,
                    a.title,
                    u.name AS user_name
                FROM novel_comments nc
                LEFT JOIN articles a ON a.article_id = nc.article_id
                LEFT JOIN users u ON u.user_id = nc.user_id
                WHERE nc.novel_id = ?
                    AND nc.deleted = 0
                    AND nc.reply_to_id = -1
                ORDER BY nc.comment_time DESC
                LIMIT ?
            `,
            [novelId, limit]
        );

        return {
            novel_id: Number(novelId),
            total_feedback_count: Number(statsRows[0]?.total_feedback_count || 0),
            pending_feedback_count: Number(statsRows[0]?.pending_feedback_count || 0),
            total_comment_count: Number(statsRows[0]?.total_comment_count || 0),
            feedbacks: feedbackRows.map((row) => ({
                feedback_id: Number(row.feedback_id),
                article_id: Number(row.article_id),
                chapter: row.article_chapter === null || row.article_chapter === undefined
                    ? null
                    : Number(row.article_chapter),
                title: row.title || null,
                feedback_content: row.feedback_content || '',
                paragraph_text: row.paragraph_text || '',
                status: Number(row.status || 0),
                create_time: row.create_time || null,
            })),
            comments: commentRows.map((row) => ({
                comment_id: Number(row.essay_comment_id),
                article_id: row.article_id ? Number(row.article_id) : null,
                chapter: row.article_chapter === null || row.article_chapter === undefined
                    ? null
                    : Number(row.article_chapter),
                title: row.title || null,
                user_id: row.user_id ? Number(row.user_id) : null,
                user_name: row.user_name || null,
                content: row.content || '',
                comment_time: row.comment_time || null,
            })),
        };
    } catch (error) {
        console.error("Error getting reader feedback summary:", error);
        return {
            novel_id: Number(novelId),
            total_feedback_count: 0,
            pending_feedback_count: 0,
            total_comment_count: 0,
            feedbacks: [],
            comments: [],
            error: 'feedback summary failed',
        };
    }
}
