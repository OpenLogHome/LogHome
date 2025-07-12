// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let sysLog = require('../bin/log.js');
let statistics = require('../bin/statistics.js');

// 创建路由对象
let router = express.Router();

router.get('/get_web_update', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM web_update_log ORDER BY web_update_id DESC LIMIT 0,1',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_app_update', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM app_update_log ORDER BY app_update_id DESC LIMIT 0,1',
		);
		// 直接返回所有字段，包括 allow_hot, is_forced, asset_url
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 检查当前版本到最新版本之间是否所有版本都支持热更新
router.get('/check_hot_update_compatibility', async function (req, res) {
	try {
		const currentVersion = req.query.current_version;
		if (!currentVersion) {
			return res.json(400, { msg: 'current_version is required' });
		}

		// 获取当前版本和最新版本之间的所有版本记录
		const versions = await query(
			`SELECT * FROM app_update_log 
			WHERE version > ? 
			ORDER BY app_update_id ASC`,
			[currentVersion]
		);

		// 检查是否所有版本都支持热更新
		const allVersionsSupportHotUpdate = versions.every(v => v.allow_hot === 1);
		
		// 获取最新版本信息
		const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
		
		res.json({
			allow_hot: allVersionsSupportHotUpdate && latestVersion.allow_hot === 1,
			latest_version: latestVersion,
			versions_between: versions
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_grand_users', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM users WHERE user_group != ?',
			['用户'],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_great_users', async function (req, res) {
	try {
		let results = await query(
			'SELECT u.*,g.great_info FROM users u,great_users g WHERE u.user_id = g.user_id'
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_typical_faqs', async function (req, res) {
	try {
		let results = await query('SELECT * FROM faqs WHERE is_typical = 1');
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_newest_faqs', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM faqs WHERE solved = 1 ORDER BY faq_id DESC ',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_faqs_by_id', async function (req, res) {
	try {
		let results = await query('SELECT * FROM faqs WHERE faq_id = ?', [
			req.query.id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_my_faqs', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query('SELECT * FROM faqs WHERE user_id = ?', [
			user.user_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/post_faq', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`INSERT INTO faqs(user_id,faq_title,faq_content,answer) 
                                VALUES(?,?,?,?)`,
			[user.user_id, req.body.faq_title, req.body.faq_content, ''],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_site_set', async function (req, res) {
	try {
		let results = await query('SELECT * FROM siteset');
		res.end(JSON.stringify(results[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
