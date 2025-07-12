// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const jwt = require('jsonwebtoken');
let axios = require('axios');
let moment = require('moment');
const SECRET = require('../SECRET.js').SECRET;
let message = require('../bin/message.js');

// 引入子路由
const circlesRouter = require('./community/circles.js');
const postsRouter = require('./community/posts.js');
const commentsRouter = require('./community/comments.js');
const interactionsRouter = require('./community/interactions.js');
const searchRouter = require('./community/search.js');
const notificationsRouter = require('./community/notifications.js');
const auditRouter = require('./community/audit.js');

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
			'notification',
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
			`INSERT INTO novel_comments(user_id,novel_id,content, article_id, media_urls) 
                                VALUES(?,?,?,?,?)`,
			[user.user_id, req.body.novel_id, req.body.content, req.body.article_id, 
			 req.body.media_urls ? JSON.stringify(req.body.media_urls) : null],
		);
		let comment = await query(
			`SELECT * FROM novel_comments n,users u WHERE n.user_id = u.user_id AND n.essay_comment_id = ?`,
			[results.insertId],
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
			'comment',
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
		res.end(JSON.stringify(comment[0]));
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
			`INSERT INTO novel_comments(reply_to_id,user_id,novel_id,content,father_comment_id,article_id,media_urls) 
                                VALUES(?,?,?,?,?,?,?)`,
			[
				req.body.essay_comment_id,
				user.user_id,
				novel_id,
				req.body.content,
				req.body.fatherId,
                req.body.article_id,
                req.body.media_urls ? JSON.stringify(req.body.media_urls) : null
			],
		);
		let newComment = await query(
			`SELECT * FROM novel_comments n,users u WHERE n.user_id = u.user_id AND n.essay_comment_id = ?`,
			[results.insertId],
		);
		message.sendMsg(
			user.user_id,
			comment.user_id,
			'回复了你的评论：' + req.body.content,
			'readers/bookInfo?id=' + req.body.novel_id,
			'comment',
		);
		res.end(JSON.stringify(newComment[0]));
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
			if(centos.length == 0) {
				res.end(JSON.stringify([]));
				return;
			};
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
            
            // Parse media_urls from JSON string to array
            if (item.media_urls) {
                try {
                    item.media_urls = JSON.parse(item.media_urls);
                } catch (e) {
                    item.media_urls = [];
                }
            } else {
                item.media_urls = [];
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
		// 基本查询 - 获取小说评论总数
		let query_ = 'SELECT COUNT(*) FROM novel_comments WHERE novel_id = ? AND deleted = 0 AND reply_to_id = -1';
		let params = [req.query.id];

		// 如果提供了文章ID但没有提供段落ID，则只查询该文章的评论数量
		if (req.query.articleId && !req.query.paragraphId) {
			query_ = 'SELECT COUNT(*) FROM novel_comments WHERE novel_id = ? AND article_id = ? AND deleted = 0 AND reply_to_id = -1';
			params = [req.query.id, req.query.articleId];
		}
		// 如果提供了文章ID和段落ID参数，则查询该段落的评论数量
		else if (req.query.articleId && req.query.paragraphId) {
			// 首先获取段落的cento_id
			let centos = await query(
				`SELECT article_cento_id FROM article_cento c WHERE c.paragraph_id = ? AND c.article_id = ? AND c.is_delete = 0`, 
				[req.query.paragraphId, req.query.articleId]
			);
			
			if (centos && centos.length > 0) {
				// 如果找到了cento记录，则查询该cento对应的评论数量
				let centoIds = centos.map(item => item.article_cento_id);
				query_ = 'SELECT COUNT(*) FROM novel_comments WHERE novel_id = ? AND deleted = 0 AND reply_to_id = -1 AND cento_id IN (?)';
				params = [req.query.id, centoIds];
			} else {
				// 如果没有找到cento记录，返回0
				res.end(JSON.stringify([{ 'COUNT(*)': 0 }]));
				return;
			}
		}

		let results = await query(query_, params);
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
        
        // Parse media_urls for each reply
        results = JSON.parse(JSON.stringify(results));
        for (let item of results) {
            if (item.media_urls) {
                try {
                    item.media_urls = JSON.parse(item.media_urls);
                } catch (e) {
                    item.media_urls = [];
                }
            } else {
                item.media_urls = [];
            }
        }
        
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
					'like_collect',
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

router.post('/send_message', auth, async function (req, res) {
	try {
		const { to_id, message_content } = req.body;
		const from_id = req.user[0].user_id;
		console.log(from_id);

		const result = await query(
			'INSERT INTO private_messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)',
			[from_id, to_id, message_content]
		);

		res.json({ 
			msg: 'Message sent successfully',
			id: result.insertId // 返回新创建的消息ID
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

router.get('/message_history', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		const friend_id = req.query.friend_id;
		const pageSize = parseInt(req.query.pageSize) || 20;

		// 获取最早的消息ID作为分页基准
		const lastMessageId = req.query.lastMessageId ? parseInt(req.query.lastMessageId) : null;
		
		let query_str = 'SELECT * FROM private_messages WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))';
		let params = [user_id, friend_id, friend_id, user_id];
		
		// 如果有lastMessageId，则只获取比这个ID更早的消息
		if (lastMessageId) {
			query_str += ' AND id < ?';
			params.push(lastMessageId);
		}
		
		query_str += ' ORDER BY sent_at DESC LIMIT ?';
		params.push(pageSize);
		
		const messages = await query(query_str, params);

		// 返回结果前反转数组，使最早的消息在前面
		res.json(messages.reverse());
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

router.post('/mark_as_read', auth, async function (req, res) {
	try {
		const { message_id } = req.body;

		await query(
			'UPDATE private_messages SET is_read = TRUE WHERE id = ?',
			[message_id]
		);

		res.json({ msg: 'Message marked as read' });
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

// 获取新消息的接口
router.get('/new_messages', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		const friend_id = req.query.friend_id;
		const since_id = parseInt(req.query.since_id) || 0;
		
		// 获取比since_id更新的消息
		const query_str = `
			SELECT * FROM private_messages 
			WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
			AND id > ?
			ORDER BY sent_at ASC
		`;
		
		const messages = await query(query_str, [
			user_id, friend_id, 
			friend_id, user_id, 
			since_id
		]);
		
		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

// 获取消息已读状态的接口
router.get('/messages_read_status', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		
		// 检查是否提供了消息ID列表
		if (!req.query.message_ids) {
			return res.status(400).json({ msg: 'Missing message_ids parameter' });
		}
		
		// 解析消息ID列表
		const messageIds = req.query.message_ids.split(',').map(id => parseInt(id));
		
		// 获取这些消息的已读状态
		const query_str = `
			SELECT id, is_read 
			FROM private_messages 
			WHERE id IN (?) AND sender_id = ?
		`;
		
		const messages = await query(query_str, [messageIds, user_id]);
		
		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

// 获取私信好友列表
router.get('/chat_friends', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		
		// 查询与当前用户有过私信往来的所有用户
		const query_str = `
			SELECT 
				u.user_id, 
				u.name, 
				u.avatar_url,
				(
					SELECT message_content 
					FROM private_messages 
					WHERE (sender_id = u.user_id AND receiver_id = ?) 
						OR (sender_id = ? AND receiver_id = u.user_id)
					ORDER BY sent_at DESC 
					LIMIT 1
				) as last_message_content,
				(
					SELECT sent_at 
					FROM private_messages 
					WHERE (sender_id = u.user_id AND receiver_id = ?) 
						OR (sender_id = ? AND receiver_id = u.user_id)
					ORDER BY sent_at DESC 
					LIMIT 1
				) as last_message_time,
				(
					SELECT COUNT(*) 
					FROM private_messages 
					WHERE sender_id = u.user_id 
						AND receiver_id = ? 
						AND is_read = FALSE
				) as unread_count
			FROM users u
			WHERE u.user_id IN (
				SELECT DISTINCT 
					CASE 
						WHEN sender_id = ? THEN receiver_id
						ELSE sender_id
					END as friend_id
				FROM private_messages
				WHERE sender_id = ? OR receiver_id = ?
			)
			ORDER BY unread_count DESC, last_message_time DESC
		`;
		
		const friends = await query(query_str, [
			user_id, user_id, 
			user_id, user_id, 
			user_id, 
			user_id, 
			user_id, user_id
		]);
		
		res.json(friends);
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

// 获取未读私信数量
router.get('/unread_messages_count', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		
		// 查询未读私信总数
		const query_str = `
			SELECT COUNT(*) as count
			FROM private_messages
			WHERE receiver_id = ? AND is_read = FALSE
		`;
		
		const result = await query(query_str, [user_id]);
		
		res.json({ count: result[0].count });
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: 'Internal server error' });
	}
});

// 注册子路由
router.use('/circles', circlesRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/interactions', interactionsRouter);
router.use('/search', searchRouter);
router.use('/notifications', notificationsRouter);
router.use('/audit', auditRouter);

module.exports = router;
