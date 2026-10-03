const { query } = require('../sql.js');

const LEGACY_LOCK_MODE = 'legacy_lock';
const REALTIME_CRDT_MODE = 'realtime_crdt';

async function getArticleCollaborationState(articleId) {
	const rows = await query(
		`SELECT
			COALESCE(acm.mode, 'legacy_lock') AS mode,
			acd.revision,
			acd.live_writer_id,
			acd.checkpoint_writer_id,
			acd.checkpoint_revision,
			acd.updated_at
		FROM articles a
		LEFT JOIN article_collaboration_modes acm ON acm.article_id = a.article_id
		LEFT JOIN article_collab_documents acd ON acd.article_id = a.article_id
		WHERE a.article_id = ?
		LIMIT 1`,
		[Number(articleId)],
	);
	if (!rows[0]) return null;
	return {
		mode: rows[0].mode || LEGACY_LOCK_MODE,
		revision: Number(rows[0].revision || 0),
		liveWriterId: Number(rows[0].live_writer_id || 0) || null,
		checkpointWriterId: Number(rows[0].checkpoint_writer_id || 0) || null,
		checkpointRevision: Number(rows[0].checkpoint_revision || 0),
		updatedAt: rows[0].updated_at || null,
	};
}

async function getRealtimeProjection(articleId) {
	const rows = await query(
		`SELECT
			acd.revision,
			acd.live_writer_id,
			aw.title,
			aw.content,
			aw.content_hash,
			aw.create_time,
			aw.updated_at
		FROM article_collab_documents acd
		INNER JOIN articles_writer aw ON aw.id = acd.live_writer_id
		WHERE acd.article_id = ?
		LIMIT 1`,
		[Number(articleId)],
	);
	if (!rows[0]) return null;
	return {
		revision: Number(rows[0].revision || 0),
		writerId: Number(rows[0].live_writer_id),
		title: rows[0].title || '',
		content: rows[0].content || '[]',
		contentHash: rows[0].content_hash || '',
		createTime: rows[0].create_time || '',
		updatedAt: rows[0].updated_at || null,
	};
}

function serializeArticleCollaborationState(state) {
	const value = state || { mode: LEGACY_LOCK_MODE };
	return {
		mode: value.mode || LEGACY_LOCK_MODE,
		revision: Number(value.revision || 0),
		writer_id: value.liveWriterId || null,
		checkpoint_writer_id: value.checkpointWriterId || null,
		checkpoint_revision: Number(value.checkpointRevision || 0),
		updated_at: value.updatedAt || null,
	};
}

module.exports = {
	LEGACY_LOCK_MODE,
	REALTIME_CRDT_MODE,
	getArticleCollaborationState,
	getRealtimeProjection,
	serializeArticleCollaborationState,
};
