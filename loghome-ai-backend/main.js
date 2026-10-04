require('dotenv').config();
const express = require('express');
const config = require('./config');
const { closePool } = require('./sql');
const { handleReaderNovelChatTaskStream } = require('./bin/chatTaskService');
const {
	handleWriterNovelAssistStream,
	handleWriterNovelSmartReplace,
} = require('./bin/writerNovelAiAssist');
const { handleWriterTextCorrection } = require('./bin/writerTextCorrection');
const { getNovelSummaryIndexStatus } = require('./bin/agentIndexing');
const { assertNovelReaderAiAllowed } = require('./bin/novelReaderAiSettings');
const { requireAuth, requireUser } = require('./bin/auth');
const collaborationRouter = require('./routes/collaboration');
const {
	startCollaborationServer,
	stopCollaborationServer,
} = require('./bin/collaborationService');

process.env.TZ = 'Asia/Shanghai';

function isOriginAllowed(origin) {
	const origins = Array.isArray(config.cors.origins) ? config.cors.origins : ['*'];
	if (origins.length === 0 || origins.includes('*')) {
		return true;
	}
	if (isLocalDevelopmentOrigin(origin)) {
		return true;
	}
	return origins.includes(origin);
}

function isLocalDevelopmentOrigin(origin) {
	if (!origin) {
		return false;
	}

	try {
		const parsed = new URL(origin);
		return [
			'localhost',
			'127.0.0.1',
			'0.0.0.0',
			'::1',
			'[::1]',
		].includes(parsed.hostname);
	} catch (error) {
		return false;
	}
}

function applyCors(req, res) {
	const requestOrigin = String(req.headers.origin || '');
	if (requestOrigin && isOriginAllowed(requestOrigin)) {
		res.header('Access-Control-Allow-Origin', requestOrigin);
		res.header('Vary', 'Origin');
	} else if (isOriginAllowed('*')) {
		res.header('Access-Control-Allow-Origin', '*');
	}

	res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, appVersion, deviceFingerprint');
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.header('Access-Control-Allow-Private-Network', 'true');
}

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: config.requestBodyLimit }));
app.use(express.urlencoded({ extended: false, limit: config.requestBodyLimit }));

app.use((req, res, next) => {
	applyCors(req, res);
	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}
	return next();
});

app.use((req, res, next) => {
	if (req.method !== 'OPTIONS') {
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
	}
	next();
});

app.use((req, res, next) => {
	if (req.path === '/healthz' || req.method === 'OPTIONS') {
		return next();
	}
	return requireAuth(req, res, next);
});

app.get('/healthz', (req, res) => {
	res.json({
		ok: true,
		service: 'loghome-reader-ai-backend',
		collaborationEnabled: config.collaboration.enabled,
		time: new Date().toISOString(),
	});
});

app.use('/collaboration', collaborationRouter);

app.post('/library/reader_novel_ai_chat_stream', requireUser, async (req, res) => {
	return handleReaderNovelChatTaskStream(req, res);
});

app.post('/library/writer_novel_ai_assist_stream', requireUser, async (req, res) => {
	return handleWriterNovelAssistStream(req, res);
});

app.post('/library/writer_novel_ai_smart_replace', requireUser, async (req, res) => {
	return handleWriterNovelSmartReplace(req, res);
});

app.post('/library/writer_text_correction', requireUser, async (req, res) => {
	return handleWriterTextCorrection(req, res);
});

app.get('/library/reader_novel_summary_index_status', async (req, res) => {
	const novelId = Number(req.query.novel_id || req.query.id || 0);
	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id 不能为空' });
	}

	try {
		await assertNovelReaderAiAllowed(novelId);
		const status = await getNovelSummaryIndexStatus(novelId);
		return res.json({
			msg: 'ok',
			data: status,
		});
	} catch (error) {
		if (error && error.code === 'READER_AI_DISABLED') {
			return res.status(403).json({ code: error.code, msg: error.message });
		}
		if (error && (error.statusCode === 400 || error.statusCode === 404)) {
			return res.status(error.statusCode).json({ msg: error.message });
		}
		console.log(error);
		return res.status(500).json({ msg: '服务器错误' });
	}
});

