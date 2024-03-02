// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

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

async function push_to_newly_modified(novel_id) {
	await query(
		'DELETE FROM library_recommend WHERE title = \'最近更新\' AND novel_id = ?',
		[novel_id],
	);
	await query('INSERT INTO library_recommend(novel_id,title) VALUES(?,?)', [
		novel_id,
		'最近更新',
	]);
}

let statistics = {
	novel_clicked,
	push_to_newly_modified,
};

module.exports = statistics;
