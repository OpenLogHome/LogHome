// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/auth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');
let statistics = require('../../bin/statistics');

// 创建路由对象
let router = express.Router();

// 排行
router.get('/get_library_recommend_titles', async function (req, res) {
	try {
		if (req.query.title == '原木力爆棚') {
			const results = await query(
				`SELECT n.*,users.name user_name,users.avatar_url,novel_type FROM novels n,users WHERE n.author_id = users.user_id AND n.deleted = 0
				AND n.is_personal = 0 ORDER BY n.ranking DESC LIMIT 100`,
			);
			res.json(results);
		}
		else if(req.query.title === '最近更新') {
			const results = await query(
				`SELECT n.*, u.name user_name, u.avatar_url FROM novel_updates nu
				LEFT JOIN novel_updates nu0 ON nu.novel_id = nu0.novel_id AND nu.time < nu0.time 
				INNER JOIN novels n ON nu.novel_id = n.novel_id AND n.deleted = 0 AND n.is_personal = 0
				LEFT JOIN users u ON n.author_id = u.user_id WHERE nu0.novel_id IS NULL ORDER BY nu.record_id DESC`
			);
			res.end(JSON.stringify(results));
		}
		else {
			const results = await query(
				`SELECT DISTINCT n.*,u.name user_name,u.avatar_url,n.novel_type FROM novels n,library_recommend c,users u
								WHERE c.novel_id = n.novel_id AND c.title = ? 
                                AND u.user_id = n.author_id
								AND n.deleted = 0
								AND n.is_personal = 0
								ORDER BY recommend_id DESC 
								LIMIT ?,?`,
				[
					req.query.title,
					(req.query.page - 1) * req.query.amount,
					Number(req.query.amount),
				],
			);
			res.end(JSON.stringify(results));
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_library_collections', async function (req, res) {
	try {
		let results = await query('SELECT * FROM library_recommend_collections');
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/check_novel_rank', async function (req, res) {
	//榜单最大数量
	const recommend_limit=100;

	try {
		//首先被动更新小说原木力
		let power=await statistics.update_logpower(req.query.id);
		
		//获取榜单
		let table = await query(
			`SELECT * FROM library_recommend_new WHERE title = '原木力爆棚' ORDER BY recommend_id`
		);
		
		console.log("Get table success:"+JSON.stringify(table));

		//寻找小说原位和实际排名
		let target_pos=-1, origin_pos=-1;
		for(let t in table)
		{
			if(target_pos===-1&&table[t].criteria<=power) target_pos=parseInt(t);
			if(table[t].novel_id==req.query.id) origin_pos=parseInt(t);
			if(target_pos!=-1&&origin_pos!=-1) break;
		}
		console.log(`Ranking process: ${target_pos}, ${origin_pos}`);

		//如果原位和现排名相同则不动
		if(target_pos===origin_pos&&target_pos!=-1)
		{
			await query(
				`UPDATE library_recommend_new SET criteria = ? WHERE novel_id = ? AND title = '原木力爆棚'`,
				[power, req.query.id]
			)
			res.end(JSON.stringify([{
				rank: target_pos+1,
				ranking: power
			}]))
			return;
		}

		//没有找到目标排名也没有原排名的情况
		if(target_pos===-1&&origin_pos===-1)
		{
			if(table.length<recommend_limit)
			{
				await query(
					`INSERT INTO library_recommend_new (recommend_id, title, novel_id, criteria, last_update)
					VALUES (?, '原木力爆棚', ?, ?, CURRENT_TIMESTAMP)`,
					[table.length+1, req.query.id, power]
				);
				res.end(JSON.stringify([{
					rank: table.length+1,
					ranking: power
				}]));
			}
			else res.end(JSON.stringify([]))
		}
		//找到目标排名但没有原排名
		else if(target_pos!=-1&&origin_pos===-1)
		{
			await query(
				`UPDATE library_recommend_new SET novel_id = ?, criteria = ?, last_update = CURRENT_TIMESTAMP WHERE recommend_id = ?`,
				[req.query.id, power, target_pos+1]
			);
			res.end(JSON.stringify([{
				rank: target_pos+1,
				ranking: power
			}]));
		}
		//没有目标排名但有原排名
		else if(target_pos===-1&&origin_pos!=-1)
		{
			await query(
				`UPDATE library_recommend_new SET novel_id = ?, criteria = ?, last_update = CURRENT_TIMESTAMP WHERE recommend_id = ?`,
				[req.query.id, power, table.length]
			);
			await query(
				`UPDATE library_recommend_new SET novel_id = ?, criteria = ?, last_update = CURRENT_TIMESTAMP WHERE recommend_id = ?`,
				[table[table.length-1].novel_id, table[table.length-1].criteria, origin_pos+1]
			);
			res.end(JSON.stringify([]))
		}
		//有目标排名和原排名
		else if(target_pos!=-1&&origin_pos!=-1)
		{
			await query(
				`UPDATE library_recommend_new SET novel_id = ?, criteria = ?, last_update = CURRENT_TIMESTAMP WHERE recommend_id = ?`,
				[req.query.id, power, target_pos+1]
			);
			await query(
				`UPDATE library_recommend_new SET novel_id = ?, criteria = ?, last_update = CURRENT_TIMESTAMP WHERE recommend_id = ?`,
				[table[target_pos].novel_id, table[target_pos].criteria, origin_pos+1]
			);
			res.end(JSON.stringify([{
				rank: target_pos+1,
				ranking: power
			}]))
		}
		else throw "error";

		/*let target = await query(
			'SELECT * FROM library_recommend WHERE novel_id = ? AND title = \'原木力爆棚\'',
			[req.query.id],
		);
		if (target.length > 0) {
			let table = await query(
				'SELECT * FROM library_recommend WHERE title = \'原木力爆棚\' ORDER BY recommend_id DESC',
			);
			for (let i = 0; i < table.length; i++) {
				if (table[i].novel_id == target[0].novel_id) {
					target[0].rank = i + 1;
					break;
				}
			}
			res.end(JSON.stringify(target));
		} else {
			res.end(JSON.stringify([]));
		}*/
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;

let schedule = require('node-schedule');

//自动更新原木力爆棚作品
async function updateBestWelcomedNovels() {
	const startTime = new Date();
	console.log(`[${startTime.toLocaleString()}] 开始更新原木力`);

	await query('DELETE FROM library_recommend WHERE title = \'原木力爆棚\'');

	/* refactor request */

	// 查询原木力排行
	const results = await query(`SELECT novel_id,NAME novel_name,n.author_id,
												ROUND(
														(clicks * 8 + 
														(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id)*12 + 
														(SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id)*200 + 
														(SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id AND deleted = 0)*20 + 
														(SELECT IFNULL(SUM(item_amount*item_cost),0) FROM tipping WHERE novel_id = n.novel_id )*10)
														* IF( (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2) > 0.4,(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2),0.4)
														* IF( (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.07 * 0.05) > 0.6, (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.07 * 0.05), 0.6)
												) ranking,
												IF( (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.3 * 0.2) > 0.4,(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.3 * 0.2),0.4)
														* IF( (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.1 * 0.05) > 0.6, (1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.1 * 0.05), 0.6) - 1 guguLoss
												FROM novels n 
												WHERE is_personal = 0 AND deleted = 0 
												ORDER BY ranking DESC
                                                LIMIT 0,100`);

	// 前 100 原木力小说加入排行数据表
	for (let i = results.length - 1; i >= results.length - 100 && i >= 0; i--) {
		const item = results[i];
		await query(
			'INSERT INTO library_recommend(novel_id,title,ranking) VALUES(?,?,?)',
			[item.novel_id, '原木力爆棚', item.ranking],
		);
	}

	// 更新所有小说原木力
	await query('UPDATE novels SET rank_last = ranking'); // 转移旧原木力
	for (let i = 0; i < results.length; i++) {
		// 赋值新原木力
		/*await query('UPDATE novels SET ranking=? WHERE novel_id=?', [
			results[i].ranking,
			results[i].novel_id,
		]);*/

		// 加入原木力历史记录表

		const time = new Date();
		await query(
			'INSERT INTO log_power(novel_id,day,hour,power) VALUES(?,?,?,?)',
			[
				results[i].novel_id,
				`${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`,
				time.getHours(),
				results[i].ranking,
			],
		);
	}

	// 计算原木力变化
	const rates = await query(
		'SELECT novel_id,(ranking-rank_last)/rank_last*10000 AS incRate FROM novels WHERE rank_last != 0 ORDER BY incRate ASC LIMIT 100',
	);

	// 原木力飙升
	// 移除旧的原木力飙升排行
	await query('DELETE FROM library_recommend WHERE title = \'原木力飙升\'');
	// 计算新的原木力飙升排行
	for (const item of rates) {
		console.log(`[${startTime.toLocaleString()}] ${item.incRate}`);
		await query(
			'INSERT INTO library_recommend(novel_id,title,ranking) VALUES(?,?,?)',
			[item.novel_id, '原木力飙升', item.incRate],
		);
	}

	const endTime = new Date();
	console.log(
		`[${endTime.toLocaleString()}] 原木力已更新 (${
			endTime.getMilliseconds() - startTime.getMilliseconds()
		})`,
	);
}

// 不要在服务器启动的时候自动更新原木力！
// updateBestWelcomedNovels();

//自动更新完本经典作品
async function updateBestCompletedNovels() {
	await query('DELETE FROM library_recommend WHERE title = \'完本经典\'');
	let results = await query(
		'SELECT novel_id FROM novels WHERE is_personal = 0 AND deleted = 0 AND is_complete = 1 ORDER BY clicks DESC LIMIT 0,100',
	);
	results.reverse();
	for (let item of results) {
		await query('INSERT INTO library_recommend(novel_id,title) VALUES(?,?)', [
			item.novel_id,
			'完本经典',
		]);
	}
}

//每6小时的15分钟触发，更新原木力爆棚作品
schedule.scheduleJob(
	'0 15 */6 * * *',
	updateBestWelcomedNovels,
);
//每小时的45分钟触发，更新完本经典作品
schedule.scheduleJob(
	'0 45 * * * *',
	updateBestCompletedNovels,
);

async function updateNovelCraftNovels(){
	await query('DELETE FROM library_recommend WHERE title = "干草块杯活动专辑"');
	await query(
		`INSERT INTO library_recommend(novel_id,title) 
        (SELECT nt.novel_id,"干草块杯活动专辑"
        FROM novel_tag nt,novels n 
        WHERE tag_id = 162 
        AND nt.novel_id = n.novel_id 
        AND n.deleted = 0 
        AND n.is_personal = 0 
        ORDER BY n.ranking)`,
	);
}

//每小时的30分钟触发，更新干草块杯活动作品
schedule.scheduleJob(
	'0 30 * * * *',
	updateNovelCraftNovels,
);