// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');
const achievements = require('../../bin/achievements.js');

// 创建路由对象
let router = express.Router();

router.post('/send_message', auth, async function (req, res) {
	try {
		message.sendMsg(
			req.body.from_id,
			req.body.to_id,
			req.body.msg,
			req.body.navigate_to,
			"mention",
			true,
		);
		res.end('success');
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_user_amount', auth, async function (req, res) {
	try {
		let result = await query('SELECT COUNT(*) count FROM users');
		res.end(JSON.stringify(result));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_users', auth, async function (req, res) {
	try {
		let result = await query('SELECT * FROM users LIMIT ?,20', [
			(Number(req.query.page) - 1) * 20,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 用户列表（搜索 + 过滤 + 分页），返回 { list, total, page, pageSize }
// keyword: 数字时精确匹配 user_id，同时模糊匹配昵称/账号；非数字时模糊匹配昵称/账号
// activated / isAdmin: '0' 或 '1'，其余值视为不过滤
router.get('/get_users_page', auth, async function (req, res) {
	try {
		const page = Math.max(1, parseInt(req.query.page, 10) || 1);
		const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
		const keyword = String(req.query.keyword || '').trim();
		const activated = String(req.query.activated === undefined ? '' : req.query.activated).trim();
		const isAdmin = String(req.query.isAdmin === undefined ? '' : req.query.isAdmin).trim();

		const where = [];
		const params = [];
		if (keyword) {
			const like = `%${keyword}%`;
			if (/^-?\d+$/.test(keyword)) {
				where.push('(user_id = ? OR `name` LIKE ? OR account LIKE ?)');
				params.push(Number(keyword), like, like);
			} else {
				where.push('(`name` LIKE ? OR account LIKE ?)');
				params.push(like, like);
			}
		}
		if (activated === '0' || activated === '1') {
			where.push('activated = ?');
			params.push(Number(activated));
		}
		if (isAdmin === '0' || isAdmin === '1') {
			where.push('is_admin = ?');
			params.push(Number(isAdmin));
		}
		const whereSql = where.length ? ' WHERE ' + where.join(' AND ') : '';

		const countRows = await query(
			'SELECT COUNT(*) AS count FROM users' + whereSql,
			params,
		);
		const total = Number(countRows[0].count);
		const list = await query(
			'SELECT user_id, `name`, avatar_url, account, user_group, activated, register_time, online_time, is_admin ' +
				'FROM users' + whereSql + ' ORDER BY user_id DESC LIMIT ? OFFSET ?',
			params.concat([pageSize, (page - 1) * pageSize]),
		);
		res.json({ list: list, total: total, page: page, pageSize: pageSize });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_user_by_id', auth, async function (req, res) {
	try {
		let result = await query('SELECT * FROM users WHERE user_id = ?', [
			req.query.user_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/user_activating_set', auth, async function (req, res) {
	try {
		let result = await query(
			'UPDATE users SET activated = ? WHERE user_id = ?',
			[req.body.activate, req.body.user_id],
		);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/achievements', auth, async function (req, res) {
	try {
		const list = await achievements.getAchievementDefinitions({
			officialOnly: false,
		});
		res.json({ list });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/get_user_achievements', auth, async function (req, res) {
	try {
		const userId = Number(req.query.user_id);
		if (!Number.isFinite(userId) || userId <= 0) {
			return res.status(400).json({ msg: 'invalid user_id' });
		}

		const list = await achievements.getUserAchievements(userId);
		res.json({ list });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/grant_achievement', auth, async function (req, res) {
	try {
		const adminUser = req.user && req.user[0] ? req.user[0] : null;
		const userId = Number(req.body.user_id);
		const achievementId = Number(req.body.achievement_id);
		const achievementKey = req.body.achievement_key;

		if (!Number.isFinite(userId) || userId <= 0) {
			return res.status(400).json({ msg: 'invalid user_id' });
		}

		if ((!Number.isFinite(achievementId) || achievementId <= 0) && !achievementKey) {
			return res.status(400).json({ msg: 'invalid achievement selector' });
		}

		const result = await achievements.grantAchievementToUser({
			userId,
			achievementId,
			achievementKey,
			adminUserId: adminUser ? adminUser.user_id : null,
			reason: req.body.reason || '',
		});

		res.json({
			msg: result.granted ? 'granted' : 'already granted',
			...result,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
