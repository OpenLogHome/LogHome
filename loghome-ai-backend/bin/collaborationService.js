const crypto = require('crypto');
const { Server } = require('@hocuspocus/server');
const { ProsemirrorTransformer } = require('@hocuspocus/transformer');
const Y = require('yjs');
const { prosemirrorJSONToYXmlFragment } = require('y-prosemirror');
const config = require('../config');
const { query, withTransaction } = require('../sql');
const { getAuthenticatedUser } = require('./auth');
const {
	COLLABORATION_MODE_REALTIME,
	buildArticleDocumentName,
	getArticleCollaborationAccess,
	parseArticleDocumentName,
} = require('./collaborationAccess');
const writerSchema = require('../utils/writerCollaborationSchema');
const {
	docToLegacyBlocks,
	legacyBlocksToDoc,
	parseLegacyContent,
	stringifyLegacyContent,
	trimBoundaryEmptyTextBlocks,
} = require('../utils/writerDocumentCodec');

let collaborationServer = null;
const collaborationChatHistory = new Map();
const collaborationChatRateLimits = new WeakMap();
const COLLABORATION_CHAT_HISTORY_LIMIT = 100;
const COLLABORATION_CHAT_MESSAGE_MAX_LENGTH = 300;
const COLLABORATION_CHAT_RATE_WINDOW_MS = 10000;
const COLLABORATION_CHAT_RATE_LIMIT = 12;

function currentCompactTime() {
	const now = new Date();
	return [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, '0'),
		String(now.getDate()).padStart(2, '0'),
		String(now.getHours()).padStart(2, '0'),
		String(now.getMinutes()).padStart(2, '0'),
		String(now.getSeconds()).padStart(2, '0'),
	].join('');
}

function calculateContentHash(content) {
	return crypto.createHash('md5').update(String(content || '')).digest('hex');
}

function userColor(userId) {
	const colors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2'];
	return colors[Math.abs(Number(userId) || 0) % colors.length];
}

function normalizeAwarenessColor(value, fallback) {
	const color = String(value || '');
	return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : fallback;
}

function serializeAwarenessParticipants(states) {
	const participantsByUserId = new Map();
	for (const state of states instanceof Map ? states.values() : []) {
		const awarenessUser = state && typeof state.user === 'object'
			? state.user
			: null;
		const userId = Number(awarenessUser && (awarenessUser.id || awarenessUser.user_id));
		if (!Number.isInteger(userId) || userId <= 0) continue;

		participantsByUserId.set(userId, {
			user_id: userId,
			name: String(awarenessUser.name || `用户${userId}`).trim() || `用户${userId}`,
			avatar_url: String(awarenessUser.avatarUrl || awarenessUser.avatar_url || ''),
			color: normalizeAwarenessColor(awarenessUser.color, userColor(userId)),
		});
	}

	return Array.from(participantsByUserId.values())
		.sort((left, right) => left.user_id - right.user_id);
}

function getRealtimeArticlePresence(articleIds) {
	const normalizedIds = Array.from(new Set((Array.isArray(articleIds) ? articleIds : [])
		.map((articleId) => Number(articleId))
		.filter((articleId) => Number.isInteger(articleId) && articleId > 0)));
	const presence = {};
	const server = getCollaborationServer();

	for (const articleId of normalizedIds) {
		const document = server
			? server.hocuspocus.documents.get(buildArticleDocumentName(articleId))
			: null;
		presence[articleId] = document
			? serializeAwarenessParticipants(document.awareness.getStates())
			: [];
	}
	return presence;
}

function getCollaborationChatHistory(documentName) {
	return collaborationChatHistory.get(String(documentName || '')) || [];
}

function clearCollaborationChatHistory(documentName) {
	collaborationChatHistory.delete(String(documentName || ''));
}

function canSendCollaborationChatMessage(connection, now = Date.now()) {
	const recent = (collaborationChatRateLimits.get(connection) || [])
		.filter((timestamp) => now - timestamp < COLLABORATION_CHAT_RATE_WINDOW_MS);
	if (recent.length >= COLLABORATION_CHAT_RATE_LIMIT) {
		collaborationChatRateLimits.set(connection, recent);
		return false;
	}
	recent.push(now);
	collaborationChatRateLimits.set(connection, recent);
	return true;
}

function sendCollaborationChatPayload(connection, payload) {
	connection.sendStateless(JSON.stringify(payload));
}

