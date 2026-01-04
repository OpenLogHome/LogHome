let { query } = require('./sql.js');


async function updateBestCompletedNovels() {
	await query('DELETE FROM library_recommend WHERE title = \'完本经典\'');
	let results = await query(
		'SELECT novel_id FROM novels WHERE is_personal = 0 AND deleted = 0 AND is_complete = 1 ORDER BY clicks DESC LIMIT 0,100',
	);
	results.reverse();
	for (let item of results) {
		await query('INSERT INTO library_recommend(novel_id,title) VALUES(?,?)', [
			item.novel_id,
			'完本经典',
		]);
	}
}

async function updateBestWelcomedNovels() {
	// 计算原木力变化
	const rates = await query(
		'SELECT n.novel_id FROM novels n, library_recommend_new r WHERE n.novel_id = r.novel_id ORDER BY r.last_update DESC LIMIT 100',
	);

	// 原木力飙升
	// 移除旧的原木力飙升排行
	await query('DELETE FROM library_recommend WHERE title = \'原木力飙升\'');
	// 计算新的原木力飙升排行
	let i = 0;
	for (const item of rates) {
		await query(
			'INSERT INTO library_recommend(novel_id,title,ranking) VALUES(?,?,?)',
			[item.novel_id, '原木力飙升', i],
		);
		i --;
	}
}

exports.main_handler = async (event, context, callback) => {
    await updateBestCompletedNovels();
	await updateBestWelcomedNovels();
    console.log("数据更新操作执行成功。")
    event.result="success";
    return event
};