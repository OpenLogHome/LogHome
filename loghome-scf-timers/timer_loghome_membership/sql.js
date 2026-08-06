const mysql = require('mysql');

function loadDatabaseConfig() {
  if (process.env.MEMBERSHIP_DB_CONFIG) {
    return JSON.parse(process.env.MEMBERSHIP_DB_CONFIG);
  }
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
    };
  }
  try {
    return require('./config.js').database;
  } catch (error) {
    throw new Error('缺少数据库配置：请设置 DB_HOST/DB_USER/DB_PASSWORD/DB_NAME，或提供 config.js');
  }
}

const databaseConfig = loadDatabaseConfig();

const pool = mysql.createPool({
  ...databaseConfig,
  timezone: '+08:00',
  charset: 'utf8mb4',
  connectionLimit: 4,
});

function runQuery(connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
}

async function query(sql, values = []) {
  const connection = await getConnection();
  try {
    return await runQuery(connection, sql, values);
  } finally {
    connection.release();
  }
}

async function withTransaction(work) {
  const connection = await getConnection();
  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((error) => (error ? reject(error) : resolve()));
    });
    const transactionalQuery = (sql, values = []) => runQuery(connection, sql, values);
    const result = await work(transactionalQuery);
    await new Promise((resolve, reject) => {
      connection.commit((error) => (error ? reject(error) : resolve()));
    });
    return result;
  } catch (error) {
    await new Promise((resolve) => connection.rollback(() => resolve()));
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  query,
  withTransaction,
};
