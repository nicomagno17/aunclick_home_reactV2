
import mysql from 'mysql2/promise'

// Configuración de conexión directa a MySQL
const mysqlConfig = {
  host: process.env.DB_HOST || '45.236.129.200',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'pcornej0',
  password: process.env.DB_PASSWORD || 'Pcornejo@2025',
  database: process.env.DB_NAME || 'aunClick_prod',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  // No usar acquireTimeout o timeout ya que no son compatibles con mysql2/promise
}

// Pool de conexiones MySQL
let mysqlPool: mysql.Pool | null = null

export const getMySQLPool = (): mysql.Pool => {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig)
  }
  return mysqlPool
}

// Función para cerrar el pool (útil para cleanup)
export const closeMySQLPool = async (): Promise<void> => {
  if (mysqlPool) {
    await mysqlPool.end()
    mysqlPool = null
  }
}

// Función helper para ejecutar queries raw
export const executeQuery = async <T = any>(
  query: string,
  params?: any[]
): Promise<T[]> => {
  const pool = getMySQLPool()
  const [rows] = await pool.execute(query, params)
  return rows as T[]
}

// Función helper para ejecutar una sola query
export const executeQuerySingle = async <T = any>(
  query: string,
  params?: any[]
): Promise<T | null> => {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Función helper para insertar y obtener el ID insertado
export const insertAndGetId = async (
  query: string,
  params?: any[]
): Promise<number> => {
  const pool = getMySQLPool()
  const [result] = await pool.execute(query, params)
  return (result as any).insertId
}

// Función helper para contar registros
export const countRecords = async (
  query: string,
  params?: any[]
): Promise<number> => {
  const pool = getMySQLPool()
  const [rows] = await pool.execute(query, params)
  const result = rows as any[]
  return result[0]?.count || 0
}

export default {
  mysql: getMySQLPool,
  executeQuery,
  executeQuerySingle,
  insertAndGetId,
  countRecords,
  closeMySQLPool
}
