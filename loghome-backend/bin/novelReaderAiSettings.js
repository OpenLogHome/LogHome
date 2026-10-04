function validNovelId(value) {
	return /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function createNovelReaderAiSettingsService({ query } = {}) {
	const databaseQuery = query || ((...args) => require('../sql.js').query(...args));

	async function isDisabled(novelId) {
		if (!validNovelId(novelId)) throw new Error('作品 ID 无效');
		const rows = await databaseQuery(
			'SELECT disable_reader_ai FROM novel_reader_ai_settings WHERE novel_id = ?',
			[Number(novelId)],
		);
		return !!(rows[0] && Number(rows[0].disable_reader_ai) === 1);
	}

	async function setDisabled(novelId, value) {
		if (!validNovelId(novelId) || (value !== 0 && value !== 1)) {
			const error = new Error('作品设置参数无效');
			error.statusCode = 422;
			throw error;
		}
		await databaseQuery(
			`INSERT INTO novel_reader_ai_settings (novel_id, disable_reader_ai)
			VALUES (?, ?) ON DUPLICATE KEY UPDATE disable_reader_ai = VALUES(disable_reader_ai)`,
			[Number(novelId), value],
		);
		return { disable_reader_ai: value };
	}

	async function assertAllowed(novelId) {
		if (!validNovelId(novelId)) {
			const error = new Error('作品 ID 无效');
			error.statusCode = 400;
			throw error;
		}
		const rows = await databaseQuery(
			'SELECT novel_id FROM novels WHERE novel_id = ? AND deleted = 0 AND is_personal = 0 LIMIT 1',
			[Number(novelId)],
		);
		if (!rows.length) {
			const error = new Error('作品不存在或未公开');
			error.statusCode = 404;
			throw error;
		}
		if (await isDisabled(novelId)) {
			const error = new Error('作者已关闭本作品的原木娘提问功能');
			error.statusCode = 403;
			error.code = 'READER_AI_DISABLED';
			throw error;
		}
	}

	return { isDisabled, setDisabled, assertAllowed };
}

module.exports = { ...createNovelReaderAiSettingsService(), createNovelReaderAiSettingsService, validNovelId };
