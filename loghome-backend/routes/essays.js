// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');
let message = require('../bin/message.js');
let statistics = require('../bin/statistics');
let bank = require('../bin/bank.js');
const fs = require('fs'); // 引入文件系统模块
const compressing = require('compressing');
const path = require('path')

function currentTime()  
{   
    var now = new Date();  
         
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
         
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss=now.getSeconds();            //秒  
         
    var clock = year + "-";  
         
    if(month < 10) clock += "0";         
    clock += month + "-";  
         
    if(day < 10) clock += "0";   
    clock += day + " ";  
         
    if(hh < 10) clock += "0";  
    clock += hh + ":";  
  
    if (mm < 10) clock += '0';   
    clock += mm+ ":";  
          
    if (ss < 10) clock += '0';   
    clock += ss;  
  
    return(clock);   
}  

// 创建路由对象
let router = express.Router();

router.get('/get_novels_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM novels WHERE author_id = ? AND deleted = 0 AND novel_type != "world" ORDER BY update_time DESC',
			[user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_by_id', async function (req, res) {
	try {
		let results = await query(
			`SELECT n.*,u.user_id auther_id,u.name author_name,u.avatar_url auther_avatar FROM novels n,users u 
						WHERE n.author_id = u.user_id AND novel_id = ? AND n.deleted = 0`,
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

router.post('/add_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'INSERT INTO novels(name,content,author_id,update_time) VALUES(?,?,?,CURRENT_TIMESTAMP)',
			[req.body.name, req.body.content, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/modify_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'UPDATE novels SET `name`=?,`content`=? WHERE `author_id`=? AND `novel_id` =? AND deleted = 0',
			[req.body.name, req.body.content, user.user_id, req.body.novel_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/export_novel', auth, async function (req, res) {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	res.end("success");
	try {
		let results = await query(
			`SELECT a.article_id,a.title,a.novel_id,a.article_chapter,a.content,
                               a.is_draft,a.deleted,a.update_time,a.text_count,a.article_type,n.name novel_name 
                               FROM articles a,novels n
                               WHERE a.novel_id = n.novel_id 
                               AND a.novel_id = ? 
                               AND n.author_id= ?  
                               AND n.deleted = 0 
                               AND a.deleted = 0 
                               ORDER BY article_chapter ASC`,
			[req.query.id, user.user_id],
		);
        let dirName = `public/${results[0].novel_id}_${Date.now()}_${Math.floor(Math.random()*9999)}`;
        fs.mkdirSync(dirName);
        for(let chapter of results){
            let reg = new RegExp('[\\\\/:*?\"<>|]');
            fs.writeFileSync(`${dirName}/${chapter.article_chapter} ${chapter.is_draft?"[草稿]":""}${chapter.title.replace(reg, '')}.txt`,chapter.content);
        }
        compressing.zip.compressDir(dirName, `${dirName}.zip`).then(()=>{
            // res.sendFile(path.resolve(`${dirName}.zip`));
			// 通过消息通知成功。
			message.sendMsg(
				-1,
				user.user_id,
				'作品《' + results[0].novel_name + '》于' + currentTime() + '导出成功，点击下载。',
				'apps/openInBrowser?url=https://loghomeservice.codesocean.top/'+ `${dirName}.zip`,
				'notification',
			);
            
        }).catch((e)=>{
            console.log(e);
			// 通过消息通知压缩失败。
			message.sendMsg(
				-1,
				user.user_id,
				'作品《' + results[0].novel_name + '》导出失败了，请联系管理员！',
				'',
				'notification',
			);
        });
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/set_novel_status', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
        let results = await query(
            'UPDATE novels SET `is_personal`=? WHERE `author_id`=? AND `novel_id` =? AND deleted = 0',
            [req.body.is_personal, user.user_id, req.body.novel_id],
        );
        res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/set_novel_update_status', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'UPDATE novels SET `is_complete`= ? WHERE `author_id`=? AND `novel_id` =? AND deleted = 0',
			[req.body.is_complete, user.user_id, req.body.novel_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/change_cover', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		axios
			.post(
				'http://img.codesocean.top/upload/imgbase64',
				{
					img: req.body.img,
					apikey: '45qEQfILCQ3tAXxmUJF8O562bJU2D0',
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
					},
				},
			)
			.then(function (response) {
				console.log(response.data);
				let result = query(
					'UPDATE novels SET picUrl = ? WHERE novel_id = ? AND deleted = 0',
					[response.data.url, req.body.novel_id],
				);
				res.json(200, { msg: 'ok' });
			})
			.catch(function (error) {
				console.log(error);
				res.json(400, { msg: 'bad request' });
			});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/delete_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM novels WHERE novel_id = ? AND author_id = ? AND deleted = 0',
			[req.body.id, user.user_id],
		);
		if (results.length != 0) {
			if(results[0].novel_type == "world"){
				results = await query(
					'UPDATE world SET is_delete = 1 WHERE asso_novel_id = ?',
					[req.body.id],
				);
			}
			await bank.useAmount(user, 'log', 50, true);
			results = await query(
				'UPDATE novels SET deleted = 1 WHERE novel_id = ?',
				[req.body.id],
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

router.get('/get_articles', auth, async function (req, res) {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT a.article_id,a.title,a.novel_id,a.article_chapter,
                               a.is_draft,a.deleted,a.update_time,a.text_count,a.article_type,n.name novel_name 
                               FROM articles a,novels n
                               WHERE a.novel_id = n.novel_id 
                               AND a.novel_id = ? 
                               AND n.author_id= ?  
                               AND n.deleted = 0 
                               AND a.deleted = 0 
                               ORDER BY article_chapter ASC`,
			[req.query.id, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_articles_deleted', auth, async function (req, res) {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT a.article_id,a.title,a.novel_id,a.article_chapter,
                               a.is_draft,a.deleted,a.update_time,a.text_count,n.name novel_name 
                               FROM articles a,novels n
                               WHERE a.novel_id = n.novel_id 
                               AND a.novel_id = ? 
                               AND n.author_id= ?  
                               AND n.deleted = 0 
                               AND a.deleted = 1
                               ORDER BY article_chapter ASC`,
			[req.query.id, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article', auth, async function (req, res) {
	try {
		let results = await query(
			`SELECT a.* FROM articles a,novels n 
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.deleted = 0
                               AND a.deleted = 0`,
			[req.query.id],
		);
        if(results.length > 0){
            let novel_info = await query(
                `SELECT * FROM novels WHERE novel_id = ?`,
                [results[0].novel_id],
            );
            results[0].novel_info = novel_info[0];
        }
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/add_article', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let novel = await query(
			'SELECT * FROM novels WHERE novel_id = ? AND author_id = ?',
			[req.body.id, user.user_id],
		);
		if (novel.length > 0) {
			if (!req.body.article_type) req.body.article_type = 'richtext';
            if (req.body.article_type == 'text') {
                req.body.article_type = 'richtext';
                req.body.content = "[]"
            }
			let results = await query(
				'INSERT INTO articles(title,content,novel_id,article_chapter,article_type,is_draft) VALUES(?,?,?,?,?,?)',
				[
					req.body.title,
					req.body.content,
					req.body.id,
					req.body.article_chapter,
					req.body.article_type,
					req.body.is_draft ? 1 : 0
				],
			);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/modify_article', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'UPDATE articles SET `title`=?,`content`=?,is_draft=?,update_time = CURRENT_TIMESTAMP WHERE article_id=? AND deleted = 0',
			[
				req.body.title,
				req.body.content,
				req.body.is_draft,
				req.body.article_id,
			],
		);
    // 字数统计
    let textCount = 0;
    let article = (await query('SELECT * FROM articles WHERE article_id = ?', [req.body.article_id]))[0];
    if(article.article_type == 'richtext' || article.article_type == "worldOutline"){
      for(let item of JSON.parse(article.content)){
        if(item.type == "text"){
          textCount += item.value.length;
        }
      }
    } else if(article.article_type == "worldVocabulary"){
      textCount += JSON.parse(article.content).desc.length;
    }
    await query(
			'UPDATE articles SET text_count = ? WHERE article_id = ? AND deleted = 0',
			[
				textCount,
				req.body.article_id,
			],
		);
		//如果不是草稿，则推送至更新记录，并向所有收藏该小说的人发布更新信息
		if (req.body.is_draft == 0) {
			await query(
				'UPDATE novels SET update_time = CURRENT_TIMESTAMP WHERE novel_id = (SELECT novel_id FROM articles WHERE article_id = ?)',
				[req.body.article_id],
			);
			let novel = await query(
				'SELECT a.novel_id,n.name,n.is_personal FROM articles a,novels n WHERE a.article_id = ? AND a.novel_id = n.novel_id',
				[req.body.article_id],
			);
			novel = JSON.parse(JSON.stringify(novel));
			//如果不是私人作品，则推送到最新更新通道
			if (novel[0].is_personal == 0) {
				await statistics.push_to_newly_modified(novel[0].novel_id);
			}
			let users = await query(
				'SELECT user_id FROM bookcase WHERE novel_id = ?',
				[novel[0].novel_id],
			);
			users = JSON.parse(JSON.stringify(users));
			for (let u of users) {
				message.sendMsg(
					user.user_id,
					u.user_id,
					'你收藏的作品《' + novel[0].name + '》更新了，快去看看吧！',
					'readers/bookInfo?id=' + novel[0].novel_id,
					'notification',
				);
			}
		}
		res.end(JSON.stringify(results));
        // 同时更新全本字数
        if (req.body.is_draft == 0) {
            let novel = (await query(
				'SELECT a.novel_id,n.name,n.is_personal FROM articles a,novels n WHERE a.article_id = ? AND a.novel_id = n.novel_id',
				[req.body.article_id],
			))[0];
            let articles = await query('SELECT text_count, is_draft FROM articles WHERE novel_id = ?', [novel.novel_id]);
            let novelTextCount = 0;
            for(let item of articles){
                if(item.is_draft == 0){
                    novelTextCount += item.text_count;
                }
            }
            await query(`UPDATE novels SET text_count = ? WHERE novel_id = ?`, [novelTextCount, novel.novel_id]);
        }
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

//删除文章
router.post('/delete_article', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT a.* FROM articles a,novels n 
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.author_id = ?
                               AND a.deleted = 0
                               AND n.deleted = 0`,
			[req.body.id, user.user_id],
		);
		if (results.length != 0) {
			results = await query(
				'UPDATE articles SET deleted = 1 WHERE article_id = ?',
				[req.body.id],
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

//永久删除文章
router.post('/delete_forever', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT a.* FROM articles a,novels n 
                               WHERE n.novel_id = a.novel_id 
                               AND article_id = ? 
                               AND n.author_id = ?
                               AND a.deleted = 1
                               AND n.deleted = 0`,
			[req.body.id, user.user_id],
		);
		if (results.length != 0) {
			results = await query(
				'DELETE FROM articles WHERE deleted = 1 AND article_id = ?',
				[req.body.id],
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

//恢复删除文章
router.post('/restore_deleted', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT a.* FROM articles a,novels n 
						WHERE n.novel_id = a.novel_id 
						AND article_id = ? 
						AND n.author_id = ?
						AND a.deleted = 1
						AND n.deleted = 0`,
			[req.body.id, user.user_id],
		);
		if (results.length != 0) {
			results = await query(
				`SELECT a.article_id FROM articles a,novels n 
						WHERE n.novel_id = a.novel_id 
						AND n.author_id = ?
						AND a.deleted = 0
						AND n.deleted = 0`,
				[user.user_id],
			);
			// console.log(results);
			let newChapter = results.length + 1;
			results = await query(
				'UPDATE articles SET deleted = 0 , article_chapter = ? WHERE article_id = ?',
				[newChapter, req.body.id],
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

//文章排序
router.post('/resort_article', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let sortlist = JSON.parse(req.body.sortlist);
		sortlist.forEach(async element => {
			let results = await query(
				'UPDATE articles SET `article_chapter`=? WHERE article_id=?',
				[element.article_chapter, element.article_id],
			);
		});
		res.end(JSON.stringify({ msg: 'success' }));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/master_work_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let master_work = await query(
			'SELECT master_work FROM writer_info WHERE user_id = ?',
			[user.user_id],
		);
		res.end(JSON.stringify(master_work));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
