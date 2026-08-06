const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../config.js');

function normalizeCode(value) {
	return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function hashCode(value) {
	return crypto.createHash('sha256').update(normalizeCode(value)).digest('hex');
}

function createCode() {
	const token = crypto.randomBytes(9).toString('hex').toUpperCase();
	return `LOGPASS-${token.slice(0, 6)}-${token.slice(6, 12)}-${token.slice(12, 18)}`;
}

function hintCode(value) {
	const normalized = normalizeCode(value);
	return `${normalized.slice(0, 7)}…${normalized.slice(-4)}`;
}

const membershipType = String(process.argv[2] || '').toLowerCase();
const durationDays = Number(process.argv[3]);
const count = Math.max(1, Math.min(100, Number(process.argv[4]) || 1));
const rawExpiresAt = process.argv[5];
const expiresAt = rawExpiresAt && String(rawExpiresAt).toLowerCase() !== 'null' ? rawExpiresAt : null;
const remark = process.argv.slice(6).join(' ').slice(0, 255) || null;

if (!['standard', 'super'].includes(membershipType) || !Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 3650) {
	console.error('用法: node scripts/create_membership_redeem_codes.js <standard|super> <有效天数> [数量] [失效时间或null] [备注]');
	process.exit(1);
}

const connection = mysql.createConnection({
	...config.database,
	charset: 'utf8mb4',
	timezone: '+08:00',
});

function query(sql, values = []) {
	return new Promise((resolve, reject) => {
		connection.query(sql, values, (error, rows) => (error ? reject(error) : resolve(rows)));
	});
}

async function main() {
	await new Promise((resolve, reject) => connection.connect((error) => (error ? reject(error) : resolve())));
	const codes = [];
	for (let index = 0; index < count; index += 1) {
		const code = createCode();
		await query(
			`INSERT INTO membership_redeem_codes
			 (code_hash, code_hint, membership_type, duration_days, usage_limit, expires_at, remark)
			 VALUES (?, ?, ?, ?, 1, ?, ?)`,
			[hashCode(code), hintCode(code), membershipType, durationDays, expiresAt, remark],
		);
		codes.push(code);
	}
	console.log(codes.join('\n'));
}

main()
	.catch((error) => {
		console.error('生成会员兑换码失败:', error.message);
		process.exitCode = 1;
	})
	.finally(() => connection.end());
