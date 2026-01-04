// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let moment = require('moment');
let message = require('../bin/message.js');
let bank = require('../bin/bank.js');

// 创建路由对象
let router = express.Router();

router.get('/get_library_roulous_chart', async function (req, res) {
	try {
		let roulous_chart = await query(
			'SELECT * FROM library_roulous_chart WHERE isValid = 1 ORDER BY `order` ASC',
		);
		res.end(JSON.stringify(roulous_chart));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novels_all', async function (req, res) {
	try {
		let results =
			await query(`SELECT n.*,u.name author_name,u.avatar_url auther_avatar 
                               FROM novels n,users u 
                               WHERE u.user_id = n.author_id 
                               AND n.deleted = 0
                               AND n.is_personal = 0`);

		for (let i = 0; i < results.length; i++) {
			let r = Math.floor(Math.random() * results.length);
			let t = results[i];
			results[i] = results[r];
			results[r] = t;
		}
		res.end(JSON.stringify(results.slice(0,6)));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novels_search', async function (req, res) {
	try {
        let keyWordToId = parseInt(req.query.keyword);
        if(!isNaN(keyWordToId)){
            let results = await query(
                `SELECT n.*,u.name author_name,u.avatar_url auther_avatar 
                                   FROM novels n,users u 
                                   WHERE u.user_id = n.author_id 
                                   AND n.deleted = 0
                                   AND n.is_personal = 0
                                   AND novel_id = ?`,
                [keyWordToId],
            );
            res.end(JSON.stringify(results));
            return;
        } else {
            let keyword = '%' + req.query.keyword + '%';
            let results = await query(
                `SELECT n.*,u.name author_name,u.avatar_url auther_avatar 
                                FROM novels n,users u 
                                WHERE u.user_id = n.author_id 
                                AND n.deleted = 0
                                AND n.is_personal = 0
                                AND (n.name LIKE ? OR n.content LIKE ?)`,
                [keyword, keyword],
            );

            for (let i = 0; i < results.length; i++) {
                let r = Math.floor(Math.random() * results.length);
                let t = results[i];
                results[i] = results[r];
                results[r] = t;
            }
            res.end(JSON.stringify(results));
        }

	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_by_id', async function (req, res) {
	try {
		let results = await query(
			`SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar,n.text_count FROM novels n,users u 
                                   WHERE n.author_id = u.user_id AND novel_id = ? AND n.deleted = 0 AND n.is_personal = 0`,
			[req.query.id],
		);
		let likes = await query('SELECT * FROM bookcase WHERE novel_id = ?', [
			req.query.id,
		]);
		results = JSON.parse(JSON.stringify(results));
		results[0]['likes'] = likes;
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_latest_articles', async function (req, res) {
	try {
		let results = await query(
			'SELECT article_id,title,novel_id,article_chapter FROM articles WHERE novel_id = ? AND is_draft = 0 AND deleted = 0 ORDER BY article_chapter DESC LIMIT 0,10',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles', async function (req, res) {
	try {
		let results = await query(
			'SELECT article_id,title,novel_id,article_chapter,update_time, article_type FROM articles WHERE novel_id = ? AND is_draft = 0 AND deleted = 0 ORDER BY article_chapter ASC',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_all', async function (req, res) {
	try {
		let results = await query(
			'SELECT article_id,title,novel_id,article_chapter,is_draft,update_time,article_type FROM articles WHERE novel_id = ? AND deleted = 0 ORDER BY article_chapter ASC',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_by_user_id', async function (req, res) {
	try {
		let results = await query(
			'SELECT n.* FROM novels n,users u WHERE n.author_id = u.user_id AND user_id = ? AND deleted = 0 AND novel_type != "world"',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_nices_by_id', async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) nices FROM novel_nice WHERE novel_id = ?',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_nice_status', auth, async function (req, res) {
	try {
		let date = moment(Date.now()).format('YYYY-MM-DD');
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query(
			'SELECT COUNT(*) nices FROM novel_nice WHERE novel_id = ? AND user_id = ? and `date` = ?',
			[req.query.id, user.user_id, date],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/nice_novel', auth, async function (req, res) {
	try {
		let date = moment(Date.now()).format('YYYY-MM-DD');
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query(
			'SELECT COUNT(*) nices FROM novel_nice WHERE novel_id = ? AND user_id = ? and `date` = ?',
			[req.query.id, user.user_id, date],
		);
		let novel = await query(
			'SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar FROM novels n,users u WHERE n.author_id = u.user_id AND novel_id = ?',
			[req.query.id],
		);
		results = JSON.parse(JSON.stringify(results));
		novel = JSON.parse(JSON.stringify(novel));

		if (results[0].nices > 0) {
			await query(
				'DELETE FROM novel_nice WHERE novel_id = ? AND user_id = ? and `date` = ?',
				[req.query.id, user.user_id, date],
			);
			res.json(200, { msg: 'ok' });
		} else {
			await query(
				'INSERT INTO novel_nice(novel_id,user_id,`date`) VALUES(?,?,?)',
				[req.query.id, user.user_id, date],
			);
			message.sendMsg(
				user.user_id,
				novel[0].author_id,
				'赞了你的小说《' + novel[0].name + '》',
				'readers/bookInfo?id=' + novel[0].novel_id,
				'like_collect',
			);
			res.json(200, { msg: 'ok' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_tipping_list', async function (req, res) {
	try {
		let results = await query('SELECT * FROM tipping_list');
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/tipping', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		if (
			await bank.useAmount(
				user,
				req.body.resource_name,
				req.body.item_amount * req.body.item_cost,
				false,
			)
		) {
			await query(
				'INSERT INTO tipping(from_id,novel_id,item_name,item_amount,item_cost) VALUES(?,?,?,?,?)',
				[
					req.body.from_id,
					req.body.novel_id,
					req.body.item_name,
					req.body.item_amount,
					req.body.item_cost,
				],
			);
			let novel = await query(
				'SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar FROM novels n,users u WHERE n.author_id = u.user_id AND novel_id = ?',
				[req.body.novel_id],
			);
			novel = JSON.parse(JSON.stringify(novel));
			message.sendMsg(
				user.user_id,
				novel[0].author_id,
				'打赏了你的小说《' +
					novel[0].name +
					'》' +
					req.body.item_amount +
					'个' +
					req.body.item_name,
				'readers/bookInfo?id=' + novel[0].novel_id,
				'like_collect',
				true,
			);
			if (req.body.resource_name == 'log') {
				await bank.addAmount(
					{ user_id: novel[0].auther_id },
					'cropped_log',
					Math.floor((req.body.item_amount * req.body.item_cost) / 2),
				);
			}
			res.end('success');
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_tipping_amount_by_id', async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) count FROM tipping WHERE novel_id = ?',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_all_novel_fans', async function (req, res) {
	try {
		let timeFilter = '';
		if (req.query.type === 'month') {
			// 当前月的第一天和下个月的第一天
			const currentMonth = moment().format('YYYY-MM-01');
			const nextMonth = moment().add(1, 'month').format('YYYY-MM-01');
			timeFilter = ` AND tipping_time >= '${currentMonth}' AND tipping_time < '${nextMonth}'`;
		}
		
		let results = await query(
			`SELECT * FROM (SELECT from_id user_id, SUM(item_amount * item_cost) fans_value 
					FROM tipping WHERE novel_id = ?${timeFilter} GROUP BY from_id) a 
					JOIN open_users USING(user_id) ORDER BY fans_value DESC`,
			[req.query.novel_id],
		);
		
		// 获取粉丝留言
		let messages = await query(
			`SELECT * FROM novel_fans_messages WHERE novel_id = ?`,
			[req.query.novel_id]
		);
		
		// 将留言信息合并到结果中
		for (let i = 0; i < results.length; i++) {
			let userMessage = messages.find(m => m.user_id === results[i].user_id);
			results[i].message = userMessage ? userMessage.message : null;
		}
		
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加更新粉丝留言的API
router.post('/update_fan_message', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novel_id = req.body.novel_id;
		const message = req.body.message;
		
		// 验证用户是否是小说的粉丝（有打赏记录）
		const isFan = await query(
			`SELECT COUNT(*) as count FROM tipping WHERE novel_id = ? AND from_id = ?`,
			[novel_id, user.user_id]
		);
		
		if (isFan[0].count > 0) {
			// 插入或更新留言
			await query(
				`INSERT INTO novel_fans_messages (novel_id, user_id, message) 
				 VALUES (?, ?, ?) 
				 ON DUPLICATE KEY UPDATE message = ?`,
				[novel_id, user.user_id, message, message]
			);
			
			res.json({ success: true });
		} else {
			res.json({ success: false, msg: '只有粉丝才能留言' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取用户的粉丝留言
router.get('/get_user_fan_message', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novel_id = req.query.novel_id;
		
		// 获取用户对该小说的留言
		const message = await query(
			`SELECT * FROM novel_fans_messages WHERE novel_id = ? AND user_id = ?`,
			[novel_id, user.user_id]
		);
		
		if (message.length > 0) {
			res.json({ success: true, message: message[0].message });
		} else {
			res.json({ success: true, message: "" });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_tags', async function (req, res) {
	try {
		let results = await query(
			'SELECT t.* FROM novel_tag nt,tags t WHERE nt.novel_id = ? AND nt.tag_id = t.tag_id',
			[req.query.novel_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_tag_by_id', async function (req, res) {
	try {
		let results = (await query(
			'SELECT * FROM tags WHERE tag_id = ?',
			[req.query.tag_id],
		))[0];
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_all_tags', async function (req, res) {
	try {
		let sql = `SELECT t.*, count(*) count from tags t, novel_tag nt, novels n where nt.tag_id = t.tag_id
            and nt.novel_id = n.novel_id and n.deleted = 0 and n.is_personal = 0`;
		let params = [];
		
		if (req.query.keyword) {
			sql += ` AND t.tag_name LIKE ?`;
			params.push('%' + req.query.keyword + '%');
		}
		
		sql += ` group by t.tag_id order by count desc`;
		
		let results = await query(sql, params);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_tag_collections', async function (req, res) {
	try {
		let results = await query(
			`SELECT n.*, u.name username, u.avatar_url from tags t, novel_tag nt, novels n, users u where nt.tag_id = t.tag_id and u.user_id = n.author_id
            and nt.novel_id = n.novel_id and n.deleted = 0 and n.is_personal = 0 and t.tag_id = ?`,
            [req.query.tag_id]
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_suggested_tags', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM tags WHERE is_suggested = 1 AND is_deleted = 0',
		);
		let novel_tag = await query(
			'SELECT * FROM novel_tag nt WHERE nt.novel_id = ?',
			[req.query.novel_id],
		);
		for(let i in results) results[i].is_chosen=false;
		for(let i in novel_tag){
			for(let j in results){
				if(results[j].tag_id===novel_tag[i].tag_id){
					results[j].is_chosen=true;
					break;
				 }
			}
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/delete_novel_tag', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let novel = await query('SELECT * FROM novels WHERE novel_id = ? AND author_id = ?', [
			req.query.novel_id,req.user[0].user_id
		]);
		if (novel.length > 0 && novel[0].author_id == user.user_id) {
            //检查是不是已结束的活动标签，如果是则不允许删除
            let tags = await query('SELECT * FROM tags WHERE tag_id = ?', [
				req.query.tag_id,
			]);
            if(tags.length > 0 && tags[0].is_activity_tag == 1 && tags[0].is_suggested == 0){
                res.json(400, { msg: '该活动已结束，不得移除标签' });
                return;
            }
			let results = await query(
				'DELETE FROM novel_tag WHERE novel_id = ? AND tag_id = ?',
				[req.query.novel_id, req.query.tag_id],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/add_novel_tag', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let novel = await query('SELECT * FROM novels WHERE novel_id = ?', [
			req.query.novel_id,
		]);
		if (novel.length > 0 && novel[0].author_id == user.user_id) {
			let tags = await query('SELECT * FROM tags WHERE tag_name = ?', [
				req.query.tag_name,
			]);
			if (tags.length > 0) {
                //检查是不是已结束的活动标签，如果是则不允许添加
                if(tags[0].is_activity_tag == 1 && tags[0].is_suggested == 0){
                    res.json(400, { msg: '该活动已结束，不得添加标签' });
                    return;
                }
				let results = await query(
					'INSERT INTO novel_tag(novel_id,tag_id) VALUES(?,?)',
					[req.query.novel_id, tags[0].tag_id],
				);
				res.end(JSON.stringify(results));
			} else {
                //已有标签库中没有该标签，则添加新的自定义标签
				let newTag = await query(
					'INSERT INTO tags(tag_name,create_user_id) VALUES(?,?)',
					[req.query.tag_name, user.user_id],
				);
				let results = await query(
					'INSERT INTO novel_tag(novel_id,tag_id) VALUES(?,?)',
					[req.query.novel_id, newTag.insertId],
				);
				res.end(JSON.stringify(results));
			}
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_pics', async function (req, res) {
	try {
		let results = await query('SELECT * FROM novel_pics WHERE novel_id = ?', [
			req.query.novel_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

// Banner相关API路由
router.get('/get_banners', async function (req, res) {
	try {
		const page = req.query.page || 'library'; // 默认为library页面
		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
		
		let results = await query(
			`SELECT * FROM banners 
			WHERE page_location = ? 
			AND is_active = 1 
			AND (start_time IS NULL OR start_time <= ?) 
			AND (end_time IS NULL OR end_time >= ?) 
			ORDER BY \`order\` ASC`,
			[page, currentTime, currentTime]
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 检查书籍更新章节数量
router.get('/check_novel_updates', async function (req, res) {
	try {
		const novel_id = req.query.novel_id;
		const local_latest_chapter = parseInt(req.query.latest_chapter) || 0;
		
		if (!novel_id) {
			res.json(400, { msg: 'novel_id is required' });
			return;
		}
		
		// 查询该小说在服务器上的最新章节及其更新时间
		let latestChapter = await query(
			'SELECT MAX(article_chapter) as max_chapter, MAX(update_time) as latest_update_time FROM articles WHERE novel_id = ? AND is_draft = 0 AND deleted = 0',
			[novel_id]
		);
		
		const server_latest_chapter = latestChapter[0].max_chapter || 0;
		const latest_update_time = latestChapter[0].latest_update_time;
		const new_chapters_count = Math.max(0, server_latest_chapter - local_latest_chapter);
		
		res.json({
			novel_id: novel_id,
			local_latest_chapter: local_latest_chapter,
			server_latest_chapter: server_latest_chapter,
			new_chapters_count: new_chapters_count,
			has_updates: new_chapters_count > 0,
			latest_update_time: latest_update_time
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取图书馆首页标签
router.get('/get_index_tags', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM library_index_tags WHERE is_active = 1 ORDER BY order_index ASC',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 创建分享口令
router.post('/create_share_code', auth, async function (req, res) {
	try {
		const { share_type, share_content, target_url, expires_hours = 24 } = req.body;
		const user_id = req.user[0].user_id;
		
		if (!share_type || !share_content || !target_url) {
			return res.status(400).json({ msg: '缺少必要参数' });
		}
		
		// 生成8位随机口令码
		const generateCode = () => {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			let result = '';
			for (let i = 0; i < 8; i++) {
				result += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return result;
		};
		
		let code;
		let isUnique = false;
		
		// 确保口令码唯一
		while (!isUnique) {
			code = generateCode();
			const existing = await query('SELECT id FROM share_codes WHERE code = ?', [code]);
			if (existing.length === 0) {
				isUnique = true;
			}
		}
		
		const expires_at = moment().add(expires_hours, 'hours').format('YYYY-MM-DD HH:mm:ss');
		
		const result = await query(
			`INSERT INTO share_codes (code, share_user_id, share_type, share_content, target_url, expires_at) 
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[code, user_id, share_type, share_content, target_url, expires_at]
		);
		
		res.json({
			success: true,
			code: code,
			share_text: `【原木社区】${code}，` + req.body.share_message,
			msg: '口令创建成功'
		});
		
	} catch (e) {
		console.log(e);
		res.status(500).json({ msg: '服务器错误' });
	}
});

// 解析分享口令
router.post('/parse_share_code', async function (req, res) {
	try {
		const { code } = req.body;
		
		if (!code) {
			return res.status(400).json({ msg: '口令不能为空' });
		}
		
		// 查询口令信息
		const shareInfo = await query(
			`SELECT sc.*, u.name as share_user_name, u.avatar_url as share_user_avatar 
			 FROM share_codes sc 
			 LEFT JOIN users u ON sc.share_user_id = u.user_id 
			 WHERE sc.code = ? AND sc.is_active = 1`,
			[code]
		);
		
		if (shareInfo.length === 0) {
			return res.status(404).json({ msg: '口令不存在或已失效' });
		}
		
		const share = shareInfo[0];
		
		// 检查是否过期
		if (moment().isAfter(moment(share.expires_at))) {
			return res.status(400).json({ msg: '口令已过期' });
		}
		
		// 增加使用次数
		await query(
			'UPDATE share_codes SET use_count = use_count + 1 WHERE id = ?',
			[share.id]
		);
		
		res.json({
			success: true,
			data: {
				share_type: share.share_type,
				share_content: share.share_content,
				target_url: share.target_url,
				share_user_name: share.share_user_name,
				share_user_avatar: share.share_user_avatar,
				created_at: share.created_at,
				use_count: share.use_count + 1
			},
			msg: '口令解析成功'
		});
		
	} catch (e) {
		console.log(e);
		res.status(500).json({ msg: '服务器错误' });
	}
});

let recommendRouter = require('./library/recommand');

router.use('/recommand', recommendRouter);

module.exports = router;
