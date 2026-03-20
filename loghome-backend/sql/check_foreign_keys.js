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

async function checkForeignKeys() {
  try {
    console.log('=== 检查外键约束 ===');
    
    const foreignKeys = await query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        REFERENCED_TABLE_SCHEMA = ? AND
        REFERENCED_TABLE_NAME IS NOT NULL
    `, [config.database.database]);
    
    console.log('外键约束:');
    foreignKeys.forEach(fk => {
      console.log(`  ${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
    });
    
    if (foreignKeys.length === 0) {
      console.log('  没有找到外键约束');
    }
    
  } catch (error) {
    console.error('✗ 操作失败:', error.message);
    console.error('错误详情:', error);
    throw error;
  } finally {
    connection.end();
  }
}

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

checkForeignKeys();
