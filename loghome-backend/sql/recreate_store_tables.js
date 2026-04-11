const mysql = require('mysql');
const config = require('../config.js');

const connection = mysql.createConnection({
	host: config.database.host,
	port: config.database.port,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
});

connection.connect((err) => {
	if (err) {
		console.error('数据库连接失败:', err.message);
		throw err;
	}
	console.log('数据库连接成功\n');
});

async function recreateTables() {
	try {
		console.log('=== 删除旧表 ===');

		await query('SET FOREIGN_KEY_CHECKS = 0');
		console.log('✓ 已禁用外键检查');

		await query('DROP TABLE IF EXISTS store_order_requests');
		console.log('✓ store_order_requests 表已删除');

		await query('DROP TABLE IF EXISTS store_orders');
		console.log('✓ store_orders 表已删除');

		await query('DROP TABLE IF EXISTS store_products');
		console.log('✓ store_products 表已删除');

		await query('DROP TABLE IF EXISTS store_addresses');
		console.log('✓ store_addresses 表已删除');

		await query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('✓ 已启用外键检查');

		console.log('\n=== 创建新表 ===');

		const productsSQL = "CREATE TABLE store_products (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, summary TEXT, description TEXT, type ENUM('virtual', 'physical') NOT NULL DEFAULT 'virtual', price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, stock INT NOT NULL DEFAULT 0, cover_url VARCHAR(500), media_urls TEXT, shipping_desc VARCHAR(255), status ENUM('on', 'off') NOT NULL DEFAULT 'on', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_type (type), INDEX idx_status (status), INDEX idx_created_at (created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
		const ordersSQL = "CREATE TABLE store_orders (id INT AUTO_INCREMENT PRIMARY KEY, order_no VARCHAR(50) NOT NULL UNIQUE, user_id INT NOT NULL, product_id INT NOT NULL, product_title VARCHAR(255) NOT NULL, product_cover VARCHAR(500), product_type ENUM('virtual', 'physical') NOT NULL, price DECIMAL(10, 2) NOT NULL, pay_log DECIMAL(10, 2) NOT NULL DEFAULT 0.00, pay_cropped_log DECIMAL(10, 2) NOT NULL DEFAULT 0.00, shipping_desc VARCHAR(255), status ENUM('pending', 'shipped', 'completed', 'canceled') NOT NULL DEFAULT 'pending', address_id INT NULL, receiver_name VARCHAR(100), receiver_phone VARCHAR(20), receiver_province VARCHAR(50), receiver_city VARCHAR(50), receiver_district VARCHAR(50), receiver_detail VARCHAR(255), tracking_number VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, shipped_at TIMESTAMP NULL, completed_at TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_user_id (user_id), INDEX idx_product_id (product_id), INDEX idx_status (status), INDEX idx_created_at (created_at), INDEX idx_order_no (order_no)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
		const addressesSQL = "CREATE TABLE store_addresses (address_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, receiver_name VARCHAR(100) NOT NULL, receiver_phone VARCHAR(20) NOT NULL, province VARCHAR(50), city VARCHAR(50), district VARCHAR(50), detail VARCHAR(255) NOT NULL, is_default TINYINT(1) DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_user_id (user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
		const orderRequestsSQL = "CREATE TABLE store_order_requests (request_key VARCHAR(64) NOT NULL PRIMARY KEY, user_id INT NOT NULL, product_id INT NOT NULL, address_id INT NULL, order_id INT NULL, status ENUM('processing', 'succeeded') NOT NULL DEFAULT 'processing', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_user_created_at (user_id, created_at), INDEX idx_order_id (order_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

		console.log('正在创建 store_products 表...');
		await query(productsSQL);
		console.log('✓ store_products 表创建成功');

		console.log('正在创建 store_orders 表...');
		await query(ordersSQL);
		console.log('✓ store_orders 表创建成功');

		console.log('正在创建 store_addresses 表...');
		await query(addressesSQL);
		console.log('✓ store_addresses 表创建成功');

		console.log('正在创建 store_order_requests 表...');
		await query(orderRequestsSQL);
		console.log('✓ store_order_requests 表创建成功');

		console.log('\n=== 验证表结构 ===');

		const productsDesc = await query('DESCRIBE store_products');
		console.log('\nstore_products 表字段:');
		productsDesc.forEach((row) => console.log(`  - ${row.Field}: ${row.Type}`));

		const ordersDesc = await query('DESCRIBE store_orders');
		console.log('\nstore_orders 表字段:');
		ordersDesc.forEach((row) => console.log(`  - ${row.Field}: ${row.Type}`));

		const addressesDesc = await query('DESCRIBE store_addresses');
		console.log('\nstore_addresses 表字段:');
		addressesDesc.forEach((row) => console.log(`  - ${row.Field}: ${row.Type}`));

		const orderRequestsDesc = await query('DESCRIBE store_order_requests');
		console.log('\nstore_order_requests 表字段:');
		orderRequestsDesc.forEach((row) => console.log(`  - ${row.Field}: ${row.Type}`));
	} catch (error) {
		console.error('✗ 操作失败:', error.message);
		console.error('错误详情:', error);
		throw error;
	} finally {
		connection.end();
	}
}

function query(sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});
}

recreateTables();
