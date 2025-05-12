// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const sysLog = require('./log.js')

async function novel_clicked(novel_id, article_id, req_ip) {
	//机制：60秒内不允许刷新相同章节的阅读量
	let result = await query(
		'SELECT * FROM `log` WHERE operation = "READ_ARTICLE" AND req_ip = ? AND content = ? AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(`time`) < 60 ORDER BY `time` DESC',
		[req_ip, article_id],
	);
	// console.log(JSON.parse(JSON.stringify(result)))
	if (JSON.parse(JSON.stringify(result)).length == 0)
		query('UPDATE novels SET clicks = clicks + 1 WHERE novel_id = ?', [
			novel_id,
		]);
}

async function update_logpower(novel_id) {
	//获取小说原木力
	//近期是否更新过
	let updated=await query(
		`SELECT * FROM \`log\` WHERE operation = 'CHECK_RANK' AND content = ? AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(time) < 300`,
		[novel_id]
	)
	//如果5分钟内更新过就跳过计算
	if(updated.length===0)
	{
		let result=await query(
			`SELECT ROUND(
				(
					clicks * 8 + (
						SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id
					)*12 + (
						SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id
					)*200 + (
						SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id AND deleted = 0
					)*20 + (
						SELECT IFNULL(
							SUM(item_amount*item_cost),0
						) FROM tipping WHERE novel_id = n.novel_id
					)*10
				) * IF(
					(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2) > 0.4,
					(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2),
					0.4
				) * IF(
					(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.07 * 0.05) > 0.6,
					(1 + (DATEDIFF(n.update_time,CURRENT_TIMESTAMP)) * 0.07 * 0.05),
					0.6
				)
			) ranking FROM novels n WHERE novel_id = ?`,
			[novel_id]
		);
		novel_power=result[0].ranking;
		await query(
			`UPDATE novels SET ranking = ? WHERE novel_id = ?`,
			[novel_power, novel_id]
		);
		sysLog("CHECK_RANK", "-1", "0", novel_id.toString());
		return novel_power;
	}
	else
	{
		let result=await query(
			`SELECT ranking FROM novels WHERE novel_id=?`,
			[novel_id]
		);
		return result[0].ranking;
	}
}

async function push_to_newly_modified(novel_id) {
	await query(
		'DELETE FROM library_recommend WHERE title = \'最近更新\' AND novel_id = ?',
		[novel_id],
	);
	await query(
		'INSERT INTO novel_updates (novel_id, time) VALUES (?, CURRENT_TIMESTAMP)',
		[novel_id]
	);
	await query('INSERT INTO library_recommend(novel_id,title) VALUES(?,?)', [
		novel_id,
		'最近更新',
	]);
}

let statistics = {
	novel_clicked,
	push_to_newly_modified,
	update_logpower,
};

module.exports = statistics;
