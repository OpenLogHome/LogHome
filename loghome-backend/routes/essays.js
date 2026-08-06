// 引入依赖包
let express = require('express');
let { query, withTransaction } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');
let config = require('../config');
let message = require('../bin/message.js');
let statistics = require('../bin/statistics');
let bank = require('../bin/bank.js');
const membership = require('../bin/membership.js');
const {
	ensureAgentMemorySchema,
	getNovelIndexingStatus,
	requestNovelIndexing,
} = require('../bin/agentIndexing.js');
const {
	COLLABORATOR_STATUS,
	DEFAULT_LOCK_TTL_SECONDS,
	buildAccessPayload,
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
	projectCollaborationPolicy,
	releaseArticleEditLock,
	serializeAccess,
} = require('../bin/novelCollaboration.js');
const {
	decodeBase64Image,
	ensureImageDominantColor,
} = require('../bin/image-dominant-color.js');
const {
	correctArticleContent,
	correctParagraphs,
} = require('../bin/baiduTextCorrection.js');
const {
	calculateContentHash: calculateArticleContentHash,
	ensureArticleParagraphIds: ensureArticleParagraphIdsForStorage,
} = require('../bin/articleParagraphIds.js');
const fs = require('fs'); // 引入文件系统模块
const compressing = require('compressing');
const path = require('path');
const crypto = require('crypto'); // 引入crypto模块用于md5
const memoryDatabase = config.memoryDatabase || 'loghome-agent-memory';
const WRITING_ACTIVITY_TIMEZONE = 'Asia/Shanghai';
const WRITING_ACTIVITY_FULL_SECONDS = 30 * 60;
const WRITING_ACTIVITY_FULL_CHARS = 3000;
const WRITING_ACTIVITY_MID_SECONDS = 15 * 60;
const WRITING_ACTIVITY_MID_CHARS = 1500;
const WRITING_ACTIVITY_MAX_REPORT_SECONDS = 5 * 60;
const WRITING_ACTIVITY_MAX_REPORT_CHARS = 100000;
const WRITING_ACTIVITY_MAX_BACKFILL_DAYS = 370;
const WRITING_ACTIVITY_TRACKING_STARTED_ON =
	process.env.WRITING_ACTIVITY_TRACKING_STARTED_ON || '2026-08-02';

function formatDateKeyInTimezone(date, timezone = WRITING_ACTIVITY_TIMEZONE) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);
	const values = {};
	parts.forEach((part) => {
		if (part.type !== 'literal') values[part.type] = part.value;
	});
	return `${values.year}-${values.month}-${values.day}`;
}

function parseDateKey(rawDate) {
	const dateKey = String(rawDate || '').trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
	const date = new Date(`${dateKey}T00:00:00.000Z`);
	if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateKey) {
		return null;
	}
	return date;
}

function shiftDateKey(dateKey, amount) {
	const date = parseDateKey(dateKey);
	if (!date) return null;
	date.setUTCDate(date.getUTCDate() + Number(amount || 0));
	return date.toISOString().slice(0, 10);
}

