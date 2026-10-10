// 引入依赖包
let express = require('express');
let { query, withTransaction } = require('../sql.js');
const { createReadingTip } = require('../bin/createReadingTip.js');
let auth = require('../bin/auth.js');
let moment = require('moment');
let message = require('../bin/message.js');
let bank = require('../bin/bank.js');
let redstone = require('../bin/redstone.js');
let avatarFrames = require('../bin/avatarFrames.js');
let { handleReaderNovelChatStream } = require('../bin/readerNovelAiChat.js');
let { getNovelSummaryIndexStatus } = require('../bin/agentIndexing.js');
const novelReaderAiSettings = require('../bin/novelReaderAiSettings.js');
const { PUBLIC_ARTICLE, PUBLIC_NOVEL } = require('../bin/readingVisibility.js');

const HAYCRAFT_TAG_FLAG_SQL = `EXISTS (
	SELECT 1
	FROM novel_tag haycraft_nt
	JOIN tags haycraft_t ON haycraft_t.tag_id = haycraft_nt.tag_id
	WHERE haycraft_nt.novel_id = n.novel_id
		AND haycraft_t.is_deleted = 0
		AND LOWER(TRIM(haycraft_t.tag_name)) LIKE '%haycraft%'
)`;

// 创建路由对象
let router = express.Router();
router.get('/get_logpower_details', require('../bin/readingLogPower').createLogPowerReader({ query }));

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

