let express = require('express');
let { query, transition } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');

let router = express.Router();

const STORAGE_RESOURCE_BASE = 'https://storage.codesocean.top/api/resource';
const TASK_STATUSES = ['todo', 'doing', 'done'];
const TASK_PRIORITIES = ['high', 'mid', 'low'];
const MAX_ATTACHMENTS = 30;
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_COMMENT_LENGTH = 1000;
const MAX_ATTACHMENT_SIZE = 200 * 1024 * 1024;
const RESOURCE_ID_PATTERN = /^[A-Za-z0-9_.-]{1,64}$/;

function httpError(status, message) {
	let error = new Error(message);
	error.status = status;
	return error;
}

function sendError(res, error) {
	if (error && error.status && error.status < 500) {
		return res.status(error.status).json({ msg: error.message });
	}
	console.log(error);
	res.status(400).json({ msg: 'bad request' });
}

function positiveInt(value) {
	let number = Number(value);
	return Number.isInteger(number) && number > 0 ? number : null;
}

function toBoolInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

function currentUserId(req) {
	return req.user[0].user_id;
}

function normalizeComment(value) {
	let content = String(value || '').trim();
	if (!content) {
		throw httpError(400, '评论内容不能为空');
	}
	if (content.length > MAX_COMMENT_LENGTH) {
		throw httpError(400, `评论不能超过 ${MAX_COMMENT_LENGTH} 个字`);
	}
	return content;
}

function normalizeNewAttachment(body) {
	let resourceId = String(body.resource_id || '').trim();
	if (!RESOURCE_ID_PATTERN.test(resourceId)) {
		throw httpError(400, '附件资源标识不正确，请重新上传');
	}
	let name = String(body.name || '').trim().slice(0, 200) || '未命名附件';
	let size = Math.floor(Number(body.size) || 0);
	if (!Number.isFinite(size) || size < 0) {
		size = 0;
	}
	return {
		resource_id: resourceId,
		name: name,
		size: Math.min(size, MAX_ATTACHMENT_SIZE),
		is_image: toBoolInt(body.is_image),
	};
}

function normalizeAttachments(value) {
	if (value === undefined || value === null) {
		return [];
	}
	if (!Array.isArray(value)) {
		throw httpError(400, '附件格式不正确');
	}
	if (value.length > MAX_ATTACHMENTS) {
		throw httpError(400, `附件数量不能超过 ${MAX_ATTACHMENTS} 个`);
	}
	return value.map((item) => {
		if (!item || typeof item !== 'object') {
			throw httpError(400, '附件格式不正确');
		}
		let id = positiveInt(item.id);
		if (id) {
			return { id: id };
		}
		return normalizeNewAttachment(item);
	});
}

function normalizeTask(body) {
	let title = String(body.title || '').trim();
	if (!title) {
		throw httpError(400, '任务标题不能为空');
	}
	if (title.length > MAX_TITLE_LENGTH) {
		throw httpError(400, `任务标题不能超过 ${MAX_TITLE_LENGTH} 个字`);
	}

	let description = String(body.description || '').trim();
	if (description.length > MAX_DESCRIPTION_LENGTH) {
		throw httpError(400, `任务描述不能超过 ${MAX_DESCRIPTION_LENGTH} 个字`);
	}

	let status = String(body.status || 'todo').trim();
	if (!TASK_STATUSES.includes(status)) {
		throw httpError(400, '任务状态不正确');
	}

	let priority = String(body.priority || 'mid').trim();
	if (!TASK_PRIORITIES.includes(priority)) {
		throw httpError(400, '任务优先级不正确');
	}

	let projectId = positiveInt(body.project_id);
	if (!projectId) {
		throw httpError(400, '请选择项目分类');
	}

	let assigneeId = positiveInt(body.assignee_id);
	if (!assigneeId) {
		throw httpError(400, '请选择负责人');
	}

	let dueDate = null;
	if (body.due_date !== undefined && body.due_date !== null && body.due_date !== '') {
		dueDate = String(body.due_date).trim();
		if (!moment(dueDate, 'YYYY-MM-DD', true).isValid()) {
			throw httpError(400, '截止日期格式不正确');
		}
	}

	return {
		title: title,
		description: description,
		status: status,
		priority: priority,
		project_id: projectId,
		assignee_id: assigneeId,
		due_date: dueDate,
		attachments: normalizeAttachments(body.attachments),
	};
}

