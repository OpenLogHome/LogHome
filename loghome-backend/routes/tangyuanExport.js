// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');
const { htmlToText } = require('html-to-text');
let message = require('../bin/message.js');

// 创建路由对象
let router = express.Router();

function stringToBase64(str) {
	return new Buffer.from(str).toString('base64');
}

router.post('/loginitangyuan', auth, async function (req, res) {
	try {
		res.end({ msg: '接口已关闭' });
		return;
		// let user = JSON.parse(JSON.stringify(req.user))[0];
		// let FormData = require('form-data');
		// let data = new FormData();
		// data.append('phone', req.body.account);
		// data.append('passwd', stringToBase64(req.body.password));
		// data.append('app_version', 'YXBwX3ZlcnNpb246aDUtMQ==');
		// data.append(
		// 	'unique_id',
		// 	'dW5pcXVlX2lkOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLUg1SU5JVERFVklDRQ==',
		// );

		// let config = {
		// 	method: 'post',
		// 	url: 'https://i.itangyuan.com/login/phone.json',
		// 	headers: {
		// 		...data.getHeaders(),
		// 	},
		// 	data: data,
		// };

		// axios(config)
		// 	.then(async function (response) {
		// 		if (response.data.msg == 'OK') {
		// 			let cookie = response.headers['set-cookie'].join(' ');
		// 			let result = await query(
		// 				'SELECT * FROM itangyuan WHERE user_id = ?',
		// 				[user.user_id],
		// 			);
		// 			if (JSON.parse(JSON.stringify(result)).length > 0) {
		// 				await query(
		// 					'UPDATE itangyuan SET tangyuan_id = ? , tangyuan_pwd = ? ,cookie = ? , nickname = ? WHERE user_id = ?',
		// 					[
		// 						req.body.account,
		// 						stringToBase64(req.body.password),
		// 						cookie,
		// 						response.data.data.nickname,
		// 						user.user_id,
		// 					],
		// 				);
		// 			} else {
		// 				await query(
		// 					'INSERT INTO itangyuan(user_id,tangyuan_id,tangyuan_pwd,cookie,nickname) VALUES(?,?,?,?,?)',
		// 					[
		// 						user.user_id,
		// 						req.body.account,
		// 						stringToBase64(req.body.password),
		// 						cookie,
		// 						response.data.data.nickname,
		// 					],
		// 				);
		// 			}
		// 		}
		// 		res.end(JSON.stringify(response.data));
		// 	})
		// 	.catch(e => {
		// 		console.log(e);
		// 		res.json(400, { msg: 'bad request' });
		// 	});
	} catch (e) {
		res.json(400, { msg: 'bad request' });
		return;
	}
});

router.get('/getallBooks', auth, async function (req, res) {
	try {
		res.end({ msg: '接口已关闭' });
		return;
		// let user = JSON.parse(JSON.stringify(req.user))[0];
		// let result = await query('SELECT * FROM itangyuan WHERE user_id = ?', [
		// 	user.user_id,
		// ]);
		// result = JSON.parse(JSON.stringify(result))[0];
		// // console.log(result);
		// let config = {
		// 	method: 'get',
		// 	url: 'http://i.itangyuan.com/write/user/books.json?content_version=1',
		// 	headers: {
		// 		Cookie: result.cookie,
		// 	},
		// };

		// axios(config)
		// 	.then(function (response) {
		// 		res.end(JSON.stringify(response.data));
		// 	})
		// 	.catch(function (error) {
		// 		console.log(error);
		// 		res.json(400, { msg: 'bad request' });
		// 	});
	} catch (e) {
		res.json(400, { msg: 'bad request' });
		return;
	}
});

router.get('/importBook', auth, async function (req, res) {
	try {
		res.end({ msg: '接口已关闭' });
		return;
		// let user = JSON.parse(JSON.stringify(req.user))[0];
		// let result = await query('SELECT * FROM itangyuan WHERE user_id = ?', [
		// 	user.user_id,
		// ]);
		// result = JSON.parse(JSON.stringify(result))[0];
		// let cookie = result.cookie;
		// importBook(req.query.book_id, req.query.ty_id, cookie, user.user_id);
		// res.json(200, { msg: 'ok' });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
		return;
	}
});

router.get('/checkImportStatus', auth, async function (req, res) {
	try {
		res.end({ msg: '接口已关闭' });
		return;
		// let user = JSON.parse(JSON.stringify(req.user))[0];
		// let result = await query('SELECT * FROM itangyuan WHERE user_id = ?', [
		// 	user.user_id,
		// ]);
		// result = JSON.parse(JSON.stringify(result));
		// if (result.length > 0) {
		// 	result[0].tangyuan_pwd = '';
		// }
		// res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
		return;
	}
});

module.exports = router;

async function importBook(id, ty_id, cookie, user_id) {
	//首先获取所有章节信息
	// console.log(id,ty_id,cookie);

	let config = {
		method: 'get',
		url:
			'http://i.itangyuan.com/write/sync/book/' +
			ty_id +
			'/0.json?content_version=1',
		headers: {
			Cookie: cookie,
		},
	};

	await axios(config)
		.then(async function (response) {
			if (response.data.msg == 'OK') {
				let i = 0;
				let chapters = response.data.data.chapters;
				chapters.sort(function (a, b) {
					return a.order_value - b.order_value;
				});
				for (let chapter of response.data.data.chapters) {
					i++;
					let ls = chapter.content_url.lastIndexOf('/');
					let chapterTitle = chapter.title;
					let isDraft = 1;
					let contentUrl =
						'http://r.itangyuan.com/r/chapter' + chapter.content_url.slice(ls);
					let axios = require('axios');

					let config = {
						method: 'get',
						url: contentUrl,
						headers: {
							Cookie: cookie,
						},
					};

					await axios(config)
						.then(async function (response) {
							await query(
								'INSERT INTO articles(title,content,novel_id,article_chapter,is_draft,text_count) VALUES(?,?,?,?,?,?)',
								[
									chapterTitle,
									htmlToText(response.data),
									id,
									i,
									isDraft,
									htmlToText(response.data).length,
								],
							);
						})
						.catch(function (error) {
							message.sendMsg(
								-1,
								user_id,
								'在小说的导入中，章节《' +
									chapterTitle +
									'》发生了错误，请手动处理！',
								'/',
								true,
							);
							console.log(error);
						});
				}
				message.sendMsg(-1, user_id, '小说导入已全部完成。', '/', true);
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}
