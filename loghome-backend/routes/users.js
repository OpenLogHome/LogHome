// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const jwt = require('jsonwebtoken');
let axios = require('axios');
const SECRET = require('../SECRET.js').SECRET;
let getSignature = require('../bin/uni-cloud/sig.js');
let tencentSms = require('../bin/tencent-sms.js');
let config = require("../config.js")

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
			'SELECT name,avatar_url,top_pic_url,user_group,motto,is_admin, uni_id FROM users WHERE user_id = ?',
			[req.query.id],
		);
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

router.post('/login', async (req, res) => {
	let user = undefined;
	// 1.看用户是否存在
	try {
		user = await query(
			'SELECT * FROM users WHERE account = ? OR mobile = ? OR oicq_account = ? AND activated = 1',
			[req.body.username, req.body.username, req.body.username],
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

	await query(
		'UPDATE user_message SET is_read = 1 WHERE to_id = ? AND is_read = 0',
		[user.user_id],
	);
	let user_id = user.user_id;
	res.send({
		token: {
			tk: token,
			id: user_id,
		},
		messages,
	});
});

router.get('/userprofile', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	user.pwd = undefined;

	res.end(JSON.stringify(user));
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

router.get('/register_with_mobile', async (req, res) => {
	try {
		let response = {
			data:{
				msg:"手机号或验证码错误"
			}
		}
		for (let key in userValidates) {
			if (key == req.query.mobile) {
				// 检查是否匹配
				if(userValidates[key].validateCode == req.query.vcode){
					response.data.msg = "登录成功";
					let userCheck = await query('SELECT * FROM users WHERE mobile = ?', [
						req.query.mobile,
					]);
					let verify_code = getCode();
					if (userCheck.length > 0) {
						// 登录
						await query(
							'UPDATE users SET register_verify = ? WHERE mobile = ?',
							[verify_code, req.query.mobile],
						);
					} else {
						// 注册
						await query(
							'INSERT INTO users(`name`,account,mobile,activated,register_verify) VALUES(?,?,?,0,?)',
							[
								req.query.mobile,
								req.query.mobile,
								req.query.mobile,
								verify_code,
							],
						);
					}
					response.data.register_code = verify_code;
				} else {
					response.data.msg = "手机号或验证码错误";
				}
			}
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
			let user = await query(
				'SELECT * FROM users WHERE mobile = ? AND register_verify = ?',
				[req.body.mobile, req.body.verifyCode],
			);
			let forgetPwd = false;
			if (user.length == 0) {
				res.json(400, { msg: 'bad request' });
				return;
			} else if (user[0].activated == 1) {
				forgetPwd = true;
			}
			if (forgetPwd) {
				await query(
					'UPDATE users SET pwd = ?, activated = 1 WHERE mobile = ?',
					[pwd, req.body.mobile],
				);
			} else {
				await query(
					'UPDATE users SET name = ? ,account = ?, pwd = ?, activated = 1 WHERE mobile = ?',
					[req.body.username, req.body.username, pwd, req.body.mobile],
				);
			}
			let results = await query('SELECT * FROM users WHERE mobile = ?', [
				req.body.mobile,
			]);
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

router.get('/send_mobile_verify_code', async (req, res) => {
	try {
		if(userValidates[req.query.mobile] != undefined && userValidates[req.query.mobile].countdown > 0){
			res.json(responses.BAD_REQUEST("验证码发送过于频繁，请等一分钟后再发送"));
			return;
		} else {
			//生成6位的验证码
			let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
			if(config.developerMode){
				code = '123456';
			} else {
				tencentSms.sendVerifyCode(req.query.mobile, code, 15);
			}
			userValidates[req.query.mobile] = {
				validateCode: code,
				countdown: 60,
				validateCountdown: 15*60
			}
			if(config.developerMode){
				res.json(200, { msg: '当前处于开发者模式，验证码为123456' });
			} else {
				res.json(200, { msg: '已发送验证码' });
			}
		}
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
})

router.get('/verify_mobile', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let axios = require('axios');
		let FormData = require('form-data');
		let data = new FormData();
		data.append('mobile', req.query.mobile);
		data.append('code', req.query.vcode);
		let result = await query('SELECT * FROM users WHERE mobile = ?', [
			req.query.mobile,
		]);
		if (result.length > 0) {
			res.json(200, { msg: '该手机号已被绑定，换一个试试吧！' });
			return;
		}

		let config = {
			method: 'post',
			url: 'https://sapi.kuailezan.com/api/login/index',
			headers: {
				...data.getHeaders(),
			},
			data: data,
		};

		axios(config)
			.then(async function (response) {
				if (response.data.msg == '登录成功') {
					await query('UPDATE users SET mobile = ? WHERE user_id = ?', [
						req.query.mobile,
						user.user_id,
					]);
				}
				res.end(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
			});
	} catch (e) {
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

router.get('/get_history_message', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let messages = await query(
			'SELECT m.*,u.name,u.avatar_url FROM user_message m,users u WHERE to_id = ? AND u.user_id = m.from_id ORDER BY time DESC LIMIT 0,100',
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


// 一些尝试去使用uni-im的遗留代码，不得不说是真tm难用，根本调不通，莫名其妙的没有任何报错信息的错误，根本没法调！
// router.post('/get_uni_token', auth, async (req, res) => {
// 	// 这里进行的是uni-id得到外部系统联登
// 	let params = {
// 		externalUid: "lguser" + req.user[0].user_id,
// 	}
// 	let sig = getSignature(params);
	
// 	console.log(req.body.clientInfo, params);

// 	let config = {
// 		method: 'post',
// 		maxBodyLength: Infinity,
// 		url: 'http://fc-mp-e1064b8d-45cc-43f3-b55b-61ad80dbee0c.next.bspapp.com/uniId/externalLogin',
// 		headers: {
// 			'content-type': 'application/json',
// 			"uni-id-nonce": sig.nonce,
// 			"uni-id-timestamp": sig.timestamp,
// 			"uni-id-signature": sig.signature,
// 		},
// 		data: {
// 			clientInfo: {
// 				uniPlatform: req.body.clientInfo.uniPlatform,
// 				appId: req.body.clientInfo.appId,
// 				deviceId: req.body.clientInfo.deviceId
// 			},
// 			params: params
// 		}
// 	};

// 	await axios.request(config)
// 	.then(async (response) => {
// 		console.log(JSON.stringify(response.data));
// 		// await query('UPDATE users SET uni_id = ? WHERE user_id = ?', [
// 		// 	response.data.uid,
// 		// 	req.user[0].user_id,
// 		// ]);
// 		// if(response.data.errCode == "uni-id-illegal-request"){
// 		// 	//进行账号注册
// 		// 	registerUniId(req.user[0], req.body.clientInfo);
// 		// }
// 		res.end(JSON.stringify(response.data));
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// })


// function registerUniId(user, clientInfo){
// 	let params = {
// 		externalUid: "loghomeuserid" + user.user_id,
// 		nickname: user.name,
// 		avatar: user.avatar_url,
// 		gender: 0
// 	}
// 	let signature = getSignature(params);
// 	let signatureData = {
// 		"uni-id-nonce": signature.nonce,
// 		"uni-id-timestamp": signature.timestamp,
// 		"uni-id-signature": signature.signature,
// 	};

// 	let config = {
// 		method: 'post',
// 		maxBodyLength: Infinity,
// 		url: 'https://fc-mp-e1064b8d-45cc-43f3-b55b-61ad80dbee0c.next.bspapp.com/uniId/externalRegister',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			...signatureData
// 		},
// 		data: {
// 			clientInfo: clientInfo, 
// 			params
// 		}
// 	};

// 	axios.request(config)
// 	.then((response) => {
// 		console.log(response.data);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});
// }

module.exports = router;

// async function sqldo(){
//     let result = await query(`(SELECT COUNT(*) add_count,a.novel_id,n.name FROM articles a,(SELECT * FROM LOG WHERE TIME < "2022-4-08 00:00:00" AND TIME > "2022-4-07 12:00:00") m,novels n WHERE a.article_id = m.content AND n.novel_id = a.novel_id GROUP BY a.novel_id ORDER BY add_count DESC)`);
//     console.log(result);
//     for(let item of result){
//         await query('UPDATE novels SET clicks = clicks - ' + item.add_count + ' WHERE novel_id = ?',[item.novel_id])
//     }
// }

// sqldo();