const server = app.listen(config.port, () => {
	console.log(`loghome-reader-ai-backend listening on :${config.port}`);
});
const collaborationServerPromise = startCollaborationServer().catch((error) => {
	console.error('Failed to start writer collaboration server:', error);
	return null;
});
const sockets = new Set();
let shuttingDown = false;
let shutdownPromise = null;
let agentWorker = null;
let agentWorkerPromise = null;

server.on('connection', (socket) => {
	sockets.add(socket);
	socket.on('close', () => {
		sockets.delete(socket);
	});
});

if (Number.isFinite(config.keepAliveTimeoutMs)) {
	server.keepAliveTimeout = config.keepAliveTimeoutMs;
}

if (Number.isFinite(config.headersTimeoutMs)) {
	server.headersTimeout = config.headersTimeoutMs;
}

if (Number.isFinite(config.requestTimeoutMs)) {
	server.requestTimeout = config.requestTimeoutMs;
}

// Start agent worker if enabled
if (config.agentWorkerEnabled) {
	agentWorker = require('./bin/agentWorker');
	console.log('Agent worker enabled via AGENT_WORKER_ENABLED=true, starting...');
	agentWorkerPromise = agentWorker.startAgentWorker({ installSignalHandlers: false }).catch((error) => {
		if (!shuttingDown) {
			console.error('Agent worker crashed:', error);
		}
	});
}

function closeHttpServer() {
	return new Promise((resolve, reject) => {
		if (!server.listening) {
			resolve();
			return;
		}

		server.close((error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});

		if (typeof server.closeIdleConnections === 'function') {
			server.closeIdleConnections();
		}
	});
}

function waitForShutdownStep(promise, timeoutMs, timeoutMessage) {
	return new Promise((resolve, reject) => {
		let settled = false;
		const timer = setTimeout(() => {
			if (settled) {
				return;
			}
			settled = true;
			console.warn(timeoutMessage);
			resolve(false);
		}, timeoutMs);

		if (typeof timer.unref === 'function') {
			timer.unref();
		}

		Promise.resolve(promise)
			.then(() => {
				if (settled) {
					return;
				}
				settled = true;
				clearTimeout(timer);
				resolve(true);
			})
			.catch((error) => {
				if (settled) {
					return;
				}
				settled = true;
				clearTimeout(timer);
				reject(error);
			});
	});
}

async function shutdownApplication(signal = 'unknown') {
	if (shutdownPromise) {
		return shutdownPromise;
	}

	shuttingDown = true;
	console.log(`Received ${signal}. Shutting down application...`);

	const forceExitTimer = setTimeout(() => {
		console.error('Graceful shutdown timed out. Forcing exit.');
		if (typeof server.closeAllConnections === 'function') {
			server.closeAllConnections();
		}
		for (const socket of sockets) {
			socket.destroy();
		}
		process.exit(1);
	}, 10_000);

	if (typeof forceExitTimer.unref === 'function') {
		forceExitTimer.unref();
	}

	shutdownPromise = (async () => {
		try {
			const shutdownTasks = [
				waitForShutdownStep(
					closeHttpServer(),
					3_000,
					'HTTP server close timed out. Proceeding with process exit.'
				),
			];
			shutdownTasks.push(
				waitForShutdownStep(
					collaborationServerPromise.then(() => stopCollaborationServer()),
					4_000,
					'Collaboration server shutdown timed out. Proceeding with process exit.'
				)
			);
			if (agentWorker) {
				shutdownTasks.push(
					waitForShutdownStep(
						agentWorker.shutdown(),
						2_000,
						'Agent worker shutdown timed out. Proceeding with process exit.'
					)
				);
			}

			const shutdownResults = await Promise.allSettled(shutdownTasks);
			const shutdownError = shutdownResults.find((result) => result.status === 'rejected');
			if (shutdownError) {
				throw shutdownError.reason;
			}

			await waitForShutdownStep(
				closePool(),
				2_000,
				'MySQL pool close timed out. Proceeding with process exit.'
			);
			console.log('Application shut down.');
		} catch (error) {
			console.error('Shutdown error:', error);
			process.exitCode = 1;
		} finally {
			clearTimeout(forceExitTimer);
			process.exit(process.exitCode || 0);
		}
	})();

	return shutdownPromise;
}

process.once('SIGINT', () => {
	shutdownApplication('SIGINT');
});

process.once('SIGTERM', () => {
	shutdownApplication('SIGTERM');
});
