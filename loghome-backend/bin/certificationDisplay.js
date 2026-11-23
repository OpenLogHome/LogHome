const fs = require('fs');
const path = require('path');
const { query } = require('../sql.js');

let schemaReady;
async function ensureSchema() {
	if (!schemaReady) {
		schemaReady = (async () => {
			try {
				await query('SELECT user_id FROM user_certification_display LIMIT 1');
			} catch (error) {
				if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
				await query(fs.readFileSync(path.join(__dirname, '../sql/certification_display.sql'), 'utf8'));
			}
		})();
	}
	try { await schemaReady; } catch (error) { schemaReady = null; throw error; }
}

async function getDisplayIndex(userId) {
	await ensureSchema();
	const rows = await query('SELECT cert_index FROM user_certification_display WHERE user_id = ?', [userId]);
	return rows.length ? Number(rows[0].cert_index) : 0;
}

async function setDisplayIndex(userId, index) {
	await ensureSchema();
	await query(
		`INSERT INTO user_certification_display (user_id, cert_index) VALUES (?, ?)
		ON DUPLICATE KEY UPDATE cert_index = VALUES(cert_index)`,
		[userId, index],
	);
	return index;
}

module.exports = { getDisplayIndex, setDisplayIndex };
