// Conexión a la base de datos MariaDB
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'solo_a_un_click',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
})

export default pool
