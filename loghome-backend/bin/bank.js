// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

let item_names = ['log', 'apple', 'cropped_log'];

let checkAccount = async function (user) {
	let results = await query('SELECT * FROM user_bank WHERE user_id = ?', [
		user.user_id,
	]);
	if (results.length > 0) {
		return;
	} else {
		await query('INSERT INTO user_bank(user_id) VALUES(?)', [user.user_id]);
	}
};

let getAmount = async function (user, item_name) {
	await checkAccount(user);
	if (item_names.includes(item_name)) {
		let result = await query(
			'SELECT ' + item_name + ' result FROM user_bank WHERE user_id = ?',
			[user.user_id],
		);
		return result[0];
	} else {
		return 0;
	}
};

let addAmount = async function (user, item_name, amount) {
	await checkAccount(user);
	if (item_names.includes(item_name)) {
		let result = await query(
			'SELECT ' + item_name + ' result FROM user_bank WHERE user_id = ?',
			[user.user_id],
		);
		let curAmount = result[0].result;
		await query(
			'UPDATE user_bank SET ' + item_name + ' = ? WHERE user_id = ?',
			[curAmount + amount, user.user_id],
		);
		return true;
	} else {
		return false;
	}
};

let useAmount = async function (user, item_name, amount, allow_negative) {
	await checkAccount(user);
	if (item_names.includes(item_name)) {
		let result = await query(
			'SELECT ' + item_name + ' result FROM user_bank WHERE user_id = ?',
			[user.user_id],
		);
		let curAmount = result[0].result;
		if (!allow_negative && curAmount < amount) {
			return false;
		} else {
			await query(
				'UPDATE user_bank SET ' + item_name + ' = ? WHERE user_id = ?',
				[curAmount - amount, user.user_id],
			);
			return true;
		}
	} else {
		return false;
	}
};

module.exports = {
	checkAccount,
	getAmount,
	addAmount,
	useAmount,
};