async function assertProject(projectId) {
	let rows = await query('SELECT project_id FROM todo_project WHERE project_id = ?', [
		projectId,
	]);
	if (!rows.length) {
		throw httpError(400, '项目分类不存在');
	}
}

async function assertAssignableAdmin(userId) {
	let rows = await query(
		'SELECT user_id FROM users WHERE user_id = ? AND is_admin = 1',
		[userId],
	);
	if (!rows.length) {
		throw httpError(400, '负责人必须是系统管理员');
	}
}

function serializeComment(row) {
	return {
		id: row.comment_id,
		author_id: row.author_id,
		content: row.content,
		is_system: Boolean(row.is_system),
		created_at: row.created_at,
	};
}

function serializeAttachment(row) {
	let resourceId = encodeURIComponent(row.resource_id);
	return {
		id: row.attachment_id,
		name: row.name,
		resource_id: row.resource_id,
		size_bytes: row.size_bytes,
		is_image: Boolean(row.is_image),
		inline_url: `${STORAGE_RESOURCE_BASE}/get/${resourceId}`,
		url: `${STORAGE_RESOURCE_BASE}/download/${resourceId}`,
		uploaded_by: row.uploaded_by,
		created_at: row.created_at,
	};
}

async function syncTaskAttachments(q, taskId, attachments, uploaderId) {
	let rows = await q('SELECT attachment_id FROM todo_attachment WHERE task_id = ?', [
		taskId,
	]);
	let existingIds = new Set(rows.map((row) => row.attachment_id));
	let keepIds = new Set();

	attachments.forEach((attachment) => {
		if (!attachment.id) {
			return;
		}
		if (!existingIds.has(attachment.id)) {
			throw httpError(400, '附件不存在或已被删除，请刷新后重试');
		}
		keepIds.add(attachment.id);
	});

	let removedIds = [...existingIds].filter((id) => !keepIds.has(id));
	if (removedIds.length) {
		let placeholders = removedIds.map(() => '?').join(',');
		await q(
			`DELETE FROM todo_attachment WHERE attachment_id IN (${placeholders})`,
			removedIds,
		);
	}

	for (let attachment of attachments) {
		if (attachment.id) {
			continue;
		}
		await q(
			`INSERT INTO todo_attachment
			 (task_id, name, resource_id, size_bytes, is_image, uploaded_by)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[
				taskId,
				attachment.name,
				attachment.resource_id,
				attachment.size,
				attachment.is_image,
				uploaderId,
			],
		);
	}
}

async function insertSystemComment(q, taskId, authorId, content) {
	await q(
		`INSERT INTO todo_comment (task_id, author_id, content, is_system)
		 VALUES (?, ?, ?, 1)`,
		[taskId, authorId, content],
	);
}

async function loadBoard() {
	let [projectRows, taskRows, commentRows, attachmentRows, memberRows] =
		await Promise.all([
			query(
				`SELECT project_id, name, color, bg_color
				 FROM todo_project
				 ORDER BY sort_order ASC, project_id ASC`,
			),
			query(
				`SELECT task_id, title, description, status, priority, project_id,
					assignee_id, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
					completed_at, created_at, updated_at
				 FROM todo_task
				 ORDER BY task_id ASC`,
			),
			query(
				`SELECT comment_id, task_id, project_id, author_id, content, is_system, created_at
				 FROM todo_comment
				 ORDER BY comment_id ASC`,
			),
			query(
				`SELECT attachment_id, task_id, project_id, name, resource_id, size_bytes,
					is_image, uploaded_by, created_at
				 FROM todo_attachment
				 ORDER BY attachment_id ASC`,
			),
			query(
				`SELECT user_id, name, account, avatar_url, activated
				 FROM users
				 WHERE is_admin = 1
				 ORDER BY activated DESC, user_id ASC`,
			),
		]);

	let projects = projectRows.map((row) => ({
		id: row.project_id,
		name: row.name,
		color: row.color,
		bg_color: row.bg_color,
		comments: [],
		attachments: [],
	}));
	let tasks = taskRows.map((row) => ({
		id: row.task_id,
		title: row.title,
		description: row.description || '',
		status: row.status,
		priority: row.priority,
		project_id: row.project_id,
		assignee_id: row.assignee_id,
		due_date: row.due_date,
		completed_at: row.completed_at,
		created_at: row.created_at,
		updated_at: row.updated_at,
		comments: [],
		attachments: [],
	}));

	let projectMap = new Map(projects.map((project) => [project.id, project]));
	let taskMap = new Map(tasks.map((task) => [task.id, task]));

	commentRows.forEach((row) => {
		let target = row.task_id ? taskMap.get(row.task_id) : projectMap.get(row.project_id);
		if (target) {
			target.comments.push(serializeComment(row));
		}
	});

	attachmentRows.forEach((row) => {
		let target = row.task_id ? taskMap.get(row.task_id) : projectMap.get(row.project_id);
		if (target) {
			target.attachments.push(serializeAttachment(row));
		}
	});

	let members = memberRows.map((row) => ({
		id: row.user_id,
		name: row.name || row.account || `用户 ${row.user_id}`,
		account: row.account || '',
		avatar_url: row.avatar_url || '',
		active: Number(row.activated) === 1,
	}));

	return { projects: projects, tasks: tasks, members: members };
}

router.get('/', auth, async function (req, res) {
	try {
		res.json(await loadBoard());
	} catch (e) {
		sendError(res, e);
	}
});

router.post('/tasks', auth, async function (req, res) {
	try {
		let data = normalizeTask(req.body);
		await assertProject(data.project_id);
		await assertAssignableAdmin(data.assignee_id);

		let userId = currentUserId(req);
		let taskId = await transition(async (q) => {
			let result = await q(
				`INSERT INTO todo_task
				 (title, description, status, priority, project_id, assignee_id, created_by,
				  due_date, completed_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					data.title,
					data.description,
					data.status,
					data.priority,
					data.project_id,
					data.assignee_id,
					userId,
					data.due_date,
					data.status === 'done' ? new Date() : null,
				],
			);
			await syncTaskAttachments(q, result.insertId, data.attachments, userId);
			return result.insertId;
		}, '创建协作待办任务');

		res.json({ msg: 'success', task_id: taskId });
	} catch (e) {
		sendError(res, e);
	}
});

