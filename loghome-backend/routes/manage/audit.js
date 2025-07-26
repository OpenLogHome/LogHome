// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');
let axios = require('axios');

//审核接口

async function checkText(content) {
	//首先将字符串切割为199长度，以便送进审核接口。
	let contentArr = [];

	for (let i = 0; i < content.length; i += 199) {
		contentArr.push(content.slice(i, i + 199))
	}

	let suspectClasses = new Set();

	for (let text of contentArr) {
		try {
			const response = await axios({
				method: 'post',
				url: 'http://49.234.114.90:8787/api/check',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: `text=${encodeURIComponent(text)}`
			});

			if (response.data.code === 0) {
				if (response.data.result !== 'pass') {
					if(response.data.remark.indexOf("色情") != -1) {
						suspectClasses.add("色情");
					}
					if(response.data.remark.indexOf("赌博") != -1) {
						suspectClasses.add("赌博");
					}
					if(response.data.remark.indexOf("政") != -1) {
						suspectClasses.add("涉政");
					}
					if(response.data.remark.indexOf("恐怖") != -1) {
						suspectClasses.add("恐怖");
					}
					if(response.data.remark.indexOf("广告") != -1) {
						suspectClasses.add("广告");
					}
				}
			} else {
				console.error('文本审核接口返回错误:', response.data);
				suspectClasses.add('接口异常需人工审核');
			}

		} catch (error) {
			console.error('调用审核接口出错');
			suspectClasses.add('接口异常需人工审核');
		}
		await new Promise(resolve => setTimeout(resolve, 2000)); // 延迟1秒
	}

	return Array.from(suspectClasses);
}

// 创建路由对象
let router = express.Router();

// 定义一个QPS为5的自动文章审核函数
// let isArticleAuditRunning = false;
// let articlesToAudit = [];
// setInterval(async function () {
// 	if (isArticleAuditRunning) return;
// 	isArticleAuditRunning = true;
// 	articlesToAudit = await query(
// 		'SELECT * FROM articles WHERE audit_status = \'Uncheck\' and is_draft = 0 LIMIT 0,5',
// 	);
// 	try {
// 		for (let i = 0; i < articlesToAudit.length; i++) {
// 			console.log("正在自动审核文章 " + articlesToAudit[i].article_id + " " + articlesToAudit[i].title)
// 			if(articlesToAudit[i].article_type == "richtext") {
// 				articlesToAudit[i].content = JSON.parse(articlesToAudit[i].content);
// 				let content = "";
// 				for(let j = 0; j < articlesToAudit[i].content.length; j++) {
// 					if(articlesToAudit[i].content[j].type == "text") {
// 						content += articlesToAudit[i].content[j].value;
// 					}
// 				}
// 				articlesToAudit[i].content = content;
// 			}
// 			// console.log(articlesToAudit[i].content)
// 			let result = await checkText(
// 				articlesToAudit[i].title + ' ' + articlesToAudit[i].content,
// 			);
// 			// if(result != undefined) console.log("识别结果：",result);
// 			if (result.length == 0) {
// 				console.log("审核通过")
// 				await query(
// 					'UPDATE articles SET audit_status = \'Checked\' WHERE article_id = ?',
// 					[articlesToAudit[i].article_id],
// 				);
// 			} else {
// 				console.log("审核完毕，存在问题：" + String(result))
// 				await query(
// 					'UPDATE articles SET audit_status = ? WHERE article_id = ?',
// 					[String(result), articlesToAudit[i].article_id],
// 				);
// 			}
// 		}
// 		isArticleAuditRunning = false;
// 	} catch (e) {
// 		console.log(e);
// 		isArticleAuditRunning = false;
// 	}
// }, 1000);

router.get('/get_articles_to_audit', auth, async function (req, res) {
	try {
		// 构建基础查询SQL和参数数组
		let sqlQuery = `
			SELECT a.article_id, a.title, n.name novel_name, a.text_count, a.audit_status, n.novel_id, n.author_id, u.name author_name
			FROM articles a, novels n, users u
			WHERE a.novel_id = n.novel_id 
			AND n.author_id = u.user_id
			AND a.audit_status != "Checked" 
			AND a.audit_status != "Uncheck"
		`;
		let params = [];
		
		// 添加标题筛选
		if (req.query.title && req.query.title.trim() !== '') {
			sqlQuery += ` AND a.title LIKE ?`;
			params.push(`%${req.query.title}%`);
		}
		
		// 添加作者筛选
		if (req.query.author && req.query.author.trim() !== '') {
			sqlQuery += ` AND u.name LIKE ?`;
			params.push(`%${req.query.author}%`);
		}
		
		// 添加分页和排序
		sqlQuery += ` ORDER BY a.article_id DESC LIMIT ?,20`;
		params.push((Number(req.query.page) - 1) * 20);
		
		let results = await query(sqlQuery, params);
		
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_to_audit_amount', auth, async function (req, res) {
	try {
		// 构建基础查询SQL和参数数组
		let sqlQuery = `
			SELECT COUNT(*) count 
			FROM articles a, novels n, users u
			WHERE a.novel_id = n.novel_id 
			AND n.author_id = u.user_id
			AND a.audit_status != "Checked" 
			AND a.audit_status != "Uncheck"
		`;
		let params = [];
		
		// 添加标题筛选
		if (req.query.title && req.query.title.trim() !== '') {
			sqlQuery += ` AND a.title LIKE ?`;
			params.push(`%${req.query.title}%`);
		}
		
		// 添加作者筛选
		if (req.query.author && req.query.author.trim() !== '') {
			sqlQuery += ` AND u.name LIKE ?`;
			params.push(`%${req.query.author}%`);
		}
		
		let results = await query(sqlQuery, params);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_by_id', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM articles WHERE article_id = ?', [
			Number(req.query.id),
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/submit_result', auth, async function (req, res) {
	try {
		let article = await query(
			'SELECT a.article_id,a.title,n.name novel_name,a.text_count,a.audit_status,n.author_id FROM articles a,novels n WHERE a.novel_id = n.novel_id AND a.article_id = ?',
			[Number(req.body.article_id)],
		);
		console.log(req.body.article_id);
		if (req.body.handleMethod == '通过') {
			let results = await query(
				'UPDATE articles SET audit_status = \'Checked\',warn_status = ? WHERE article_id = ?',
				[req.body.warnInfo, req.body.article_id],
			);
			res.end(JSON.stringify(results));
		} else if (req.body.handleMethod == '打回草稿') {
			let results = await query(
				'UPDATE articles SET is_draft = 1,audit_status = \'Checked\' WHERE article_id = ?',
				[req.body.article_id],
			);
			message.sendMsg(
				-1,
				article[0].author_id,
				'抱歉，您的作品《' +
				article[0].novel_name +
				'》的章节' +
				'《' +
				article[0].title +
				'》未能通过审核已被退回，您可以编辑后重新发布。',
				'writers/chapterEditor?id=' + req.body.article_id,
				'notification',
				true,
			);
			res.end(JSON.stringify(results));
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
