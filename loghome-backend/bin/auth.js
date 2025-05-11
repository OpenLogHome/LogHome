// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const SECRET = require('../SECRET.js').SECRET;

const UniCloud = require('../bin/unicloud.js');

const uniCloud = new UniCloud();

// 中间件：验证授权
const auth = async (req, res, next) => {
	try {
		// 获取客户端请求头的token
		const rawToken = String(req.headers.authorization).split(' ').pop();
		jwt.verify(rawToken, SECRET, async function (err, decoded) {
			if (err) {
				res.json(401, {
					status: 401,
					message: 'Request failed with status code 401',
				});
				return;
			} else {
				const id = decoded.id;
				const pwd = decoded.pwd;
				req.user = await query(
					'SELECT * FROM users WHERE user_id = ? AND pwd = ?  AND activated = 1',
					[id, pwd],
				);
				if (req.user && req.user.length > 0) {
					const userId = req.user[0].user_id;
					const currentTime = Date.now();
					const lastOnlineTime = new Date(req.user[0].online_time).getTime();
					
					// 只有当距离上次在线时间超过1分钟时，才更新用户在线时间
					if (currentTime - lastOnlineTime > 60 * 1000) {
						await query('UPDATE users SET online_time = ? WHERE user_id = ?', [
							new Date(),
							userId,
						]);
					}

					// 检查UniCloud用户是否存在，不存在的话就注册用户
					if (req.user[0].uni_id == null) {
						const username = UniCloud.generateUsername(userId);
						const pwdMd5 = UniCloud.generatePasswordMd5(req.user[0].pwd);
						let result = await uniCloud.registerUser(username, pwdMd5);
						await query('UPDATE users SET uni_id = ? WHERE user_id = ?', [result.userInfo._id, userId]);
					}
				} else {
					res.json(401, {
						status: 401,
						message: 'Request failed with status code 401',
					});
					return;
				}
				next();
			}
		});
	} catch (e) {
		res.json(401, {
			status: 401,
			message: 'Request failed with status code 401',
		});
	}

	// 获取用户id
};

module.exports = auth;
