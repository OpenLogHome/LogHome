let express = require('express');
let auth = require('../../bin/adminAuth.js');
const achievements = require('../../bin/achievements.js');

let router = express.Router();

function getAdminUserId(req) {
	return req.user && req.user[0] ? req.user[0].user_id : null;
}

router.get('/list', auth, async function (req, res) {
	try {
		const list = await achievements.listAchievementDefinitions({
			includeDisabled: req.query.include_disabled === '1',
			categories: req.query.categories ? String(req.query.categories).split(',') : [],
			keyword: req.query.keyword || '',
		});
		res.json({ list });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/detail', auth, async function (req, res) {
	try {
		const achievementId = Number(req.query.achievement_id);
		if (!Number.isFinite(achievementId) || achievementId <= 0) {
			return res.status(400).json({ msg: 'invalid achievement_id' });
		}
		const detail = await achievements.getAchievementDetail(achievementId, {
			includeDisabled: true,
		});
		res.json({ detail });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/save', auth, async function (req, res) {
	try {
		const detail = await achievements.saveAchievementDefinition(req.body || {}, getAdminUserId(req));
		res.json({ msg: 'ok', detail });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: e.message || 'bad request' });
	}
});

router.post('/toggle', auth, async function (req, res) {
	try {
		const achievementId = Number(req.body.achievement_id);
		if (!Number.isFinite(achievementId) || achievementId <= 0) {
			return res.status(400).json({ msg: 'invalid achievement_id' });
		}
		const detail = await achievements.setAchievementEnabled(
			achievementId,
			Number(req.body.is_enabled) === 1 || req.body.is_enabled === true,
			getAdminUserId(req),
		);
		res.json({ msg: 'ok', detail });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/test-user', auth, async function (req, res) {
	try {
		const achievementId = Number(req.body.achievement_id);
		const userId = Number(req.body.user_id);
		if (!Number.isFinite(achievementId) || achievementId <= 0 || !Number.isFinite(userId) || userId <= 0) {
			return res.status(400).json({ msg: 'invalid payload' });
		}
		const result = await achievements.evaluateAchievementForUser(achievementId, userId, {
			grantIfMatched: false,
		});
		res.json({ result });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/recalculate-user', auth, async function (req, res) {
	try {
		const userId = Number(req.body.user_id);
		if (!Number.isFinite(userId) || userId <= 0) {
			return res.status(400).json({ msg: 'invalid user_id' });
		}
		const achievementIds = Array.isArray(req.body.achievement_ids) ? req.body.achievement_ids : [];
		const results = await achievements.recalculateUserAchievements(userId, {
			achievementIds,
			operatorUserId: getAdminUserId(req),
			reason: req.body.reason || '管理员重算勋章规则',
		});
		res.json({ msg: 'ok', results });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/grant', auth, async function (req, res) {
	try {
		const result = await achievements.grantAchievementToUser({
			userId: req.body.user_id,
			achievementId: req.body.achievement_id,
			achievementKey: req.body.achievement_key,
			adminUserId: getAdminUserId(req),
			reason: req.body.reason || '',
			grantSource: 'official_manual',
		});
		res.json({ msg: 'ok', ...result });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: e.message || 'bad request' });
	}
});

router.post('/revoke', auth, async function (req, res) {
	try {
		const result = await achievements.revokeAchievementFromUser({
			userId: req.body.user_id,
			achievementId: req.body.achievement_id,
			operatorUserId: getAdminUserId(req),
			reason: req.body.reason || '',
		});
		res.json({ msg: 'ok', ...result });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: e.message || 'bad request' });
	}
});

router.get('/logs', auth, async function (req, res) {
	try {
		const logs = await achievements.getAchievementGrantLogs({
			page: req.query.page,
			limit: req.query.limit,
			achievementId: req.query.achievement_id,
			userId: req.query.user_id,
		});
		res.json(logs);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
