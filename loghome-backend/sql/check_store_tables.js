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

async function checkStoreTables() {
  try {
    console.log('=== 检查现有积分商城相关表 ===');
    
    const storeTables = [
      'store_cart',
      'store_categories', 
      'store_order_items',
      'store_user_addresses'
    ];
    
    for (const tableName of storeTables) {
      console.log(`\n表名: ${tableName}`);
      try {
        const desc = await query(`DESCRIBE ${tableName}`);
        desc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
        
        const count = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  数据行数: ${count[0].count}`);
      } catch (error) {
        console.log(`  表不存在或查询失败: ${error.message}`);
      }
    }
    
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

checkStoreTables();
