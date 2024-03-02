// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

async function sendMsg(from_id, to_id, content, router, ignoreRepeat) {
	let result = await query(
		'SELECT * FROM user_message WHERE from_id = ? AND to_id = ? AND message_content = ? AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(`time`) < 3600',
		[from_id, to_id, content],
	);
	result = JSON.parse(JSON.stringify(result));
	if ((result.length == 0 && !ignoreRepeat) || ignoreRepeat) {
		await query(
			'INSERT INTO user_message(from_id,to_id,message_content,router) VALUES(?,?,?,?)',
			[from_id, to_id, content, router],
		);
	}
}

async function sendMail(from_id, to_id, content, router, ignoreRepeat) {
	let result = await query(
		'SELECT * FROM user_message WHERE from_id = ? AND to_id = ? AND message_content = ? AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(`time`) < 3600',
		[from_id, to_id, content],
	);
	result = JSON.parse(JSON.stringify(result));
	if ((result.length == 0 && !ignoreRepeat) || ignoreRepeat) {
		let result = await query(
			'INSERT INTO user_message(from_id,to_id,message_content,router) VALUES(?,?,?,?)',
			[from_id, to_id, content, ''],
		);
		console.log(result);
		await query('UPDATE user_message SET router = ? WHERE message_id = ?', [
			'community/read_mail?id=' + result.insertId,
			result.insertId,
		]);
	}
}

module.exports = {
	sendMsg,
	sendMail,
};
