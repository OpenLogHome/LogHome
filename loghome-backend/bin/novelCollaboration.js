const { query } = require('../sql.js');

const COLLABORATOR_STATUS = {
	PENDING: 'pending',
	ACTIVE: 'active',
	REJECTED: 'rejected',
	REMOVED: 'removed',
};

const LOCK_STATUS = {
	ACTIVE: 'active',
	RELEASED: 'released',
	EXPIRED: 'expired',
};

const DEFAULT_LOCK_TTL_SECONDS = 60;

function normalizePermissionFlag(value) {
	return Number(value) === 1;
}

function normalizeUser(rawUser) {
	if (!rawUser) return null;
	if (Array.isArray(rawUser)) {
		return rawUser.length > 0 ? rawUser[0] : null;
	}
	return rawUser;
}

function buildAccessPayload(row, userId) {
	if (!row) return null;

	const normalizedUserId = Number(userId);
	const ownerId = Number(row.author_id);
	const membershipStatus = row.collaborator_status || null;
	const isOwner = ownerId === normalizedUserId;
	const isActiveCollaborator =
		!isOwner && membershipStatus === COLLABORATOR_STATUS.ACTIVE;
	const isPendingInvitee =
		!isOwner && membershipStatus === COLLABORATOR_STATUS.PENDING;
	const collaboratorPermissions = {
		can_edit_article:
			isActiveCollaborator && normalizePermissionFlag(row.can_edit_article),
		can_add_article:
			isActiveCollaborator && normalizePermissionFlag(row.can_add_article),
		can_delete_article:
			isActiveCollaborator && normalizePermissionFlag(row.can_delete_article),
		can_sort_article:
			isActiveCollaborator && normalizePermissionFlag(row.can_sort_article),
		can_publish_article:
			isActiveCollaborator && normalizePermissionFlag(row.can_publish_article),
	};
	const accessRole = isOwner
		? 'owner'
		: isActiveCollaborator
			? 'collaborator'
			: isPendingInvitee
				? 'invitee'
				: 'none';
	const canAddArticle = isOwner || collaboratorPermissions.can_add_article;
	const canDeleteArticle = isOwner || collaboratorPermissions.can_delete_article;
	const canSortArticle = isOwner || collaboratorPermissions.can_sort_article;
	const canPublishArticle = isOwner || collaboratorPermissions.can_publish_article;
	const canEditArticle = isOwner || collaboratorPermissions.can_edit_article;

	return {
		viewer_user_id: normalizedUserId,
		novel_id: Number(row.novel_id),
		author_id: ownerId,
		access_role: accessRole,
		collaborator_role: row.collaborator_role || null,
		collaborator_status: membershipStatus,
		can_view_novel: isOwner || isActiveCollaborator,
		can_view_articles: isOwner || isActiveCollaborator,
		can_edit_article: canEditArticle,
		can_edit_draft: canEditArticle,
		can_add_article: canAddArticle,
		can_delete_article: canDeleteArticle,
		can_sort_article: canSortArticle,
		can_publish_article: canPublishArticle,
		can_publish: canPublishArticle,
		can_manage_structure: canAddArticle || canDeleteArticle || canSortArticle,
		can_manage_collaborators: isOwner,
		can_respond_invitation: isPendingInvitee,
		is_owner: isOwner,
		is_collaborator: isActiveCollaborator,
	};
}

async function getNovelAccess(userId, novelId) {
	const rows = await query(
		`SELECT
			n.novel_id,
			n.author_id,
			n.deleted,
			n.novel_type,
			nc.role AS collaborator_role,
			nc.status AS collaborator_status,
			nc.can_edit_article,
			nc.can_add_article,
			nc.can_delete_article,
			nc.can_sort_article,
			nc.can_publish_article
		FROM novels n
		LEFT JOIN novel_collaborators nc
			ON nc.novel_id = n.novel_id
			AND nc.user_id = ?
		WHERE n.novel_id = ?
			AND n.deleted = 0
		LIMIT 1`,
		[userId, novelId],
	);

	if (!rows || rows.length === 0) {
		return null;
	}

	return buildAccessPayload(rows[0], userId);
}

