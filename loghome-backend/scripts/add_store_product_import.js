// Run once before deploying the management UI. Safe to run again.
const { query } = require('../sql');

async function migrate() {
	const columns = await query('SHOW COLUMNS FROM store_products');
	const names = new Set(columns.map(row => row.Field));
	for (const [name, definition] of [
		['category', 'VARCHAR(80) NULL'],
		['source_metadata', 'TEXT NULL'],
		['source_key', 'VARCHAR(64) NULL'],
	]) {
		if (!names.has(name)) await query(`ALTER TABLE store_products ADD COLUMN ${name} ${definition}`);
	}
	const indexes = await query('SHOW INDEX FROM store_products');
	if (!indexes.some(row => row.Key_name === 'uq_store_source_key')) {
		await query('ALTER TABLE store_products ADD UNIQUE INDEX uq_store_source_key (source_key)');
	}
}

if (require.main === module) migrate().then(() => {
	console.log('商城商品导入字段已就绪');
	process.exit(0);
}).catch(() => {
	console.error('商城商品迁移失败，请检查数据库连接、表结构和ALTER权限');
	process.exit(1);
});

module.exports = migrate;
