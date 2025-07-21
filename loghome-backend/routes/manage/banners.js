// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');

// 创建路由对象
let router = express.Router();

// 获取所有横幅广告
router.get('/', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM banners ORDER BY `order` ASC');
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取指定横幅广告
router.get('/:id', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM banners WHERE banner_id = ?', [req.params.id]);
		if (results.length === 0) {
			return res.json(404, { msg: 'banner not found' });
		}
		res.end(JSON.stringify(results[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加横幅广告
router.post('/', auth, async function (req, res) {
	try {
		let { title, image_url, link_url, page_location, is_active, start_time, end_time, order } = req.body;
		
		if (!image_url || !page_location) {
			return res.json(400, { msg: 'image_url and page_location are required' });
		}

		let result = await query(
			`INSERT INTO banners (title, image_url, link_url, page_location, is_active, start_time, end_time, \`order\`) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[title, image_url, link_url, page_location, is_active, start_time, end_time, order]
		);
		
		res.json({ success: true, banner_id: result.insertId });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 更新横幅广告
router.put('/:id', auth, async function (req, res) {
	try {
		let { title, image_url, link_url, page_location, is_active, start_time, end_time, order } = req.body;
		let banner_id = req.params.id;
		
		if (!image_url || !page_location) {
			return res.json(400, { msg: 'image_url and page_location are required' });
		}

		let result = await query(
			`UPDATE banners SET 
			title = ?, 
			image_url = ?, 
			link_url = ?, 
			page_location = ?, 
			is_active = ?, 
			start_time = ?, 
			end_time = ?, 
			\`order\` = ? 
			WHERE banner_id = ?`,
			[title, image_url, link_url, page_location, is_active, start_time, end_time, order, banner_id]
		);
		
		if (result.affectedRows === 0) {
			return res.json(404, { msg: 'banner not found' });
		}
		
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 更新横幅广告状态
router.put('/:id/status', auth, async function (req, res) {
	try {
		let { is_active } = req.body;
		let banner_id = req.params.id;
		
		let result = await query(
			'UPDATE banners SET is_active = ? WHERE banner_id = ?',
			[is_active, banner_id]
		);
		
		if (result.affectedRows === 0) {
			return res.json(404, { msg: 'banner not found' });
		}
		
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 删除横幅广告
router.delete('/:id', auth, async function (req, res) {
	try {
		let banner_id = req.params.id;
		
		let result = await query('DELETE FROM banners WHERE banner_id = ?', [banner_id]);
		
		if (result.affectedRows === 0) {
			return res.json(404, { msg: 'banner not found' });
		}
		
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router; 