const mysql = require('mysql');
const config = require("./config")
let pool = mysql.createPool({
	...config.database,
	timezone: '+08:00',
	charset: 'utf8mb4'
});

const query = async function (sql, values) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err);
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
					connection.release();
				});
			}
		});
	});
};

const transition = async (work, name) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				console.log(err);
			} else {
				conn.beginTransaction(err => {
					if (err) {
						console.log(err);
					} else {
						work(query);
						conn.commit(err => {
							if (err) {
								if (name) {
									console.log(`事务 ${name} 提交失败`);
									reject(`事务 ${name} 提交失败`);
								} else {
									console.log('事务提交失败');
									reject('事务提交失败');
								}
							}
						});
						conn.release();
						resolve(true);
					}
				});
			}

			function query(sql, values) {
				return new Promise((queryResolve, queryReject) => {
					conn.query(sql, values, (err, rows) => {
						if (err) {
							console.log(`执行 ${sql}: values:[${values}] 失败`);
							queryReject(`执行 ${sql}: values:[${values}] 失败`);
							reject(`执行 ${sql}: values:[${values}] 失败`);
							console.log(err);
							conn.rollback(() => {
								if (name) {
									console.log(`事务 ${name} 回滚`);
								} else {
									console.log('事务回滚');
								}
							});
						} else {
							queryResolve(rows);
						}
					});
				});
			}
		});
	});
};

module.exports = {
	query,
	transition,
};