async function getArticleAccess(userId, articleId) {
	const rows = await query(
		`SELECT
			a.article_id,
			a.novel_id,
			a.article_type,
			a.deleted AS article_deleted,
			n.author_id,
			n.deleted AS novel_deleted,
			n.novel_type,
			nc.role AS collaborator_role,
			nc.status AS collaborator_status,
			nc.can_edit_article,
			nc.can_add_article,
			nc.can_delete_article,
			nc.can_sort_article,
			nc.can_publish_article
		FROM articles a
		INNER JOIN novels n ON n.novel_id = a.novel_id
		LEFT JOIN novel_collaborators nc
			ON nc.novel_id = n.novel_id
			AND nc.user_id = ?
		WHERE a.article_id = ?
		LIMIT 1`,
		[userId, articleId],
	);

	if (!rows || rows.length === 0) {
		return null;
	}

	const row = rows[0];
	if (Number(row.novel_deleted) === 1) {
		return null;
	}

	const access = buildAccessPayload(row, userId);
	if (!access) return null;

	return {
		...access,
		article_id: Number(row.article_id),
		article_type: row.article_type,
		article_deleted: Number(row.article_deleted) === 1,
	};
}

function canViewNovel(access) {
	return !!(access && access.can_view_novel);
}

function canViewArticles(access) {
	return !!(access && access.can_view_articles);
}

function canEditDraft(access) {
	return !!(access && access.can_edit_draft);
}

function canManageStructure(access) {
	return !!(access && access.can_manage_structure);
}

function canAddArticle(access) {
	return !!(access && access.can_add_article);
}

function canDeleteArticle(access) {
	return !!(access && access.can_delete_article);
}

function canSortArticle(access) {
	return !!(access && access.can_sort_article);
}

function canPublish(access) {
	return !!(access && access.can_publish);
}

function canManageCollaborators(access) {
	return !!(access && access.can_manage_collaborators);
}

function canRespondInvitation(access) {
	return !!(access && access.can_respond_invitation);
}

function serializeAccess(access) {
	if (!access) return null;

	return {
		novel_id: Number(access.novel_id),
		author_id: Number(access.author_id),
		access_role: access.access_role,
		collaborator_role: access.collaborator_role || null,
		collaborator_status: access.collaborator_status || null,
		can_view_novel: !!access.can_view_novel,
		can_view_articles: !!access.can_view_articles,
		can_edit_article: !!access.can_edit_article,
		can_edit_draft: !!access.can_edit_draft,
		can_add_article: !!access.can_add_article,
		can_delete_article: !!access.can_delete_article,
		can_sort_article: !!access.can_sort_article,
		can_publish_article: !!access.can_publish_article,
		can_publish: !!access.can_publish,
		can_manage_structure: !!access.can_manage_structure,
		can_manage_collaborators: !!access.can_manage_collaborators,
		can_respond_invitation: !!access.can_respond_invitation,
		is_owner: !!access.is_owner,
		is_collaborator: !!access.is_collaborator,
	};
}

async function listNovelCollaborators(novelId, options = {}) {
	const includeHidden = options.includeHidden === true;
	const viewerAccess = options.viewerAccess || null;

	let sql = `SELECT
		nc.id,
		nc.novel_id,
		nc.user_id,
		nc.role,
		nc.status,
		nc.can_edit_article,
		nc.can_add_article,
		nc.can_delete_article,
		nc.can_sort_article,
		nc.can_publish_article,
		nc.invited_by,
		nc.invited_at,
		nc.accepted_at,
		u.name,
		u.avatar_url,
		u.account
	FROM novel_collaborators nc
	INNER JOIN users u ON u.user_id = nc.user_id
	WHERE nc.novel_id = ?`;
	const params = [novelId];

	if (!includeHidden) {
		sql += ` AND nc.status IN (?, ?)`;
		params.push(
			COLLABORATOR_STATUS.PENDING,
			COLLABORATOR_STATUS.ACTIVE,
		);
	}

	if (viewerAccess && viewerAccess.access_role === 'collaborator') {
		sql += ` AND nc.status = ?`;
		params.push(COLLABORATOR_STATUS.ACTIVE);
	} else if (viewerAccess && viewerAccess.access_role === 'invitee') {
		sql += ` AND nc.user_id = ?`;
		params.push(viewerAccess.viewer_user_id);
	}

	sql += ` ORDER BY
		CASE nc.status
			WHEN '${COLLABORATOR_STATUS.ACTIVE}' THEN 0
			WHEN '${COLLABORATOR_STATUS.PENDING}' THEN 1
			ELSE 2
		END,
		nc.accepted_at DESC,
		nc.invited_at DESC`;

	return query(sql, params);
}

async function expireArticleEditLocks(articleId = null) {
	let sql =
		'UPDATE article_edit_locks SET status = ? WHERE status = ? AND expires_at <= CURRENT_TIMESTAMP';
	const params = [LOCK_STATUS.EXPIRED, LOCK_STATUS.ACTIVE];

	if (articleId != null) {
		sql += ' AND article_id = ?';
		params.push(articleId);
	}

	return query(sql, params);
}

