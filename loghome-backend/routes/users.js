// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const jwt = require('jsonwebtoken');
let axios = require('axios');
const SECRET = require('../SECRET.js').SECRET;
let config = require("../config.js")
const fetch = require('node-fetch');
const { generateRandomUsername } = require('../bin/username-generator.js');
const UniCloud = require('../bin/unicloud.js');
const achievements = require('../bin/achievements.js');
const membership = require('../bin/membership.js');
const avatarFrames = require('../bin/avatarFrames.js');

// 发送邮件的函数
async function sendEmail(to, code) {
    try {
        // API key
        let myHeaders = {
            "x-api-key": config.emailApiKey
        };

        // 构造请求
        let urlencoded = new URLSearchParams();
        urlencoded.append("emailId", "3");
        urlencoded.append("templateId", "3");
        urlencoded.append("recipients", to);
        urlencoded.append("parameters", JSON.stringify({"validateCode": code}));
        
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        
        const response = await fetch("http://email.codesocean.top/api/send", requestOptions);
        
        if (response.ok) {
            console.log('邮件发送成功');
            return true;
        } else {
            console.error('邮件发送失败: 状态码', response.status);
            return false;
        }
    } catch (error) {
        console.error('邮件发送失败:', error);
        return false;
    }
}

// 创建路由对象
let router = express.Router();

let userValidates = {}
setInterval(() => {
    for (let key in userValidates) {
        if (userValidates[key].countdown > 0) {
            userValidates[key].countdown--;
        }
        if (userValidates[key].validateCountdown > 0) {
            userValidates[key].validateCountdown--;
        }
    }
    userValidates = Object.filter(userValidates, function(item){
        return item.countdown > 0 || item.validateCountdown > 0;
    });
}, 1000)

