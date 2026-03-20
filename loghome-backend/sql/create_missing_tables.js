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

async function createMissingTables() {
  try {
    console.log('=== 创建缺失的表 ===');
    
    await query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✓ 已禁用外键检查');
    
    const productsSQL = "CREATE TABLE IF NOT EXISTS store_products (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, summary TEXT, description TEXT, type ENUM('virtual', 'physical') NOT NULL DEFAULT 'virtual', price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, stock INT NOT NULL DEFAULT 0, cover_url VARCHAR(500), media_urls TEXT, shipping_desc VARCHAR(255), status ENUM('on', 'off') NOT NULL DEFAULT 'on', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_type (type), INDEX idx_status (status), INDEX idx_created_at (created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    console.log('正在创建 store_products 表...');
    await query(productsSQL);
    console.log('✓ store_products 表创建成功');
    
    const ordersSQL = "CREATE TABLE IF NOT EXISTS store_orders (id INT AUTO_INCREMENT PRIMARY KEY, order_no VARCHAR(50) NOT NULL UNIQUE, user_id INT NOT NULL, product_id INT NOT NULL, product_title VARCHAR(255) NOT NULL, product_type ENUM('virtual', 'physical') NOT NULL, price DECIMAL(10, 2) NOT NULL, status ENUM('pending', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', pay_log TEXT, pay_cropped_log TEXT, tracking_number VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, shipped_at TIMESTAMP NULL, completed_at TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_user_id (user_id), INDEX idx_product_id (product_id), INDEX idx_status (status), INDEX idx_created_at (created_at), INDEX idx_order_no (order_no)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    console.log('正在创建 store_orders 表...');
    await query(ordersSQL);
    console.log('✓ store_orders 表创建成功');
    
    await query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ 已启用外键检查');
    
    console.log('\n=== 验证表结构 ===');
    
    const productsDesc = await query('DESCRIBE store_products');
    console.log('\nstore_products 表字段:');
    productsDesc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
    
    const ordersDesc = await query('DESCRIBE store_orders');
    console.log('\nstore_orders 表字段:');
    ordersDesc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
    
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

createMissingTables();