function handleCollaborationStateless({ connection, document, documentName, payload }) {
	let request = null;
	try {
		request = JSON.parse(String(payload || ''));
	} catch (error) {
		return;
	}
	if (!request || typeof request !== 'object') return;

	if (request.type === 'collaboration_chat_history_request') {
		sendCollaborationChatPayload(connection, {
			type: 'collaboration_chat_history',
			messages: getCollaborationChatHistory(documentName),
		});
		return;
	}
	if (request.type !== 'collaboration_chat_send') return;

	const content = String(request.content || '').trim();
	if (!content || content.length > COLLABORATION_CHAT_MESSAGE_MAX_LENGTH) return;
	if (!canSendCollaborationChatMessage(connection)) return;

	const context = connection && connection.context ? connection.context : {};
	const userId = Number(context.userId || 0);
	if (!userId) return;
	const presenceUser = serializeAwarenessParticipants(document.awareness.getStates())
		.find((participant) => participant.user_id === userId);
	const message = {
		id: `${Date.now().toString(36)}_${crypto.randomBytes(6).toString('hex')}`,
		user_id: userId,
		name: String(presenceUser && presenceUser.name || context.name || `用户${userId}`),
		avatar_url: String(presenceUser && presenceUser.avatar_url || context.avatarUrl || ''),
		color: normalizeAwarenessColor(
			presenceUser && presenceUser.color,
			context.color || userColor(userId),
		),
		content,
		sent_at: new Date().toISOString(),
	};
	const history = getCollaborationChatHistory(documentName);
	history.push(message);
	if (history.length > COLLABORATION_CHAT_HISTORY_LIMIT) {
		history.splice(0, history.length - COLLABORATION_CHAT_HISTORY_LIMIT);
	}
	collaborationChatHistory.set(documentName, history);
	document.broadcastStateless(JSON.stringify({
		type: 'collaboration_chat_message',
		message,
	}));
}

function isAllowedWebSocketOrigin(origin) {
	const allowed = Array.isArray(config.cors.origins) ? config.cors.origins : ['*'];
	if (!origin || allowed.includes('*') || allowed.includes(origin)) return true;
	try {
		return ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']
			.includes(new URL(origin).hostname);
	} catch (error) {
		return false;
	}
}

function createHttpError(status, message, code) {
	const error = new Error(message);
	error.status = status;
	error.code = code;
	return error;
}

async function getLatestLegacyArticle(articleId) {
	const writerRows = await query(
		`SELECT aw.id, aw.article_id, aw.novel_id, aw.title, aw.content
		FROM articles_writer aw
		WHERE aw.article_id = ?
		ORDER BY COALESCE(aw.updated_at, STR_TO_DATE(aw.create_time, '%Y%m%d%H%i%s')) DESC, aw.id DESC
		LIMIT 1`,
		[articleId],
	);
	if (writerRows[0]) return writerRows[0];

	const articleRows = await query(
		`SELECT article_id, novel_id, title, content
		FROM articles
		WHERE article_id = ? AND deleted = 0
		LIMIT 1`,
		[articleId],
	);
	return articleRows[0] || null;
}

function seedDocument(document, sourceArticle) {
	const blocks = parseLegacyContent(sourceArticle && sourceArticle.content);
	const seed = ProsemirrorTransformer.toYdoc(
		legacyBlocksToDoc(blocks),
		'body',
		writerSchema,
	);
	Y.applyUpdate(document, Y.encodeStateAsUpdate(seed));

	const title = document.getText('title');
	if (title.length > 0) title.delete(0, title.length);
	title.insert(0, String((sourceArticle && sourceArticle.title) || ''));
	document.getMap('meta').set('schemaVersion', 1);
	document.getMap('meta').set('articleId', Number(sourceArticle.article_id));
}

function repairBoundaryEmptyParagraphs(document) {
	const body = document.getXmlFragment('body');
	const prosemirrorDoc = ProsemirrorTransformer.fromYdoc(document, 'body');
	const blocks = docToLegacyBlocks(prosemirrorDoc);
	const repairedBlocks = trimBoundaryEmptyTextBlocks(blocks);
	if (repairedBlocks.length === blocks.length) return false;

	prosemirrorJSONToYXmlFragment(
		writerSchema,
		legacyBlocksToDoc(repairedBlocks),
		body,
	);
	return true;
}

function projectDocument(document) {
	const prosemirrorDoc = ProsemirrorTransformer.fromYdoc(document, 'body');
	const blocks = trimBoundaryEmptyTextBlocks(docToLegacyBlocks(prosemirrorDoc));
	const content = stringifyLegacyContent(blocks);
	return {
		title: document.getText('title').toString(),
		content,
		contentHash: calculateContentHash(content),
	};
}

