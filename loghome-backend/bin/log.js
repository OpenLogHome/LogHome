// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

function sysLog(operation, user_id, req_ip, content) {
	query('INSERT INTO log(operation,user_id,req_ip,content) VALUES(?,?,?,?)', [
		operation,
		user_id,
		req_ip,
		content,
	]);
}

module.exports = sysLog;
