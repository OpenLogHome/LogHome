// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const jwt = require('jsonwebtoken');
let axios = require('axios');
let moment = require('moment');
const SECRET = require('../SECRET.js').SECRET;
let message = require('../bin/message.js');

let router = express.Router();

router.get('/get_follows_of', async function (req, res) {
	try {
		let results = await query(
			'SELECT f.`follow_id`,u.`name`,u.`avatar_url`,u.`user_group`,u.motto FROM user_follow f,users u WHERE f.follow_id = u.`user_id` AND f.`user_id` = ?',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_fans_of', async function (req, res) {
	try {
		let results = await query(
			'SELECT f.`user_id`,u.`name`,u.`avatar_url`,u.`user_group`,u.motto FROM user_follow f,users u WHERE f.user_id = u.`user_id` AND f.`follow_id` = ?',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_friends_of', async function (req, res) {
	try {
		let results = await query(
			'SELECT f.`user_id` id,u.`name`,u.`avatar_url`,u.`user_group`,u.motto FROM user_follow f,users u WHERE f.user_id = u.`user_id` AND f.`follow_id` = ?',
			[req.query.id],
		);
		let friends = results;
		results = await query(
			'SELECT f.`follow_id` id,u.`name`,u.`avatar_url`,u.`user_group`,u.motto FROM user_follow f,users u WHERE f.follow_id = u.`user_id` AND f.`user_id` = ?',
			[req.query.id],
		);
		friends = [...friends, ...results];

		let map = new Map();
		for (let i of friends) {
			if (!map.has(i.id)) {
				map.set(i.id, i);
			}
		}
		friends = [...map.values()];
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/follow_status', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM user_follow WHERE user_id = ? AND follow_id = ?',
			[req.query.user_id, req.query.target_id],
		);
		//判断是否有单向关注
		if (results.length > 0) {
			let results = await query(
				'SELECT * FROM user_follow WHERE user_id = ? AND follow_id = ?',
				[req.query.target_id, req.query.user_id],
			);
			//判断是否有双向关注
			if (results.length > 0) {
				res.end(JSON.stringify({ status: 2 }));
				return;
			} else {
				res.end(JSON.stringify({ status: 1 }));
				return;
			}
		} else {
			res.end(JSON.stringify({ status: 0 }));
			return;
		}
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/follow', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'INSERT INTO user_follow(user_id,follow_id) VALUES(?,?)',
			[user.user_id, req.body.follow_id],
		);
		res.end(JSON.stringify(results));
		message.sendMsg(
			user.user_id,
			req.body.follow_id,
			'关注了你。',
			'users/personalPage?id=' + user.user_id,
		);
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/unfollow', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'DELETE FROM user_follow WHERE user_id = ? AND follow_id = ?',
			[user.user_id, req.body.follow_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/comment_on_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`INSERT INTO novel_comments(user_id,novel_id,content, article_id) 
                                VALUES(?,?,?, ?)`,
			[user.user_id, req.body.novel_id, req.body.content, req.body.article_id],
		);
		let novel = JSON.parse(
			JSON.stringify(
				await query('SELECT * FROM novels WHERE novel_id = ?', [
					req.body.novel_id,
				]),
			),
		)[0];
		message.sendMsg(
			user.user_id,
			novel.author_id,
			'评论了你的小说《' + novel.name + '》：' + req.body.content,
			'readers/bookInfo?id=' + req.body.novel_id,
		);
        // 判断一下是不是章节评论，如果是的话就操作一下cento
        if(req.body.paragraph_id != -1){
            let article = JSON.parse((await query(`SELECT * FROM articles WHERE article_id = ?`, [req.body.article_id]))[0].content);
            for(let paragraph of article){
                if(paragraph.id == req.body.paragraph_id){
                    let cento = await query(`SELECT * FROM article_cento WHERE article_id = ? AND paragraph = ? AND user_id = ? AND is_delete = 0`,
                    [req.body.article_id, paragraph.value, req.user[0].user_id])
                    let centoId = -1;
                    if(cento.length > 0) centoId = cento[0].article_cento_id;
                    else {
                        let newCento = await query(
                            'INSERT INTO article_cento(user_id, article_id, paragraph_id, paragraph) VALUES(?, ?, ?, ?)',
                            [req.user[0].user_id, req.body.article_id, paragraph.id, paragraph.value],
                        );
                        centoId = newCento.insertId;
                    }
                    await query(
                        'UPDATE novel_comments SET cento_id = ? WHERE essay_comment_id = ?',
                        [centoId, results.insertId],
                    );
                }
            }
        }
		res.end(JSON.stringify(results));
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/reply_to_novel_comment', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let comment = await query(
			'SELECT novel_id,user_id from novel_comments WHERE essay_comment_id = ? AND deleted = 0',
			[req.body.essay_comment_id],
		);
		comment = JSON.parse(JSON.stringify(comment))[0];
		if (comment == undefined) res.json(400, { msg: 'bad request' });
		let novel_id = comment.novel_id;
		let results = await query(
			`INSERT INTO novel_comments(reply_to_id,user_id,novel_id,content,father_comment_id, article_id) 
                                VALUES(?,?,?,?,?, ?)`,
			[
				req.body.essay_comment_id,
				user.user_id,
				novel_id,
				req.body.content,
				req.body.fatherId,
                req.body.article_id
			],
		);
		message.sendMsg(
			user.user_id,
			comment.user_id,
			'回复了你的评论：' + req.body.content,
			'readers/bookInfo?id=' + req.body.novel_id,
		);
		res.end(JSON.stringify(results));
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/novel_commonts_all', async function (req, res) {
	try {
		req.query.page = req.query.page ? req.query.page : 1;
		req.query.pageSize = req.query.pageSize ? req.query.pageSize : 3;

		// 首先处理是否是章节评论
		if(req.query.paragraphId != undefined && req.query.articleId != undefined){
			var centos = await query(`SELECT article_cento_id FROM article_cento c WHERE c.paragraph_id = ? AND c.article_id = ?`, [
				req.query.paragraphId, req.query.articleId
			])
			centos = centos.map((item) => item.article_cento_id);
		}

		let results = await query(
			`SELECT l.author_id,n.*,u.name,u.avatar_url,u.user_group 
							FROM novel_comments n,users u,novels l
							WHERE reply_to_id = -1 
							AND u.user_id = n.user_id
							AND l.novel_id = n.novel_id
							AND n.deleted = 0 `
							 + ((req.query.articleId != undefined) ? ` AND n.article_id = ${req.query.articleId}` : ``)
							 + ((req.query.paragraphId != undefined) ? ` AND n.cento_id in (?)` : ``) + 
                            ` AND n.novel_id = ?
							ORDER BY n.essay_comment_id
							DESC
							LIMIT ?,?`,
			[...(centos != undefined ? [centos] : []),...[
				req.query.id,
				Number(req.query.page - 1) * Number(req.query.pageSize),
				Number(req.query.pageSize),
			]],
		);
		results = JSON.parse(JSON.stringify(results));
		for (let item of results) {
			let praise = await query(
				`SELECT * FROM novel_comments_praise
                                      WHERE novel_comment_id = ?`,
				[item.essay_comment_id],
			);
			praise = JSON.parse(JSON.stringify(praise));
			item.likeNum = 0;
			for (let praiseItem of praise) {
				if (praiseItem.type == 0) item.likeNum++;
			}
            if(item.cento_id != 0) {
                let cento = (await query(
                    `SELECT * FROM article_cento
                                          WHERE article_cento_id = ?`,
                    [item.cento_id],
                ))[0]
                item.cento = cento;
            }
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/novel_commonts_amount', async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) FROM novel_comments WHERE novel_id = ? AND deleted = 0 AND reply_to_id = -1',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/novel_commonts_reply_to', async function (req, res) {
	try {
		let results = await query(
			`SELECT n.*,u.name,u.avatar_url,u.user_group 
							FROM novel_comments n,users u 
							WHERE father_comment_id = ?
							AND u.user_id = n.user_id
							AND n.deleted = 0`,
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_comment_praise_status', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * from novel_comments_praise WHERE novel_comment_id = ? AND user_id = ?',
			[req.query.essay_comment_id, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (err) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/delete_comment', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT l.author_id,n.*,u.name,u.avatar_url,u.user_group 
                               FROM novel_comments n,users u,novels l
                               WHERE n.essay_comment_id = ?
                               AND u.user_id = n.user_id
                               AND l.novel_id = n.novel_id
                               ORDER BY n.essay_comment_id
                               AND n.deleted = 0
                               DESC`,
			[req.query.id],
		);
		results = JSON.parse(JSON.stringify(results));
		if (
			results[0].author_id == Number(user.user_id) ||
			results[0].user_id == Number(user.user_id)
		) {
			await query(
				'UPDATE novel_comments SET deleted = 1 WHERE essay_comment_id = ?',
				[req.query.id],
			);
			res.json(200, { msg: 'success' });
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (err) {
		console.log(err);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/praise_on_comment', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let comment = await query(
			'SELECT novel_id,content,user_id from novel_comments WHERE essay_comment_id = ? AND deleted = 0',
			[req.body.essay_comment_id],
		);
		comment = JSON.parse(JSON.stringify(comment));
		if (comment.length == 0) {
			res.json(400, { msg: 'bad request' });
		} else {
			if (req.body.type == 3) {
				let results = await query(
					'DELETE FROM novel_comments_praise WHERE novel_comment_id = ? AND user_id = ?',
					[req.body.essay_comment_id, user.user_id],
				);
				res.end(JSON.stringify(results));
				return;
			}
			let results = await query(
				'SELECT * from novel_comments_praise WHERE novel_comment_id = ? AND user_id = ?',
				[req.body.essay_comment_id, user.user_id],
			);
			if (req.body.type == 0) {
				message.sendMsg(
					user.user_id,
					comment[0].user_id,
					'点赞了你的评论：' + comment[0].content,
					'readers/bookInfo?id=' + comment[0].novel_id,
				);
			}
			if (JSON.parse(JSON.stringify(results)).length == 0) {
				await query(
					'INSERT INTO novel_comments_praise(novel_comment_id,user_id,type) VALUES(?,?,?)',
					[req.body.essay_comment_id, user.user_id, req.body.type],
				);
				res.json(200, { msg: 'success' });
			} else {
				await query(
					'UPDATE novel_comments_praise SET type = ? WHERE novel_comment_id = ? AND user_id = ?',
					[req.body.type, req.body.essay_comment_id, user.user_id],
				);
				res.json(200, { msg: 'success' });
			}
		}
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/send_mail', auth, async function (req, res) {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		message.sendMail(
			user.user_id,
			req.body.to_id,
			req.body.title + '\n' + req.body.msg,
			'',
			true,
		);
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_mail', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * from user_message m,open_users u WHERE message_id = ? AND (from_id = ? OR to_id = ?) AND u.user_id = m.from_id',
			[req.query.message_id, user.user_id, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (err) {
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