// Stable pagination prevents repeated random recommendations and unbounded table reads.
router.get('/get_novels_all', async function (req, res) {
	try {
		const page = Number(req.query.page || 1);
		const amount = Number(req.query.amount || 6);
		if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(amount) || amount < 1 || amount > 100 || !Number.isSafeInteger((page - 1) * amount)) {
			return res.status(400).json({ msg: 'invalid pagination' });
		}
		const results = await query(`SELECT n.*,u.name author_name,u.avatar_url auther_avatar,
			${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft
			FROM novels n JOIN users u ON u.user_id = n.author_id
			WHERE n.deleted = 0 AND n.is_personal = 0 AND n.is_banned = 0
			ORDER BY n.novel_id DESC LIMIT ?, ?`, [(page - 1) * amount, amount]);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/get_novels_search', async function (req, res) {
	try {
		let keyWordToId = parseInt(req.query.keyword);
		if(!isNaN(keyWordToId)){
			let results = await query(
				`SELECT n.*,u.name author_name,u.avatar_url auther_avatar,
						${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft
                                   FROM novels n,users u
                                   WHERE u.user_id = n.author_id
                                   AND n.deleted = 0
                                   AND n.is_personal = 0
                                   AND n.is_banned = 0
                                   AND novel_id = ?`,
				[keyWordToId],
			);
			res.end(JSON.stringify(results));
			return;
		} else {
			let keyword = '%' + req.query.keyword + '%';
			let results = await query(
				`SELECT n.*,u.name author_name,u.avatar_url auther_avatar,
						${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft
                                FROM novels n,users u
                                WHERE u.user_id = n.author_id
                                AND n.deleted = 0
                                AND n.is_personal = 0
                                AND n.is_banned = 0
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
			`SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar,n.text_count,ic.dominant_color pic_dominant_color FROM novels n
                                   JOIN users u ON n.author_id = u.user_id
                                   LEFT JOIN image_dominant_colors ic ON ic.image_url = n.picUrl AND ic.extract_status = 'success'
                                   WHERE novel_id = ? AND ${PUBLIC_NOVEL}`,
			[req.query.id],
		);
		let likes = await query('SELECT * FROM bookcase WHERE novel_id = ?', [
			req.query.id,
		]);
		results = JSON.parse(JSON.stringify(results));
		if (!results.length) return res.status(404).json({ msg: '作品不存在或未公开' });
		results[0].disable_reader_ai = Number(await novelReaderAiSettings.isDisabled(req.query.id));
		results[0]['likes'] = likes;
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_public_authors', async function (req, res) {
	try {
		const novelId = Number(req.query.novel_id || 0);
		if (!novelId) {
			return res.end(
				JSON.stringify({
					novel_id: 0,
					has_collaboration: false,
					total_author_count: 0,
					authors: [],
				})
			);
		}

		const ownerRows = await query(
			`SELECT
				n.novel_id,
				u.user_id,
				u.name,
				u.avatar_url
			FROM novels n
			INNER JOIN users u ON u.user_id = n.author_id
			WHERE n.novel_id = ?
				AND n.deleted = 0
				AND n.is_personal = 0
			LIMIT 1`,
			[novelId],
		);

		if (!ownerRows || ownerRows.length === 0) {
			return res.end(
				JSON.stringify({
					novel_id: novelId,
					has_collaboration: false,
					total_author_count: 0,
					authors: [],
				})
			);
		}

		const collaboratorRows = await query(
			`SELECT
				nc.user_id,
				u.name,
				u.avatar_url,
				nc.accepted_at
			FROM novel_collaborators nc
			INNER JOIN novels n ON n.novel_id = nc.novel_id
			INNER JOIN users u ON u.user_id = nc.user_id
			WHERE nc.novel_id = ?
				AND nc.status = 'active'
				AND n.deleted = 0
				AND n.is_personal = 0
			ORDER BY
				CASE WHEN nc.accepted_at IS NULL THEN 1 ELSE 0 END ASC,
				nc.accepted_at ASC,
				nc.user_id ASC`,
			[novelId],
		);

		const owner = ownerRows[0];
		const authors = [
			{
				user_id: Number(owner.user_id),
				name: owner.name,
				avatar_url: owner.avatar_url,
				is_owner: true,
			},
			...JSON.parse(JSON.stringify(collaboratorRows || [])).map((row) => ({
				user_id: Number(row.user_id),
				name: row.name,
				avatar_url: row.avatar_url,
				is_owner: false,
			})),
		];

		res.end(
			JSON.stringify({
				novel_id: Number(owner.novel_id),
				has_collaboration: authors.length > 1,
				total_author_count: authors.length,
				authors,
			})
		);
	} catch (e) {
		console.log(e);
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
			`SELECT a.article_id,a.title,a.novel_id,a.article_chapter,a.update_time,a.article_type FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.novel_id = ? AND ${PUBLIC_ARTICLE} ORDER BY a.article_chapter ASC`,
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
			`SELECT a.article_id,a.title,a.novel_id,a.article_chapter,a.is_draft,a.update_time,a.article_type FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.novel_id = ? AND ${PUBLIC_ARTICLE} ORDER BY a.article_chapter ASC`,
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
			'SELECT n.* FROM novels n,users u WHERE n.author_id = u.user_id AND u.user_id = ? AND n.deleted = 0 AND n.is_personal = 0 AND n.is_banned = 0 AND novel_type != "world"',
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
 try {
  const user = req.user[0], result = await createReadingTip(req.body, user.user_id, withTransaction);
  const kind = result.book.novel_type === 'manga' ? '\u6f2b\u753b' : result.book.novel_type === 'world' ? '\u4e16\u754c\u8bbe\u5b9a' : '\u5c0f\u8bf4';
  try {
   await message.sendMsg(user.user_id, result.book.author_id, '\u6253\u8d4f\u4e86\u4f60\u7684' + kind + '\u300a' + result.book.name + '\u300b' + result.amount + '\u4e2a' + result.gift.item_name,
    (result.book.novel_type === 'manga' ? 'readers/mangaInfo?id=' : 'readers/bookInfo?id=') + result.book.novel_id, 'like_collect', true);
  } catch (_) { /* A notification failure cannot undo or misreport the committed tip. */ }
  res.json({ success: true, amount: result.amount, cost: result.total, resource_name: result.resource, balance: result.balance, author_income: result.authorIncome });
 } catch (failure) { res.status(failure.status || 500).json({ msg: failure.status ? failure.message : '\u6253\u8d4f\u672a\u5b8c\u6210\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5' }); }
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
			'SELECT * FROM novel_fans_messages WHERE novel_id = ?',
			[req.query.novel_id],
		);
		
		// 将留言信息合并到结果中
		for (let i = 0; i < results.length; i++) {
			let userMessage = messages.find(m => m.user_id === results[i].user_id);
			results[i].message = userMessage ? userMessage.message : null;
		}
		await avatarFrames.decorateRows(results, [
			{ userIdField: 'user_id', targetField: 'avatar_frame' },
		]);
		
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
			'SELECT COUNT(*) as count FROM tipping WHERE novel_id = ? AND from_id = ?',
			[novel_id, user.user_id],
		);
		
		if (isFan[0].count > 0) {
			// 插入或更新留言
			await query(
				`INSERT INTO novel_fans_messages (novel_id, user_id, message) 
				 VALUES (?, ?, ?) 
				 ON DUPLICATE KEY UPDATE message = ?`,
				[novel_id, user.user_id, message, message],
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
			'SELECT * FROM novel_fans_messages WHERE novel_id = ? AND user_id = ?',
			[novel_id, user.user_id],
		);
		
		if (message.length > 0) {
			res.json({ success: true, message: message[0].message });
		} else {
			res.json({ success: true, message: '' });
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

// 获取小说关联活动标签的活动新闻（公开接口，供书籍详情页展示）
router.get('/get_novel_activity_news', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.tag_id, a.activity_name, a.activity_news, a.is_active,
			        a.popularity_enabled, a.popularity_quota, a.popularity_rules,
			        COALESCE(v.vote_count, 0) AS popularity_votes
			 FROM novel_tag nt
			 JOIN tags t ON t.tag_id = nt.tag_id AND t.is_activity_tag = 1 AND t.is_deleted = 0
			 JOIN activity a ON a.tag_id = t.tag_id
			 JOIN novels n ON n.novel_id = nt.novel_id AND n.deleted = 0 AND n.is_personal = 0
			 LEFT JOIN (
			 	SELECT tag_id, novel_id, COUNT(*) AS vote_count
			 	FROM activity_popularity_vote
			 	GROUP BY tag_id, novel_id
			 ) v ON v.tag_id = a.tag_id AND v.novel_id = nt.novel_id
			 WHERE nt.novel_id = ?
			 ORDER BY a.is_active DESC, a.tag_id ASC`,
			[req.query.novel_id],
		);
		results = results.map((row) => {
			let news = [];
			try {
				let parsed = JSON.parse(row.activity_news || '[]');
				if (Array.isArray(parsed)) {
					news = parsed;
				}
			} catch (e) {}
			let rules = [];
			try {
				let parsed = JSON.parse(row.popularity_rules || '[]');
				if (Array.isArray(parsed)) {
					rules = parsed;
				}
			} catch (e) {}
			return {
				tag_id: row.tag_id,
				activity_name: row.activity_name,
				is_active: Number(row.is_active),
				news,
				popularity: {
					enabled: Number(row.popularity_enabled) === 1,
					quota: Number(row.popularity_quota) || 2,
					votes: Number(row.popularity_votes || 0),
					rules,
				},
			};
		});
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
			sql += ' AND t.tag_name LIKE ?';
			params.push('%' + req.query.keyword + '%');
		}
		
		sql += ' group by t.tag_id order by count desc';
		
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
			`SELECT n.*, u.name username, u.avatar_url, ${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft from tags t, novel_tag nt, novels n, users u where nt.tag_id = t.tag_id and u.user_id = n.author_id
            and nt.novel_id = n.novel_id and n.deleted = 0 and n.is_personal = 0 and t.tag_id = ?`,
			[req.query.tag_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_suggested_tags', async function (req, res) {
	try {
		// 官方标签 + 进行中的活动标签（活动标签未标记为 suggested，需单独纳入，否则创建作品/标签页的活动选择器会显示"无数据"）
		let results = await query(
			`SELECT t.* FROM tags t
			LEFT JOIN activity a ON a.tag_id = t.tag_id
			WHERE t.is_deleted = 0 AND (t.is_suggested = 1 OR (t.is_activity_tag = 1 AND a.is_active = 1))
			ORDER BY t.is_activity_tag DESC, t.tag_id DESC`,
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
			req.query.novel_id,req.user[0].user_id,
		]);
		if (novel.length > 0 && novel[0].author_id == user.user_id) {
			//检查是不是已结束的活动标签，如果是则不允许删除（活动不存在时视为可删除）
			let tags = await query(
				`SELECT t.tag_id, t.is_activity_tag, t.is_suggested, a.is_active
				 FROM tags t LEFT JOIN activity a ON a.tag_id = t.tag_id
				 WHERE t.tag_id = ?`,
				[req.query.tag_id],
			);
			if(tags.length > 0 && tags[0].is_activity_tag == 1 && tags[0].is_suggested == 0 && Number(tags[0].is_active) === 0){
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
				//检查是不是已结束（或未开放）的活动标签，如果是则不允许添加
				if(tags[0].is_activity_tag == 1 && tags[0].is_suggested == 0){
					let activity = await query('SELECT is_active FROM activity WHERE tag_id = ?', [
						tags[0].tag_id,
					]);
					if (activity.length === 0 || Number(activity[0].is_active) !== 1) {
						res.json(400, { msg: '该活动未开放或已结束，不得添加标签' });
						return;
					}
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
			[page, currentTime, currentTime],
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
			[novel_id],
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
			latest_update_time: latest_update_time,
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 批量检查书籍更新章节数量
router.get('/check_novel_updates_batch', async function (req, res) {
	try {
		const booksParam = req.query.books;
		
		if (!booksParam) {
			res.json(400, { msg: 'books parameter is required' });
			return;
		}
		
		let books;
		try {
			books = JSON.parse(booksParam);
		} catch (parseError) {
			res.json(400, { msg: 'invalid books parameter format' });
			return;
		}
		
		if (!Array.isArray(books) || books.length === 0) {
			res.json({ updates: [] });
			return;
		}
		
		const novelIds = books.map(b => b.novel_id);
		
		const results = await query(
			`SELECT 
				novel_id, 
				MAX(article_chapter) as max_chapter, 
				MAX(update_time) as latest_update_time 
			FROM articles 
			WHERE novel_id IN (${novelIds.map(() => '?').join(',')}) 
				AND is_draft = 0 
				AND deleted = 0 
			GROUP BY novel_id`,
			novelIds,
		);
		
		const serverDataMap = new Map();
		results.forEach(row => {
			serverDataMap.set(row.novel_id, {
				server_latest_chapter: row.max_chapter || 0,
				latest_update_time: row.latest_update_time
			});
		});
		
		const updates = books.map(book => {
			const serverData = serverDataMap.get(book.novel_id) || { server_latest_chapter: 0, latest_update_time: null };
			const local_latest_chapter = parseInt(book.latest_chapter) || 0;
			const new_chapters_count = Math.max(0, serverData.server_latest_chapter - local_latest_chapter);
			
			return {
				novel_id: book.novel_id,
				local_latest_chapter: local_latest_chapter,
				server_latest_chapter: serverData.server_latest_chapter,
				new_chapters_count: new_chapters_count,
				has_updates: new_chapters_count > 0,
				latest_update_time: serverData.latest_update_time,
			};
		});
		
		res.json({ updates });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取云端阅读记录列表
router.get('/reading_history', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		const limit = Math.min(parseInt(req.query.limit) || 50, 200);
		const offset = parseInt(req.query.offset) || 0;
		
		let results = await query(
			`SELECT 
				n.novel_id,
				n.name,
				n.novel_type,
				n.is_complete,
				n.text_count,
				n.content,
				n.picUrl,
				n.author_id,
				u.user_id auther_id,
				u.name author_name,
				u.avatar_url auther_avatar,
				${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft,
				n.update_time,
				rh.last_article_id,
				rh.last_article_chapter,
				rh.last_page_idx,
				rh.updated_at as last_read_time
			FROM user_reading_history rh
			INNER JOIN novels n ON n.novel_id = rh.novel_id
			LEFT JOIN users u ON n.author_id = u.user_id
			WHERE rh.user_id = ? AND n.deleted = 0
			ORDER BY rh.updated_at DESC
			LIMIT ?, ?`,
			[user_id, offset, limit],
		);
		
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取某本书的云端阅读进度
router.get('/reading_progress', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		const novel_id = parseInt(req.query.novel_id);
		
		if (!novel_id) {
			return res.json(400, { msg: 'missing novel_id parameter' });
		}
		
		let results = await query(
			`SELECT 
				novel_id,
				last_article_id,
				last_article_chapter,
				last_page_idx,
				updated_at as last_read_time
			FROM user_reading_history
			WHERE user_id = ? AND novel_id = ?
			LIMIT 1`,
			[user_id, novel_id],
		);
		
		if (results.length === 0) {
			res.end(JSON.stringify([]));
			return;
		}
		
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 更新云端阅读进度（写入/更新阅读记录）
router.post('/update_reading_progress', auth, async function (req, res) {
	try {
		const user_id = req.user[0].user_id;
		const novel_id = parseInt(req.body.novel_id);
		
		if (!novel_id) {
			return res.json(400, { msg: 'missing novel_id parameter' });
		}
		
		const article_id =
			req.body.article_id === undefined || req.body.article_id === null || req.body.article_id === ''
				? null
				: parseInt(req.body.article_id);
		const page_idx =
			req.body.page_idx === undefined || req.body.page_idx === null || req.body.page_idx === ''
				? null
				: parseInt(req.body.page_idx);

		if (!Number.isInteger(article_id) || article_id <= 0 || !Number.isInteger(Number(req.body.article_id)) ||
			(page_idx !== null && (!Number.isInteger(Number(req.body.page_idx)) || page_idx < 0))) {
			return res.status(400).json({ msg: 'invalid reading progress' });
		}
		const readable = await query(
			`SELECT a.article_chapter,a.article_type,a.content FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND a.novel_id = ? AND ${PUBLIC_ARTICLE}`,
			[article_id, novel_id],
		);
		if (!readable.length) return res.status(403).json({ msg: '作品或章节不可阅读' });
		const chapter = readable[0];
		if (chapter.article_type === 'mangaStrip' || chapter.article_type === 'mangaPage') {
			let content;
			try { content = JSON.parse(chapter.content); } catch (_) { content = null; }
			if (!content || !Array.isArray(content.pages) || page_idx === null || page_idx >= content.pages.length) {
				return res.status(400).json({ msg: 'invalid manga page index' });
			}
		}
		
		const existing = await query(
			'SELECT last_article_id, last_article_chapter, last_page_idx FROM user_reading_history WHERE user_id = ? AND novel_id = ? LIMIT 1',
			[user_id, novel_id],
		);
		
		if (existing.length === 0) {
			await query(
				`INSERT INTO user_reading_history (user_id, novel_id, last_article_id, last_article_chapter, last_page_idx)
				 VALUES (?, ?, ?, ?, ?)`,
				[user_id, novel_id, article_id, chapter.article_chapter, page_idx],
			);
			res.json(200, { msg: 'ok' });
			return;
		}
		
		const prev = existing[0];
		await query(
			`UPDATE user_reading_history
			 SET last_article_id = ?,
				 last_article_chapter = ?,
				 last_page_idx = ?,
				 updated_at = CURRENT_TIMESTAMP
			 WHERE user_id = ? AND novel_id = ?`,
			[
				article_id === null ? prev.last_article_id : article_id,
				chapter.article_chapter,
				page_idx === null ? (Number(prev.last_article_id) === article_id ? prev.last_page_idx : null) : page_idx,
				user_id,
				novel_id,
			],
		);
		
		res.json(200, { msg: 'ok' });
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
		
		await query(
			`INSERT INTO share_codes (code, share_user_id, share_type, share_content, target_url, expires_at) 
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[code, user_id, share_type, share_content, target_url, expires_at],
		);
		
		res.json({
			success: true,
			code: code,
			share_text: `【原木社区】${code}，` + req.body.share_message,
			msg: '口令创建成功',
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
			[code],
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
			[share.id],
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
				use_count: share.use_count + 1,
			},
			msg: '口令解析成功',
		});
		
	} catch (e) {
		console.log(e);
		res.status(500).json({ msg: '服务器错误' });
	}
});

router.post('/reader_novel_ai_chat_stream', auth, async function (req, res) {
	try {
		const user = req.user && req.user[0];
		// Check the author's choice before deducting redstone or opening the stream.
		await novelReaderAiSettings.assertAllowed(req.body && req.body.novel_id);
		const retrieverMode = String(req.body.retriever_mode || req.body.search_mode || 'fast') === 'deep' ? 'deep' : 'fast';
		const cost = retrieverMode === 'deep' ? 2 : 1;
		await redstone.consumeRedstone(user.user_id, cost, {
			feature: retrieverMode === 'deep' ? 'reader_log_girl_deep' : 'reader_log_girl_fast',
			requestId: req.body.task_id || `${req.body.session_id || ''}:${req.body.message_id || Date.now()}`,
			description: `问问原木娘${retrieverMode === 'deep' ? '深度思考' : '普通问答'}消耗${cost}红石`,
		});
		return handleReaderNovelChatStream(req, res);
	} catch (error) {
		if (error && error.code === 'READER_AI_DISABLED') {
			return res.status(403).json({ code: error.code, msg: error.message, message: error.message });
		}
		if (error && (error.statusCode === 400 || error.statusCode === 404)) {
			return res.status(error.statusCode).json({ msg: error.message });
		}
		if (error && error.isBusinessError) {
			return res.status(error.statusCode || 400).json({ code: error.code, msg: error.message, message: error.message });
		}
		console.log(error);
		return res.status(500).json({ msg: '提问服务暂不可用' });
	}
});

router.get('/reader_novel_summary_index_status', async function (req, res) {
	const novelId = Number(req.query.novel_id || req.query.id || 0);
	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id 不能为空' });
	}

	try {
		await novelReaderAiSettings.assertAllowed(novelId);
		const status = await getNovelSummaryIndexStatus(novelId);
		return res.json({
			msg: 'ok',
			data: status,
		});
	} catch (error) {
		if (error && error.code === 'READER_AI_DISABLED') {
			return res.status(403).json({ code: error.code, msg: error.message });
		}
		if (error && (error.statusCode === 400 || error.statusCode === 404)) {
			return res.status(error.statusCode).json({ msg: error.message });
		}
		console.log(error);
		return res.status(500).json({ msg: '服务器错误' });
	}
});

let recommendRouter = require('./library/recommand');

router.use('/recommand', recommendRouter);

let rankRouter = require('./library/rank');

router.use('/rank', rankRouter);

module.exports = router;