async function persistDocument(articleId, document, editorUserId, options = {}) {
	repairBoundaryEmptyParagraphs(document);
	const projection = projectDocument(document);
	const binaryState = Buffer.from(Y.encodeStateAsUpdate(document));
	const createTime = currentCompactTime();

	return withTransaction(async (transactionQuery) => {
		const documentRows = await transactionQuery(
			`SELECT article_id, revision, live_writer_id, ydoc_state
			FROM article_collab_documents
			WHERE article_id = ?
			FOR UPDATE`,
			[articleId],
		);
		const articleRows = await transactionQuery(
			'SELECT article_id, novel_id FROM articles WHERE article_id = ? AND deleted = 0 LIMIT 1',
			[articleId],
		);
		if (!articleRows[0]) throw createHttpError(404, 'article not found', 'article_not_found');

		const previous = documentRows[0] || null;
		const previousState = previous && previous.ydoc_state
			? Buffer.from(previous.ydoc_state)
			: null;
		const stateChanged = !previousState || !previousState.equals(binaryState);
		const revision = previous
			? Number(previous.revision || 0) + (stateChanged ? 1 : 0)
			: 1;
		let liveWriterId = Number(previous && previous.live_writer_id || 0);

		if (liveWriterId) {
			const updateResult = await transactionQuery(
				`UPDATE articles_writer
				SET title = ?, content = ?, content_hash = ?, create_time = ?, novel_id = ?,
					editor_user_id = ?, edit_session_id = NULL
				WHERE id = ? AND article_id = ?`,
				[
					projection.title,
					projection.content,
					projection.contentHash,
					createTime,
					articleRows[0].novel_id,
					editorUserId || null,
					liveWriterId,
					articleId,
				],
			);
			if (!updateResult.affectedRows) liveWriterId = 0;
		}

		if (!liveWriterId) {
			const insertResult = await transactionQuery(
				`INSERT INTO articles_writer(
					article_id, title, content, content_hash, create_time, novel_id,
					editor_user_id, edit_session_id
				) VALUES(?,?,?,?,?,?,?,NULL)`,
				[
					articleId,
					projection.title,
					projection.content,
					projection.contentHash,
					createTime,
					articleRows[0].novel_id,
					editorUserId || null,
				],
			);
			liveWriterId = Number(insertResult.insertId);
		}

		let checkpointWriterId = null;
		if (options.createCheckpoint === true) {
			const checkpointResult = await transactionQuery(
				`INSERT INTO articles_writer(
					article_id, title, content, content_hash, create_time, novel_id,
					editor_user_id, edit_session_id
				) VALUES(?,?,?,?,?,?,?,NULL)`,
				[
					articleId,
					projection.title,
					projection.content,
					projection.contentHash,
					createTime,
					articleRows[0].novel_id,
					editorUserId || null,
				],
			);
			checkpointWriterId = Number(checkpointResult.insertId);
		}

		await transactionQuery(
			`INSERT INTO article_collab_documents(
				article_id, document_name, ydoc_state, schema_version, revision,
				live_writer_id, checkpoint_writer_id, checkpoint_revision,
				content_hash, last_editor_user_id
			) VALUES(?,?,?,?,?,?,?,?,?,?)
			ON DUPLICATE KEY UPDATE
				document_name = VALUES(document_name),
				ydoc_state = VALUES(ydoc_state),
				schema_version = VALUES(schema_version),
				revision = VALUES(revision),
				live_writer_id = VALUES(live_writer_id),
				checkpoint_writer_id = COALESCE(VALUES(checkpoint_writer_id), checkpoint_writer_id),
				checkpoint_revision = IF(VALUES(checkpoint_writer_id) IS NULL, checkpoint_revision, VALUES(checkpoint_revision)),
				content_hash = VALUES(content_hash),
				last_editor_user_id = VALUES(last_editor_user_id)`,
			[
				articleId,
				buildArticleDocumentName(articleId),
				binaryState,
				1,
				revision,
				liveWriterId,
				checkpointWriterId,
				checkpointWriterId ? revision : null,
				projection.contentHash,
				editorUserId || null,
			],
		);

		return {
			articleId,
			revision,
			writerId: liveWriterId,
			checkpointWriterId,
			...projection,
		};
	});
}

async function loadDocument({ articleId, document, editorUserId }) {
	const rows = await query(
		`SELECT ydoc_state
		FROM article_collab_documents
		WHERE article_id = ?
		LIMIT 1`,
		[articleId],
	);
	if (rows[0] && rows[0].ydoc_state) {
		Y.applyUpdate(document, new Uint8Array(rows[0].ydoc_state));
		if (repairBoundaryEmptyParagraphs(document)) {
			await persistDocument(articleId, document, editorUserId);
		}
		return document;
	}

	const source = await getLatestLegacyArticle(articleId);
	if (!source) throw createHttpError(404, 'article not found', 'article_not_found');
	seedDocument(document, source);
	await persistDocument(articleId, document, editorUserId);
	return document;
}

