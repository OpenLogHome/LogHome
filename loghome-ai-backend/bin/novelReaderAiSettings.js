const { query } = require('../sql');

async function assertNovelReaderAiAllowed(novelId) {
	const id = Number(novelId);
	if (!Number.isSafeInteger(id) || id <= 0) {
		const error = new Error('作品 ID 无效');
		error.statusCode = 400;
		throw error;
	}
	const novels = await query(
		'SELECT novel_id FROM novels WHERE novel_id = ? AND deleted = 0 AND is_personal = 0 LIMIT 1',
		[id],
	);
	if (!novels.length) {
		const error = new Error('作品不存在或未公开');
		error.statusCode = 404;
		throw error;
	}
	const rows = await query(
		'SELECT disable_reader_ai FROM novel_reader_ai_settings WHERE novel_id = ?',
		[id],
	);
	if (rows[0] && Number(rows[0].disable_reader_ai) === 1) {
		const error = new Error('作者已关闭本作品的原木娘提问功能');
		error.statusCode = 403;
		error.code = 'READER_AI_DISABLED';
		throw error;
	}
}

module.exports = { assertNovelReaderAiAllowed };