router.put('/tasks/:id', auth, async function (req, res) {
	try {
		let taskId = positiveInt(req.params.id);
		if (!taskId) {
			throw httpError(400, '任务 ID 不正确');
		}

		let data = normalizeTask(req.body);
		await assertProject(data.project_id);
		await assertAssignableAdmin(data.assignee_id);

		let userId = currentUserId(req);
		await transition(async (q) => {
			let rows = await q(
				'SELECT status, completed_at FROM todo_task WHERE task_id = ? FOR UPDATE',
				[taskId],
			);
			if (!rows.length) {
				throw httpError(404, '任务不存在');
			}
			let previous = rows[0];
			let completedAt = null;
			if (data.status === 'done') {
				completedAt =
					previous.status === 'done' && previous.completed_at
						? previous.completed_at
						: new Date();
			}

			await q(
				`UPDATE todo_task
				 SET title = ?, description = ?, status = ?, priority = ?, project_id = ?,
				     assignee_id = ?, due_date = ?, completed_at = ?
				 WHERE task_id = ?`,
				[
					data.title,
					data.description,
					data.status,
					data.priority,
					data.project_id,
					data.assignee_id,
					data.due_date,
					completedAt,
					taskId,
				],
			);
			await syncTaskAttachments(q, taskId, data.attachments, userId);

			if (previous.status !== 'done' && data.status === 'done') {
				await insertSystemComment(q, taskId, userId, '状态流转为已完成。');
			}
		}, '更新协作待办任务');

		res.json({ msg: 'success' });
	} catch (e) {
		sendError(res, e);
	}
});

