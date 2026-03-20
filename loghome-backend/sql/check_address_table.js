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

async function checkAddressTable() {
  try {
    console.log('=== 检查地址表 ===');
    
    const userAddressesDesc = await query('DESCRIBE store_user_addresses');
    console.log('\nstore_user_addresses 表字段:');
    userAddressesDesc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
    
    const count = await query('SELECT COUNT(*) as count FROM store_user_addresses');
    console.log(`  数据行数: ${count[0].count}`);
    
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

checkAddressTable();
