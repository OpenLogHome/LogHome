let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

const VALID_TIERS = ['free', 'standard', 'super'];
const VALID_STATUS = ['draft', 'active', 'disabled'];
const VALID_LICENSES = ['pending', 'cleared', 'blocked'];

function normalizeBody(body) {
	let data = {
		code: String(body.code || '').trim(),
		name: String(body.name || '').trim(),
		asset_url: String(body.asset_url || '').trim(),
		thumbnail_url: String(body.thumbnail_url || '').trim(),
		required_tier: String(body.required_tier || 'free').trim(),
		is_animated: toInt(body.is_animated),
		avatar_scale: Number(body.avatar_scale),
		offset_x: Number(body.offset_x),
		offset_y: Number(body.offset_y),
		status: String(body.status || 'draft').trim(),
		sort_order: Number(body.sort_order),
		source: String(body.source || '').trim(),
		license_status: String(body.license_status || 'pending').trim(),
	};

	if (!data.code) {
		return { error: '挂件编码不能为空' };
	}
	if (!data.name) {
		return { error: '挂件名称不能为空' };
	}
	if (!data.asset_url) {
		return { error: '请上传挂件素材' };
	}
	if (!VALID_TIERS.includes(data.required_tier)) {
		return { error: '权益档位不合法' };
	}
	if (!VALID_STATUS.includes(data.status)) {
		return { error: '状态不合法' };
	}
	if (!VALID_LICENSES.includes(data.license_status)) {
		return { error: '授权状态不合法' };
	}
	if (!Number.isFinite(data.avatar_scale) || data.avatar_scale <= 0) {
		return { error: '头像缩放比例必须为正数' };
	}

	return { data };
}

// 挂件列表
router.get('/', auth, async function (req, res) {
	try {
		const status = req.query.status || '';
		const tier = req.query.required_tier || '';
		const keyword = String(req.query.keyword || '').trim();

		let sql = 'SELECT * FROM avatar_frames WHERE 1 = 1';
		let params = [];

		if (VALID_STATUS.includes(status)) {
			sql += ' AND status = ?';
			params.push(status);
		}
		if (VALID_TIERS.includes(tier)) {
			sql += ' AND required_tier = ?';
			params.push(tier);
		}
		if (keyword) {
			sql += ' AND (name LIKE ? OR code LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY sort_order ASC, frame_id ASC';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 新增挂件
router.post('/', auth, async function (req, res) {
	try {
		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let exists = await query('SELECT frame_id FROM avatar_frames WHERE code = ?', [
			data.code,
		]);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '挂件编码已存在' });
		}

		await query(
			`INSERT INTO avatar_frames (code, name, asset_url, thumbnail_url, required_tier, is_animated, avatar_scale, offset_x, offset_y, status, sort_order, source, license_status)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.code,
				data.name,
				data.asset_url,
				data.thumbnail_url,
				data.required_tier,
				data.is_animated,
				data.avatar_scale,
				data.offset_x,
				data.offset_y,
				data.status,
				data.sort_order,
				data.source,
				data.license_status,
			],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 编辑挂件
router.put('/:id', auth, async function (req, res) {
	try {
		let frameId = Number(req.params.id);
		if (!frameId) {
			return res.status(400).json({ msg: 'invalid frame id' });
		}

		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let duplicate = await query(
			'SELECT frame_id FROM avatar_frames WHERE code = ? AND frame_id != ?',
			[data.code, frameId],
		);
		if (duplicate.length > 0) {
			return res.status(400).json({ msg: '挂件编码已存在' });
		}

		let result = await query(
			`UPDATE avatar_frames
			 SET code = ?, name = ?, asset_url = ?, thumbnail_url = ?, required_tier = ?, is_animated = ?, avatar_scale = ?, offset_x = ?, offset_y = ?, status = ?, sort_order = ?, source = ?, license_status = ?
			 WHERE frame_id = ?`,
			[
				data.code,
				data.name,
				data.asset_url,
				data.thumbnail_url,
				data.required_tier,
				data.is_animated,
				data.avatar_scale,
				data.offset_x,
				data.offset_y,
				data.status,
				data.sort_order,
				data.source,
				data.license_status,
				frameId,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'frame not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 删除挂件
router.delete('/:id', auth, async function (req, res) {
	try {
		let frameId = Number(req.params.id);
		if (!frameId) {
			return res.status(400).json({ msg: 'invalid frame id' });
		}

		await query('DELETE FROM user_avatar_frame_selections WHERE frame_id = ?', [
			frameId,
		]);

		let result = await query('DELETE FROM avatar_frames WHERE frame_id = ?', [frameId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'frame not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
