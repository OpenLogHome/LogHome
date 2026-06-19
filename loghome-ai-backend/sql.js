const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
	...config.database,
	timezone: '+08:00',
	charset: 'utf8mb4',
});
let poolClosePromise = null;

function getConnection() {
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

module.exports = {
	query,
	closePool,
};
