const { query } = require('../sql');

async function migrate() {
	await query(`CREATE TABLE IF NOT EXISTS store_product_variants (
		id INT AUTO_INCREMENT PRIMARY KEY,
		product_id INT NOT NULL,
		label VARCHAR(255) NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		stock INT NOT NULL DEFAULT 0,
		cover_url VARCHAR(500) NULL,
		status ENUM('on','off') NOT NULL DEFAULT 'on',
		deleted TINYINT(1) NOT NULL DEFAULT 0,
		source_metadata TEXT NULL,
		source_key VARCHAR(64) NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_variant_product (product_id),
		UNIQUE INDEX uq_variant_source (source_key),
		FOREIGN KEY (product_id) REFERENCES store_products(id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	for (const [table, fields] of [
		['store_product_variants', [['deleted', 'TINYINT(1) NOT NULL DEFAULT 0']]],
		['store_products', [['has_variants', 'TINYINT(1) NOT NULL DEFAULT 0']]],
		['store_orders', [['variant_id', 'INT NULL'], ['variant_label', 'VARCHAR(255) NULL'], ['source_snapshot', 'TEXT NULL']]],
		['store_order_requests', [['variant_id', 'INT NULL']]],
	]) {
		const columns = new Set((await query(`SHOW COLUMNS FROM ${table}`)).map(row => row.Field));
		for (const [name, type] of fields) if (!columns.has(name)) await query(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
	}
}
if (require.main === module) migrate().then(() => { console.log('商城多规格字段已就绪'); process.exit(0); }).catch(() => { console.error('多规格迁移失败，请检查数据库连接和表结构'); process.exit(1); });
module.exports = migrate;
