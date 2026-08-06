// 会员兑换码管理（管理侧）
let crypto = require('crypto');
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let membership = require('../../bin/membership.js');

let router = express.Router();

// 搜索用户（按用户ID或昵称）
router.get('/users/search', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();
		const page = parseInt(req.query.page, 10) || 1;
		const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 20);
		const offset = (page - 1) * pageSize;

		if (!keyword) {
			return res.json({ code: 200, data: { list: [], total: 0 } });
		}

		let whereClause = 'WHERE u.user_id = ? OR u.name LIKE ?';
		let params = [keyword, `%${keyword}%`];

		const list = await query(
			`SELECT u.user_id, u.name, u.avatar_url, u.motto, u.activated
			 FROM users u
			 ${whereClause}
			 ORDER BY u.user_id ASC
			 LIMIT ?, ?`,
			[...params, offset, pageSize],
		);

		const totalRows = await query(
			`SELECT COUNT(*) AS total
			 FROM users u
			 ${whereClause}`,
			params,
		);

		res.json({
			code: 200,
			data: {
				list,
				total: totalRows[0] ? totalRows[0].total : 0,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取所有已开通通行证的用户（每人返回当前最相关的订阅记录）
router.get('/pass-users', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 20);
		const offset = (page - 1) * pageSize;
		const keyword = String(req.query.keyword || '').trim();
		const status = String(req.query.status || '').trim();

		const baseSql = `
			FROM membership_subscriptions s
			JOIN users u ON u.user_id = s.user_id
			WHERE s.subscription_id = (
				SELECT s2.subscription_id
				FROM membership_subscriptions s2
				WHERE s2.user_id = s.user_id
				ORDER BY FIELD(s2.membership_type, 'super', 'standard'),
				         s2.expires_at DESC, s2.subscription_id DESC
				LIMIT 1
			)`;

		let whereClause = '';
		let params = [];

		if (keyword) {
			whereClause = ' AND (s.user_id = ? OR u.name LIKE ?)';
			params.push(keyword, `%${keyword}%`);
		}

		let statusClause = '';
		if (status === 'active') {
			statusClause = ` AND s.status = 'active' AND s.starts_at <= NOW() AND s.expires_at > NOW()`;
		} else if (status === 'inactive') {
			statusClause = ` AND NOT (s.status = 'active' AND s.starts_at <= NOW() AND s.expires_at > NOW())`;
		}

		const list = await query(
			`SELECT u.user_id, u.name, u.avatar_url, u.motto, u.activated,
			        s.subscription_id, s.membership_type, s.billing_cycle, s.status,
			        s.starts_at, s.expires_at, s.auto_renew, s.source, s.created_at,
			        CASE WHEN s.status = 'active' AND s.starts_at <= NOW() AND s.expires_at > NOW()
			             THEN 1 ELSE 0 END AS is_current_active
			 ${baseSql}
			 ${whereClause}${statusClause}
			 ORDER BY is_current_active DESC,
			          FIELD(s.membership_type, 'super', 'standard'),
			          s.expires_at DESC, s.user_id ASC
			 LIMIT ?, ?`,
			[...params, offset, pageSize],
		);

		const totalRows = await query(
			`SELECT COUNT(*) AS total
			 ${baseSql}
			 ${whereClause}${statusClause}`,
			params,
		);

		res.json({
			code: 200,
			data: {
				list,
				total: totalRows[0] ? totalRows[0].total : 0,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取指定用户的会员订阅历史
router.get('/subscriptions', auth, async function (req, res) {
	try {
		const userId = Number(req.query.user_id);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.json(400, { msg: 'user_id 参数无效' });
		}
		const data = await membership.listSubscriptions(userId, req.query.page, req.query.pageSize);
		res.json({ code: 200, data });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取指定用户的当前通行证状态
router.get('/users/:userId/status', auth, async function (req, res) {
	try {
		const userId = Number(req.params.userId);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.json(400, { msg: 'user_id 参数无效' });
		}
		const userRows = await query(
			'SELECT user_id, name, avatar_url, motto, activated FROM users WHERE user_id = ? LIMIT 1',
			[userId],
		);
		if (userRows.length === 0) {
			return res.json(404, { msg: '用户不存在' });
		}
		const status = await membership.getSubscriptionStatus(userId);
		res.json({
			code: 200,
			data: {
				user: userRows[0],
				status,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

function normalizeCode(value) {
	return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function hashCode(value) {
	return crypto.createHash('sha256').update(normalizeCode(value)).digest('hex');
}

function createCode() {
	const token = crypto.randomBytes(9).toString('hex').toUpperCase();
	return `LOGPASS-${token.slice(0, 6)}-${token.slice(6, 12)}-${token.slice(12, 18)}`;
}

function hintCode(value) {
	const normalized = normalizeCode(value);
	return `${normalized.slice(0, 7)}…${normalized.slice(-4)}`;
}

// 获取兑换码列表
router.get('/redeem-codes', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const pageSize = parseInt(req.query.pageSize, 10) || 20;
		const offset = (page - 1) * pageSize;
		const status = req.query.status || '';
		const keyword = req.query.keyword || '';

		let whereClause = 'WHERE 1 = 1';
		let params = [];

		if (['active', 'disabled', 'exhausted'].includes(status)) {
			whereClause += ' AND c.status = ?';
			params.push(status);
		}

		if (keyword) {
			whereClause += ' AND c.code_hint LIKE ?';
			params.push(`%${keyword}%`);
		}

		const list = await query(
			`SELECT c.code_id, c.code_hint, c.membership_type, c.duration_days,
			        c.usage_limit, c.used_count, c.status, c.expires_at,
			        c.created_by, c.remark, c.created_at, c.updated_at
			 FROM membership_redeem_codes c
			 ${whereClause}
			 ORDER BY c.created_at DESC, c.code_id DESC
			 LIMIT ?, ?`,
			[...params, offset, pageSize],
		);

		const totalRows = await query(
			`SELECT COUNT(*) AS total
			 FROM membership_redeem_codes c
			 ${whereClause}`,
			params,
		);

		res.json({
			code: 200,
			data: {
				list,
				total: totalRows[0] ? totalRows[0].total : 0,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 创建兑换码
router.post('/redeem-codes', auth, async function (req, res) {
	try {
		const membershipType = String(req.body.membership_type || '').toLowerCase();
		const durationDays = Number(req.body.duration_days);
		const count = Math.max(1, Math.min(100, Number(req.body.count) || 1));
		const remark = String(req.body.remark || '').trim().slice(0, 255) || null;
		const rawExpiresAt = req.body.expires_at === undefined || req.body.expires_at === null || req.body.expires_at === ''
			? null
			: String(req.body.expires_at);
		const expiresAt = rawExpiresAt && new Date(rawExpiresAt).getTime() ? rawExpiresAt : null;

		if (!['standard', 'super'].includes(membershipType)) {
			return res.json(400, { msg: '会员档位无效，仅支持 standard 或 super' });
		}
		if (!Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 3650) {
			return res.json(400, { msg: '有效天数必须是 1 到 3650 之间的整数' });
		}

		const adminUser = req.user && req.user[0] ? req.user[0] : null;
		const createdBy = adminUser ? adminUser.user_id : null;

		const codes = [];
		for (let i = 0; i < count; i += 1) {
			let code = '';
			let exists = true;

			while (exists) {
				code = createCode();
				const rows = await query(
					'SELECT code_hash FROM membership_redeem_codes WHERE code_hash = ?',
					[hashCode(code)],
				);
				exists = rows.length > 0;
			}

			await query(
				`INSERT INTO membership_redeem_codes
				 (code_hash, code_hint, membership_type, duration_days, usage_limit, expires_at, created_by, remark)
				 VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
				[hashCode(code), hintCode(code), membershipType, durationDays, expiresAt, createdBy, remark],
			);
			codes.push(code);
		}

		res.json({
			code: 200,
			data: {
				list: codes,
				membership_type: membershipType,
				duration_days: durationDays,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
