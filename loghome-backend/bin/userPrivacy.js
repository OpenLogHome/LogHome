const fs = require('fs');
const path = require('path');

const LIST_VISIBILITIES = ['public', 'following_only', 'fans_only', 'private'];
const MESSAGE_POLICIES = ['default', 'following', 'mutual', 'none'];
const DEFAULTS = Object.freeze({ follow_list_visibility: 'public', direct_message_policy: 'default' });

function validUserId(value) {
	return /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function canViewList(settings, kind, ownerId, viewerId) {
	if (validUserId(viewerId) && Number(ownerId) === Number(viewerId)) return true;
	return settings.follow_list_visibility === 'public' ||
		settings.follow_list_visibility === (kind === 'following' ? 'following_only' : 'fans_only');
}

function canSendMessage(policy, recipientFollowsSender, senderFollowsRecipient) {
	return policy === 'default' ||
		(policy === 'following' && recipientFollowsSender) ||
		(policy === 'mutual' && recipientFollowsSender && senderFollowsRecipient);
}

function createPrivacyService({ query, verifyToken } = {}) {
	const databaseQuery = query || ((...args) => require('../sql.js').query(...args));
	const decodeToken = verifyToken || (token => require('jsonwebtoken').verify(token, require('../SECRET.js').SECRET));
	let schemaReady;
	async function ensureSchema() {
		if (!schemaReady) {
			schemaReady = (async () => {
				try {
					await databaseQuery('SELECT user_id FROM user_privacy_settings LIMIT 1');
				} catch (error) {
					if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
					await databaseQuery(fs.readFileSync(path.join(__dirname, '../sql/user_privacy_settings.sql'), 'utf8'));
				}
			})();
		}
		try { await schemaReady; } catch (error) { schemaReady = null; throw error; }
	}
	async function getSettings(userId) {
		await ensureSchema();
		const rows = await databaseQuery('SELECT follow_list_visibility, direct_message_policy FROM user_privacy_settings WHERE user_id = ?', [userId]);
		return rows[0] || { ...DEFAULTS };
	}
	async function saveSettings(userId, settings) {
		if (!settings || !LIST_VISIBILITIES.includes(settings.follow_list_visibility) || !MESSAGE_POLICIES.includes(settings.direct_message_policy)) {
			const error = new Error('隐私设置选项无效');
			error.statusCode = 422;
			throw error;
		}
		await ensureSchema();
		await databaseQuery(`INSERT INTO user_privacy_settings (user_id, follow_list_visibility, direct_message_policy)
			VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE follow_list_visibility = VALUES(follow_list_visibility), direct_message_policy = VALUES(direct_message_policy)`,
			[userId, settings.follow_list_visibility, settings.direct_message_policy]);
		return { follow_list_visibility: settings.follow_list_visibility, direct_message_policy: settings.direct_message_policy };
	}
	// 公开列表仍允许游客浏览；本人豁免只认可服务端验证过的账户身份。
	async function getViewerId(req) {
		if (req.user && req.user[0]) return req.user[0].user_id;
		const token = String(req.headers.authorization || '').split(' ').pop();
		if (!token) return null;
		let decoded;
		try { decoded = decodeToken(token); } catch (_) { return null; }
		if (!decoded || !validUserId(decoded.id) || typeof decoded.pwd !== 'string') return null;
		const users = await databaseQuery('SELECT user_id FROM users WHERE user_id = ? AND pwd = ? AND activated = 1', [decoded.id, decoded.pwd]);
		return users[0] ? users[0].user_id : null;
	}
	function listGuard(kind) {
		return async (req, res, next) => {
			if (!validUserId(req.query.id)) return res.status(400).json({ msg: '用户 ID 无效' });
			try {
				const [settings, viewerId] = await Promise.all([getSettings(req.query.id), getViewerId(req)]);
				if (!canViewList(settings, kind, req.query.id, viewerId)) {
					return res.status(403).json({ code: 'PRIVATE_LIST', msg: '该列表已设为私密' });
				}
				next();
			} catch (error) { next(error); }
		};
	}
	async function messageGuard(req, res, next) {
		const senderId = req.user[0].user_id;
		const recipientId = req.body.to_id;
		if (!validUserId(recipientId)) return res.status(400).json({ msg: '收件人 ID 无效' });
		try {
			const users = await databaseQuery('SELECT user_id FROM users WHERE user_id = ? AND activated = 1', [recipientId]);
			if (!users.length) return res.status(404).json({ msg: '收件人不存在' });
			const settings = await getSettings(recipientId);
			let relations = [];
			if (settings.direct_message_policy === 'following' || settings.direct_message_policy === 'mutual') {
				relations = await databaseQuery(`SELECT user_id, follow_id FROM user_follow
					WHERE (user_id = ? AND follow_id = ?) OR (user_id = ? AND follow_id = ?)`,
					[recipientId, senderId, senderId, recipientId]);
			}
			const recipientFollows = relations.some(row => Number(row.user_id) === Number(recipientId) && Number(row.follow_id) === Number(senderId));
			const senderFollows = relations.some(row => Number(row.user_id) === Number(senderId) && Number(row.follow_id) === Number(recipientId));
			if (!canSendMessage(settings.direct_message_policy, recipientFollows, senderFollows)) {
				return res.status(403).json({ code: 'PRIVATE_MESSAGE_FORBIDDEN', msg: '对方的隐私设置不允许你发送私信' });
			}
			next();
		} catch (error) { next(error); }
	}
	async function relationGuard(req, res, next) {
		const { user_id: ownerId, target_id: targetId } = req.query;
		if (!validUserId(ownerId) || !validUserId(targetId)) return res.status(400).json({ msg: '用户 ID 无效' });
		try {
			const viewerId = await getViewerId(req);
			if (Number(viewerId) === Number(ownerId) || Number(viewerId) === Number(targetId)) return next();
			const [owner, target] = await Promise.all([getSettings(ownerId), getSettings(targetId)]);
			if (!canViewList(owner, 'following', ownerId, viewerId) || !canViewList(target, 'fans', targetId, viewerId)) {
				return res.status(403).json({ code: 'PRIVATE_LIST', msg: '该关注关系已设为私密' });
			}
			next();
		} catch (error) { next(error); }
	}
	return { getSettings, saveSettings, getViewerId, listGuard, messageGuard, relationGuard };
}

module.exports = { ...createPrivacyService(), createPrivacyService, canViewList, canSendMessage, validUserId };
