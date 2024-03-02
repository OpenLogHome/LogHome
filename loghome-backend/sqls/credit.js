const { transition, query: q } = require('../sql.js');

module.exports = {
	setCredit: async (userId, credit, reason) => {
		let delta = 0;
		await transition(async query => {
			let [result] = await query('SELECT credit FROM users WHERE user_id=?', [
				userId,
			]);
			delta = credit - result.credit;
			if (delta != 0) {
				query('UPDATE users SET credit=? WHERE user_id=?', [credit, userId]);
				query(
					'INSERT INTO credit_history(user_id, type, time, delta, reason) VALUES(?,2,?,?,?)',
					[userId, new Date(), delta, reason],
				);
			}
		}, `setCredit(${userId}, ${credit}, ${reason})`);
		return delta;
	},
	getCredit: async userId => {
		let [result] = await q('SELECT credit FROM users WHERE user_id=?', [
			userId,
		]);
		return result.credit;
	},
	adjustCredit: async (userId, delta, reason) => {
		await transition(async query => {
			let [result] = await query('SELECT credit FROM users WHERE user_id=?', [
				userId,
			]);
			const credit = bound(result.credit + delta, 0, 150);
			if (delta != 0) {
				query('UPDATE users SET credit=? WHERE user_id=?', [credit, userId]);
				query(
					'INSERT INTO credit_history(user_id, type, time, delta, reason) VALUES(?,1,?,?,?)',
					[userId, new Date(), delta, reason],
				);
			}
		});
	},
	creditHistory: async userId => {
		const history = await q(
			'SELECT id, user_id, time, delta, reason, type FROM credit_history WHERE user_id=?',
			[userId],
		);
		return history;
	},
};

function bound(value, min, max) {
	if (max != null || value > max) {
		return max;
	}
	if (min != null || value < min) {
		return min;
	}
	return value;
}