function resolveWritingActivityDate(rawDate) {
	const todayKey = formatDateKeyInTimezone(new Date());
	const today = parseDateKey(todayKey);
	const requested = parseDateKey(rawDate);
	if (!requested) return todayKey;

	const differenceDays = Math.round(
		(requested.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
	);
	if (
		differenceDays > 0 ||
		differenceDays < -WRITING_ACTIVITY_MAX_BACKFILL_DAYS
	) {
		return todayKey;
	}
	return requested.toISOString().slice(0, 10);
}

function calculateWritingActivityLevel(activeSeconds, writtenChars) {
	const seconds = Math.max(0, Number(activeSeconds || 0));
	const chars = Math.max(0, Number(writtenChars || 0));
	if (seconds <= 0 && chars <= 0) return 0;
	if (
		seconds >= WRITING_ACTIVITY_FULL_SECONDS ||
		chars >= WRITING_ACTIVITY_FULL_CHARS
	) {
		return 3;
	}
	if (
		seconds >= WRITING_ACTIVITY_MID_SECONDS ||
		chars >= WRITING_ACTIVITY_MID_CHARS
	) {
		return 2;
	}
	return 1;
}

/**
 * 计算内容的MD5哈希值
 * @param {string} content - 要计算哈希的内容
 * @returns {string} MD5哈希值
 */
function calculateContentHash(content) {
    return calculateArticleContentHash(content);
}

function parsePositiveParagraphId(rawId) {
	if (rawId === null || rawId === undefined || rawId === '') {
		return null;
	}

	const normalizedId = Number(rawId);
	return Number.isInteger(normalizedId) && normalizedId > 0
		? normalizedId
		: null;
}

function ensureArticleParagraphIds(content) {
	return ensureArticleParagraphIdsForStorage(content);
}

function currentTime()  
{   
    var now = new Date();  
         
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
         
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss=now.getSeconds();            //秒  
         
    var clock = year + "-";  
         
    if(month < 10) clock += "0";         
    clock += month + "-";  
         
    if(day < 10) clock += "0";   
    clock += day + " ";  
         
    if(hh < 10) clock += "0";  
    clock += hh + ":";  
  
    if (mm < 10) clock += '0';   
    clock += mm+ ":";  
          
    if (ss < 10) clock += '0';   
    clock += ss;  
  
    return(clock);   
}  

function currentCompactTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function normalizeWriterCreateTime(rawCreateTime) {
	const normalized = String(rawCreateTime || '').replace(/\D/g, '').slice(0, 14);
	return normalized || currentCompactTime();
}

const WRITER_LEGACY_TIME_SQL_FORMAT = '%Y%m%d%H%i%s';

function buildWriterUpdatedAtExpression(alias = 'aw') {
	return `COALESCE(${alias}.updated_at, STR_TO_DATE(${alias}.create_time, '${WRITER_LEGACY_TIME_SQL_FORMAT}'))`;
}

function buildLatestWriterIdSubquery(articleIdExpression, options = {}) {
	const writerAlias = options.writerAlias || 'aw_latest';
	const includeNovelCheck = options.includeNovelCheck === true;
	const joinSql = includeNovelCheck
		? `INNER JOIN novels n_${writerAlias} ON n_${writerAlias}.novel_id = ${writerAlias}.novel_id`
		: '';
	const novelWhereSql = includeNovelCheck ? `AND n_${writerAlias}.deleted = 0` : '';

	return `(
		SELECT ${writerAlias}.id
		FROM articles_writer ${writerAlias}
		${joinSql}
		WHERE ${writerAlias}.article_id = ${articleIdExpression}
			${novelWhereSql}
		ORDER BY ${buildWriterUpdatedAtExpression(writerAlias)} DESC, ${writerAlias}.id DESC
		LIMIT 1
	)`;
}

function shouldMirrorWriterDraftForArticleType(articleType) {
	const normalizedType = String(articleType || '').trim();
	return !normalizedType || normalizedType === 'text' || normalizedType === 'richtext';
}

function serializeWriterSnapshotMeta(row) {
	if (!row) {
		return null;
	}

	return {
		id: Number(row.id),
		article_id: Number(row.article_id),
		create_time: row.create_time || '',
		updated_at: row.updated_at || null,
		content_hash: row.content_hash || null,
		title: row.title || '',
		editor_user_id: row.editor_user_id ? Number(row.editor_user_id) : null,
		edit_session_id: row.edit_session_id || null,
	};
}

async function getWriterSnapshotMetaById(writerId) {
	if (!writerId) {
		return null;
	}

	const rows = await query(
		`SELECT
			id,
			article_id,
			create_time,
			updated_at,
			content_hash,
			title,
			editor_user_id,
			edit_session_id
		FROM articles_writer
		WHERE id = ?
		LIMIT 1`,
		[writerId],
	);

	return serializeWriterSnapshotMeta(rows[0] || null);
}

async function getLatestWriterSnapshotMeta(articleId) {
	const rows = await query(
		`SELECT
			id,
			article_id,
			create_time,
			updated_at,
			content_hash,
			title,
			editor_user_id,
			edit_session_id
		FROM articles_writer
		WHERE article_id = ?
		ORDER BY ${buildWriterUpdatedAtExpression('articles_writer')} DESC, id DESC
		LIMIT 1`,
		[articleId],
	);

	return serializeWriterSnapshotMeta(rows[0] || null);
}

async function validateActiveEditSession({
	articleId,
	userId,
	sessionId,
	required = false,
}) {
	if (!sessionId) {
		if (!required) {
			return {
				ok: true,
				lock: null,
			};
		}

		return {
			ok: false,
			status: 400,
			body: {
				msg: 'edit_session_id is required',
				code: 'edit_session_required',
			},
		};
	}

	const activeLock = await getActiveArticleEditLock(articleId);
	if (
		!activeLock ||
		Number(activeLock.user_id) !== Number(userId) ||
		String(activeLock.session_id || '').trim() !== String(sessionId).trim()
	) {
		return {
			ok: false,
			status: 409,
			body: {
				msg: 'stale_session',
				code: 'stale_session',
				lock: serializeEditLock(activeLock),
			},
		};
	}

	return {
		ok: true,
		lock: activeLock,
	};
}

async function mirrorWriterDraftSnapshot({
	articleId,
	novelId,
	title,
	content,
	contentHash,
	createTime,
	editorUserId,
	editSessionId,
}) {
	const normalizedCreateTime = normalizeWriterCreateTime(createTime);
	const latestRows = await query(
		`SELECT id, title, content, content_hash
		FROM articles_writer
		WHERE article_id = ?
		ORDER BY ${buildWriterUpdatedAtExpression('articles_writer')} DESC, id DESC
		LIMIT 1`,
		[articleId],
	);

	if (
		latestRows.length > 0 &&
		latestRows[0].title === title &&
		latestRows[0].content === content &&
		latestRows[0].content_hash === contentHash
	) {
		return {
			ok: true,
			skipped: true,
			writer_snapshot: await getWriterSnapshotMetaById(latestRows[0].id),
		};
	}

	if (
		latestRows.length > 0 &&
		latestRows[0].title === title &&
		latestRows[0].content === content
	) {
		await query(
			`UPDATE articles_writer
			SET content_hash = ?,
				create_time = ?,
				novel_id = ?,
				editor_user_id = ?,
				edit_session_id = ?
			WHERE id = ?`,
			[
				contentHash,
				normalizedCreateTime,
				novelId,
				editorUserId || null,
				editSessionId || null,
				latestRows[0].id,
			],
		);

		return {
			ok: true,
			skipped: false,
			updated_hash: true,
			writer_snapshot: await getWriterSnapshotMetaById(latestRows[0].id),
		};
	}

	const insertResult = await query(
		`INSERT INTO articles_writer(
			article_id,
			title,
			content,
			content_hash,
			create_time,
			novel_id,
			editor_user_id,
			edit_session_id
		) VALUES(?,?,?,?,?,?,?,?)`,
		[
			articleId,
			title,
			content,
			contentHash,
			normalizedCreateTime,
			novelId,
			editorUserId || null,
			editSessionId || null,
		],
	);

	return {
		ok: true,
		skipped: false,
		writer_snapshot: await getWriterSnapshotMetaById(insertResult.insertId),
	};
}

function serializeEditLock(lock) {
	if (!lock) return null;

	return {
		lock_id: Number(lock.lock_id),
		article_id: Number(lock.article_id),
		novel_id: Number(lock.novel_id),
		user_id: Number(lock.user_id),
		name: lock.name,
		avatar_url: lock.avatar_url,
		session_id: lock.session_id,
		status: lock.status,
		created_at: lock.created_at,
		updated_at: lock.updated_at,
		expires_at: lock.expires_at,
	};
}

function getCurrentUser(req) {
	return normalizeUser(JSON.parse(JSON.stringify(req.user)));
}

function sanitizeSessionId(rawSessionId) {
	const sessionId = String(rawSessionId || '').trim();
	return sessionId ? sessionId.slice(0, 64) : null;
}

function hasNovelOwnerAccess(access) {
	return !!access && access.access_role === 'owner';
}

function parsePermissionFlag(value) {
	if (value === true || value === 'true') return 1;
	return Number(value) === 1 ? 1 : 0;
}

async function getNovelSummary(novelId) {
	const rows = await query(
		'SELECT novel_id, name, author_id FROM novels WHERE novel_id = ? AND deleted = 0 LIMIT 1',
		[novelId],
	);
	return rows && rows.length > 0 ? rows[0] : null;
}

function getCollaborationSettingsRoute(novelId) {
	return `writers/essayCollaborationSettings?id=${novelId}`;
}


function getCollaboratorPermissionPolicy(collaborationPolicy, collaboratorStatus) {
	if (collaboratorStatus === COLLABORATOR_STATUS.ACTIVE) {
		return collaborationPolicy;
	}
	return projectCollaborationPolicy(collaborationPolicy, 1);
}

function serializeCollaborator(row, collaborationPolicy = null) {
	const permissionPolicy = getCollaboratorPermissionPolicy(
		collaborationPolicy,
		row.status,
	);
	const permissionsLocked = Boolean(permissionPolicy.permissions_restricted);
	return {
		id: Number(row.id),
		novel_id: Number(row.novel_id),
		user_id: Number(row.user_id),
		role: row.role,
		status: row.status,
		can_edit_article: !permissionsLocked && Number(row.can_edit_article) === 1,
		can_add_article: !permissionsLocked && Number(row.can_add_article) === 1,
		can_delete_article: !permissionsLocked && Number(row.can_delete_article) === 1,
		can_sort_article: !permissionsLocked && Number(row.can_sort_article) === 1,
		can_publish_article: !permissionsLocked && Number(row.can_publish_article) === 1,
		permissions_locked: permissionsLocked,
		permission_policy: permissionPolicy,
		invited_by: Number(row.invited_by),
		invited_at: row.invited_at,
		accepted_at: row.accepted_at,
		name: row.name,
		avatar_url: row.avatar_url,
		account: row.account,
	};
}

function serializeArticleListRow(row) {
	const article = {
		article_id: row.article_id,
		title: row.title,
		novel_id: row.novel_id,
		article_chapter: row.article_chapter,
		content_hash: row.content_hash,
		is_draft: row.is_draft,
		deleted: row.deleted,
		update_time: row.update_time,
		index_update_time: row.index_update_time || null,
		index_is_current: Number(row.index_is_current || 0) === 1,
		text_count: row.text_count,
		article_type: row.article_type,
		novel_name: row.novel_name,
		feedback_count: row.feedback_count || 0,
	};

	if (row.writer_article_id) {
		article.article_writer = {
			article_id: row.writer_article_id,
			content_hash: row.writer_content_hash,
			create_time: row.writer_create_time,
			updated_at: row.writer_updated_at || null,
			id: row.writer_id,
			novel_id: row.writer_novel_id,
			title: row.writer_title,
			editor_user_id: row.writer_editor_user_id
				? Number(row.writer_editor_user_id)
				: null,
			editor_name: row.writer_editor_name || null,
			editor_avatar_url: row.writer_editor_avatar_url || null,
			edit_session_id: row.writer_edit_session_id || null,
			index_update_time: row.writer_index_update_time || null,
			index_is_current: Number(row.writer_index_is_current || 0) === 1,
		};
	}

	if (row.active_lock_id) {
		article.active_editor = serializeEditLock({
			lock_id: row.active_lock_id,
			article_id: row.article_id,
			novel_id: row.novel_id,
			user_id: row.active_lock_user_id,
			name: row.active_lock_user_name,
			avatar_url: row.active_lock_avatar_url,
			session_id: row.active_lock_session_id,
			status: row.active_lock_status,
			created_at: row.active_lock_created_at,
			updated_at: row.active_lock_updated_at,
			expires_at: row.active_lock_expires_at,
		});
	}

	return article;
}

function serializeArticleHistoryRow(row) {
	return {
		id: Number(row.id),
		article_id: Number(row.article_id),
		title: row.title,
		content: row.content,
		create_time: row.create_time,
		updated_at: row.updated_at || null,
		novel_id: Number(row.novel_id),
		content_hash: row.content_hash || null,
		editor_user_id: row.editor_user_id ? Number(row.editor_user_id) : null,
		editor_name: row.editor_name || null,
		editor_avatar_url: row.editor_avatar_url || null,
		edit_session_id: row.edit_session_id || null,
	};
}

function serializeArticleSearchSnapshotRow(row) {
	return {
		article_id: Number(row.article_id),
		novel_id: Number(row.novel_id),
		article_chapter: Number(row.article_chapter),
		article_type: row.article_type,
		is_draft: Number(row.is_draft),
		published: {
			title: row.reader_title || '',
			content: row.reader_content || '',
			content_hash: row.reader_content_hash || null,
			update_time: row.reader_update_time || null,
		},
		latest_writer: row.writer_article_id
			? {
				id: Number(row.writer_article_id),
				title: row.writer_title || '',
				content: row.writer_content || '',
				content_hash: row.writer_content_hash || null,
				create_time: row.writer_create_time || '',
				updated_at: row.writer_updated_at || null,
				editor_user_id: row.writer_editor_user_id
					? Number(row.writer_editor_user_id)
					: null,
				editor_name: row.writer_editor_name || null,
				editor_avatar_url: row.writer_editor_avatar_url || null,
				edit_session_id: row.writer_edit_session_id || null,
			}
			: null,
	};
}

// 创建路由对象
let router = express.Router();

router.get('/get_novels_of', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		let results = await query(
			`SELECT
				n.*,
					EXISTS(
					SELECT 1
					FROM novel_collaborators nc_active
					WHERE nc_active.novel_id = n.novel_id
						AND nc_active.status = ?
					LIMIT 1
					) AS has_active_collaborators,
					(
						SELECT COUNT(*)
						FROM novel_collaborators nc_count
						WHERE nc_count.novel_id = n.novel_id
							AND nc_count.status = '${COLLABORATOR_STATUS.ACTIVE}'
					) AS active_collaborator_count,
					(
						SELECT ms.membership_type
						FROM membership_subscriptions ms
						WHERE ms.user_id = n.author_id
							AND ms.status = 'active'
							AND ms.starts_at <= NOW()
							AND ms.expires_at > NOW()
							AND ms.membership_type IN ('standard', 'super')
						ORDER BY FIELD(ms.membership_type, 'super', 'standard'), ms.expires_at DESC
						LIMIT 1
					) AS owner_membership_type,
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
			WHERE n.deleted = 0
				AND n.novel_type != "world"
				AND (
					n.author_id = ?
					OR nc.status = ?
				)
			ORDER BY n.update_time DESC`,
			[
				COLLABORATOR_STATUS.ACTIVE,
				user.user_id,
				user.user_id,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);
		results = JSON.parse(JSON.stringify(results)).map((row) => {
				const access = buildAccessPayload(row, user.user_id);
				const serializedAccess = serializeAccess(access);

			return {
				...row,
				...serializedAccess,
				current_access: serializedAccess,
			};
		});
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_by_id', async function (req, res) {
	try {
		let results = await query(
			`SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar,ic.dominant_color pic_dominant_color FROM novels n
						JOIN users u ON n.author_id = u.user_id
						LEFT JOIN image_dominant_colors ic ON ic.image_url = n.picUrl AND ic.extract_status = 'success'
						WHERE novel_id = ? AND n.deleted = 0`,
			[req.query.id],
		);
		let likes = await query('SELECT * FROM bookcase WHERE novel_id = ?', [
			req.query.id,
		]);
		results = JSON.parse(JSON.stringify(results));
		results[0]['likes'] = likes;
        
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/add_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'INSERT INTO novels(name,content,author_id,update_time) VALUES(?,?,?,CURRENT_TIMESTAMP)',
			[req.body.name, req.body.content, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/modify_novel', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'UPDATE novels SET `name`=?,`content`=? WHERE `novel_id` = ? AND deleted = 0',
			[req.body.name, req.body.content, novelId],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/export_novel', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.id || 0);
	res.end('success');
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return;
		}

		let results = await query(
			`SELECT n.name novel_name
			FROM novels n
			WHERE n.novel_id = ?
				AND n.deleted = 0
			LIMIT 1`,
			[novelId],
		);

		if (!results || results.length === 0) {
			return;
		}

		axios.post('http://localhost:9000/export_novel', {
			novel_id: novelId,
			user_id: user.user_id,
			novel_name: results[0].novel_name,
		});
	} catch (e) {
		console.log(e);
	}
});

router.post('/set_novel_status', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'UPDATE novels SET `is_personal`=? WHERE `novel_id` = ? AND deleted = 0',
			[req.body.is_personal, novelId],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/set_novel_update_status', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'UPDATE novels SET `is_complete`= ? WHERE `novel_id` = ? AND deleted = 0',
			[req.body.is_complete, novelId],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/change_cover', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const coverBuffer = decodeBase64Image(req.body.img);
		const uploadResponse = await axios.post(
			'http://img.codesocean.top/upload/imgbase64',
			{
				img: req.body.img,
				apikey: '45qEQfILCQ3tAXxmUJF8O562bJU2D0',
			},
			{
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
				},
			},
		);
		console.log(uploadResponse.data);
		await query('UPDATE novels SET picUrl = ? WHERE novel_id = ? AND author_id = ? AND deleted = 0', [
			uploadResponse.data.url,
			novelId,
			user.user_id,
		]);

		let dominantColor = null;
		try {
			dominantColor = await ensureImageDominantColor(uploadResponse.data.url, {
				imageBuffer: coverBuffer,
			});
		} catch (colorError) {
			console.log('extract novel cover dominant color failed', colorError);
		}

		res.json(200, { msg: 'ok', dominant_color: dominantColor });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/delete_novel', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'SELECT * FROM novels WHERE novel_id = ? AND author_id = ? AND deleted = 0',
			[novelId, user.user_id],
		);
		if (results.length != 0) {
			if(results[0].novel_type == "world"){
				results = await query(
					'UPDATE world SET is_delete = 1 WHERE asso_novel_id = ?',
					[novelId],
				);
			}
			await bank.useAmount(user, 'log', 50, true);
			results = await query(
				'UPDATE novels SET deleted = 1 WHERE novel_id = ?',
				[novelId],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_collaboration_info', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.novel_id || req.query.id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!access) {
			return res.status(404).json({ msg: 'novel not found' });
		}

		if (
			!canViewNovel(access) &&
			!canManageCollaborators(access) &&
			!canRespondInvitation(access)
		) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const novelRows = await query(
			`SELECT
				n.novel_id,
				n.name,
				n.author_id,
				u.name AS owner_name,
				u.avatar_url AS owner_avatar_url
			FROM novels n
			INNER JOIN users u ON u.user_id = n.author_id
			WHERE n.novel_id = ?
				AND n.deleted = 0
			LIMIT 1`,
			[novelId],
		);

		if (!novelRows || novelRows.length === 0) {
			return res.status(404).json({ msg: 'novel not found' });
		}

		const collaborators = await listNovelCollaborators(novelId, {
			viewerAccess: access,
		});

		return res.json({
			novel: {
				novel_id: Number(novelRows[0].novel_id),
				name: novelRows[0].name,
				author_id: Number(novelRows[0].author_id),
				owner_name: novelRows[0].owner_name,
				owner_avatar_url: novelRows[0].owner_avatar_url,
			},
			access: serializeAccess(access),
			collaborators: collaborators.map((row) =>
				serializeCollaborator(row, access.collaboration_policy),
			),
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/invite_novel_collaborator', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	const targetUserId = Number(req.body.user_id || 0);
	const role = String(req.body.role || 'collaborator').trim() || 'collaborator';

	if (!novelId || !targetUserId) {
		return res.status(400).json({ msg: 'novel_id and user_id are required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canManageCollaborators(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		if (Number(access.author_id) === targetUserId) {
			return res.status(400).json({ msg: 'cannot invite the novel owner' });
		}

		const invitationPolicy = projectCollaborationPolicy(
			access.collaboration_policy,
			1,
		);
		const defaultPermissions = invitationPolicy.permissions_restricted
			? [0, 0, 0, 0, 0]
			: [1, 0, 0, 0, 0];

		const [targetUser] = await query(
			'SELECT user_id, name FROM users WHERE user_id = ? LIMIT 1',
			[targetUserId],
		);
		if (!targetUser) {
			return res.status(404).json({ msg: 'target user not found' });
		}

		const [novel] = await query(
			'SELECT novel_id, name FROM novels WHERE novel_id = ? AND deleted = 0 LIMIT 1',
			[novelId],
		);
		if (!novel) {
			return res.status(404).json({ msg: 'novel not found' });
		}

		const existing = await query(
			'SELECT id, status FROM novel_collaborators WHERE novel_id = ? AND user_id = ? LIMIT 1',
			[novelId, targetUserId],
		);

		if (existing.length > 0) {
			if (existing[0].status === COLLABORATOR_STATUS.ACTIVE) {
				return res.json({ msg: 'collaborator already active' });
			}

			await query(
				`UPDATE novel_collaborators
				SET role = ?,
					status = ?,
					can_edit_article = ?,
					can_add_article = ?,
					can_delete_article = ?,
					can_sort_article = ?,
					can_publish_article = ?,
					invited_by = ?,
					invited_at = CURRENT_TIMESTAMP,
					accepted_at = NULL
				WHERE novel_id = ?
					AND user_id = ?`,
				[
					role,
					COLLABORATOR_STATUS.PENDING,
					...defaultPermissions,
					user.user_id,
					novelId,
					targetUserId,
				],
			);
		} else {
			await query(
				`INSERT INTO novel_collaborators(
					novel_id,
					user_id,
					role,
					status,
					can_edit_article,
					can_add_article,
					can_delete_article,
					can_sort_article,
					can_publish_article,
					invited_by,
					invited_at,
					accepted_at
				) VALUES(?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,NULL)`,
				[
					novelId,
					targetUserId,
					role,
					COLLABORATOR_STATUS.PENDING,
					...defaultPermissions,
					user.user_id,
				],
			);
		}

		await message.sendMsg(
			user.user_id,
			targetUserId,
			`你收到了《${novel.name}》的协作邀请`,
			`writers/essayCollaborationSettings?id=${novelId}`,
			'notification',
			true,
		);

		return res.json({
			msg: 'ok',
			permissions_locked: invitationPolicy.permissions_restricted,
			collaboration_policy: invitationPolicy,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/update_novel_collaborator_permissions', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	const targetUserId = Number(req.body.user_id || 0);

	if (!novelId || !targetUserId) {
		return res.status(400).json({ msg: 'novel_id and user_id are required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canManageCollaborators(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		if (Number(access.author_id) === targetUserId) {
			return res.status(400).json({ msg: 'cannot update the novel owner' });
		}

		const permissions = {
			can_edit_article: parsePermissionFlag(req.body.can_edit_article),
			can_add_article: parsePermissionFlag(req.body.can_add_article),
			can_delete_article: parsePermissionFlag(req.body.can_delete_article),
			can_sort_article: parsePermissionFlag(req.body.can_sort_article),
			can_publish_article: parsePermissionFlag(req.body.can_publish_article),
		};
		const collaboratorRows = await query(
			`SELECT status
			FROM novel_collaborators
			WHERE novel_id = ?
				AND user_id = ?
				AND status IN (?, ?)
			LIMIT 1`,
			[
				novelId,
				targetUserId,
				COLLABORATOR_STATUS.PENDING,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);
		if (collaboratorRows.length === 0) {
			return res.status(404).json({ msg: 'collaborator not found' });
		}
		const permissionPolicy = getCollaboratorPermissionPolicy(
			access.collaboration_policy,
			collaboratorRows[0].status,
		);
		const wantsAdditionalPermission = Object.values(permissions).some(
			(value) => value === 1,
		);
		if (permissionPolicy.permissions_restricted && wantsAdditionalPermission) {
			return res.status(403).json({
				code: 'COLLABORATION_MEMBERSHIP_REQUIRED',
				msg: '三人及以上协作需要主作者开通原木通行证，未开通时协作者仅可预览作品',
				collaboration_policy: permissionPolicy,
			});
		}

		const result = await query(
			`UPDATE novel_collaborators
			SET can_edit_article = ?,
				can_add_article = ?,
				can_delete_article = ?,
				can_sort_article = ?,
				can_publish_article = ?
			WHERE novel_id = ?
				AND user_id = ?
				AND status IN (?, ?)`,
			[
				permissions.can_edit_article,
				permissions.can_add_article,
				permissions.can_delete_article,
				permissions.can_sort_article,
				permissions.can_publish_article,
				novelId,
				targetUserId,
				COLLABORATOR_STATUS.PENDING,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);

		if (!result || result.affectedRows === 0) {
			return res.status(404).json({ msg: 'collaborator not found' });
		}

		return res.json({
			msg: 'ok',
			permissions,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/accept_novel_collaborator_invite', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canRespondInvitation(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const novel = await getNovelSummary(novelId);
		const result = await query(
			`UPDATE novel_collaborators
			SET status = ?,
				accepted_at = CURRENT_TIMESTAMP
			WHERE novel_id = ?
				AND user_id = ?
				AND status = ?`,
			[
				COLLABORATOR_STATUS.ACTIVE,
				novelId,
				user.user_id,
				COLLABORATOR_STATUS.PENDING,
			],
		);

		if (result && result.affectedRows > 0 && novel) {
			await message.sendMsg(
				user.user_id,
				Number(access.author_id),
				`${user.name}已接受《${novel.name}》的协作邀请`,
				getCollaborationSettingsRoute(novelId),
				'notification',
				true,
			);
		}

		return res.json({ msg: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/reject_novel_collaborator_invite', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canRespondInvitation(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const novel = await getNovelSummary(novelId);
		const result = await query(
			`UPDATE novel_collaborators
			SET status = ?,
				accepted_at = NULL
			WHERE novel_id = ?
				AND user_id = ?
				AND status = ?`,
			[
				COLLABORATOR_STATUS.REJECTED,
				novelId,
				user.user_id,
				COLLABORATOR_STATUS.PENDING,
			],
		);

		if (result && result.affectedRows > 0 && novel) {
			await message.sendMsg(
				user.user_id,
				Number(access.author_id),
				`${user.name}已拒绝《${novel.name}》的协作邀请`,
				getCollaborationSettingsRoute(novelId),
				'notification',
				true,
			);
		}

		return res.json({ msg: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/remove_novel_collaborator', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);
	const targetUserId = Number(req.body.user_id || 0);

	if (!novelId || !targetUserId) {
		return res.status(400).json({ msg: 'novel_id and user_id are required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canManageCollaborators(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		if (Number(access.author_id) === targetUserId) {
			return res.status(400).json({ msg: 'cannot remove the novel owner' });
		}

		const novel = await getNovelSummary(novelId);
		const collaboratorRows = await query(
			'SELECT status FROM novel_collaborators WHERE novel_id = ? AND user_id = ? LIMIT 1',
			[novelId, targetUserId],
		);
		const previousStatus =
			collaboratorRows && collaboratorRows.length > 0
				? collaboratorRows[0].status
				: null;

		const result = await query(
			`UPDATE novel_collaborators
			SET status = ?,
				accepted_at = NULL
			WHERE novel_id = ?
				AND user_id = ?
				AND status IN (?, ?)`,
			[
				COLLABORATOR_STATUS.REMOVED,
				novelId,
				targetUserId,
				COLLABORATOR_STATUS.PENDING,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);

		if (result && result.affectedRows > 0 && novel) {
			const content =
				previousStatus === COLLABORATOR_STATUS.PENDING
					? `《${novel.name}》的协作邀请已被撤回`
					: `你已被移出《${novel.name}》的多人协作`;
			await message.sendMsg(
				user.user_id,
				targetUserId,
				content,
				'community/notifications',
				'notification',
				true,
			);
		}

		return res.json({ msg: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/quit_novel_collaboration', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!access || access.access_role !== 'collaborator') {
			return res.status(403).json({ msg: 'access denied' });
		}

		const novel = await getNovelSummary(novelId);
		const result = await query(
			`UPDATE novel_collaborators
			SET status = ?,
				accepted_at = NULL
			WHERE novel_id = ?
				AND user_id = ?
				AND status = ?`,
			[
				COLLABORATOR_STATUS.REMOVED,
				novelId,
				user.user_id,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);

		if (result && result.affectedRows > 0 && novel) {
			await message.sendMsg(
				user.user_id,
				Number(access.author_id),
				`${user.name}已退出《${novel.name}》的多人协作`,
				getCollaborationSettingsRoute(novelId),
				'notification',
				true,
			);
		}

		return res.json({ msg: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/claim_article_edit_lock', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const sessionId = sanitizeSessionId(req.body.session_id);

	if (!articleId || !sessionId) {
		return res
			.status(400)
			.json({ msg: 'article_id and session_id are required' });
	}

	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const result = await claimArticleEditLock({
			articleId: access.article_id,
			novelId: access.novel_id,
			userId: user.user_id,
			sessionId,
			ttlSeconds: DEFAULT_LOCK_TTL_SECONDS,
		});

		if (!result.ok) {
			return res.status(409).json({
				msg: result.reason || 'locked_by_other',
				lock: serializeEditLock(result.lock),
				ttl_seconds: DEFAULT_LOCK_TTL_SECONDS,
			});
		}

		return res.json({
			msg: 'ok',
			lock: serializeEditLock(result.lock),
			ttl_seconds: DEFAULT_LOCK_TTL_SECONDS,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/heartbeat_article_edit_lock', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const sessionId = sanitizeSessionId(req.body.session_id);

	if (!articleId || !sessionId) {
		return res
			.status(400)
			.json({ msg: 'article_id and session_id are required' });
	}

	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const result = await heartbeatArticleEditLock({
			articleId: access.article_id,
			userId: user.user_id,
			sessionId,
			ttlSeconds: DEFAULT_LOCK_TTL_SECONDS,
		});

		if (!result.ok) {
			return res.status(409).json({
				msg: result.reason || 'lock_not_found',
				lock: serializeEditLock(result.lock),
				ttl_seconds: DEFAULT_LOCK_TTL_SECONDS,
			});
		}

		return res.json({
			msg: 'ok',
			lock: serializeEditLock(result.lock),
			ttl_seconds: DEFAULT_LOCK_TTL_SECONDS,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/release_article_edit_lock', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const sessionId = sanitizeSessionId(req.body.session_id);

	if (!articleId || !sessionId) {
		return res
			.status(400)
			.json({ msg: 'article_id and session_id are required' });
	}

	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const result = await releaseArticleEditLock({
			articleId: access.article_id,
			userId: user.user_id,
			sessionId,
		});

		return res.json({
			msg: 'ok',
			lock: serializeEditLock(result.lock),
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/get_article_edit_lock_status', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.article_id || req.query.id || 0);

	if (!articleId) {
		return res.status(400).json({ msg: 'article_id is required' });
	}

	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		await expireArticleEditLocks(articleId);
		const lock = await getActiveArticleEditLock(access.article_id);

		return res.json({
			msg: 'ok',
			lock: serializeEditLock(lock),
			ttl_seconds: DEFAULT_LOCK_TTL_SECONDS,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/get_novel_indexing_status', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.novel_id || req.query.id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canViewArticles(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const result = await getNovelIndexingStatus(novelId);
		return res.json({
			msg: 'ok',
			...result,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/request_novel_indexing', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.novel_id || req.body.id || 0);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id is required' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canViewArticles(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const result = await requestNovelIndexing(novelId, user.user_id);
		return res.json({
			msg: 'ok',
			...result,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/get_articles', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canViewArticles(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		await ensureAgentMemorySchema();
		await expireArticleEditLocks();

		let results = await query(
			`SELECT 
				a.article_id,
				a.title,
				a.novel_id,
				a.article_chapter, 
				a.content_hash,
				a.is_draft,
				a.deleted,
				a.update_time,
				am_raw.updated_at as index_update_time,
				IF(am.memory_id IS NULL, 0, 1) as index_is_current,
				a.text_count,
				a.article_type,
				n.name as novel_name,
				(SELECT COUNT(*) FROM article_feedback WHERE article_id = a.article_id AND status = 0) as feedback_count,
				aw.article_id as writer_article_id,
				aw.content_hash as writer_content_hash,
				aw.create_time as writer_create_time,
				aw.updated_at as writer_updated_at,
				aw.id as writer_id,
				aw.novel_id as writer_novel_id,
				aw.title as writer_title,
				aw.editor_user_id as writer_editor_user_id,
				writer_user.name as writer_editor_name,
				writer_user.avatar_url as writer_editor_avatar_url,
				aw.edit_session_id as writer_edit_session_id,
				awm_raw.updated_at as writer_index_update_time,
				IF(awm.memory_id IS NULL, 0, 1) as writer_index_is_current,
				al.lock_id as active_lock_id,
				al.user_id as active_lock_user_id,
				al.session_id as active_lock_session_id,
				al.status as active_lock_status,
				al.created_at as active_lock_created_at,
				al.updated_at as active_lock_updated_at,
				al.expires_at as active_lock_expires_at,
				al.name as active_lock_user_name,
				al.avatar_url as active_lock_avatar_url
			FROM articles a
			INNER JOIN novels n ON a.novel_id = n.novel_id
			LEFT JOIN articles_writer aw
				ON aw.id = ${buildLatestWriterIdSubquery('a.article_id', { includeNovelCheck: true })}
			LEFT JOIN users writer_user ON writer_user.user_id = aw.editor_user_id
			LEFT JOIN \`${memoryDatabase}\`.agent_memory am_raw ON a.article_id = am_raw.article_id
			LEFT JOIN \`${memoryDatabase}\`.agent_memory am
				ON a.article_id = am.article_id
				AND am.source_content_hash <=> a.content_hash
				AND am.source_title <=> a.title
				AND am.source_updated_at <=> a.update_time
			LEFT JOIN \`${memoryDatabase}\`.agent_writer_memory awm_raw ON a.article_id = awm_raw.article_id
			LEFT JOIN \`${memoryDatabase}\`.agent_writer_memory awm
				ON aw.article_id = awm.article_id
				AND aw.id = awm.writer_id
				AND awm.source_content_hash <=> aw.content_hash
				AND awm.source_title <=> aw.title
				AND awm.source_updated_at <=> aw.create_time
			LEFT JOIN (
				SELECT
					l1.lock_id,
					l1.article_id,
					l1.novel_id,
					l1.user_id,
					l1.session_id,
					l1.status,
					l1.created_at,
					l1.updated_at,
					l1.expires_at,
					u.name,
					u.avatar_url
				FROM article_edit_locks l1
				INNER JOIN (
					SELECT article_id, MAX(lock_id) AS max_lock_id
					FROM article_edit_locks
					WHERE status = 'active'
						AND expires_at > CURRENT_TIMESTAMP
					GROUP BY article_id
				) latest_lock ON latest_lock.max_lock_id = l1.lock_id
				INNER JOIN users u ON u.user_id = l1.user_id
			) al ON a.article_id = al.article_id
			WHERE a.novel_id = ? 
				AND n.deleted = 0 
				AND a.deleted = 0 
			ORDER BY a.article_chapter ASC`,
			[novelId],
		);

		res.end(JSON.stringify(results.map(serializeArticleListRow)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_search_snapshot', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canViewArticles(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			`SELECT
				a.article_id,
				a.novel_id,
				a.article_chapter,
				a.article_type,
				a.is_draft,
				a.title AS reader_title,
				a.content AS reader_content,
				a.content_hash AS reader_content_hash,
				a.update_time AS reader_update_time,
				aw.article_id AS writer_article_id,
				aw.id AS writer_id,
				aw.title AS writer_title,
				aw.content AS writer_content,
				aw.content_hash AS writer_content_hash,
				aw.create_time AS writer_create_time,
				aw.updated_at AS writer_updated_at,
				aw.editor_user_id AS writer_editor_user_id,
				aw.edit_session_id AS writer_edit_session_id,
				writer_user.name AS writer_editor_name,
				writer_user.avatar_url AS writer_editor_avatar_url
			FROM articles a
			INNER JOIN novels n ON a.novel_id = n.novel_id
			LEFT JOIN articles_writer aw
				ON aw.id = ${buildLatestWriterIdSubquery('a.article_id', { includeNovelCheck: true })}
			LEFT JOIN users writer_user ON writer_user.user_id = aw.editor_user_id
			WHERE a.novel_id = ?
				AND n.deleted = 0
				AND a.deleted = 0
				AND a.article_type <> 'spliter'
			ORDER BY a.article_chapter ASC`,
			[novelId],
		);

		res.end(JSON.stringify(results.map(serializeArticleSearchSnapshotRow)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_deleted', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!access || !canDeleteArticle(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			`SELECT 
				a.article_id,
				a.title,
				a.novel_id,
				a.article_chapter,
				a.content_hash,
				a.is_draft,
				a.deleted,
				a.update_time,
				a.text_count,
				n.name as novel_name,
				aw.article_id as writer_article_id,
				aw.content_hash as writer_content_hash,
				aw.create_time as writer_create_time,
				aw.updated_at as writer_updated_at,
				aw.id as writer_id,
				aw.novel_id as writer_novel_id,
				aw.title as writer_title,
				aw.editor_user_id as writer_editor_user_id,
				writer_user.name as writer_editor_name,
				writer_user.avatar_url as writer_editor_avatar_url,
				aw.edit_session_id as writer_edit_session_id
			FROM articles a
			INNER JOIN novels n ON a.novel_id = n.novel_id
			LEFT JOIN articles_writer aw
				ON aw.id = ${buildLatestWriterIdSubquery('a.article_id', { includeNovelCheck: true })}
			LEFT JOIN users writer_user ON writer_user.user_id = aw.editor_user_id
			WHERE a.novel_id = ? 
				AND n.deleted = 0 
				AND a.deleted = 1 
			ORDER BY a.article_chapter ASC`,
			[novelId],
		);

		res.end(JSON.stringify(results.map(serializeArticleListRow)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			`SELECT a.* FROM articles a,novels n 
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.deleted = 0
                               AND a.deleted = 0`,
			[articleId],
		);
        if(results.length > 0){
            let novel_info = await query(
                `SELECT * FROM novels WHERE novel_id = ?`,
                [results[0].novel_id],
            );
            results[0].novel_info = novel_info[0];
			results[0].current_access = serializeAccess(access);
        }
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.get('/get_article_hash', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			`SELECT a.* FROM articles a,novels n 
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.deleted = 0
                               AND a.deleted = 0`,
			[articleId],
		);
		if (results && results.length > 0 && results[0].content) {
			// 使用crypto模块生成md5哈希
			results[0].contentHash = crypto.createHash('md5').update(results[0].content).digest('hex');
			results[0].content = undefined;
			results[0].current_access = serializeAccess(access);
		}
		res.end(JSON.stringify(results[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.get('/get_article_writer', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let readerResults = await query(
			`SELECT * FROM articles WHERE article_id = ?`,
			[articleId],
		)
		let results = await query(
			`SELECT
				a.*,
				u.name AS editor_name,
				u.avatar_url AS editor_avatar_url
			FROM articles_writer a
			INNER JOIN novels n ON n.novel_id = a.novel_id
			LEFT JOIN users u ON u.user_id = a.editor_user_id
			WHERE article_id = ?
				AND n.deleted = 0
			ORDER BY ${buildWriterUpdatedAtExpression('a')} DESC, a.id DESC
			LIMIT 1`,
			[articleId],
		); 
        if(results.length > 0){
            let novel_info = await query(
                `SELECT * FROM novels WHERE novel_id = ?`,
                [results[0].novel_id],
            );
            results[0].novel_info = novel_info[0];
			results[0].current_access = serializeAccess(access);
        } else {
			res.end("no data");
			return;
		}
		res.end(JSON.stringify({ ...(readerResults[0] || {}), ...results[0] }));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.get('/get_article_writer_hash', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let readerResults = await query(
			`SELECT * FROM articles WHERE article_id = ?`,
			[articleId],
		)
		if (readerResults.length > 0) {
			readerResults[0].content = undefined;
		}
		let results = await query(
			`SELECT a.* FROM articles_writer a, novels n
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.deleted = 0
							   ORDER BY ${buildWriterUpdatedAtExpression('a')} DESC, a.id DESC
							   LIMIT 1`,
			[articleId],
		); 

        if(results.length > 0){
            let novel_info = await query(
                `SELECT * FROM novels WHERE novel_id = ?`,
                [results[0].novel_id],
            );
            results[0].novel_info = novel_info[0];
			results[0].contentHash = crypto.createHash('md5').update(results[0].content).digest('hex');
			results[0].current_access = serializeAccess(access);
			// results[0].content = undefined;
        } else {
			res.end("no data");
			return;
		}
		res.end(JSON.stringify({ ...(readerResults[0] || {}), ...results[0] }));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.post('/sync_article_writer_from_reader', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const sessionId = sanitizeSessionId(req.body.edit_session_id);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let article_reader = await query(
			'SELECT a.* FROM articles a, novels n WHERE a.novel_id = n.novel_id AND article_id = ? AND a.deleted = 0 AND n.deleted = 0',
			[articleId],
		);
		if(article_reader.length == 0){
			return res.status(404).json({ msg: 'article does not exist' });
		}
		article_reader = article_reader[0];

		const normalizedContent = ensureArticleParagraphIds(article_reader.content);
		const contentHash = calculateContentHash(normalizedContent);

		let results = await query(
			'INSERT INTO articles_writer(article_id, title, content, content_hash, create_time, novel_id, editor_user_id, edit_session_id) VALUES(?,?,?,?,?,?,?,?)',
			[
				articleId,
				article_reader.title,
				normalizedContent,
				contentHash,
				req.body.create_time,
				access.novel_id,
				user.user_id,
				sessionId,
			],
		);
		res.end(
			JSON.stringify({
				...results,
				writer_snapshot: await getWriterSnapshotMetaById(results.insertId),
			}),
		);
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.post('/upload_article_writer', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const sessionId = sanitizeSessionId(req.body.edit_session_id);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const sessionValidation = await validateActiveEditSession({
			articleId: access.article_id,
			userId: user.user_id,
			sessionId,
			required: req.body.is_force !== true,
		});
		if (!sessionValidation.ok) {
			return res.status(sessionValidation.status).json(sessionValidation.body);
		}

		const novelId = Number(access.novel_id);
		req.body.content = ensureArticleParagraphIds(req.body.content);
		const contentHash = calculateContentHash(req.body.content);

		if(req.body.is_fast_save){
			let article_writer = [];
			if (sessionId) {
				article_writer = await query(
					`SELECT *
					FROM articles_writer
					WHERE article_id = ?
						AND editor_user_id = ?
						AND edit_session_id = ?
					ORDER BY ${buildWriterUpdatedAtExpression('articles_writer')} DESC, id DESC
					LIMIT 1`,
					[articleId, user.user_id, sessionId],
				);
			}

			if (article_writer.length === 0) {
				article_writer = await query(
					`SELECT *
					FROM articles_writer
					WHERE article_id = ?
						AND editor_user_id = ?
					ORDER BY ${buildWriterUpdatedAtExpression('articles_writer')} DESC, id DESC
					LIMIT 1`,
					[articleId, user.user_id],
				);
			}

			if (article_writer.length === 0) {
				let results = await query(
					`INSERT INTO articles_writer(
						article_id,
						title,
						content,
						content_hash,
						create_time,
						novel_id,
						editor_user_id,
						edit_session_id
					) VALUES(?,?,?,?,?,?,?,?)`,
					[
						articleId,
						req.body.title,
						req.body.content,
						contentHash,
						req.body.create_time,
						novelId,
						user.user_id,
						sessionId,
					],
				);
				res.end(
					JSON.stringify({
						...results,
						writer_snapshot: await getWriterSnapshotMetaById(results.insertId),
					}),
				);
				return;
			}

			let results = await query(
				`UPDATE articles_writer
				SET title = ?,
					content = ?,
					content_hash = ?,
					create_time = ?,
					novel_id = ?,
					editor_user_id = ?,
					edit_session_id = ?
				WHERE id = ?`,
				[
					req.body.title,
					req.body.content,
					contentHash,
					req.body.create_time,
					novelId,
					user.user_id,
					sessionId,
					article_writer[0].id,
				],
			);
			res.end(
				JSON.stringify({
					...results,
					writer_snapshot: await getWriterSnapshotMetaById(article_writer[0].id),
				}),
			);
		} else {

			if(!req.body.is_force){
				// 检查是否与上次记录不一样
				let latestLocalArticle = await query(
					`SELECT *
					FROM articles_writer
					WHERE article_id = ?
					ORDER BY ${buildWriterUpdatedAtExpression('articles_writer')} DESC, id DESC
					LIMIT 1`,
					[articleId],
				);
				if(latestLocalArticle.length > 0 && latestLocalArticle[0].content == req.body.content && latestLocalArticle[0].title == req.body.title) {
					res.status(200).json({
						msg: 'content does not change',
						writer_snapshot: await getWriterSnapshotMetaById(latestLocalArticle[0].id),
					});
					return;
				}
			}

			let results = await query(
				`INSERT INTO articles_writer(
					article_id,
					title,
					content,
					content_hash,
					create_time,
					novel_id,
					editor_user_id,
					edit_session_id
				) VALUES(?,?,?,?,?,?,?,?)`,
				[
					articleId,
					req.body.title,
					req.body.content,
					contentHash,
					req.body.create_time,
					novelId,
					user.user_id,
					sessionId,
				],
			);
			res.end(
				JSON.stringify({
					...results,
					writer_snapshot: await getWriterSnapshotMetaById(results.insertId),
				}),
			);
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/add_article', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.body.id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (access && canAddArticle(access)) {
			if (!req.body.article_type) req.body.article_type = 'richtext';
            if (req.body.article_type == 'text') {
                req.body.article_type = 'richtext';
                req.body.content = "[]"
            }
			req.body.content = ensureArticleParagraphIds(req.body.content);
			let insertChapter = Number(req.body.article_chapter || 1);
			if (!Number.isFinite(insertChapter) || insertChapter < 1) {
				insertChapter = 1;
			}
			const chapterRows = await query(
				'SELECT COALESCE(MAX(article_chapter), 0) AS max_chapter FROM articles WHERE novel_id = ? AND deleted = 0',
				[novelId],
			);
			const maxChapter = Number(chapterRows[0].max_chapter || 0);
			if (insertChapter > maxChapter + 1) {
				insertChapter = maxChapter + 1;
			}
			await query(
				'UPDATE articles SET article_chapter = article_chapter + 1 WHERE novel_id = ? AND deleted = 0 AND article_chapter >= ?',
				[novelId, insertChapter],
			);
			const contentHash = calculateContentHash(req.body.content);
			let results = await query(
				'INSERT INTO articles(title,content,content_hash,novel_id,article_chapter,article_type,is_draft) VALUES(?,?,?,?,?,?,?)',
				[
					req.body.title,
					req.body.content,
					contentHash,
					novelId,
					insertChapter,
					req.body.article_type,
					req.body.is_draft ? 1 : 0
				],
			);
			res.end(JSON.stringify(results));
		} else {
			res.status(403).json({ msg: 'access denied' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/modify_article', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		req.body.content = ensureArticleParagraphIds(req.body.content);
		const sessionId = sanitizeSessionId(req.body.edit_session_id);
		const writerCreateTime = normalizeWriterCreateTime(
			req.body.writer_create_time || req.body.create_time,
		);
		const scheduleTime =
			typeof req.body.schedule_time === 'string'
				? req.body.schedule_time.trim()
				: '';
		const shouldClearSchedule =
			req.body.clear_schedule === true ||
			req.body.clear_schedule === 'true' ||
			Number(req.body.clear_schedule) === 1;
		const contentHash = calculateContentHash(req.body.content);
		const access = await getArticleAccess(user.user_id, req.body.article_id);
		if (!access || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		if (access.article_type === 'spliter') {
			if (!canSortArticle(access)) {
				return res.status(403).json({ msg: 'access denied' });
			}
		} else if (!canEditDraft(access) || !canPublish(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const sessionValidation = await validateActiveEditSession({
			articleId: access.article_id,
			userId: user.user_id,
			sessionId,
			required: false,
		});
		if (!sessionValidation.ok) {
			return res.status(sessionValidation.status).json(sessionValidation.body);
		}

		// 如果是定时发布
		if (scheduleTime) {
			if (!canPublish(access)) {
				return res.status(403).json({ msg: 'access denied' });
			}
			const activeMembership = await membership.getCurrentSubscription(user.user_id);
			if (!activeMembership) {
				return res.status(403).json({
					code: 'MEMBERSHIP_REQUIRED',
					msg: '定时发布仅限原木通行证或超级原木通行证会员使用',
				});
			}
			const parsedScheduleTime = new Date(scheduleTime.replace(' ', 'T'));
			if (Number.isNaN(parsedScheduleTime.getTime())) {
				return res.status(400).json({ msg: 'invalid schedule_time' });
			}
			if (parsedScheduleTime.getTime() <= Date.now()) {
				return res.status(400).json({ msg: 'schedule_time must be in the future' });
			}
			// 强制设为草稿
			req.body.is_draft = 1;
			
			// 删除该文章已有的待执行定时任务
			await query(
				'DELETE FROM scheduled_publish_tasks WHERE article_id = ? AND status = "pending"',
				[req.body.article_id]
			);
			
			// 插入新的定时任务
			await query(
				'INSERT INTO scheduled_publish_tasks (article_id, publish_time, status) VALUES (?, ?, "pending")',
				[req.body.article_id, scheduleTime]
			);
		} else if (shouldClearSchedule && canPublish(access)) {
			await query(
				'DELETE FROM scheduled_publish_tasks WHERE article_id = ? AND status = "pending"',
				[req.body.article_id]
			);
		}

		let results = await query(
			'UPDATE articles SET `title`=?,`content`=?,`content_hash`=?,`is_draft`=?,update_time = CURRENT_TIMESTAMP WHERE article_id=? AND deleted = 0',
			[
				req.body.title,
				req.body.content,
				contentHash,
				req.body.is_draft,
				req.body.article_id,
			],
		);
		const shouldTriggerPublishEffects =
			canPublish(access) &&
			Number(req.body.is_draft) === 0 &&
			access.article_type !== 'spliter';
    // 字数统计
    let textCount = 0;
    let article = (await query('SELECT * FROM articles WHERE article_id = ?', [req.body.article_id]))[0];
    if(article.article_type == 'richtext' || article.article_type == "worldOutline"){
      for(let item of JSON.parse(article.content)){
        if(item.type == "text"){
          textCount += item.value.length;
        }
      }
    } else if(article.article_type == "worldVocabulary"){
      textCount += JSON.parse(article.content).desc.length;
    }
		await query(
			'UPDATE articles SET text_count = ? WHERE article_id = ? AND deleted = 0',
			[
				textCount,
				req.body.article_id,
			],
		);
		let writerSnapshot = null;
		if (shouldMirrorWriterDraftForArticleType(access.article_type)) {
			const mirrorResult = await mirrorWriterDraftSnapshot({
				articleId: Number(req.body.article_id),
				novelId: Number(access.novel_id),
				title: req.body.title,
				content: req.body.content,
				contentHash,
				createTime: writerCreateTime,
				editorUserId: user.user_id,
				editSessionId: sessionId,
			});
			writerSnapshot = mirrorResult && mirrorResult.writer_snapshot
				? mirrorResult.writer_snapshot
				: await getLatestWriterSnapshotMeta(req.body.article_id);
		}
		//如果不是草稿，则推送至更新记录，并向所有收藏该小说的人发布更新信息
		if (shouldTriggerPublishEffects) {
			// 审核状态设为未审核
			await query(
				'UPDATE articles SET audit_status = \'Uncheck\' WHERE article_id = ? AND deleted = 0',
				[
					req.body.article_id,
				],
			);
			await query(
				'UPDATE novels SET update_time = CURRENT_TIMESTAMP WHERE novel_id = (SELECT novel_id FROM articles WHERE article_id = ?)',
				[req.body.article_id],
			);
			let novel = await query(
				'SELECT a.novel_id,n.name,n.is_personal FROM articles a,novels n WHERE a.article_id = ? AND a.novel_id = n.novel_id',
				[req.body.article_id],
			);
			novel = JSON.parse(JSON.stringify(novel));
			//如果不是私人作品，则推送到最新更新通道
			if (novel[0].is_personal == 0) {
				await statistics.push_to_newly_modified(novel[0].novel_id);
			}
			let users = await query(
				'SELECT user_id FROM bookcase WHERE novel_id = ?',
				[novel[0].novel_id],
			);
			users = JSON.parse(JSON.stringify(users));
			for (let u of users) {
				message.sendMsg(
					user.user_id,
					u.user_id,
					'你收藏的作品《' + novel[0].name + '》更新了，快去看看吧！',
					'readers/bookInfo?id=' + novel[0].novel_id,
					'followed',
				);
			}
		}
		res.end(JSON.stringify({
			...results,
			writer_snapshot: writerSnapshot,
		}));
        // 同时更新全本字数
        if (shouldTriggerPublishEffects) {
            let novel = (await query(
				'SELECT a.novel_id,n.name,n.is_personal FROM articles a,novels n WHERE a.article_id = ? AND a.novel_id = n.novel_id',
				[req.body.article_id],
			))[0];
            let articles = await query('SELECT text_count, is_draft FROM articles WHERE novel_id = ?', [novel.novel_id]);
            let novelTextCount = 0;
            for(let item of articles){
                if(item.is_draft == 0){
                    novelTextCount += item.text_count;
                }
            }
            await query(`UPDATE novels SET text_count = ? WHERE novel_id = ?`, [novelTextCount, novel.novel_id]);
        }
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_article_text_correction', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	try {
		if (!articleId) {
			return res.status(400).json({ msg: 'article_id is required' });
		}

		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const requestParagraphs = Array.isArray(req.body.paragraphs)
			? req.body.paragraphs
			: null;

		let result;
		if (requestParagraphs && requestParagraphs.length > 0) {
			result = await correctParagraphs(requestParagraphs);
		} else {
			let content =
				typeof req.body.content === 'string' ? req.body.content : '';
			if (!content) {
				const articleRows = await query(
					'SELECT content FROM articles WHERE article_id = ? AND deleted = 0 LIMIT 1',
					[articleId],
				);
				content =
					articleRows && articleRows.length > 0
						? articleRows[0].content || ''
						: '';
			}

			result = await correctArticleContent(content);
		}

		res.json(result);
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取文章历史记录
router.get('/get_article_history', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'unauthorized access' });
		}
		
		// 获取文章的历史记录
		let results = await query(
			`SELECT
				aw.id,
				aw.article_id,
				aw.title,
				aw.content,
				aw.create_time,
				aw.updated_at,
				aw.novel_id,
				aw.content_hash,
				aw.editor_user_id,
				aw.edit_session_id,
				u.name AS editor_name,
				u.avatar_url AS editor_avatar_url
			FROM articles_writer aw
			LEFT JOIN users u ON u.user_id = aw.editor_user_id
			WHERE aw.article_id = ?
			ORDER BY ${buildWriterUpdatedAtExpression('aw')} DESC, aw.id DESC`,
			[articleId],
		);
		
		res.end(JSON.stringify(results.map(serializeArticleHistoryRow)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_history_meta', auth, async function (req, res) {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'unauthorized access' });
		}

		let results = await query(
			`SELECT
				aw.id,
				aw.article_id,
				aw.title,
				aw.create_time,
				aw.updated_at,
				aw.novel_id,
				aw.content_hash,
				aw.editor_user_id,
				aw.edit_session_id,
				u.name AS editor_name,
				u.avatar_url AS editor_avatar_url
			FROM articles_writer aw
			LEFT JOIN users u ON u.user_id = aw.editor_user_id
			WHERE aw.article_id = ?
			ORDER BY ${buildWriterUpdatedAtExpression('aw')} DESC, aw.id DESC`,
			[articleId],
		);

		res.end(JSON.stringify(results.map(serializeArticleHistoryRow)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

//删除文章
router.post('/delete_article', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		const articleId = Number(req.body.id || 0);
		const access = await getArticleAccess(user.user_id, articleId);
		if (!access || !canDeleteArticle(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'SELECT article_id, novel_id, article_chapter FROM articles WHERE article_id = ? AND deleted = 0 LIMIT 1',
			[articleId],
		);
		if (results.length != 0) {
			const article = results[0];
			results = await query(
				'UPDATE articles SET deleted = 1 WHERE article_id = ?',
				[articleId],
			);
			await query(
				'DELETE FROM scheduled_publish_tasks WHERE article_id = ? AND status = "pending"',
				[articleId],
			);
			await query(
				'UPDATE articles SET article_chapter = article_chapter - 1 WHERE novel_id = ? AND deleted = 0 AND article_chapter > ?',
				[article.novel_id, article.article_chapter],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

//永久删除文章
router.post('/delete_forever', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		const access = await getArticleAccess(user.user_id, req.body.id);
		if (!access || !canDeleteArticle(access) || !access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'SELECT article_id FROM articles WHERE article_id = ? AND deleted = 1 LIMIT 1',
			[req.body.id],
		);
		if (results.length != 0) {
			results = await query(
				'DELETE FROM articles WHERE deleted = 1 AND article_id = ?',
				[req.body.id],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

//恢复删除文章
router.post('/restore_deleted', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		const access = await getArticleAccess(user.user_id, req.body.id);
		if (!access || !canDeleteArticle(access) || !access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		let results = await query(
			'SELECT article_id, novel_id FROM articles WHERE article_id = ? AND deleted = 1 LIMIT 1',
			[req.body.id],
		);
		if (results.length != 0) {
			const article = results[0];
			const activeArticles = await query(
				'SELECT COALESCE(MAX(article_chapter), 0) AS max_chapter FROM articles WHERE novel_id = ? AND deleted = 0',
				[article.novel_id],
			);
			let newChapter = Number(activeArticles[0].max_chapter || 0) + 1;
			results = await query(
				'UPDATE articles SET deleted = 0 , article_chapter = ? WHERE article_id = ?',
				[newChapter, req.body.id],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

//文章排序
router.post('/resort_article', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		let sortlist = JSON.parse(req.body.sortlist);
		if (!Array.isArray(sortlist) || sortlist.length === 0) {
			return res.status(400).json({ msg: 'sortlist is required' });
		}

		const access = await getArticleAccess(user.user_id, sortlist[0].article_id);
		if (!access || !canSortArticle(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		// Batch verify all articles exist and belong to the same novel
		const articleIds = sortlist.map(e => e.article_id);
		const placeholders = articleIds.map(() => '?').join(',');
		const articleCheckRows = await query(
			`SELECT article_id, novel_id FROM articles WHERE article_id IN (${placeholders})`,
			articleIds
		);

		if (articleCheckRows.length !== articleIds.length) {
			return res.status(400).json({ msg: 'some articles not found' });
		}

		for (const row of articleCheckRows) {
			if (Number(row.novel_id) !== Number(access.novel_id)) {
				return res.status(403).json({ msg: 'access denied' });
			}
		}

		// Batch update all article chapters in a single query
		const updateParts = sortlist.map(() => 'WHEN ? THEN ?').join(' ');
		const updateParams = sortlist.flatMap(e => [e.article_id, e.article_chapter]);
		await query(
			`UPDATE articles SET article_chapter = CASE article_id ${updateParts} END WHERE article_id IN (${placeholders})`,
			[...updateParams, ...articleIds]
		);

		res.end(JSON.stringify({ msg: 'success' }));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/master_work_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let master_work = await query(
			'SELECT master_work FROM writer_info WHERE user_id = ?',
			[user.user_id],
		);
		res.end(JSON.stringify(master_work));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取文章的错误反馈列表
router.get('/get_article_feedbacks', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.query.id || 0);
	try {
		if (!articleId) {
			return res.status(400).json({ msg: 'article_id is required' });
		}

		// 协作者也可以查看自己有权访问的文章反馈。
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canViewArticles(access) || access.article_deleted) {
			return res.status(403).json({ msg: '没有权限查看此文章的反馈' });
		}
		
		// 获取反馈列表
		let results = await query(
			`SELECT af.*, u.name as username, u.avatar_url
			 FROM article_feedback af
			 JOIN users u ON af.user_id = u.user_id
			 WHERE af.article_id = ?
			 ORDER BY af.status ASC, af.create_time DESC`,
			[articleId]
		);
		
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 更新错误反馈的状态
router.post('/update_feedback_status', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		let feedbackInfo = await query(
			`SELECT af.*, a.novel_id 
			 FROM article_feedback af
			 JOIN articles a ON af.article_id = a.article_id
			 WHERE af.feedback_id = ?`,
			[req.body.feedback_id]
		);
		
		if (feedbackInfo.length === 0) {
			return res.status(404).json({ msg: '未找到指定反馈' });
		}
		
		// 修改反馈状态属于文章编辑操作，遵循协作者的章节编辑权限。
		const access = await getArticleAccess(user.user_id, feedbackInfo[0].article_id);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: '没有权限更新此反馈状态' });
		}
		
		// 更新反馈状态
		await query(
			'UPDATE article_feedback SET status = ? WHERE feedback_id = ?',
			[req.body.status, req.body.feedback_id]
		);
		
		// 如果标记为已处理，给反馈者发送通知
		if (req.body.status === 1) {
			const message = require('../bin/message.js');
			message.sendMsg(
				user.user_id,
				feedbackInfo[0].user_id,
				`提交的错误反馈已被作者处理，原木社区有你更美好！`,
				'readers/newReader/article?id=' + feedbackInfo[0].article_id,
				'notification',
				true
			);
		}
		
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 上报作者在某篇章节中的创作活动。report_id 用于保证客户端重试不会重复累计。
router.post('/report_novel_writing_activity', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const articleId = Number(req.body.article_id || 0);
	const reportId = String(req.body.report_id || '').trim().slice(0, 64);
	const sessionId = sanitizeSessionId(req.body.session_id);
	const activeSeconds = Math.min(
		WRITING_ACTIVITY_MAX_REPORT_SECONDS,
		Math.max(0, Math.floor(Number(req.body.active_seconds || 0))),
	);
	const writtenChars = Math.min(
		WRITING_ACTIVITY_MAX_REPORT_CHARS,
		Math.max(0, Math.floor(Number(req.body.written_chars || 0))),
	);
	const activityDate = resolveWritingActivityDate(req.body.activity_date);

	if (!articleId || !reportId || !sessionId) {
		return res.status(400).json({
			msg: 'article_id, report_id and session_id are required',
		});
	}
	if (!/^[A-Za-z0-9:_-]+$/.test(reportId)) {
		return res.status(400).json({ msg: 'invalid report_id' });
	}
	if (activeSeconds <= 0 && writtenChars <= 0) {
		return res.status(400).json({ msg: 'empty writing activity report' });
	}

	try {
		const access = await getArticleAccess(user.user_id, articleId);
		if (!canEditDraft(access) || access.article_deleted) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const novelId = Number(access.novel_id);
		const transactionResult = await withTransaction(
			async (transactionalQuery) => {
				const inserted = await transactionalQuery(
					`INSERT IGNORE INTO novel_writing_activity_reports(
						report_id,
						session_id,
						novel_id,
						article_id,
						user_id,
						activity_date,
						active_seconds,
						written_chars
					) VALUES(?,?,?,?,?,?,?,?)`,
					[
						reportId,
						sessionId,
						novelId,
						articleId,
						user.user_id,
						activityDate,
						activeSeconds,
						writtenChars,
					],
				);

				if (!inserted || Number(inserted.affectedRows || 0) === 0) {
					return { duplicate: true };
				}

				await transactionalQuery(
					`INSERT INTO novel_writing_activity_daily(
						novel_id,
						user_id,
						activity_date,
						active_seconds,
						written_chars
					) VALUES(?,?,?,?,?)
					ON DUPLICATE KEY UPDATE
						active_seconds = active_seconds + VALUES(active_seconds),
						written_chars = written_chars + VALUES(written_chars)`,
					[
						novelId,
						user.user_id,
						activityDate,
						activeSeconds,
						writtenChars,
					],
				);

				return { duplicate: false };
			},
			'report novel writing activity',
		);

		return res.json({
			msg: 'ok',
			duplicate: transactionResult.duplicate,
			novel_id: novelId,
			activity_date: activityDate,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

// 获取当前作者在某本作品中的过去一年创作活动。
router.get('/get_novel_writing_calendar', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.novel_id || 0);
	const todayKey = formatDateKeyInTimezone(new Date());
	const toKey = req.query.to ? String(req.query.to) : todayKey;
	const fromKey = req.query.from
		? String(req.query.from)
		: shiftDateKey(toKey, -364);
	const fromDate = parseDateKey(fromKey);
	const toDate = parseDateKey(toKey);

	if (!novelId || !fromDate || !toDate || fromDate > toDate) {
		return res.status(400).json({ msg: 'invalid calendar range' });
	}
	const rangeDays = Math.floor(
		(toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000),
	);
	if (rangeDays > 370) {
		return res.status(400).json({ msg: 'calendar range is too large' });
	}

	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!canViewArticles(access)) {
			return res.status(403).json({ msg: 'access denied' });
		}

		const rows = await query(
			`SELECT
				DATE_FORMAT(activity_date, '%Y-%m-%d') AS activity_date,
				active_seconds,
				written_chars
			FROM novel_writing_activity_daily
			WHERE novel_id = ?
				AND user_id = ?
				AND activity_date >= ?
				AND activity_date <= ?
			ORDER BY activity_date ASC`,
			[novelId, user.user_id, fromKey, toKey],
		);

		const days = rows.map((row) => ({
			date: row.activity_date,
			active_seconds: Number(row.active_seconds || 0),
			written_chars: Number(row.written_chars || 0),
			level: calculateWritingActivityLevel(
				row.active_seconds,
				row.written_chars,
			),
		}));
		const activeDateSet = new Set(days.map((day) => day.date));
		let streakCursor = todayKey;
		if (!activeDateSet.has(streakCursor)) {
			streakCursor = shiftDateKey(streakCursor, -1);
		}
		let currentStreak = 0;
		while (streakCursor && activeDateSet.has(streakCursor)) {
			currentStreak += 1;
			streakCursor = shiftDateKey(streakCursor, -1);
		}

		return res.json({
			novel_id: novelId,
			user_id: Number(user.user_id),
			timezone: WRITING_ACTIVITY_TIMEZONE,
			from: fromKey,
			to: toKey,
			tracking_started_on: WRITING_ACTIVITY_TRACKING_STARTED_ON,
			thresholds: {
				mid_active_seconds: WRITING_ACTIVITY_MID_SECONDS,
				mid_written_chars: WRITING_ACTIVITY_MID_CHARS,
				full_active_seconds: WRITING_ACTIVITY_FULL_SECONDS,
				full_written_chars: WRITING_ACTIVITY_FULL_CHARS,
			},
			summary: {
				active_days: days.length,
				current_streak: currentStreak,
				total_active_seconds: days.reduce(
					(total, day) => total + day.active_seconds,
					0,
				),
				total_written_chars: days.reduce(
					(total, day) => total + day.written_chars,
					0,
				),
			},
			days,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: 'bad request' });
	}
});

// 获取作品的活动信息
router.get('/get_novel_activity', auth, async (req, res) => {
	const user = getCurrentUser(req);
	const novelId = Number(req.query.novel_id || 0);
	try {
		const access = await getNovelAccess(user.user_id, novelId);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'Novel not found or access denied' });
		}

		// 获取作品的标签，并检查是否有活动标签
		let activityTags = await query(`
			SELECT t.tag_id, t.tag_name, a.activity_name, a.activity_description, 
				   a.activity_news, a.required_fields
			FROM novel_tag nt
			JOIN tags t ON nt.tag_id = t.tag_id
			JOIN activity a ON t.tag_id = a.tag_id
			WHERE nt.novel_id = ? AND t.is_activity_tag = 1 AND t.is_deleted = 0
		`, [novelId]);

		if (activityTags.length === 0) {
			return res.json({ hasActivity: false });
		}

		// 获取用户已填写的活动信息
		let userActivityInfo = await query(`
			SELECT ai.*, a.required_fields
			FROM activity_information ai
			JOIN activity a ON ai.tag_id = a.tag_id
			WHERE ai.user_id = ? AND ai.novel_id = ?
		`, [user.user_id, novelId]);

		// 解析JSON字段
		activityTags = activityTags.map(tag => ({
			...tag,
			activity_news: JSON.parse(tag.activity_news || '[]'),
			required_fields: JSON.parse(tag.required_fields || '[]')
		}));

		userActivityInfo = userActivityInfo.map(info => ({
			...info,
			form_data: JSON.parse(info.form_data || '{}')
		}));

		res.json({
			hasActivity: true,
			activities: activityTags,
			userInfo: userActivityInfo
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 提交活动信息
router.post('/submit_activity_info', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		const { novel_id, tag_id, form_data } = req.body;
		const access = await getNovelAccess(user.user_id, novel_id);
		if (!hasNovelOwnerAccess(access)) {
			return res.status(403).json({ msg: 'Novel not found or access denied' });
		}

		// 验证标签是否为活动标签
		let activityTag = await query(
			'SELECT * FROM tags WHERE tag_id = ? AND is_activity_tag = 1 AND is_deleted = 0',
			[tag_id]
		);
		
		if (activityTag.length === 0) {
			return res.json(400, { msg: 'Invalid activity tag' });
		}

		// 检查是否已存在记录
		let existingInfo = await query(
			'SELECT * FROM activity_information WHERE user_id = ? AND novel_id = ? AND tag_id = ?',
			[user.user_id, novel_id, tag_id]
		);

		if (existingInfo.length > 0) {
			// 更新现有记录
			await query(
				'UPDATE activity_information SET information_data = ?, update_time = CURRENT_TIMESTAMP WHERE user_id = ? AND novel_id = ? AND tag_id = ?',
				[JSON.stringify(form_data), user.user_id, novel_id, tag_id]
			);
		} else {
			// 插入新记录
			await query(
				'INSERT INTO activity_information (user_id, novel_id, tag_id, information_data, submit_time, update_time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
				[user.user_id, novel_id, tag_id, JSON.stringify(form_data)]
			);
		}

		res.json({ success: true, msg: 'Activity information submitted successfully' });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取定时发布任务列表
router.get('/get_scheduled_tasks', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		let results = await query(
			`SELECT 
				t.task_id,
				t.publish_time,
				t.status,
				a.article_id,
				a.title as article_title,
				a.article_chapter,
				n.novel_id,
				n.name as novel_name
			FROM scheduled_publish_tasks t
			JOIN articles a ON t.article_id = a.article_id
			JOIN novels n ON a.novel_id = n.novel_id
			LEFT JOIN novel_collaborators nc
				ON nc.novel_id = n.novel_id
				AND nc.user_id = ?
			WHERE t.status = 'pending'
				AND (
					n.author_id = ?
						OR (
							nc.status = ?
							AND nc.can_publish_article = 1
							AND (
								(
									SELECT COUNT(*)
									FROM novel_collaborators nc_count
									WHERE nc_count.novel_id = n.novel_id
										AND nc_count.status = '${COLLABORATOR_STATUS.ACTIVE}'
								) <= 1
								OR EXISTS(
									SELECT 1
									FROM membership_subscriptions ms
									WHERE ms.user_id = n.author_id
										AND ms.status = 'active'
										AND ms.starts_at <= NOW()
										AND ms.expires_at > NOW()
										AND ms.membership_type IN ('standard', 'super')
								)
							)
						)
				)
			ORDER BY t.publish_time ASC`,
			[user.user_id, user.user_id, COLLABORATOR_STATUS.ACTIVE]
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 取消定时发布任务
router.post('/cancel_scheduled_task', auth, async (req, res) => {
	const user = getCurrentUser(req);
	try {
		// 验证任务是否属于当前用户
		let task = await query(
			`SELECT t.* 
			 FROM scheduled_publish_tasks t
			 JOIN articles a ON t.article_id = a.article_id
			 JOIN novels n ON a.novel_id = n.novel_id
			 LEFT JOIN novel_collaborators nc
				ON nc.novel_id = n.novel_id
				AND nc.user_id = ?
			 WHERE t.task_id = ?
				AND (
					n.author_id = ?
						OR (
							nc.status = ?
							AND nc.can_publish_article = 1
							AND (
								(
									SELECT COUNT(*)
									FROM novel_collaborators nc_count
									WHERE nc_count.novel_id = n.novel_id
										AND nc_count.status = '${COLLABORATOR_STATUS.ACTIVE}'
								) <= 1
								OR EXISTS(
									SELECT 1
									FROM membership_subscriptions ms
									WHERE ms.user_id = n.author_id
										AND ms.status = 'active'
										AND ms.starts_at <= NOW()
										AND ms.expires_at > NOW()
										AND ms.membership_type IN ('standard', 'super')
								)
							)
						)
				)`,
			[
				user.user_id,
				req.body.task_id,
				user.user_id,
				COLLABORATOR_STATUS.ACTIVE,
			]
		);

		if (task.length === 0) {
			return res.json(400, { msg: 'Task not found or access denied' });
		}

		// 删除任务
		await query(
			'DELETE FROM scheduled_publish_tasks WHERE task_id = ?',
			[req.body.task_id]
		);

		res.json({ success: true, msg: 'Scheduled task canceled successfully' });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
