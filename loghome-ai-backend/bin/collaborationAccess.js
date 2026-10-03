const { query } = require('../sql');

const COLLABORATION_MODE_REALTIME = 'realtime_crdt';
const DOCUMENT_NAME_PATTERN = /^article:(\d+):v1$/;

function parseArticleDocumentName(documentName) {
	const match = DOCUMENT_NAME_PATTERN.exec(String(documentName || ''));
	const articleId = match ? Number(match[1]) : 0;
	return Number.isInteger(articleId) && articleId > 0 ? articleId : null;
}

function buildArticleDocumentName(articleId) {
	const normalizedId = Number(articleId);
	if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
		throw new Error('invalid article id');
	}
	return `article:${normalizedId}:v1`;
}

async function getArticleCollaborationAccess(userId, articleId) {
	const rows = await query(
		`SELECT
			a.article_id,
			a.novel_id,
			a.article_type,
			a.deleted AS article_deleted,
			n.author_id,
			n.deleted AS novel_deleted,
			nc.status AS collaborator_status,
			nc.can_edit_article,
			COALESCE(acm.mode, 'legacy_lock') AS collaboration_mode,
			(
				SELECT COUNT(*)
				FROM novel_collaborators active_nc
				WHERE active_nc.novel_id = n.novel_id
					AND active_nc.status = 'active'
			) AS active_collaborator_count,
			(
				SELECT COUNT(*)
				FROM membership_subscriptions ms
				WHERE ms.user_id = n.author_id
					AND ms.status = 'active'
					AND ms.starts_at <= NOW()
					AND ms.expires_at > NOW()
					AND ms.membership_type IN ('standard', 'super')
			) AS owner_membership_count
		FROM articles a
		INNER JOIN novels n ON n.novel_id = a.novel_id
		LEFT JOIN novel_collaborators nc
			ON nc.novel_id = n.novel_id AND nc.user_id = ?
		LEFT JOIN article_collaboration_modes acm
			ON acm.article_id = a.article_id
		WHERE a.article_id = ?
		LIMIT 1`,
		[Number(userId), Number(articleId)],
	);
	if (!rows[0]) return null;

	const row = rows[0];
	const isOwner = Number(row.author_id) === Number(userId);
	const membershipRestricted = Number(row.active_collaborator_count) + 1 > 2
		&& Number(row.owner_membership_count) === 0;
	const isCollaborator = row.collaborator_status === 'active';
	const canEdit = isOwner || (
		isCollaborator
		&& !membershipRestricted
		&& Number(row.can_edit_article) === 1
	);

	return {
		articleId: Number(row.article_id),
		novelId: Number(row.novel_id),
		authorId: Number(row.author_id),
		articleType: row.article_type,
		collaborationMode: row.collaboration_mode,
		isOwner,
		canView: isOwner || isCollaborator,
		canEdit,
		deleted: Number(row.article_deleted) === 1 || Number(row.novel_deleted) === 1,
	};
}

module.exports = {
	COLLABORATION_MODE_REALTIME,
	buildArticleDocumentName,
	getArticleCollaborationAccess,
	parseArticleDocumentName,
};
