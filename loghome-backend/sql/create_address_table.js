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

async function createAddressTable() {
  try {
    console.log('=== 创建地址表 ===');
    
    await query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✓ 已禁用外键检查');
    
    const addressesSQL = "CREATE TABLE IF NOT EXISTS store_addresses (address_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, receiver_name VARCHAR(100) NOT NULL, receiver_phone VARCHAR(20) NOT NULL, province VARCHAR(50), city VARCHAR(50), district VARCHAR(50), detail VARCHAR(255) NOT NULL, is_default TINYINT(1) DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_user_id (user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    console.log('正在创建 store_addresses 表...');
    await query(addressesSQL);
    console.log('✓ store_addresses 表创建成功');
    
    await query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ 已启用外键检查');
    
    console.log('\n=== 验证表结构 ===');
    
    const addressesDesc = await query('DESCRIBE store_addresses');
    console.log('\nstore_addresses 表字段:');
    addressesDesc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
    
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

createAddressTable();
