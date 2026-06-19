const { runReaderNovelChat } = require('./readerNovelAiChat');

const STREAM_CHUNK_SIZE = 24;
const STREAM_CHUNK_DELAY_MS = 8;
const TASK_TTL_MS = 30 * 60 * 1000;
const TASK_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const taskStore = new Map();
let cleanupTimer = null;

function normalizeTaskId(rawTaskId, fallbackParts = []) {
	const rawValue = String(rawTaskId || '').trim();
	if (rawValue) {
		return rawValue.slice(0, 160);
	}
	return fallbackParts
		.map((item) => String(item || '').trim())
		.filter(Boolean)
		.join(':')
		.slice(0, 160);
}

function normalizeEventCursor(value) {
	const numericValue = Number(value);
	return Number.isFinite(numericValue) && numericValue > 0 ? Math.floor(numericValue) : 0;
}

function normalizeRetrieverMode(value) {
	return String(value || '').trim() === 'fast' ? 'fast' : 'deep';
}

function buildTaskInputSignature(novelId, activeNovelId, retrieverMode, messages) {
	try {
		return JSON.stringify({
			novel_id: Number(novelId || 0),
			active_novel_id: Number(activeNovelId || novelId || 0),
			retriever_mode: normalizeRetrieverMode(retrieverMode),
			messages: Array.isArray(messages) ? messages : [],
		});
	} catch (error) {
		return `${Number(novelId || 0)}:${Number(activeNovelId || novelId || 0)}:${normalizeRetrieverMode(retrieverMode)}:${Date.now()}`;
	}
}

function ensureCleanupTimer() {
	if (cleanupTimer) {
		return;
	}

	cleanupTimer = setInterval(() => {
		const now = Date.now();
		for (const [taskId, task] of taskStore.entries()) {
			const expired = now - Number(task.updatedAt || task.createdAt || now) > TASK_TTL_MS;
			const finished = task.status === 'completed' || task.status === 'error';
			if (expired && finished) {
				taskStore.delete(taskId);
			}
		}
	}, TASK_CLEANUP_INTERVAL_MS);

	if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
		cleanupTimer.unref();
	}
}

function createNdjsonStreamWriter(res) {
	let closed = false;
	const markClosed = () => {
		closed = true;
	};

	if (typeof res.once === 'function') {
		res.once('close', markClosed);
		res.once('error', markClosed);
		res.once('finish', markClosed);
	}

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('X-Accel-Buffering', 'no');
	if (typeof res.flushHeaders === 'function') {
		res.flushHeaders();
	}

	return {
		get closed() {
			return closed || res.writableEnded === true || res.destroyed === true;
		},
		write(payload) {
			if (this.closed) {
				return false;
			}
			try {
				res.write(`${JSON.stringify(payload)}\n`);
				if (typeof res.flush === 'function') {
					res.flush();
				}
				return true;
			} catch (error) {
				markClosed();
				return false;
			}
		},
		end() {
			if (this.closed) {
				return;
			}
			try {
				res.end();
			} finally {
				markClosed();
			}
		},
	};
}

function createTaskRecord({ taskId, novelId, activeNovelId, retrieverMode, sessionId, messageId, messages, inputSignature }) {
	return {
		taskId,
		novelId: Number(novelId || 0),
		activeNovelId: Number(activeNovelId || novelId || 0),
		retrieverMode: normalizeRetrieverMode(retrieverMode),
		sessionId: String(sessionId || ''),
		messageId: String(messageId || ''),
		messages: Array.isArray(messages) ? messages : [],
		inputSignature,
		status: 'running',
		createdAt: Date.now(),
		updatedAt: Date.now(),
		nextEventId: 1,
		events: [],
		subscribers: new Set(),
		started: false,
	};
}

