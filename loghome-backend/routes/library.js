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
			'SELECT * FROM library_roulous_chart WHERE isValid = 1',
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

router.get('/get_all_novel_fans', async function (req, res) {
	try {
		let results = await query(
			`SELECT * FROM (SELECT from_id user_id, SUM(item_amount * item_cost) fans_value 
					FROM tipping WHERE novel_id = ? GROUP BY from_id) a 
					JOIN open_users USING(user_id) ORDER BY fans_value DESC`,
			[req.query.novel_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
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

router.get('/get_all_tags', async function (req, res) {
	try {
		let results = await query(
			`SELECT t.*, count(*) count from tags t, novel_tag nt, novels n where nt.tag_id = t.tag_id
            and nt.novel_id = n.novel_id and n.deleted = 0 and n.is_personal = 0 group by t.tag_id order by count desc`
		);
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

let recommendRouter = require('./library/recommand');

router.use('/recommand', recommendRouter);

module.exports = router;
