let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

const INVITE_SETTINGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS invite_settings (
  setting_key VARCHAR(64) PRIMARY KEY,
  setting_value VARCHAR(255) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

async function ensureInviteSettingsTable() {
	await query(INVITE_SETTINGS_TABLE_SQL);
}

// 邀请码列表
router.get('/codes', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT ic.*, u.name, u.avatar_url
			FROM invite_codes ic
			LEFT JOIN users u ON ic.user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND (u.name LIKE ? OR ic.invite_code LIKE ? OR ic.user_id LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY ic.create_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 邀请记录列表
router.get('/records', auth, async function (req, res) {
	try {
		const inviteType = req.query.invite_type || '';

		let sql = `
			SELECT ir.*, inviter.name AS inviter_name, invitee.name AS invitee_name
			FROM invite_records ir
			LEFT JOIN users inviter ON ir.inviter_id = inviter.user_id
			LEFT JOIN users invitee ON ir.invitee_id = invitee.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (inviteType === 'new' || inviteType === 'return') {
			sql += ' AND ir.invite_type = ?';
			params.push(inviteType);
		}

		sql += ' ORDER BY ir.create_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 回归资格列表
router.get('/eligibility', auth, async function (req, res) {
	try {
		const used =
			req.query.is_used === undefined || req.query.is_used === ''
				? undefined
				: req.query.is_used === '1' || req.query.is_used === 1
					? 1
					: 0;

		let sql = `
			SELECT re.*, u.name, u.avatar_url
			FROM return_user_eligibility re
			LEFT JOIN users u ON re.user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (used !== undefined) {
			sql += ' AND re.is_used = ?';
			params.push(used);
		}

		sql += ' ORDER BY re.eligibility_id DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 发放回归资格
router.post('/eligibility', auth, async function (req, res) {
	try {
		let userId = Number(req.body.user_id);
		let expiryDays = Number(req.body.expiry_days);

		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ msg: '请选择用户' });
		}
		if (!Number.isInteger(expiryDays) || expiryDays <= 0) {
			return res.status(400).json({ msg: '有效天数必须为正整数' });
		}

		let user = await query('SELECT user_id FROM users WHERE user_id = ?', [userId]);
		if (user.length === 0) {
			return res.status(400).json({ msg: '用户不存在' });
		}

		let active = await query(
			'SELECT eligibility_id FROM return_user_eligibility WHERE user_id = ? AND is_used = 0 AND expiry_date > NOW()',
			[userId],
		);
		if (active.length > 0) {
			return res.status(400).json({ msg: '该用户已有未使用的回归资格' });
		}

		await query(
			'INSERT INTO return_user_eligibility (user_id, expiry_date, is_used) VALUES (?, DATE_ADD(NOW(), INTERVAL ? DAY), 0)',
			[userId, expiryDays],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 删除回归资格
router.delete('/eligibility/:id', auth, async function (req, res) {
	try {
		let eligibilityId = Number(req.params.id);
		if (!eligibilityId) {
			return res.status(400).json({ msg: 'invalid eligibility id' });
		}

		let result = await query(
			'DELETE FROM return_user_eligibility WHERE eligibility_id = ?',
			[eligibilityId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'eligibility record not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 奖励配置
const DEFAULT_INVITE_SETTINGS = {
	new_user_reward: 1000,
	return_user_reward: 500,
	monthly_limit: 10,
};

router.get('/settings', auth, async function (req, res) {
	try {
		await ensureInviteSettingsTable();

		let rows = await query('SELECT * FROM invite_settings');
		let merged = { ...DEFAULT_INVITE_SETTINGS };
		let descriptions = {};

		for (let row of rows) {
			if (merged[row.setting_key] !== undefined) {
				merged[row.setting_key] = Number(row.setting_value);
			}
			descriptions[row.setting_key] = row.description || '';
		}

		let result = Object.keys(merged).map((key) => ({
			setting_key: key,
			setting_value: merged[key],
			description: descriptions[key] || '',
		}));

		res.json(result);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/settings', auth, async function (req, res) {
	try {
		await ensureInviteSettingsTable();

		let settings = req.body.settings;
		if (!Array.isArray(settings)) {
			return res.status(400).json({ msg: 'settings must be an array' });
		}

		for (let item of settings) {
			let key = String(item.setting_key || '').trim();
			if (DEFAULT_INVITE_SETTINGS[key] === undefined) {
				continue;
			}
			let value = Number(item.setting_value);
			if (!Number.isFinite(value) || value < 0) {
				return res.status(400).json({ msg: `配置 ${key} 必须为非负数` });
			}
			let description = String(item.description || '').trim();

			await query(
				`INSERT INTO invite_settings (setting_key, setting_value, description)
				 VALUES (?, ?, ?)
				 ON DUPLICATE KEY UPDATE setting_value = ?, description = ?`,
				[key, value, description, value, description],
			);
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