function emitTaskEvent(task, eventType, payload = {}) {
	const event = {
		type: String(eventType || ''),
		task_id: task.taskId,
		session_id: task.sessionId,
		message_id: task.messageId,
		event_id: task.nextEventId,
		...payload,
	};
	task.nextEventId += 1;
	task.updatedAt = Date.now();
	task.events.push(event);

	for (const subscriber of [...task.subscribers]) {
		const success = subscriber.write(event);
		if (!success) {
			task.subscribers.delete(subscriber);
		}
	}

	return event;
}

async function streamFinalTextToTask(task, text) {
	const source = String(text || '').trim();
	if (!source) {
		return;
	}

	for (let index = 0; index < source.length; index += STREAM_CHUNK_SIZE) {
		emitTaskEvent(task, 'delta', {
			content: source.slice(index, index + STREAM_CHUNK_SIZE),
		});
		if (STREAM_CHUNK_DELAY_MS > 0) {
			await new Promise((resolve) => setTimeout(resolve, STREAM_CHUNK_DELAY_MS));
		}
	}
}

function finishTask(task, status) {
	task.status = status === 'error' ? 'error' : 'completed';
	task.updatedAt = Date.now();
	setTimeout(() => {
		for (const subscriber of [...task.subscribers]) {
			try {
				subscriber.end();
			} finally {
				task.subscribers.delete(subscriber);
			}
		}
	}, 0);
}

function replayTaskEvents(events, resumeFromEventId, writer) {
	const cursor = normalizeEventCursor(resumeFromEventId);
	for (const event of Array.isArray(events) ? events : []) {
		if (Number(event.event_id || 0) <= cursor) {
			continue;
		}
		if (!writer.write(event)) {
			return false;
		}
	}
	return true;
}

function subscribeTask(task, writer) {
	const subscriber = {
		ready: false,
		buffer: [],
		write(event) {
			if (!this.ready) {
				this.buffer.push(event);
				return true;
			}
			return writer.write(event);
		},
		flushBufferedEvents(afterEventId = 0) {
			const pendingEvents = this.buffer
				.filter((event) => Number(event.event_id || 0) > Number(afterEventId || 0));
			this.buffer = [];
			for (const event of pendingEvents) {
				if (!writer.write(event)) {
					return false;
				}
			}
			this.ready = true;
			return true;
		},
		end() {
			writer.end();
		},
	};
	task.subscribers.add(subscriber);
	return () => {
		task.subscribers.delete(subscriber);
	};
}

function ensureTaskStarted(task) {
	if (task.started) {
		return;
	}

	task.started = true;
	ensureCleanupTimer();

	(async () => {
		try {
			const result = await runReaderNovelChat(
				task.novelId,
				task.messages,
				(eventType, payload = {}) => {
					emitTaskEvent(task, eventType, payload);
				},
				{
					activeNovelId: task.activeNovelId,
					retrieverMode: task.retrieverMode,
				}
			);

			if (!result.streamed) {
				await streamFinalTextToTask(task, result.message);
			}

			if (Array.isArray(result.citations) && result.citations.length > 0) {
				emitTaskEvent(task, 'citations', {
					items: result.citations,
				});
			}

			if (result.active_novel) {
				emitTaskEvent(task, 'active_novel', result.active_novel);
			}

			emitTaskEvent(task, 'done', {});
			finishTask(task, 'completed');
		} catch (error) {
			console.log(error);
			emitTaskEvent(task, 'error', {
				message: error.code === 'UNIFIED_API_KEY_MISSING'
					? 'AI 配置尚未完成'
					: error.message || '原木娘暂时没有响应，请稍后再试',
			});
			finishTask(task, 'error');
		}
	})().catch((error) => {
		console.log(error);
	});
}

