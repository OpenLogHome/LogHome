const crypto = require('crypto');

const TTS_BASE_URL = 'https://tts.codesocean.top';
const FREE_VOICES = [
	{ id: 'warm-gentleman', name: '温润君子' },
	{ id: 'sunny-boy', name: '阳光少年' },
	{ id: 'youthful-goddess', name: '青春女神' },
	{ id: 'soft-girl', name: '软糯萝莉' },
];
const SCHEMA = `CREATE TABLE IF NOT EXISTS user_tts_tokens (
 user_id BIGINT NOT NULL PRIMARY KEY,
 key_id BIGINT NULL,
 encrypted_token TEXT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

function createTtsService({ database, http, config }) {
	let schemaReady;
	function ensureSchema() {
		if (!schemaReady) schemaReady = database.query(SCHEMA).catch((error) => {
			schemaReady = null;
			throw error;
		});
		return schemaReady;
	}
	function encryptionKey() {
		if (!config.ttsAdminKey || !String(config.ttsAdminKey).trim()) throw new Error('TTS_NOT_CONFIGURED');
		return crypto.createHash('sha256').update(String(config.ttsTokenEncryptionKey || config.ttsAdminKey)).digest();
	}
	function encrypt(token, userId) {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
		cipher.setAAD(Buffer.from(String(userId)));
		const data = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
		return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64');
	}
	function decrypt(value, userId) {
		const data = Buffer.from(value, 'base64');
		const cipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), data.subarray(0, 12));
		cipher.setAAD(Buffer.from(String(userId)));
		cipher.setAuthTag(data.subarray(12, 28));
		return Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]).toString('utf8');
	}
	const adminOptions = () => ({ headers: { 'X-Admin-Key': config.ttsAdminKey }, timeout: 15000 });
	const getVoices = (token) => http.get(`${TTS_BASE_URL}/v1/voices`, {
		headers: { Authorization: `Bearer ${token}` }, timeout: 15000,
	});

	async function getSession(userId) {
		if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error('INVALID_USER');
		encryptionKey();
		await ensureSchema();
		let createdKeyId;
		let result;
		try {
			result = await database.withTransaction(async (query) => {
				// The database lock also serializes requests across backend processes.
				await query('INSERT INTO user_tts_tokens (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)', [userId]);
				const [row] = await query('SELECT * FROM user_tts_tokens WHERE user_id = ? FOR UPDATE', [userId]);
				let token = row.encrypted_token ? decrypt(row.encrypted_token, userId) : null;
				let catalog;
				if (token) {
					try {
						catalog = await getVoices(token);
					} catch (error) {
						// Only an explicitly invalid/revoked user key triggers replacement.
						if (!error.response || error.response.status !== 401) throw error;
						token = null;
					}
				}
				if (!token) {
					const response = await http.post(`${TTS_BASE_URL}/admin/keys`, {
						name: `loghome-user-${userId}`, note: `LogHome user_id=${userId}`,
					}, adminOptions());
					createdKeyId = response.data.id;
					token = response.data.key;
					if (!createdKeyId || typeof token !== 'string' || !token.startsWith('sk-tts-')) throw new Error('INVALID_TTS_KEY_RESPONSE');
					await query('UPDATE user_tts_tokens SET key_id = ?, encrypted_token = ? WHERE user_id = ?', [
						createdKeyId, encrypt(token, userId), userId,
					]);
				}
				return { token, catalog };
			}, 'tts-user-token');
		} catch (error) {
			// A key whose transaction failed must never remain usable without an owner.
			if (createdKeyId) {
				await http.post(`${TTS_BASE_URL}/admin/keys/${createdKeyId}/revoke`, {}, adminOptions()).catch(() => {});
			}
			throw error;
		}
		const catalog = result.catalog || await getVoices(result.token);
		const voices = FREE_VOICES.map((voice) => {
			const matches = (catalog.data.data || []).filter((item) => item.name === voice.name);
			if (matches.length !== 1 || !matches[0].id) throw new Error('TTS_VOICE_UNAVAILABLE');
			return { ...voice, voice_id: matches[0].id, free: true };
		});
		return { user_id: userId, token: result.token, base_url: TTS_BASE_URL, voices };
	}
	return { getSession, ensureSchema };
}

module.exports = { createTtsService, FREE_VOICES, TTS_BASE_URL };
