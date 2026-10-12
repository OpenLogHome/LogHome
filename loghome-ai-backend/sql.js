const mysql = require('mysql');
const config = require('./config');

// Transient failures we retry instead of letting a single DNS/proxy flap fail the query.
const TRANSIENT_CONNECT_CODES = new Set([
	'ENOTFOUND',
	'EAI_AGAIN',
	'ECONNREFUSED',
	'ECONNRESET',
	'EPIPE',
	'ETIMEDOUT',
	'PROTOCOL_CONNECTION_LOST',
]);
const CONNECT_MAX_ATTEMPTS = 5;
const CONNECT_BASE_DELAY_MS = 400;
const CONNECT_MAX_DELAY_MS = 8000;

const pool = mysql.createPool({
	...config.database,
	timezone: '+08:00',
	charset: 'utf8mb4',
});
let poolClosePromise = null;

// Without this listener an errored idle connection becomes an uncaught 'error'
// event and takes the whole process down.
pool.on('error', (error) => {
	console.error(
		`[sql] pool connection error (host=${config.database.host}:${config.database.port}): code=${error.code} ${error.message}`,
	);
});

function isTransientConnectError(error) {
	return TRANSIENT_CONNECT_CODES.has(error && error.code);
}

function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function connectBackoffMs(attempt) {
	const capped = Math.min(CONNECT_MAX_DELAY_MS, CONNECT_BASE_DELAY_MS * 2 ** (attempt - 1));
	return capped + Math.floor(Math.random() * 250);
}

function acquireConnection() {
	return new Promise((resolve, reject) => {
		pool.getConnection((error, connection) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(connection);
		});
	});
}

async function getConnection() {
	let lastError;
	for (let attempt = 1; attempt <= CONNECT_MAX_ATTEMPTS; attempt += 1) {
		try {
			return await acquireConnection();
		} catch (error) {
			if (!isTransientConnectError(error)) {
				throw error;
			}
			lastError = error;
			if (attempt === CONNECT_MAX_ATTEMPTS) {
				break;
			}
			const backoffMs = connectBackoffMs(attempt);
			console.warn(
				`[sql] transient connect failure (attempt ${attempt}/${CONNECT_MAX_ATTEMPTS}): ` +
					`code=${error.code} host=${config.database.host}:${config.database.port} — retrying in ${backoffMs}ms`,
			);
			await wait(backoffMs);
		}
	}
	console.error(
		`[sql] connect still failing after ${CONNECT_MAX_ATTEMPTS} attempts: code=${lastError && lastError.code} ` +
			`host=${config.database.host}:${config.database.port}. Check local DNS interception (proxy TUN/fake-ip) ` +
			`with: dscacheutil -q host -a name ${config.database.host}`,
	);
	throw lastError;
}

function runQuery(connection, sql, values) {
	return new Promise((resolve, reject) => {
		connection.query(sql, values, (error, rows) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(rows);
		});
	});
}

async function query(sql, values) {
	let connection;
	try {
		connection = await getConnection();
		return await runQuery(connection, sql, values);
	} finally {
		if (connection) {
			connection.release();
		}
	}
}

function closePool() {
	if (poolClosePromise) {
		return poolClosePromise;
	}

	poolClosePromise = new Promise((resolve, reject) => {
		pool.end((error) => {
			if (error) {
				poolClosePromise = null;
				reject(error);
				return;
			}
			resolve();
		});
	});

	return poolClosePromise;
}

async function withTransaction(work) {
	let connection;
	try {
		connection = await getConnection();
		await new Promise((resolve, reject) => {
			connection.beginTransaction((error) => (error ? reject(error) : resolve()));
		});
		const transactionalQuery = (sql, values) => runQuery(connection, sql, values);
		const result = await work(transactionalQuery);
		await new Promise((resolve, reject) => {
			connection.commit((error) => (error ? reject(error) : resolve()));
		});
		return result;
	} catch (error) {
		if (connection) {
			await new Promise((resolve) => connection.rollback(() => resolve()));
		}
		throw error;
	} finally {
		if (connection) connection.release();
	}
}

module.exports = {
	query,
	withTransaction,
	closePool,
};