function ensureTask({ taskId, novelId, activeNovelId, retrieverMode, sessionId, messageId, messages }) {
	const normalizedTaskId = normalizeTaskId(taskId, [novelId, sessionId, messageId]);
	const normalizedActiveNovelId = Number(activeNovelId || novelId || 0);
	const normalizedRetrieverMode = normalizeRetrieverMode(retrieverMode);
	const inputSignature = buildTaskInputSignature(novelId, normalizedActiveNovelId, normalizedRetrieverMode, messages);
	const existingTask = taskStore.get(normalizedTaskId);

	if (existingTask) {
		if (existingTask.inputSignature !== inputSignature) {
			const conflictError = new Error('任务标识与请求内容不匹配');
			conflictError.code = 'TASK_INPUT_CONFLICT';
			throw conflictError;
		}
		ensureTaskStarted(existingTask);
		return {
			task: existingTask,
			created: false,
		};
	}

	const task = createTaskRecord({
		taskId: normalizedTaskId,
		novelId,
		activeNovelId: normalizedActiveNovelId,
		retrieverMode: normalizedRetrieverMode,
		sessionId,
		messageId,
		messages,
		inputSignature,
	});
	taskStore.set(normalizedTaskId, task);
	ensureTaskStarted(task);
	return {
		task,
		created: true,
	};
}

async function handleReaderNovelChatTaskStream(req, res) {
	const novelId = Number(req.body?.novel_id || 0);
	const activeNovelId = Number(req.body?.active_novel_id || req.body?.current_novel_id || novelId || 0);
	const retrieverMode = normalizeRetrieverMode(req.body?.retriever_mode || req.body?.search_mode);
	const sessionId = String(req.body?.session_id || '').trim();
	const messageId = String(req.body?.message_id || '').trim();
	const taskId = String(req.body?.task_id || '').trim();
	const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
	const resumeFromEventId = normalizeEventCursor(
		req.body?.resume_from_event_id !== undefined
			? req.body.resume_from_event_id
			: req.query?.resume_from_event_id
	);

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id 不能为空' });
	}
	if (!sessionId) {
		return res.status(400).json({ msg: 'session_id 不能为空' });
	}
	if (!messageId) {
		return res.status(400).json({ msg: 'message_id 不能为空' });
	}

	try {
		const ensuredTask = ensureTask({
			taskId,
			novelId,
			activeNovelId,
			retrieverMode,
			sessionId,
			messageId,
			messages,
		});
		const task = ensuredTask.task;

		const writer = createNdjsonStreamWriter(res);
		writer.write({
			type: 'task',
			task_id: task.taskId,
			session_id: task.sessionId,
			message_id: task.messageId,
			novel_id: task.novelId,
			active_novel_id: task.activeNovelId,
			retriever_mode: task.retrieverMode,
			status: task.status,
			created: ensuredTask.created === true,
		});

		const unsubscribe = subscribeTask(task, writer);
		const replaySnapshot = task.events.slice();
		const replaySuccess = replayTaskEvents(replaySnapshot, resumeFromEventId, writer);
		const latestReplayedEventId = replaySnapshot.length > 0
			? Number(replaySnapshot[replaySnapshot.length - 1].event_id || 0)
			: normalizeEventCursor(resumeFromEventId);
		const flushSuccess = replaySuccess && [...task.subscribers]
			.filter((subscriber) => subscriber && typeof subscriber.flushBufferedEvents === 'function')
			.every((subscriber) => subscriber.flushBufferedEvents(latestReplayedEventId));

		if (!flushSuccess || task.status !== 'running') {
			unsubscribe();
			writer.end();
			return;
		}

		const handleDisconnect = () => {
			unsubscribe();
		};

		if (typeof res.once === 'function') {
			res.once('close', handleDisconnect);
		}

		if (typeof req.once === 'function') {
			req.once('aborted', handleDisconnect);
		}
	} catch (error) {
		console.log(error);
		if (error && error.code === 'TASK_INPUT_CONFLICT') {
			return res.status(409).json({ msg: error.message || '任务冲突' });
		}
		return res.status(500).json({ msg: '服务器错误' });
	}
}

module.exports = {
	handleReaderNovelChatTaskStream,
};