router.delete('/tasks/:id', auth, async function (req, res) {
	try {
		let taskId = positiveInt(req.params.id);
		if (!taskId) {
			throw httpError(400, '任务 ID 不正确');
		}

		await transition(async (q) => {
			let rows = await q('SELECT task_id FROM todo_task WHERE task_id = ?', [taskId]);
			if (!rows.length) {
				throw httpError(404, '任务不存在');
			}
			await q('DELETE FROM todo_attachment WHERE task_id = ?', [taskId]);
			await q('DELETE FROM todo_comment WHERE task_id = ?', [taskId]);
			await q('DELETE FROM todo_task WHERE task_id = ?', [taskId]);
		}, '删除协作待办任务');

		res.json({ msg: 'success' });
	} catch (e) {
		sendError(res, e);
	}
});

router.post('/tasks/:id/comments', auth, async function (req, res) {
	try {
		let taskId = positiveInt(req.params.id);
		if (!taskId) {
			throw httpError(400, '任务 ID 不正确');
		}
		let content = normalizeComment(req.body.content);

		let tasks = await query('SELECT task_id FROM todo_task WHERE task_id = ?', [taskId]);
		if (!tasks.length) {
			throw httpError(404, '任务不存在');
		}

		await query(
			`INSERT INTO todo_comment (task_id, author_id, content, is_system)
			 VALUES (?, ?, ?, 0)`,
			[taskId, currentUserId(req), content],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		sendError(res, e);
	}
});

router.post('/projects/:id/comments', auth, async function (req, res) {
	try {
		let projectId = positiveInt(req.params.id);
		if (!projectId) {
			throw httpError(400, '项目 ID 不正确');
		}
		let content = normalizeComment(req.body.content);

		let projects = await query(
			'SELECT project_id FROM todo_project WHERE project_id = ?',
			[projectId],
		);
		if (!projects.length) {
			throw httpError(404, '项目不存在');
		}

		await query(
			`INSERT INTO todo_comment (project_id, author_id, content, is_system)
			 VALUES (?, ?, ?, 0)`,
			[projectId, currentUserId(req), content],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		sendError(res, e);
	}
});

router.post('/projects/:id/attachments', auth, async function (req, res) {
	try {
		let projectId = positiveInt(req.params.id);
		if (!projectId) {
			throw httpError(400, '项目 ID 不正确');
		}
		let attachment = normalizeNewAttachment(req.body);

		let projects = await query(
			'SELECT project_id FROM todo_project WHERE project_id = ?',
			[projectId],
		);
		if (!projects.length) {
			throw httpError(404, '项目不存在');
		}

		let result = await query(
			`INSERT INTO todo_attachment
			 (project_id, name, resource_id, size_bytes, is_image, uploaded_by)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[
				projectId,
				attachment.name,
				attachment.resource_id,
				attachment.size,
				attachment.is_image,
				currentUserId(req),
			],
		);

		res.json({ msg: 'success', attachment_id: result.insertId });
	} catch (e) {
		sendError(res, e);
	}
});

router.delete('/attachments/:id', auth, async function (req, res) {
	try {
		let attachmentId = positiveInt(req.params.id);
		if (!attachmentId) {
			throw httpError(400, '附件 ID 不正确');
		}

		let rows = await query(
			'SELECT attachment_id FROM todo_attachment WHERE attachment_id = ?',
			[attachmentId],
		);
		if (!rows.length) {
			throw httpError(404, '附件不存在');
		}

		await query('DELETE FROM todo_attachment WHERE attachment_id = ?', [attachmentId]);
		res.json({ msg: 'success' });
	} catch (e) {
		sendError(res, e);
	}
});

module.exports = router;
