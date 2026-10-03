const { query } = require('../sql');
async function migrate() {
	const tables = await query(
		"SELECT TABLE_NAME AS name, ENGINE AS engine FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('store_orders','user_message')",
	);
	if (tables.length !== 2 || tables.some(row => row.engine !== 'InnoDB'))
		throw new Error('订单和消息表必须使用 InnoDB 才能保证发货通知事务');
	const columns = new Set(
		(await query('SHOW COLUMNS FROM store_orders')).map(row => row.Field),
	);
	for (const [name, type] of [
		['shipping_company', 'VARCHAR(60) NULL'],
		['shipping_company_code', 'VARCHAR(40) NULL'],
	]) {
		if (!columns.has(name))
			await query(`ALTER TABLE store_orders ADD COLUMN ${name} ${type}`);
	}
	await query(`CREATE TABLE IF NOT EXISTS store_logistics_cache (
  order_id INT NOT NULL PRIMARY KEY,
  tracking_key VARCHAR(64) NOT NULL DEFAULT '',
  payload MEDIUMTEXT NULL,
  checked_at DATETIME NULL,
  next_query_at DATETIME NULL,
  UNIQUE KEY uq_store_tracking_key (tracking_key)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	const indexes = await query('SHOW INDEX FROM store_logistics_cache');
	if (!indexes.some(row => row.Key_name === 'uq_store_tracking_key'))
		await query(
			'ALTER TABLE store_logistics_cache ADD UNIQUE KEY uq_store_tracking_key (tracking_key)',
		);
}
if (require.main === module)
	migrate()
		.then(() => {
			console.log('商城物流字段已就绪');
			process.exit(0);
		})
		.catch(() => {
			console.error('商城物流迁移失败，请检查数据库连接和表结构');
			process.exit(1);
		});
module.exports = migrate;