async function authenticateConnection(data) {
	const articleId = parseArticleDocumentName(data.documentName);
	if (!articleId) throw createHttpError(400, 'invalid document name', 'invalid_document_name');
	const user = await getAuthenticatedUser({
		headers: { authorization: `Bearer ${data.token || ''}` },
	});
	if (!user) throw createHttpError(401, 'unauthorized', 'unauthorized');

	const access = await getArticleCollaborationAccess(user.user_id, articleId);
	if (
		!access
		|| access.deleted
		|| !access.canEdit
		|| access.collaborationMode !== COLLABORATION_MODE_REALTIME
	) {
		throw createHttpError(403, 'collaboration access denied', 'collaboration_access_denied');
	}

	data.connectionConfig.readOnly = false;
	return {
		articleId,
		userId: Number(user.user_id),
		name: String(user.name || `用户${user.user_id}`),
		avatarUrl: user.avatar_url || '',
		color: userColor(user.user_id),
	};
}

function createCollaborationServer() {
	return new Server({
		port: config.collaboration.port,
		address: config.collaboration.address,
		stopOnSignals: false,
		quiet: true,
		debounce: config.collaboration.debounceMs,
		maxDebounce: config.collaboration.maxDebounceMs,
		unloadImmediately: false,
		websocketOptions: { maxPayload: config.collaboration.maxPayloadBytes },
		async onUpgrade({ request }) {
			if (!isAllowedWebSocketOrigin(request.headers.origin)) {
				throw createHttpError(403, 'websocket origin is not allowed', 'origin_not_allowed');
			}
		},
		async onAuthenticate(data) {
			return authenticateConnection(data);
		},
		async onLoadDocument({ context, document, documentName }) {
			const articleId = parseArticleDocumentName(documentName);
			return loadDocument({ articleId, document, editorUserId: context.userId });
		},
		async onStoreDocument({ document, documentName, lastContext }) {
			const articleId = parseArticleDocumentName(documentName);
			await persistDocument(articleId, document, lastContext && lastContext.userId);
		},
		async beforeHandleAwareness({ context, states }) {
			if (!context) return;
			for (const [clientId, state] of states.entries()) {
				if (state === null) continue;
				const requestedUser = state && typeof state.user === 'object'
					? state.user
					: {};
				states.set(clientId, {
					...(state || {}),
					user: {
						id: context.userId,
						name: context.name,
						avatarUrl: context.avatarUrl,
						color: normalizeAwarenessColor(requestedUser.color, context.color),
					},
				});
			}
		},
		onStateless(payload) {
			handleCollaborationStateless(payload);
		},
		afterUnloadDocument({ documentName }) {
			clearCollaborationChatHistory(documentName);
		},
	});
}

async function startCollaborationServer() {
	if (!config.collaboration.enabled) return null;
	if (collaborationServer) return collaborationServer;
	collaborationServer = createCollaborationServer();
	await collaborationServer.listen();
	console.log(`writer collaboration server listening on ${collaborationServer.webSocketURL}`);
	return collaborationServer;
}

async function stopCollaborationServer() {
	if (!collaborationServer) return;
	const server = collaborationServer;
	collaborationServer = null;
	server.hocuspocus.flushPendingStores();
	await server.destroy();
}

async function withDirectDocument(articleId, userContext, work) {
	if (!collaborationServer) {
		throw createHttpError(503, 'collaboration server is disabled', 'collaboration_disabled');
	}
	const connection = await collaborationServer.hocuspocus.openDirectConnection(
		buildArticleDocumentName(articleId),
		userContext,
	);
	try {
		return await work(connection.document, connection);
	} finally {
		await connection.disconnect({ unloadImmediately: false });
	}
}

async function checkpointArticle(articleId, user) {
	const access = await getArticleCollaborationAccess(user.user_id, articleId);
	if (
		!access || access.deleted || !access.canEdit
		|| access.collaborationMode !== COLLABORATION_MODE_REALTIME
	) {
		throw createHttpError(403, 'access denied', 'access_denied');
	}
	return withDirectDocument(articleId, {
		articleId,
		userId: Number(user.user_id),
		name: user.name || '',
	}, (document) => persistDocument(articleId, document, user.user_id, { createCheckpoint: true }));
}

