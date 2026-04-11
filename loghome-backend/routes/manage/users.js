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
