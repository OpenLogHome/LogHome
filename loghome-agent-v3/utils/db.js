import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretPath = path.join(__dirname, '../secret.json');
const secret = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));

const pool = mysql.createPool(secret.DB_CONFIG);
const memoryPool = mysql.createPool(secret.MEMORY_DB_CONFIG);

export default pool;
export { memoryPool, secret };