async function restoreArticleFromWriter(articleId, writerId, user) {
	const access = await getArticleCollaborationAccess(user.user_id, articleId);
	if (
		!access || access.deleted || !access.canEdit
		|| access.collaborationMode !== COLLABORATION_MODE_REALTIME
	) {
		throw createHttpError(403, 'access denied', 'access_denied');
	}
	const rows = await query(
		'SELECT id, article_id, title, content FROM articles_writer WHERE id = ? AND article_id = ? LIMIT 1',
		[writerId, articleId],
	);
	if (!rows[0]) throw createHttpError(404, 'writer snapshot not found', 'snapshot_not_found');

	return withDirectDocument(articleId, {
		articleId,
		userId: Number(user.user_id),
		name: user.name || '',
	}, async (document, connection) => {
		await connection.transact((activeDocument) => {
			const body = activeDocument.getXmlFragment('body');
			prosemirrorJSONToYXmlFragment(
				writerSchema,
				legacyBlocksToDoc(parseLegacyContent(rows[0].content)),
				body,
			);
			const title = activeDocument.getText('title');
			if (title.length) title.delete(0, title.length);
			title.insert(0, String(rows[0].title || ''));
		});
		return persistDocument(articleId, document, user.user_id, { createCheckpoint: true });
	});
}

async function replaceArticleFromLegacy(articleId, titleValue, contentValue, user) {
	const access = await getArticleCollaborationAccess(user.user_id, articleId);
	if (
		!access || access.deleted || !access.canEdit
		|| access.collaborationMode !== COLLABORATION_MODE_REALTIME
	) {
		throw createHttpError(403, 'access denied', 'access_denied');
	}
	return withDirectDocument(articleId, {
		articleId,
		userId: Number(user.user_id),
		name: user.name || '',
	}, async (document, connection) => {
		await connection.transact((activeDocument) => {
			prosemirrorJSONToYXmlFragment(
				writerSchema,
				legacyBlocksToDoc(parseLegacyContent(contentValue)),
				activeDocument.getXmlFragment('body'),
			);
			const title = activeDocument.getText('title');
			if (title.length) title.delete(0, title.length);
			title.insert(0, String(titleValue || ''));
		});
		return persistDocument(articleId, document, user.user_id, { createCheckpoint: true });
	});
}

async function reserveParagraphIds(articleId, requestedSize, user) {
	const access = await getArticleCollaborationAccess(user.user_id, articleId);
	if (
		!access || access.deleted || !access.canEdit
		|| access.collaborationMode !== COLLABORATION_MODE_REALTIME
	) {
		throw createHttpError(403, 'access denied', 'access_denied');
	}
	const size = Math.min(1024, Math.max(32, Number(requestedSize) || 256));

	return withTransaction(async (transactionQuery) => {
		await transactionQuery(
			'SELECT article_id FROM articles WHERE article_id = ? FOR UPDATE',
			[articleId],
		);
		const sequenceRows = await transactionQuery(
			'SELECT next_id FROM article_paragraph_id_sequences WHERE article_id = ? FOR UPDATE',
			[articleId],
		);
		let start = Number(sequenceRows[0] && sequenceRows[0].next_id || 0);
		if (!start) {
			const contentRows = await transactionQuery(
				`SELECT content FROM articles_writer
				WHERE article_id = ?
				ORDER BY COALESCE(updated_at, STR_TO_DATE(create_time, '%Y%m%d%H%i%s')) DESC, id DESC
				LIMIT 1`,
				[articleId],
			);
			const maxId = parseLegacyContent(contentRows[0] && contentRows[0].content)
				.reduce((maximum, block) => Math.max(maximum, Number(block.id) || 0), 0);
			start = maxId + 1;
			await transactionQuery(
				'INSERT INTO article_paragraph_id_sequences(article_id, next_id) VALUES(?, ?)',
				[articleId, start + size],
			);
		} else {
			await transactionQuery(
				'UPDATE article_paragraph_id_sequences SET next_id = ? WHERE article_id = ?',
				[start + size, articleId],
			);
		}
		return { start, end: start + size - 1, size };
	});
}

function getCollaborationServer() {
	return collaborationServer;
}

module.exports = {
	checkpointArticle,
	createHttpError,
	getCollaborationServer,
	getCollaborationChatHistory,
	getRealtimeArticlePresence,
	handleCollaborationStateless,
	persistDocument,
	projectDocument,
	repairBoundaryEmptyParagraphs,
	serializeAwarenessParticipants,
	replaceArticleFromLegacy,
	reserveParagraphIds,
	restoreArticleFromWriter,
	startCollaborationServer,
	stopCollaborationServer,
};
