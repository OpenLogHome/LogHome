const express = require('express');
const { query } = require('../sql');
const { requireUser } = require('../bin/auth');
const {
	COLLABORATION_MODE_REALTIME,
	buildArticleDocumentName,
	getArticleCollaborationAccess,
} = require('../bin/collaborationAccess');
const {
	checkpointArticle,
	getCollaborationServer,
	getRealtimeArticlePresence,
	replaceArticleFromLegacy,
	reserveParagraphIds,
	restoreArticleFromWriter,
} = require('../bin/collaborationService');

const router = express.Router();

function sendError(res, error) {
	console.error('collaboration request failed:', error);
	return res.status(Number(error.status) || 500).json({
		msg: error.message || '服务器错误',
		code: error.code || 'collaboration_error',
	});
}

router.post('/presence', requireUser, async (req, res) => {
	const articleIds = Array.from(new Set((Array.isArray(req.body.article_ids)
		? req.body.article_ids
		: [])
		.map((articleId) => Number(articleId))
		.filter((articleId) => Number.isInteger(articleId) && articleId > 0)))
		.slice(0, 200);
	if (articleIds.length === 0) {
		return res.json({ msg: 'ok', data: {} });
	}

	try {
		const placeholders = articleIds.map(() => '?').join(',');
		const rows = await query(
			`SELECT a.article_id
			FROM articles a
			INNER JOIN novels n ON n.novel_id = a.novel_id
			LEFT JOIN novel_collaborators nc
				ON nc.novel_id = n.novel_id AND nc.user_id = ?
			INNER JOIN article_collaboration_modes acm
				ON acm.article_id = a.article_id AND acm.mode = ?
			WHERE a.article_id IN (${placeholders})
				AND a.deleted = 0
				AND n.deleted = 0
				AND (n.author_id = ? OR nc.status = 'active')`,
			[
				Number(req.user.user_id),
				COLLABORATION_MODE_REALTIME,
				...articleIds,
				Number(req.user.user_id),
			],
		);
		const accessibleArticleIds = rows.map((row) => Number(row.article_id));
		return res.json({
			msg: 'ok',
			data: getRealtimeArticlePresence(accessibleArticleIds),
		});
	} catch (error) {
		return sendError(res, error);
	}
});

router.get('/articles/:articleId/status', requireUser, async (req, res) => {
	const articleId = Number(req.params.articleId);
	try {
		const access = await getArticleCollaborationAccess(req.user.user_id, articleId);
		if (!access || access.deleted || !access.canView) {
			return res.status(403).json({ msg: 'access denied', code: 'access_denied' });
		}
		const rows = await query(
			`SELECT revision, live_writer_id, checkpoint_writer_id, checkpoint_revision, updated_at
			FROM article_collab_documents WHERE article_id = ? LIMIT 1`,
			[articleId],
		);
		return res.json({
			msg: 'ok',
			data: {
				article_id: articleId,
				mode: access.collaborationMode,
				document_name: buildArticleDocumentName(articleId),
				can_edit: access.canEdit,
				revision: Number(rows[0] && rows[0].revision || 0),
				writer_id: Number(rows[0] && rows[0].live_writer_id || 0) || null,
				checkpoint_writer_id: Number(rows[0] && rows[0].checkpoint_writer_id || 0) || null,
				checkpoint_revision: Number(rows[0] && rows[0].checkpoint_revision || 0),
				updated_at: rows[0] && rows[0].updated_at || null,
			},
		});
	} catch (error) {
		return sendError(res, error);
	}
});

router.post('/articles/:articleId/mode', requireUser, async (req, res) => {
	const articleId = Number(req.params.articleId);
	const mode = req.body.mode === COLLABORATION_MODE_REALTIME
		? COLLABORATION_MODE_REALTIME
		: 'legacy_lock';
	try {
		const access = await getArticleCollaborationAccess(req.user.user_id, articleId);
		if (!access || access.deleted || !access.isOwner) {
			return res.status(403).json({ msg: 'only the owner can change collaboration mode' });
		}
		if (!['text', 'richtext'].includes(String(access.articleType || 'richtext'))) {
			return res.status(400).json({
				msg: 'this article type does not support realtime collaboration',
				code: 'unsupported_article_type',
			});
		}
		if (mode === COLLABORATION_MODE_REALTIME) {
			if (!getCollaborationServer()) {
				return res.status(503).json({
					msg: 'collaboration server is disabled',
					code: 'collaboration_disabled',
				});
			}
			const lockRows = await query(
				`SELECT lock_id, user_id, expires_at
				FROM article_edit_locks
				WHERE article_id = ? AND status = 'active' AND expires_at > NOW()
				LIMIT 1`,
				[articleId],
			);
			if (lockRows[0]) {
				return res.status(409).json({
					msg: 'wait for the legacy editor to leave before enabling realtime collaboration',
					code: 'legacy_editor_active',
				});
			}
		} else if (access.collaborationMode === COLLABORATION_MODE_REALTIME) {
			await checkpointArticle(articleId, req.user);
		}
		await query(
			`INSERT INTO article_collaboration_modes(article_id, mode, enabled_by, enabled_at)
			VALUES(?, ?, ?, IF(? = 'realtime_crdt', NOW(), NULL))
			ON DUPLICATE KEY UPDATE
				mode = VALUES(mode), enabled_by = VALUES(enabled_by),
				enabled_at = IF(VALUES(mode) = 'realtime_crdt', COALESCE(enabled_at, NOW()), NULL)`,
			[articleId, mode, req.user.user_id, mode],
		);
		if (mode !== COLLABORATION_MODE_REALTIME) {
			const server = getCollaborationServer();
			if (server) server.hocuspocus.closeConnections(buildArticleDocumentName(articleId));
		}
		return res.json({ msg: 'ok', data: { article_id: articleId, mode } });
	} catch (error) {
		return sendError(res, error);
	}
});

router.post('/articles/:articleId/checkpoint', requireUser, async (req, res) => {
	try {
		const result = await checkpointArticle(Number(req.params.articleId), req.user);
		return res.json({ msg: 'ok', data: {
			article_id: result.articleId,
			revision: result.revision,
			writer_id: result.writerId,
			checkpoint_writer_id: result.checkpointWriterId,
			title: result.title,
			content: result.content,
			content_hash: result.contentHash,
		} });
	} catch (error) {
		return sendError(res, error);
	}
});

router.post('/articles/:articleId/paragraph-id-range', requireUser, async (req, res) => {
	try {
		const range = await reserveParagraphIds(
			Number(req.params.articleId),
			req.body.size,
			req.user,
		);
		return res.json({ msg: 'ok', data: range });
	} catch (error) {
		return sendError(res, error);
	}
});

router.post('/articles/:articleId/restore', requireUser, async (req, res) => {
	try {
		const result = await restoreArticleFromWriter(
			Number(req.params.articleId),
			Number(req.body.writer_id),
			req.user,
		);
		return res.json({ msg: 'ok', data: {
			article_id: result.articleId,
			revision: result.revision,
			checkpoint_writer_id: result.checkpointWriterId,
		} });
	} catch (error) {
		return sendError(res, error);
	}
});

router.post('/articles/:articleId/replace', requireUser, async (req, res) => {
	try {
		const result = await replaceArticleFromLegacy(
			Number(req.params.articleId),
			req.body.title,
			req.body.content,
			req.user,
		);
		return res.json({ msg: 'ok', data: {
			article_id: result.articleId,
			revision: result.revision,
			checkpoint_writer_id: result.checkpointWriterId,
		} });
	} catch (error) {
		return sendError(res, error);
	}
});

module.exports = router;
