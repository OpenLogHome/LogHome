// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');
let axios = require('axios');

//审核接口
/*
async function checkText(content){
    
    //首先将字符串切割为150长度，以便送进审核接口。
    let contentArr = [];
    
    for (let i = 0; i < content.length ; i += 150) {
        contentArr.push(content.slice(i,i + 150))
    }

    let type2class= ["低质灌水","暴恐违禁","文本色情","政治敏感","恶意推广","低俗辱骂",'恶意推广-联系方式','恶意推广-软文推广','广告法审核'];
    let suspectClasses = new Set();

    var FormData = require('form-data');
    for(let content of contentArr){
        var data = new FormData();
        data.append('content', content);
        data.append('type', 'textcensor');
        data.append('apiType', 'censor');
    
        var config = {
            method: 'post',
            url: 'https://ai.baidu.com/aidemo',
            headers: { 
                ...data.getHeaders()
            },
            data : data
        };
        
        async function getResult(config){
            await axios(config).then(async function(response){
                console.log(response.data);
                for(item of [...response.data.data.result.pass, ...response.data.data.result.reject,...response.data.data.result.review]){
                    if(item.score >= 0.7){
                        suspectClasses.add(type2class[item.label])
                    }
                }
                await sleep(1000);
            }).catch(function (error) {
                return undefined;
            });;
        }
        
        await getResult(config);

    }
    return Array.from(suspectClasses);

}
*/

//暂时打回人工审核
async function checkText(content) {
	return ['需人工审核'];
}

// 创建路由对象
let router = express.Router();

// 定义一个QPS为1的自动文章审核函数
let isArticleAuditRunning = false;
let articlesToAudit = [];
setInterval(async function () {
	if (isArticleAuditRunning) return;
	isArticleAuditRunning = true;
	try {
		articlesToAudit = await query(
			'SELECT * FROM articles WHERE audit_status = \'Uncheck\' LIMIT 0,5',
		);
		for (let i = 0; i < articlesToAudit.length; i++) {
			// console.log("正在识别 " + articlesToAudit[i].article_id + " " + articlesToAudit[i].title)
			let result = await checkText(
				articlesToAudit[i].title + ' ' + articlesToAudit[i].content,
			);
			// if(result != undefined) console.log("识别结果：",result);
			if (result.length == 0) {
				await query(
					'UPDATE articles SET audit_status = \'Checked\' WHERE article_id = ?',
					[articlesToAudit[i].article_id],
				);
			} else {
				await query(
					'UPDATE articles SET audit_status = ? WHERE article_id = ?',
					[String(result), articlesToAudit[i].article_id],
				);
			}
		}
		isArticleAuditRunning = false;
	} catch (e) {
		console.log(e);
		isArticleAuditRunning = false;
	}
}, 5000);

router.get('/get_articles_to_audit', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT a.article_id,a.title,n.name novel_name,a.text_count,a.audit_status,n.novel_id,n.author_id FROM articles a,novels n WHERE a.novel_id = n.novel_id AND a.audit_status != "Checked" AND a.audit_status != "Uncheck" LIMIT ?,20',
			[(Number(req.query.page) - 1) * 20],
		);
		for (let item of results) {
			let result = await query(
				'SELECT u.name FROM users u,novels n WHERE u.user_id = n.author_id AND u.user_id = ?',
				[item.author_id],
			);
			if (result[0] == undefined) {
				item.author_name = '作者已删除';
			} else {
				item.author_name = result[0].name;
			}
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_to_audit_amount', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) count FROM articles WHERE audit_status != "Checked" AND audit_status != "Uncheck"',
		);
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
				'你的作品《' +
					article[0].novel_name +
					'》的章节' +
					'《' +
					article[0].title +
					'》经审核违反了《原木社区用户内容上传协议》，已经打回草稿，请重新编辑。',
				'writers/chapterEditor?id=' + req.body.article_id,
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
