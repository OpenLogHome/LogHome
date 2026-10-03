let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// ---------- 成长任务 tree_tasks ----------

router.get('/tasks', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM tree_tasks ORDER BY task_id ASC');
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

function normalizeTreeTask(body) {
	let data = {
		task_code: String(body.task_code || '').trim(),
		task_name: String(body.task_name || '').trim(),
		task_desc: String(body.task_desc || '').trim(),
		task_type: String(body.task_type || '').trim(),
		growth_reward: Number(body.growth_reward),
		icon: String(body.icon || '').trim(),
	};

	if (!data.task_code) {
		return { error: '任务编码不能为空' };
	}
	if (!data.task_name) {
		return { error: '任务名称不能为空' };
	}
	if (data.task_type !== 'daily' && data.task_type !== 'fixed') {
		return { error: '任务类型必须为 daily 或 fixed' };
	}
	if (!Number.isInteger(data.growth_reward) || data.growth_reward < 0) {
		return { error: '成长值奖励必须为非负整数' };
	}

	return { data };
}

router.post('/tasks', auth, async function (req, res) {
	try {
		let { data, error } = normalizeTreeTask(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let exists = await query(
			'SELECT task_id FROM tree_tasks WHERE task_code = ?',
			[data.task_code],
		);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '任务编码已存在' });
		}

		await query(
			'INSERT INTO tree_tasks (task_code, task_name, task_desc, task_type, growth_reward, icon) VALUES (?, ?, ?, ?, ?, ?)',
			[
				data.task_code,
				data.task_name,
				data.task_desc,
				data.task_type,
				data.growth_reward,
				data.icon,
			],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/tasks/:id', auth, async function (req, res) {
	try {
		let taskId = Number(req.params.id);
		if (!taskId) {
			return res.status(400).json({ msg: 'invalid task id' });
		}

		let { data, error } = normalizeTreeTask(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			'UPDATE tree_tasks SET task_code = ?, task_name = ?, task_desc = ?, task_type = ?, growth_reward = ?, icon = ? WHERE task_id = ?',
			[
				data.task_code,
				data.task_name,
				data.task_desc,
				data.task_type,
				data.growth_reward,
				data.icon,
				taskId,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'task not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/tasks/:id', auth, async function (req, res) {
	try {
		let taskId = Number(req.params.id);
		if (!taskId) {
			return res.status(400).json({ msg: 'invalid task id' });
		}

		let result = await query('DELETE FROM tree_tasks WHERE task_id = ?', [taskId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'task not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 经验球参数 tree_exp_settings ----------

router.get('/exp-settings', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM tree_exp_settings ORDER BY setting_key ASC',
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/exp-settings', auth, async function (req, res) {
	try {
		let settings = req.body.settings;
		if (!Array.isArray(settings)) {
			return res.status(400).json({ msg: 'settings must be an array' });
		}

		for (let item of settings) {
			let key = String(item.setting_key || '').trim();
			if (!key) {
				continue;
			}
			let value = item.setting_value === undefined || item.setting_value === null
				? ''
				: String(item.setting_value).trim();
			let description = String(item.description || '').trim();

			let exists = await query(
				'SELECT setting_key FROM tree_exp_settings WHERE setting_key = ?',
				[key],
			);
			if (exists.length > 0) {
				await query(
					'UPDATE tree_exp_settings SET setting_value = ?, description = ?, updated_at = NOW() WHERE setting_key = ?',
					[value, description, key],
				);
			} else {
				await query(
					'INSERT INTO tree_exp_settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
					[key, value, description],
				);
			}
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 经验任务 tree_exp_tasks ----------

router.get('/exp-tasks', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM tree_exp_tasks ORDER BY sort_order ASC, task_id ASC',
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

function normalizeExpTask(body) {
	let data = {
		task_code: String(body.task_code || '').trim(),
		task_name: String(body.task_name || '').trim(),
		task_desc: String(body.task_desc || '').trim(),
		source_code: String(body.source_code || '').trim(),
		required_value: Number(body.required_value),
		daily_limit: Number(body.daily_limit),
		exp_reward: Number(body.exp_reward),
		icon: String(body.icon || '').trim(),
		sort_order: Number(body.sort_order),
		is_enabled: toInt(body.is_enabled),
	};

	if (!data.task_code) {
		return { error: '任务编码不能为空' };
	}
	if (!data.task_name) {
		return { error: '任务名称不能为空' };
	}
	if (!data.source_code) {
		return { error: '触发事件编码不能为空' };
	}
	if (!Number.isInteger(data.required_value) || data.required_value <= 0) {
		return { error: '目标值必须为正整数' };
	}
	if (!Number.isInteger(data.daily_limit) || data.daily_limit <= 0) {
		return { error: '每日次数必须为正整数' };
	}
	if (!Number.isInteger(data.exp_reward) || data.exp_reward <= 0) {
		return { error: '经验奖励必须为正整数' };
	}

	return { data };
}

router.post('/exp-tasks', auth, async function (req, res) {
	try {
		let { data, error } = normalizeExpTask(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let exists = await query(
			'SELECT task_id FROM tree_exp_tasks WHERE task_code = ?',
			[data.task_code],
		);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '任务编码已存在' });
		}

		await query(
			`INSERT INTO tree_exp_tasks (task_code, task_name, task_desc, source_code, required_value, daily_limit, exp_reward, icon, sort_order, is_enabled, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
			[
				data.task_code,
				data.task_name,
				data.task_desc,
				data.source_code,
				data.required_value,
				data.daily_limit,
				data.exp_reward,
				data.icon,
				data.sort_order,
				data.is_enabled,
			],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/exp-tasks/:id', auth, async function (req, res) {
	try {
		let taskId = Number(req.params.id);
		if (!taskId) {
			return res.status(400).json({ msg: 'invalid task id' });
		}

		let { data, error } = normalizeExpTask(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			`UPDATE tree_exp_tasks
			 SET task_code = ?, task_name = ?, task_desc = ?, source_code = ?, required_value = ?, daily_limit = ?, exp_reward = ?, icon = ?, sort_order = ?, is_enabled = ?, updated_at = NOW()
			 WHERE task_id = ?`,
			[
				data.task_code,
				data.task_name,
				data.task_desc,
				data.source_code,
				data.required_value,
				data.daily_limit,
				data.exp_reward,
				data.icon,
				data.sort_order,
				data.is_enabled,
				taskId,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'task not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/exp-tasks/:id', auth, async function (req, res) {
	try {
		let taskId = Number(req.params.id);
		if (!taskId) {
			return res.status(400).json({ msg: 'invalid task id' });
		}

		let result = await query('DELETE FROM tree_exp_tasks WHERE task_id = ?', [taskId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'task not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