async function getActiveArticleEditLock(articleId) {
	await expireArticleEditLocks(articleId);

	const rows = await query(
		`SELECT
			l.lock_id,
			l.article_id,
			l.novel_id,
			l.user_id,
			l.session_id,
			l.status,
			l.created_at,
			l.updated_at,
			l.expires_at,
			u.name,
			u.avatar_url
		FROM article_edit_locks l
		INNER JOIN users u ON u.user_id = l.user_id
		WHERE l.article_id = ?
			AND l.status = ?
			AND l.expires_at > CURRENT_TIMESTAMP
		ORDER BY l.updated_at DESC, l.lock_id DESC
		LIMIT 1`,
		[articleId, LOCK_STATUS.ACTIVE],
	);

	return rows && rows.length > 0 ? rows[0] : null;
}

async function claimArticleEditLock({
	articleId,
	novelId,
	userId,
	sessionId,
	ttlSeconds = DEFAULT_LOCK_TTL_SECONDS,
}) {
	await expireArticleEditLocks(articleId);

	const activeLock = await getActiveArticleEditLock(articleId);
	if (activeLock && Number(activeLock.user_id) !== Number(userId)) {
		return {
			ok: false,
			reason: 'locked_by_other',
			lock: activeLock,
		};
	}

	const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

	if (activeLock && Number(activeLock.user_id) === Number(userId)) {
		await query(
			`UPDATE article_edit_locks
			SET session_id = ?, expires_at = ?, status = ?, novel_id = ?
			WHERE lock_id = ?`,
			[
				sessionId,
				expiresAt,
				LOCK_STATUS.ACTIVE,
				novelId,
				activeLock.lock_id,
			],
		);
	} else {
		await query(
			`INSERT INTO article_edit_locks(
				article_id,
				novel_id,
				user_id,
				session_id,
				status,
				expires_at
			) VALUES(?,?,?,?,?,?)`,
			[
				articleId,
				novelId,
				userId,
				sessionId,
				LOCK_STATUS.ACTIVE,
				expiresAt,
			],
		);
	}

	return {
		ok: true,
		lock: await getActiveArticleEditLock(articleId),
	};
}

async function heartbeatArticleEditLock({
	articleId,
	userId,
	sessionId,
	ttlSeconds = DEFAULT_LOCK_TTL_SECONDS,
}) {
	await expireArticleEditLocks(articleId);

	const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
	const result = await query(
		`UPDATE article_edit_locks
		SET expires_at = ?, status = ?
		WHERE article_id = ?
			AND user_id = ?
			AND session_id = ?
			AND status = ?
			AND expires_at > CURRENT_TIMESTAMP`,
		[
			expiresAt,
			LOCK_STATUS.ACTIVE,
			articleId,
			userId,
			sessionId,
			LOCK_STATUS.ACTIVE,
		],
	);

	if (!result || result.affectedRows === 0) {
		return {
			ok: false,
			reason: 'lock_not_found',
			lock: await getActiveArticleEditLock(articleId),
		};
	}

	return {
		ok: true,
		lock: await getActiveArticleEditLock(articleId),
	};
}

async function releaseArticleEditLock({ articleId, userId, sessionId }) {
	await expireArticleEditLocks(articleId);

	await query(
		`UPDATE article_edit_locks
		SET status = ?
		WHERE article_id = ?
			AND user_id = ?
			AND session_id = ?
			AND status = ?`,
		[
			LOCK_STATUS.RELEASED,
			articleId,
			userId,
			sessionId,
			LOCK_STATUS.ACTIVE,
		],
	);

	return {
		ok: true,
		lock: await getActiveArticleEditLock(articleId),
	};
}

module.exports = {
	COLLABORATOR_STATUS,
	DEFAULT_LOCK_TTL_SECONDS,
	LOCK_STATUS,
	canAddArticle,
	canDeleteArticle,
	canEditDraft,
	canManageCollaborators,
	canManageStructure,
	canPublish,
	canRespondInvitation,
	canSortArticle,
	canViewArticles,
	canViewNovel,
	claimArticleEditLock,
	expireArticleEditLocks,
	getActiveArticleEditLock,
	getArticleAccess,
	getNovelAccess,
	heartbeatArticleEditLock,
	listNovelCollaborators,
	normalizeUser,
	releaseArticleEditLock,
	serializeAccess,
};
