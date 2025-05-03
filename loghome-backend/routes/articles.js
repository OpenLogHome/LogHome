// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let sysLog = require('../bin/log.js');
let statistics = require('../bin/statistics.js');

// 创建路由对象
let router = express.Router();

router.get('/get_article_novel_id', async function (req, res) {
	try {
		let results = await query(
			'SELECT novel_id FROM articles WHERE article_id = ?',
			[req.query.id],
		);
		if (results.length > 0) res.end(JSON.stringify(results));
		else res.json(400, { msg: 'bad request' });
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_info', async function (req, res) {
	try {
		let results = await query(
			'SELECT article_id, article_type, title, novel_id, article_chapter, is_draft, deleted, update_time, text_count FROM articles WHERE article_id = ? AND is_draft = 0 AND deleted = 0',
			[req.query.id],
		);
		if (results.length > 0) res.end(JSON.stringify(results));
		else res.json(400, { msg: 'bad request' });
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM articles WHERE article_id = ? AND is_draft = 0 AND deleted = 0',
			[req.query.id],
		);
		if (req.query.isCaching == undefined || req.query.isCaching == 'false') {
			await statistics.novel_clicked(
				JSON.parse(JSON.stringify(results))[0].novel_id,
				req.query.id,
				req.ip,
			);
			sysLog('READ_ARTICLE', '-1', req.ip, req.query.id);
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/novel_clicked', async function (req, res) {
	try {
		let results = await query(
			'SELECT novel_id FROM articles WHERE article_id = ? AND is_draft = 0 AND deleted = 0',
			[req.query.id],
		);
		await statistics.novel_clicked(
			JSON.parse(JSON.stringify(results))[0].novel_id,
			req.query.id,
			req.ip,
		);
		sysLog('READ_ARTICLE', '-1', req.ip, req.query.id);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
})

router.get('/get_my_article_cento', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM article_cento WHERE article_id = ? AND user_id = ? AND is_delete = 0',
			[req.query.article_id, req.user[0].user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});


router.post('/add_article_cento', auth, async function (req, res) {
	try {
		await query(
			'INSERT INTO article_cento(user_id, article_id, paragraph_id, paragraph) VALUES(?, ?, ?, ?)',
			[req.user[0].user_id, req.body.article_id, req.body.paragraph_id, req.body.paragraph],
		);
		res.end("success");
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/remove_article_cento', auth, async function (req, res) {
	try {
		await query(
			'UPDATE article_cento SET is_delete = 1 WHERE article_cento_id = ? AND user_id = ?',
			[req.body.article_cento_id, req.user[0].user_id],
		);
		res.end("success");
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_paragraph_comment_amount', async function(req, res){
    try{
        let result = await query(`SELECT COUNT(*) count FROM novel_comments n, article_cento c WHERE n.cento_id != 0
        AND n.deleted = 0 AND n.cento_id = c.article_cento_id AND c.paragraph_id = ? AND c.article_id = ?`, [
            req.body.paragraph_id, req.body.article_id
        ])
        res.end(JSON.stringify(result));
    } catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
})

router.get('/get_article_comment_amount', async function(req, res){
    try{
        let result = await query(`SELECT COUNT(*) count FROM novel_comments WHERE article_id = ?`, [
            req.query.article_id
        ])
        res.end(JSON.stringify(result));
    } catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
})


router.get('/get_novel_statistics', async function (req, res) {
	try {
		let time = new Date().getTime();
		let today = new Date(time - 24 * 60 * 60 * 1000); // 获取最新一天的数据
		let yesterday = new Date(time - 24 * 60 * 60 * 1000 * 2); // 获取前一天的数据
		yesterday =
			yesterday.getFullYear() +
			'-' +
			(yesterday.getMonth() > 9
				? yesterday.getMonth() + 1
				: '0' + (yesterday.getMonth() + 1)) +
			'-' +
			(yesterday.getDate() > 9
				? yesterday.getDate()
				: '0' + yesterday.getDate());
		today =
			today.getFullYear() +
			'-' +
			(today.getMonth() > 9
				? today.getMonth() + 1
				: '0' + (today.getMonth() + 1)) +
			'-' +
			(today.getDate() > 9 ? today.getDate() : '0' + today.getDate());
		let results_today = await query(
			'SELECT * FROM novel_statistics WHERE novel_id = ? AND statistic_date = ?',
			[req.query.novel_id, today + ' 00:00:00'],
		);
		let results_yesterday = await query(
			'SELECT * FROM novel_statistics WHERE novel_id = ? AND statistic_date = ?',
			[req.query.novel_id, yesterday + ' 00:00:00'],
		);

		let results = [...results_today, ...results_yesterday];
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_specific_statistics', async function (req, res) {
	try {
		let time = new Date().getTime();
		let today = new Date(time - 24 * 60 * 60 * 1000); // 获取最新一天的数据
		let startDay = new Date(time - 24 * 60 * 60 * 1000 * 30); // 获取30天前的数据
		startDay =
			startDay.getFullYear() +
			'-' +
			(startDay.getMonth() > 9
				? startDay.getMonth() + 1
				: '0' + (startDay.getMonth() + 1)) +
			'-' +
			(startDay.getDate() > 9 ? startDay.getDate() : '0' + startDay.getDate());
		today =
			today.getFullYear() +
			'-' +
			(today.getMonth() > 9
				? today.getMonth() + 1
				: '0' + (today.getMonth() + 1)) +
			'-' +
			(today.getDate() > 9 ? today.getDate() : '0' + today.getDate());

		let results = await query(
			'SELECT * FROM novel_statistics WHERE novel_id = ? AND statistic_date >= ? AND statistic_date <= ? ',
			[req.query.novel_id, startDay + ' 00:00:00', today + ' 00:00:00'],
		);

		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

let schedule = require('node-schedule');

async function novelStatistics() {
	try {
		let time = new Date().getTime() - 24 * 60 * 60 * 1000;
		let yesterday = new Date(time);
		yesterday =
			yesterday.getFullYear() +
			'-' +
			(yesterday.getMonth() > 9
				? yesterday.getMonth() + 1
				: '0' + (yesterday.getMonth() + 1)) +
			'-' +
			(yesterday.getDate() > 9
				? yesterday.getDate()
				: '0' + yesterday.getDate());
		await query(
			`INSERT INTO novel_statistics(novel_id,statistic_date,clicks,nices,likes,comments,tippings) 
                    SELECT novel_id,?,clicks,(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id) nices,
                    (SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id) likes,
                    (SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id) comments,
                    (SELECT IFNULL(SUM(item_amount*item_cost),0) FROM tipping WHERE novel_id = n.novel_id) tippings FROM novels n WHERE deleted = 0 AND is_personal = 0`,
			[yesterday + ' 00:00:00'],
		);
	} catch (e) {
		console.log(e);
	}
}

//每晚凌晨三点的小说数据统计功能,记录全站小说数据情况
schedule.scheduleJob('0 0 3 * * *', novelStatistics);

// 获取用户对某本小说的全部划线段落
router.get('/get_my_novel_centos', auth, async function (req, res) {
    try {
        let results = await query(
            `SELECT ac.*, a.title, a.article_chapter FROM article_cento ac 
            JOIN articles a ON ac.article_id = a.article_id 
            WHERE a.novel_id = ? AND ac.user_id = ? AND ac.is_delete = 0
			ORDER BY article_chapter ASC`,
            [req.query.novel_id, req.user[0].user_id],
        );
        res.end(JSON.stringify(results));
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 获取某本小说的热门划线段落
router.get('/get_hot_novel_centos', async function (req, res) {
    try {
        // 热门划线段落，按划线次数和评论数降序排序
        let results = await query(
            `SELECT ac.paragraph_id, ac.paragraph, 
            COUNT(DISTINCT ac.article_cento_id) AS highlight_count, 
            COUNT(DISTINCT nc.essay_comment_id) AS comment_count,
            a.title AS article_title, a.article_chapter, a.article_id
            FROM article_cento ac
            JOIN articles a ON ac.article_id = a.article_id
            LEFT JOIN novel_comments nc ON nc.cento_id = ac.article_cento_id AND nc.deleted = 0
            WHERE a.novel_id = ? AND ac.is_delete = 0
            GROUP BY ac.paragraph_id, ac.paragraph, a.title, a.article_chapter
            ORDER BY highlight_count DESC, comment_count DESC
            LIMIT ?`,
            [req.query.novel_id, Number(req.query.limit) || 10],
        );
        res.end(JSON.stringify(results));
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

module.exports = router;
