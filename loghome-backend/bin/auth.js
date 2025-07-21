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
					
					// 检查用户是否符合回归用户资格（超过90天未登录）
					const daysDiff = Math.floor((currentTime - lastOnlineTime) / (1000 * 60 * 60 * 24));
					if (daysDiff >= 90) {
						try {
							// 计算资格过期时间（14天后）
							const expiryDate = new Date(currentTime + 14 * 24 * 60 * 60 * 1000);
							
							// 直接使用INSERT IGNORE，依靠数据库的唯一键约束避免重复插入
							const result = await query(
								'INSERT IGNORE INTO return_user_eligibility (user_id, expiry_date) VALUES (?, ?)',
								[userId, expiryDate]
							);
							
							// 检查是否真的插入了新记录
							if (result.affectedRows > 0) {
								// 如果插入成功，发送通知
								try {
									const message = require('./message.js');
									message.sendMsg(
										-1,
										userId,
										'欢迎回归原木社区！您现在有资格填写回归用户邀请码，获得500原木奖励。此资格将在14天后过期。',
										'',
										'notification',
										true
									);
								} catch (e) {
									console.log('发送回归通知失败:', e);
								}
							}
						} catch (err) {
							console.log('回归资格处理失败:', err);
						}
					}
					
					// 只有当距离上次在线时间超过1分钟时，才更新用户在线时间
					if (currentTime - lastOnlineTime > 60 * 1000) {
						await query('UPDATE users SET online_time = ? WHERE user_id = ?', [
							new Date(),
							userId,
						]);
					}

					// 检查UniCloud用户是否存在，不存在的话就注册用户
					// if (req.user[0].uni_id == null) {
					// 	const username = UniCloud.generateUsername(userId);
					// 	const pwdMd5 = UniCloud.generatePasswordMd5(req.user[0].pwd);
					// 	let result = await uniCloud.registerUser(username, pwdMd5);
					// 	await query('UPDATE users SET uni_id = ? WHERE user_id = ?', [result.userInfo._id, userId]);
					// }
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
