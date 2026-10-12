// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let sysLog = require('../bin/log.js');
let statistics = require('../bin/statistics.js');
const { PUBLIC_ARTICLE } = require('../bin/readingVisibility.js');
const { findReaderParagraph } = require('../bin/readerParagraphs.js');
const { registerReaderExcerpts } = require('../bin/readerExcerpts.js');

// 创建路由对象
let router = express.Router();

function toYMD(dateLike) {
	if (!dateLike) return null;
	if (typeof dateLike === 'string') return dateLike.slice(0, 10);
	try {
		return new Date(dateLike).toISOString().slice(0, 10);
	} catch (e) {
		return null;
	}
}

function addDaysYMD(ymd, days) {
	const d = new Date(ymd + 'T00:00:00');
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}

async function attachNovelShareCounts(statRows, novelId) {
	if (!Array.isArray(statRows) || statRows.length === 0) return statRows;
	if (novelId === undefined || novelId === null) return statRows;

	const days = statRows
		.map((r) => toYMD(r && r.statistic_date))
		.filter(Boolean);
	if (days.length === 0) return statRows;

	const minDay = days.reduce((a, b) => (a < b ? a : b));
	const maxDay = days.reduce((a, b) => (a > b ? a : b));
	const endExclusive = addDaysYMD(maxDay, 1);
	const targetUrlLike = `/pages/readers/bookInfo?id=${novelId}%`;

	const baseRows = await query(
		`SELECT COUNT(*) AS share_count
		 FROM share_codes
		 WHERE share_type = 'book'
		   AND target_url LIKE ?
		   AND created_at < ?`,
		[targetUrlLike, minDay + ' 00:00:00'],
	);
	const baseCount =
		baseRows && baseRows[0] ? Number(baseRows[0].share_count) || 0 : 0;

	const shareRows = await query(
		`SELECT DATE(created_at) AS day, COUNT(*) AS share_count
		 FROM share_codes
		 WHERE share_type = 'book'
		   AND target_url LIKE ?
		   AND created_at >= ?
		   AND created_at < ?
		 GROUP BY DATE(created_at)
		 ORDER BY day ASC`,
		[targetUrlLike, minDay + ' 00:00:00', endExclusive + ' 00:00:00'],
	);

	const perDay = new Map();
	for (const row of shareRows) {
		const day = toYMD(row && row.day);
		if (!day) continue;
		perDay.set(day, Number(row.share_count) || 0);
	}

	const uniqueDaysSorted = Array.from(new Set(days)).sort();
	let running = baseCount;
	const cumulative = new Map();
	for (const day of uniqueDaysSorted) {
		running += perDay.get(day) || 0;
		cumulative.set(day, running);
	}

	for (const row of statRows) {
		const day = toYMD(row && row.statistic_date);
		row.shares = cumulative.get(day) || 0;
	}

	return statRows;
}

router.get('/get_article_novel_id', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.novel_id FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
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
			`SELECT a.article_id, a.article_type, a.title, a.novel_id, a.article_chapter, a.is_draft, a.deleted, a.update_time, a.text_count FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
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
			`SELECT a.* FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (!results.length) return res.status(404).json({ msg: '作品或章节不可阅读' });
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
			`SELECT a.novel_id FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (!results.length) return res.status(404).json({ msg: '作品或章节不可阅读' });
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
});

registerReaderExcerpts(router, { auth, query });

router.post('/remove_article_cento', auth, async function (req, res) {
	try {
		await query(
			'UPDATE article_cento SET is_delete = 1 WHERE article_cento_id = ? AND user_id = ?',
			[req.body.article_cento_id, req.user[0].user_id],
		);
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_paragraph_comment_amount', async function(req, res){
	try{
		let result = await query(`SELECT COUNT(*) count FROM novel_comments n, article_cento c WHERE n.cento_id != 0
        AND n.deleted = 0 AND n.cento_id = c.article_cento_id AND c.paragraph_id = ? AND c.article_id = ?`, [
			req.body.paragraph_id, req.body.article_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_paragraph_comment_amounts', async function(req, res){
	try{
		let articleId = Number(req.body.article_id);
		let paragraphIds = Array.isArray(req.body.paragraph_ids)
			? Array.from(new Set(req.body.paragraph_ids
				.map((item) => Number(item))
				.filter((item) => Number.isInteger(item) && item > 0)))
			: [];
		if (!Number.isInteger(articleId) || articleId <= 0 || paragraphIds.length == 0) {
			res.end(JSON.stringify([]));
			return;
		}
		let result = await query(`SELECT c.paragraph_id, COUNT(*) count
			FROM novel_comments n
			INNER JOIN article_cento c ON n.cento_id = c.article_cento_id
			WHERE n.cento_id != 0
			  AND n.deleted = 0
			  AND c.article_id = ?
			  AND c.paragraph_id IN (?)
			GROUP BY c.paragraph_id`, [
			articleId,
			paragraphIds,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_comment_amount', async function(req, res){
	try{
		let result = await query('SELECT COUNT(*) count FROM novel_comments WHERE article_id = ?', [
			req.query.article_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


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
		await attachNovelShareCounts(results, req.query.novel_id);
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

		await attachNovelShareCounts(results, req.query.novel_id);
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

// 提交文本错误反馈
router.post('/submit_feedback', auth, async function (req, res) {
	try {
		// 首先获取段落内容
		let articleInfo = await query(
			`SELECT a.* FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.body.article_id],
		);
        
		if (articleInfo.length === 0) {
			return res.status(404).json({ msg: '文章不存在' });
		}
        
		let article = articleInfo[0];
		let paragraphText = '';

		// 漫画章节（条漫/页漫）没有段落结构，不支持段评反馈
		if (article.article_type === 'mangaStrip' || article.article_type === 'mangaPage') {
			return res.status(400).json({ msg: '漫画章节暂不支持段落反馈' });
		}

		const paragraph = findReaderParagraph(article, req.body.paragraph_id);
		paragraphText = paragraph ? paragraph.value : '';
        
		if (!paragraphText) {
			return res.status(404).json({ msg: '未找到指定段落' });
		}
        
		// 插入反馈记录
		await query(
			'INSERT INTO article_feedback (article_id, paragraph_id, user_id, feedback_content, paragraph_text) VALUES (?, ?, ?, ?, ?)',
			[
				req.body.article_id,
				req.body.paragraph_id,
				req.user[0].user_id,
				req.body.feedback_content,
				paragraphText,
			],
		);
        
		// 获取作者ID并发送消息通知
		let novelInfo = await query(
			'SELECT n.author_id, n.name FROM novels n JOIN articles a ON n.novel_id = a.novel_id WHERE a.article_id = ?',
			[req.body.article_id],
		);
        
		if (novelInfo.length > 0) {
			const message = require('../bin/message.js');
			message.sendMsg(
				req.user[0].user_id,
				novelInfo[0].author_id,
				`您的作品《${novelInfo[0].name}》收到了一条文本错误反馈，点击查看。`,
				'writers/articleFeedbacks?id=' + article.article_id,
				'notification',
				true,
			);
		}
        
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
