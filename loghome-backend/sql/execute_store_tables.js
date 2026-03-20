const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const config = require('../config.js');

function executeSQLFile() {
  const connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err) {
      console.error('数据库连接失败:', err.message);
      throw err;
    }
    console.log('数据库连接成功');
  });

  try {
    const sqlPath = path.join(__dirname, 'create_store_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('执行SQL文件:', sqlPath);
    
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('✗ 执行SQL失败:', error.message);
        throw error;
      }
      
      console.log('✓ 数据库表创建成功！');
      
      connection.query('SHOW TABLES LIKE "store_products"', (err, products) => {
        if (err) throw err;
        console.log('store_products 表存在:', products.length > 0);
        
        connection.query('SHOW TABLES LIKE "store_orders"', (err, orders) => {
          if (err) throw err;
          console.log('store_orders 表存在:', orders.length > 0);
          
          connection.end();
        });
      });
    });
    
  } catch (error) {
    console.error('✗ 执行SQL失败:', error.message);
    connection.end();
    throw error;
  }
}

executeSQLFile();
