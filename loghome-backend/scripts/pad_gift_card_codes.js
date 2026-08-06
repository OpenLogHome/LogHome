// 将 log_gift_card 中不足 16 位的卡密补齐到 16 位（一次性数据修复脚本）
const { query } = require('../sql.js');

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TARGET_LENGTH = 16;

function randomChars(count) {
	let result = '';
	for (let i = 0; i < count; i += 1) {
		result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}
	return result;
}

async function main() {
	const shortRows = await query(
		'SELECT gift_card_id, card_code FROM log_gift_card WHERE CHAR_LENGTH(card_code) < ?',
		[TARGET_LENGTH],
	);
	const allCodes = await query('SELECT card_code FROM log_gift_card');
	const existing = new Set(allCodes.map((row) => row.card_code));

	let padded = 0;
	for (const row of shortRows) {
		const current = String(row.card_code);
		const need = TARGET_LENGTH - current.length;
		let newCode = current;
		while (existing.has(newCode)) {
			newCode = current + randomChars(need);
		}
		existing.add(newCode);
		await query('UPDATE log_gift_card SET card_code = ? WHERE gift_card_id = ?', [newCode, row.gift_card_id]);
		padded += 1;
		console.log(`#${row.gift_card_id}: ${current} -> ${newCode}`);
	}
	console.log(`已补齐 ${padded} 张礼品卡`);
	process.exit(0);
}

main().catch((error) => {
	console.error('补齐礼品卡卡密失败:', error.message);
	process.exit(1);
});
