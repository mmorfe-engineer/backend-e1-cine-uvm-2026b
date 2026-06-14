'use strict';
require('dotenv').config();
const mysql = require('mysql2/promise');

const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

const pool = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'cine_uvm',
  ssl: isRailway ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL conectado → ${isRailway ? 'Railway Cloud' : 'Local'}`);
    conn.release();
  } catch (err) {
    console.error('❌ Error de conexión MySQL:', err.message);
    console.error('⚠️  El servidor continuará funcionando pero las operaciones de base de datos fallarán.');
    console.error('⚠️  Verifica: MySQL está en ejecución, credenciales en .env son correctas.');
  }
})();

module.exports = pool;
