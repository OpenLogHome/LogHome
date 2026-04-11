const mysql = require('mysql');
const config = require('./config');

let pool = mysql.createPool({
	...config.database,
	timezone: '+08:00',
	charset: 'utf8mb4',
});

const getConnection = function () {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(connection);
		});
	});
};

const runQuery = function (connection, sql, values) {
	return new Promise((resolve, reject) => {
		connection.query(sql, values, (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
};

const query = async function (sql, values) {
	let connection;
	try {
		connection = await getConnection();
		return await runQuery(connection, sql, values);
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

const withTransaction = async function (work, name) {
	let connection;
	try {
		connection = await getConnection();
		await new Promise((resolve, reject) => {
			connection.beginTransaction((err) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});

		const transactionalQuery = (sql, values) => runQuery(connection, sql, values);
		const result = await work(transactionalQuery, connection);

		await new Promise((resolve, reject) => {
			connection.commit((err) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});

		return result;
	} catch (error) {
		if (connection) {
			try {
				await new Promise((resolve) => {
					connection.rollback(() => {
						resolve();
					});
				});
			} catch (rollbackError) {
				console.log('事务回滚失败', rollbackError);
			}
		}

		if (name) {
			console.log(`事务 ${name} 失败`);
		} else {
			console.log('事务失败');
		}
		throw error;
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

const transition = async (work, name) => {
	return withTransaction((transactionalQuery) => work(transactionalQuery), name);
};

module.exports = {
	query,
	transition,
	withTransaction,
};
