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

async function checkTables() {
  try {
    console.log('=== 检查现有表 ===');
    
    const tables = await query('SHOW TABLES');
    console.log('现有表:', tables);
    
    console.log('\n=== 检查表结构 ===');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n表名: ${tableName}`);
      const desc = await query(`DESCRIBE ${tableName}`);
      desc.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
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

checkTables();
