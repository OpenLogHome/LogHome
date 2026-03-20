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

async function showTableStructure() {
  try {
    console.log('=== store_products 表结构 ===');
    const productsDesc = await query('DESCRIBE store_products');
    console.log(JSON.stringify(productsDesc, null, 2));
    
    console.log('\n=== store_orders 表结构 ===');
    const ordersDesc = await query('DESCRIBE store_orders');
    console.log(JSON.stringify(ordersDesc, null, 2));
    
    console.log('\n=== store_addresses 表结构 ===');
    const addressesDesc = await query('DESCRIBE store_addresses');
    console.log(JSON.stringify(addressesDesc, null, 2));
    
  } catch (error) {
    console.error('查询失败:', error.message);
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

showTableStructure();
