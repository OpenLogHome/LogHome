// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = require('../SECRET.js').SECRET;

// 中间件：验证授权
const auth = async (req, res, next) => {
	// 获取客户端请求头的token
	const rawToken = String(req.headers.authorization).split(' ').pop();
	jwt.verify(rawToken, SECRET, async function (err, decoded) {
		if (err) {
			res.json(401, {
				status: 401,
				message: 'Request failed with status code 401',
			});
		} else {
			const id = decoded.id;
			const pwd = decoded.pwd;
			req.user = await query(
				'SELECT * FROM users WHERE user_id = ? AND pwd = ? AND activated = 1 AND is_admin = 1',
				[id, pwd],
			);

			if (req.user && req.user.length > 0) {
				next();
			} else {
				res.json(401, {
					status: 401,
					message: 'Request failed with status code 401',
				});
			}
		}
	});

	// 获取用户id
};

module.exports = auth;
