let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

const LIST_FIELDS =
	'app_update_id, version, version_number, version_info, update_url, asset_url, allow_hot, is_forced, update_bg, update_time';

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

function normalizeBody(body) {
	let data = {
		version: String(body.version || '').trim(),
		version_number: Number(body.version_number),
		version_info: String(body.version_info || '').trim(),
		update_url: String(body.update_url || '').trim(),
		asset_url: String(body.asset_url || '').trim(),
		update_bg: String(body.update_bg || '').trim(),
		allow_hot: toInt(body.allow_hot),
		is_forced: toInt(body.is_forced),
	};

	if (!data.version) {
		return { error: '版本号不能为空' };
	}
	if (!Number.isInteger(data.version_number) || data.version_number <= 0) {
		return { error: '版本数字必须为正整数' };
	}
	if (!data.version_info) {
		return { error: '更新内容不能为空' };
	}
	if (!data.update_url) {
		return { error: '请上传安装包' };
	}
	if (data.allow_hot && !data.asset_url) {
		return { error: '允许热更新时必须上传资源包' };
	}

	return { data };
}

async function getLatestVersionNumber() {
	let results = await query(
		'SELECT MAX(version_number) AS max_version FROM app_update_log',
	);
	return results[0].max_version || 0;
}

router.get('/', auth, async function (req, res) {
	try {
		let results = await query(
			`SELECT ${LIST_FIELDS} FROM app_update_log ORDER BY version_number DESC, app_update_id DESC`,
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/', auth, async function (req, res) {
	try {
		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let maxVersion = await getLatestVersionNumber();
		if (data.version_number <= maxVersion) {
			return res.status(400).json({
				msg: `版本数字必须大于当前最新版本数字 ${maxVersion}`,
			});
		}

		await query(
			`INSERT INTO app_update_log
			 (version, version_number, version_info, update_url, asset_url, allow_hot, is_forced, update_bg, update_time)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
			[
				data.version,
				data.version_number,
				data.version_info,
				data.update_url,
				data.asset_url,
				data.allow_hot,
				data.is_forced,
				data.update_bg,
			],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/:id', auth, async function (req, res) {
	try {
		let appUpdateId = Number(req.params.id);
		if (!appUpdateId) {
			return res.status(400).json({ msg: 'invalid app update id' });
		}

		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			`UPDATE app_update_log
			 SET version = ?, version_number = ?, version_info = ?, update_url = ?, asset_url = ?, allow_hot = ?, is_forced = ?, update_bg = ?
			 WHERE app_update_id = ?`,
			[
				data.version,
				data.version_number,
				data.version_info,
				data.update_url,
				data.asset_url,
				data.allow_hot,
				data.is_forced,
				data.update_bg,
				appUpdateId,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'app update record not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/:id', auth, async function (req, res) {
	try {
		let appUpdateId = Number(req.params.id);
		if (!appUpdateId) {
			return res.status(400).json({ msg: 'invalid app update id' });
		}

		let result = await query(
			'DELETE FROM app_update_log WHERE app_update_id = ?',
			[appUpdateId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'app update record not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