function getRandom(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function getCode(len = 10) {
	let code = '';
	for (let i = 0; i < len; i++) {
		let type = getRandom(1, 3);
		switch (type) {
			case 1:
				code += String.fromCharCode(getRandom(48, 57)); //数字
				break;
			case 2:
				code += String.fromCharCode(getRandom(65, 90)); //大写字母
				break;
			case 3:
				code += String.fromCharCode(getRandom(97, 122)); //小写字母
				break;
		}
	}
	return code;
}

router.get('/all_users', async function (req, res) {
	//获取用户列表的所有用户信息
	try {
		let results = await query('SELECT user_id,name,account FROM users');
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/user_profile_of', async function (req, res) {
	try {
		let results = await query(
			'SELECT name,avatar_url,top_pic_url,user_group,motto,is_admin,uni_id FROM users WHERE user_id = ?',
			[req.query.id],
		);
		if (results && results.length > 0) {
			const [currentMembership, selectedBadge, titleProfile, avatarFrame] = await Promise.all([
				membership.getCurrentSubscription(req.query.id),
				achievements.getUserBadge(req.query.id),
				achievements.getUserTitleProfile(req.query.id),
				avatarFrames.getEffectiveAvatarFrame(req.query.id),
			]);
			results[0].selected_badge = selectedBadge;
			results[0].title_profile = titleProfile;
			results[0].display_title = results[0].title_profile.display_text;
			results[0].avatar_frame = avatarFrame;
			results[0].membership_type = currentMembership
				? currentMembership.membership_type
				: '';
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/check_mobile', async function (req, res) {
	try {
		let results = await query(
			'SELECT account FROM users WHERE mobile = ? AND activated = 1',
			[req.query.mobile],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/check_account', async function (req, res) {
	try {
		let results = await query('SELECT account FROM users WHERE account = ?', [
			req.query.account,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/check_email', async function (req, res) {
	try {
		let results = await query(
			'SELECT account FROM users WHERE email = ? AND activated = 1',
			[req.query.email],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/login', async (req, res) => {
	let user = undefined;
	// 1.看用户是否存在
	try {
		user = await query(
			'SELECT * FROM users WHERE account = ? OR mobile = ? OR oicq_account = ? OR email= ? AND activated = 1',
			[req.body.username, req.body.username, req.body.username, req.body.username],
		);
	} catch (e) {
		res.status(422).send({
			msg: '用户名不存在',
		});
		return;
	}

	if (user.length == 0) {
		res.status(422).send({
			msg: '用户名不存在',
		});
	} else {
		user = JSON.parse(JSON.stringify(user))[0];
		// console.log(req.body.password,user.pwd);
		// 2.用户如果存在，则看密码是否正确
		const isPasswordValid = require('bcryptjs').compareSync(
			req.body.password,
			user.pwd,
		);

		if (!isPasswordValid) {
			// 密码无效
			return res.status(422).send({
				message: '密码无效',
			});
		}

		// 生成token
		const token = jwt.sign(
			{
				id: String(user.user_id),
				pwd: String(user.pwd),
			},
			SECRET,
		);
		let user_id = user.user_id;
		res.send({
			token: {
				tk: token,
				id: user_id,
			},
		});
	}
});

router.get('/heartbeat', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	// 生成token
	const token = jwt.sign(
		{
			id: String(user.user_id),
			pwd: String(user.pwd),
			expiresIn: 60 * 60 * 24 * 7, //jwt七天过期
		},
		SECRET,
	);

	let messages = await query(
		'SELECT m.*,u.name,u.avatar_url FROM user_message m,users u WHERE is_read = 0 AND to_id = ? AND u.user_id = m.from_id ORDER BY time DESC',
		[user.user_id],
	);

	// 获取用户的邮箱信息
	let userInfo = await query(
		'SELECT email FROM users WHERE user_id = ?',
		[user.user_id],
	);
	
	let user_id = user.user_id;
	res.send({
		token: {
			tk: token,
			id: user_id,
		},
		messages,
		email: userInfo[0].email || '',
	});
});

router.get('/userprofile', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	user.pwd = undefined;
	user.selected_badge = await achievements.getUserBadge(user.user_id);
	user.title_profile = await achievements.getUserTitleProfile(user.user_id);
	user.display_title = user.title_profile.display_text;
	user.selected_avatar_frame_id = await avatarFrames.getSelectedFrameId(user.user_id);
	user.avatar_frame = await avatarFrames.getEffectiveAvatarFrame(user.user_id);
	const currentMembership = await membership.getCurrentSubscription(user.user_id);
	user.membership = currentMembership
		? {
			type: currentMembership.membership_type,
			active: true,
			billing_cycle: currentMembership.billing_cycle,
			expires_at: currentMembership.expires_at,
			auto_renew: Boolean(currentMembership.auto_renew),
		  }
		: { active: false };

	res.end(JSON.stringify(user));
});

router.get('/achievements_definitions', auth, async (req, res) => {
	try {
		const list = await achievements.getAchievementDefinitions({
			officialOnly: false,
		});
		res.json({ list });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/achievements', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		const list = await achievements.getUserAchievements(user.user_id);
		res.json({
			list,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/achievements_summary', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		const summary = await achievements.getUserAchievementSummary(user.user_id);
		res.json(summary);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/title_profile', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		const titleProfile = await achievements.getUserTitleProfile(user.user_id);
		res.json({ title_profile: titleProfile });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/title_profile', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		const titleProfile = await achievements.setUserTitleShowcase(user.user_id, req.body || {});
		res.json({
			msg: 'ok',
			title_profile: titleProfile,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: e.message || 'bad request' });
	}
});

router.get('/achievement_progress', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		const achievementId = Number(req.query.achievement_id);
		if (!Number.isFinite(achievementId) || achievementId <= 0) {
			return res.status(400).json({ msg: 'invalid achievement_id' });
		}
		const result = await achievements.evaluateAchievementForUser(achievementId, user.user_id, {
			grantIfMatched: false,
			allowProgressOutsideWindow: true,
			clampToValidWindow: true,
		});
		res.json({ result });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/select_badge', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];

		const selectedBadge = await achievements.setUserBadge(
			user.user_id,
			req.body.achievement_id,
		);

		if (
			req.body.achievement_id !== null &&
			req.body.achievement_id !== undefined &&
			req.body.achievement_id !== 0 &&
			!selectedBadge
		) {
			return res.status(400).json({
				msg: 'achievement not unlocked or not selectable',
			});
		}

		res.json({
			msg: 'ok',
			selected_badge: selectedBadge,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 使用旧密码更新密码
router.post('/change_pwd', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];

	// 2.用户如果存在，则看密码是否正确
	const isPasswordValid = require('bcryptjs').compareSync(
		req.body.password,
		user.pwd,
	);

	if (!isPasswordValid) {
		// 密码无效
		return res.status(422).send({
			message: '密码无效',
		});
	}

	require('bcryptjs').hash(req.body.newPwd, 10, async (err, pwd) => {
		await query('UPDATE users SET pwd = ? WHERE user_id = ?', [
			pwd,
			user.user_id,
		]);
	});

	res.json(200, { msg: 'ok' });
});


router.get('/register_with_email', async (req, res) => {
	try {
		let response = {
			data:{
				msg:"邮箱或验证码错误"
			}
		}
		
		// 从数据库获取验证码
		let validateCode = await query('SELECT * FROM user_validate_code WHERE email = ? AND create_time > DATE_SUB(NOW(), INTERVAL 30 MINUTE)', [req.query.email]);
		
		if (validateCode.length > 0 && validateCode[0].code === req.query.vcode) {
			response.data.msg = "登录成功";
			let userCheck = await query('SELECT * FROM users WHERE email = ?', [
				req.query.email,
			]);
			let verify_code = getCode();
			if (userCheck.length > 0) {
				// 登录
				await query(
					'UPDATE users SET register_verify = ? WHERE email = ?',
					[verify_code, req.query.email],
				);
			} else {
				// 注册 - 使用随机生成的Minecraft风格昵称
				const randomUsername = generateRandomUsername();
				await query(
					'INSERT INTO users(`name`,account,email,activated,register_verify) VALUES(?,?,?,0,?)',
					[
						randomUsername,
						req.query.email,
						req.query.email,
						verify_code,
					],
				);
			}
			response.data.register_code = verify_code;
			// 验证成功后删除验证码
			await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
		} else {
			response.data.msg = "邮箱或验证码错误";
		}
		res.end(JSON.stringify(response.data));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/register', async (req, res) => {
	try {
		require('bcryptjs').hash(req.body.password, 10, async (err, pwd) => {
			let user = undefined;
			if (req.body.mobile) {
				user = await query(
					'SELECT * FROM users WHERE mobile = ? AND register_verify = ?',
					[req.body.mobile, req.body.verifyCode],
				);
			} else if (req.body.email) {
				user = await query(
					'SELECT * FROM users WHERE email = ? AND register_verify = ?',
					[req.body.email, req.body.verifyCode],
				);
			} else {
				res.json(400, { msg: 'bad request' });
				return;
			}
			
			let forgetPwd = false;
			if (user.length == 0) {
				res.json(400, { msg: 'bad request' });
				return;
			} else if (user[0].activated == 1) {
				forgetPwd = true;
			}
			
			if (forgetPwd) {
				if (req.body.mobile) {
					await query(
						'UPDATE users SET pwd = ?, activated = 1 WHERE mobile = ?',
						[pwd, req.body.mobile],
					);
				} else if (req.body.email) {
					await query(
						'UPDATE users SET pwd = ?, activated = 1 WHERE email = ?',
						[pwd, req.body.email],
					);
				}
			} else {
				// 如果用户提供了用户名，则使用用户提供的，否则保留预注册时生成的随机昵称
				const username = req.body.username || user[0].name;
				
				if (req.body.mobile) {
					await query(
						'UPDATE users SET name = ? ,account = ?, pwd = ?, activated = 1 WHERE mobile = ?',
						[generateRandomUsername(), username, pwd, req.body.mobile],
					);
				} else if (req.body.email) {
					await query(
						'UPDATE users SET name = ? ,account = ?, pwd = ?, activated = 1 WHERE email = ?',
						[generateRandomUsername(), username, pwd, req.body.email],
					);
				}
			}
			
			let results = undefined;
			if (req.body.mobile) {
				results = await query('SELECT * FROM users WHERE mobile = ?', [
					req.body.mobile,
				]);
			} else if (req.body.email) {
				results = await query('SELECT * FROM users WHERE email = ?', [
					req.body.email,
				]);
			}
			
			if (!forgetPwd) {
				let verifyCode = getCode();
				await query(
					'INSERT INTO register_code(user_id,register_code) VALUES(?,?)',
					[results[0].user_id, verifyCode],
				);
			}
			// 生成token
			const token = jwt.sign(
				{
					id: String(results[0].user_id),
					pwd: String(results[0].pwd),
				},
				SECRET,
			);
			let user_id = results[0].user_id;
			res.send({
				token: {
					tk: token,
					id: user_id,
				},
			});
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_verify_code', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let result = await query('SELECT * FROM register_code WHERE user_id = ?', [
			user.user_id,
		]);
		if (result.length == 0) {
			let verifyCode = getCode();
			await query(
				'INSERT INTO register_code(user_id,register_code) VALUES(?,?)',
				[user.user_id, verifyCode],
			);
			res.send(verifyCode);
		} else {
			res.send(result[0].register_code);
		}
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/send_email_verify_code', async (req, res) => {
	try {
		// 检查是否在冷却时间内
		let lastCode = await query('SELECT * FROM user_validate_code WHERE email = ? AND create_time > DATE_SUB(NOW(), INTERVAL 1 MINUTE)', [req.query.email]);
		
		if (lastCode.length > 0) {
			res.json(400, "验证码发送过于频繁，请等一分钟后再发送");
			return;
		}

		//生成6位的验证码
		let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
		if(config.developerMode){
			code = '123456';
		}

		// 删除旧的验证码（如果存在）
		await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
		
		// 插入新的验证码
		await query('INSERT INTO user_validate_code(email, code) VALUES(?, ?)', [req.query.email, code]);

		if(config.developerMode){
			res.json(200, { msg: '当前处于开发者模式，验证码为123456' });
		} else {
			// 发送邮件验证码
			const emailSent = await sendEmail(req.query.email, code);
			
			if (emailSent) {
				res.json(200, { msg: '已发送验证码到您的邮箱' });
			} else {
				// 如果发送失败，删除验证码记录
				await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
				res.json(400, { msg: '验证码发送失败，请稍后重试' });
			}
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/verify_email', auth, async (req, res) => {
	try {
        let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
        let response = {
			data:{
				msg:"验证码错误"
			}
		}
		
		// 从数据库获取验证码
		let validateCode = await query('SELECT * FROM user_validate_code WHERE email = ? AND create_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)', [req.query.email]);
		
		if (validateCode.length > 0 && validateCode[0].code === req.query.vcode) {
			response.data.msg = "登录成功";
			let userCheck = await query('SELECT * FROM users WHERE email = ?', [
				req.query.email,
			]);
			if (userCheck.length > 0) {
				// 邮箱已被使用，不能注册
				response.data.msg = "该邮箱已被使用"
			} else {
				await query('UPDATE users SET email = ? WHERE user_id = ?', [
                    req.query.email,
                    user.user_id,
                ]);
                response.data.msg = "绑定成功"
			}
			// 验证成功后删除验证码
			await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
		} else {
			response.data.msg = "验证码错误或已过期";
		}
		res.end(JSON.stringify(response.data));
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/change_avater', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		axios
			.post(
				'http://img.codesocean.top/upload/imgbase64',
				{
					img: req.body.img,
					apikey: '45qEQfILCQ3tAXxmUJF8O562bJU2D0',
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
					},
				},
			)
			.then(function (response) {
				let result = query(
					'UPDATE users SET avatar_url = ? WHERE user_id = ?',
					[response.data.url, user.user_id],
				);
				res.json(200, { msg: 'ok' });
			})
			.catch(function (error) {
				res.json(400, { msg: 'bad request' });
			});
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/change_top_cover', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		axios
			.post(
				'http://img.codesocean.top/upload/imgbase64',
				{
					img: req.body.img,
					apikey: '45qEQfILCQ3tAXxmUJF8O562bJU2D0',
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
					},
				},
			)
			.then(function (response) {
				let result = query(
					'UPDATE users SET top_pic_url = ? WHERE user_id = ?',
					[response.data.url, user.user_id],
				);
				res.json(200, { msg: 'ok' });
			})
			.catch(function (error) {
				console.log(error);
				res.json(400, { msg: 'bad request' });
			});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/update_userinfo', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'UPDATE users SET `name`=?,`motto`=? WHERE `user_id`=?',
			[req.body.name, req.body.motto, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/push_status', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let result = await query(
			'SELECT push_set_status FROM users WHERE user_id = ?',
			[user.user_id],
		);
		res.end(JSON.stringify(result));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/push_set', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		if (Number(req.query.status) == 1) {
			await query('UPDATE users SET push_set_status = 1 WHERE user_id = ?', [
				user.user_id,
			]);
		} else {
			await query('UPDATE users SET push_set_status = 0 WHERE user_id = ?', [
				user.user_id,
			]);
		}
		res.end('Success!');
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

// 获取/生成用户绑定码
router.get('/get_binding_code', auth, async (req, res) => {
    try {
        let user = req.user;
        user = JSON.parse(JSON.stringify(user))[0];
        let user_id = user.user_id;
        
        // 查询是否已有绑定码
        let results = await query('SELECT binding_code, push_start_time, push_end_time FROM user_bindings WHERE user_id = ?', [user_id]);
        
        if (results.length > 0 && req.query.refresh != 'true') {
            res.json(200, { 
                binding_code: results[0].binding_code,
                push_start_time: results[0].push_start_time || '00:00',
                push_end_time: results[0].push_end_time || '23:59'
            });
        } else {
            // 生成新的绑定码
            let newCode = getCode(8);
            
            // 确保唯一性（简单重试机制）
            let check = await query('SELECT user_id FROM user_bindings WHERE binding_code = ?', [newCode]);
            let retryCount = 0;
            while (check.length > 0 && retryCount < 5) {
                newCode = getCode(8);
                check = await query('SELECT user_id FROM user_bindings WHERE binding_code = ?', [newCode]);
                retryCount++;
            }
            
            if (retryCount >= 5) {
                 return res.json(500, { msg: '生成绑定码失败，请重试' });
            }
            
            if (results.length > 0) {
                await query('UPDATE user_bindings SET binding_code = ? WHERE user_id = ?', [newCode, user_id]);
            } else {
                await query('INSERT INTO user_bindings (user_id, binding_code, push_start_time, push_end_time) VALUES (?, ?, "00:00", "23:59")', [user_id, newCode]);
            }
            res.json(200, { 
                binding_code: newCode,
                push_start_time: results.length > 0 ? (results[0].push_start_time || '00:00') : '00:00',
                push_end_time: results.length > 0 ? (results[0].push_end_time || '23:59') : '23:59'
            });
        }
    } catch (e) {
        console.log(e);
        res.json(500, { msg: '服务器错误' });
    }
});

// 更新推送时间设置
router.post('/update_push_time', auth, async (req, res) => {
    try {
        let user = req.user;
        user = JSON.parse(JSON.stringify(user))[0];
        let user_id = user.user_id;
        
        let { start_time, end_time } = req.body;
        
        if (!start_time || !end_time) {
            return res.json(400, { msg: '参数不完整' });
        }
        
        await query('UPDATE user_bindings SET push_start_time = ?, push_end_time = ? WHERE user_id = ?', [start_time, end_time, user_id]);
        
        res.json(200, { msg: '设置成功' });
    } catch (e) {
        console.log(e);
        res.json(500, { msg: '服务器错误' });
    }
});

router.get('/get_history_message', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let messages = await query(
			'SELECT m.*,u.name,u.avatar_url FROM user_message m,users u WHERE to_id = ? AND u.user_id = m.from_id ORDER BY time DESC LIMIT 0,100',
			[user.user_id],
		);
		await avatarFrames.decorateRows(messages, [
			{ userIdField: 'from_id', targetField: 'avatar_frame' },
		]);
        await query(
            'UPDATE user_message SET is_read = 1 WHERE to_id = ? AND is_read = 0',
            [user.user_id],
        );
		res.end(JSON.stringify(messages));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

// 设备验证相关接口
router.get('/device_verify', async (req, res) => {
	try {
		// 如果请求中有设备指纹，则进行验证
		if (req.query.deviceFingerprint) {
			let devices = await query(
				'SELECT * FROM devices WHERE device_id = ?', [req.query.deviceFingerprint]
			);
			if (devices.length > 0 && devices[0].os == req.query.os && devices[0].model == req.query.model) {
				res.end("welcome");
				return;
			}
		}
		// 否则创建设备
		let deviceFingerprint = getCode(50);
		await query("INSERT INTO devices(device_id,os,model) VALUES(?,?,?)", [deviceFingerprint, req.query.os, req.query.model])
		res.json(202, { newFingerprint: deviceFingerprint });

	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 发送邮箱绑定验证码
router.get('/send_bind_email_code', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		// 检查邮箱是否已被其他用户使用
		let emailCheck = await query('SELECT * FROM users WHERE email = ? AND user_id != ?', [
			req.query.email,
			user.user_id
		]);
		
		if (emailCheck.length > 0) {
			res.json(400, { msg: '该邮箱已被其他用户绑定' });
			return;
		}
		
		// 检查是否在冷却时间内
		let lastCode = await query('SELECT * FROM user_validate_code WHERE email = ? AND create_time > DATE_SUB(NOW(), INTERVAL 1 MINUTE)', [req.query.email]);
		
		if (lastCode.length > 0) {
			res.json(400, "验证码发送过于频繁，请等一分钟后再发送");
			return;
		}

		//生成6位的验证码
		let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
		if(config.developerMode){
			code = '123456';
		}

		// 删除旧的验证码（如果存在）
		await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
		
		// 插入新的验证码
		await query('INSERT INTO user_validate_code(email, code) VALUES(?, ?)', [req.query.email, code]);

		if(config.developerMode){
			res.json(200, { msg: '当前处于开发者模式，验证码为123456' });
		} else {
			// 发送邮件验证码
			const emailSent = await sendEmail(req.query.email, code);
			
			if (emailSent) {
				res.json(200, { msg: '已发送验证码到您的邮箱' });
			} else {
				// 如果发送失败，删除验证码记录
				await query('DELETE FROM user_validate_code WHERE email = ?', [req.query.email]);
				res.json(400, { msg: '验证码发送失败，请稍后重试' });
			}
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 验证邮箱绑定
router.post('/verify_bind_email', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		// 如果此用户已绑定邮箱且不是请求更换邮箱
		if (user.email != 'unbind' && !req.body.force) {
			res.json(400, { msg: '您已绑定邮箱，如需更换请先解绑' });
			return;
		}
		
		// 检查邮箱是否已被其他用户使用
		let emailCheck = await query('SELECT * FROM users WHERE email = ? AND user_id != ?', [
			req.body.email,
			user.user_id
		]);
		
		if (emailCheck.length > 0) {
			res.json(400, { msg: '该邮箱已被其他用户绑定' });
			return;
		}
		
		let verified = false;
		let response = {
			code: 400,
			msg: "验证码错误或已过期"
		};

		// 从数据库获取验证码，参考 verify_email 接口
		let validateCode = await query('SELECT * FROM user_validate_code WHERE email = ? AND create_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)', [req.body.email]);
		
		if (validateCode.length > 0 && validateCode[0].code === req.body.code) {
			// 更新用户邮箱
			await query('UPDATE users SET email = ? WHERE user_id = ?', [
				req.body.email,
				user.user_id
			]);
			
			// 验证成功后删除验证码
			await query('DELETE FROM user_validate_code WHERE email = ?', [req.body.email]);
			
			verified = true;
			response = {
				code: 200,
				msg: "邮箱绑定成功"
			};
		}
		
		res.json(response.code, { msg: response.msg, success: verified });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 签发短期跨站点登录令牌 - 供已登录用户使用
router.get('/generate_cross_site_token', auth, async (req, res) => {
    try {
        let user = req.user;
        user = JSON.parse(JSON.stringify(user))[0];
        
        // 生成一个8字符的随机令牌
        const crossSiteToken = getCode(8);
        
        // 计算过期时间 - 15秒后过期
        const expireTime = new Date(Date.now() + 15000);
        
        // 存储令牌到数据库
        await query(
            'INSERT INTO user_cross_site_tokens(token, user_id, expire_time) VALUES(?, ?, ?)',
            [crossSiteToken, user.user_id, expireTime]
        );
        
        res.json(200, { 
            crossSiteToken: crossSiteToken,
            expireIn: 15 // 15秒后过期
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 通过跨站点令牌获取登录token
router.get('/token_by_cross_site', async (req, res) => {
    try {
        const crossSiteToken = req.query.token;
        
        if (!crossSiteToken) {
            return res.json(400, { msg: '无效的跨站点令牌' });
        }
        
        // 从数据库获取令牌信息
        const tokenResults = await query(
            'SELECT t.*, u.pwd FROM user_cross_site_tokens t JOIN users u ON t.user_id = u.user_id WHERE t.token = ?',
            [crossSiteToken]
        );
        
        if (tokenResults.length === 0) {
            return res.json(400, { msg: '无效的跨站点令牌或令牌已过期' });
        }
        
        const tokenInfo = tokenResults[0];
        const currentTime = new Date();
        
        // 验证令牌是否过期
        if (new Date(tokenInfo.expire_time) < currentTime) {
            // 删除过期令牌
            await query('DELETE FROM user_cross_site_tokens WHERE token = ?', [crossSiteToken]);
            return res.json(400, { msg: '令牌已过期' });
        }
        
        // 获取用户信息
        const userId = tokenInfo.user_id;
        const userPwd = tokenInfo.pwd;
        
        // 生成标准JWT token
        const token = jwt.sign(
            {
                id: String(userId),
                pwd: String(userPwd),
            },
            SECRET,
        );
        
        // 删除过期的令牌
        await query('DELETE FROM user_cross_site_tokens WHERE expire_time < NOW()');
        
        // 返回登录token
        res.json(200, {
            token: {
                tk: token,
                id: userId,
            }
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 通过跨站点令牌获取UniCloud登录token
router.get('/unicloud_token_by_cross_site', async (req, res) => {
    try {
        const crossSiteToken = req.query.token;
        
        if (!crossSiteToken) {
            return res.json(400, { msg: '无效的跨站点令牌' });
        }
        
        // 从数据库获取令牌信息
        const tokenResults = await query(
            'SELECT t.*, u.pwd, u.uni_id FROM user_cross_site_tokens t JOIN users u ON t.user_id = u.user_id WHERE t.token = ?',
            [crossSiteToken]
        );
        
        if (tokenResults.length === 0) {
            return res.json(400, { msg: '无效的跨站点令牌或令牌已过期' });
        }
        
        const tokenInfo = tokenResults[0];
        const currentTime = new Date();
        
        // 验证令牌是否过期
        if (new Date(tokenInfo.expire_time) < currentTime) {
            // 删除过期令牌
            await query('DELETE FROM user_cross_site_tokens WHERE token = ?', [crossSiteToken]);
            return res.json(400, { msg: '令牌已过期' });
        }

        // 检查用户是否有UniCloud账号
        if (!tokenInfo.uni_id) {
            return res.json(400, { msg: '用户未绑定UniCloud账号' });
        }
        
        // 获取用户信息
        const userId = tokenInfo.user_id;
        const userPwd = tokenInfo.pwd;
        
        // 生成UniCloud用户名和密码
        const username = UniCloud.generateUsername(userId);
        const pwdMd5 = UniCloud.generatePasswordMd5(userPwd);
		console.log("username", username);
		console.log("pwdMd5", pwdMd5);
        
        // 使用UniCloud登录
        const uniCloud = new UniCloud();
        const loginResult = await uniCloud.login(username, pwdMd5);
        
        if (!loginResult || loginResult.code !== 0) {
            return res.json(400, { msg: 'UniCloud登录失败' });
        }
        
        // 删除过期的令牌
        await query('DELETE FROM user_cross_site_tokens WHERE expire_time < NOW()');

		// 获取用户信息
		const userInfo = await query('SELECT * FROM users WHERE user_id = ?', [userId]);

		// 更新用户信息
		await uniCloud.updateUserInfo({
			nickname: userInfo[0].name,
			avatar: userInfo[0].avatar_url,
			background: userInfo[0].top_pic_url,
			gxqm: userInfo[0].motto,
			gender: 0
		}, loginResult.token);
        
        // 返回UniCloud登录token
        res.json(200, {
            token: loginResult.token,
            tokenExpired: loginResult.tokenExpired,
			userInfo: loginResult.userInfo
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});


router.get('/get_user_id_by_uni_id', async function (req, res) {
	//获取用户列表的所有用户信息
	try {
		let results = await query('SELECT user_id FROM users WHERE uni_id = ?', [req.query.uni_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
