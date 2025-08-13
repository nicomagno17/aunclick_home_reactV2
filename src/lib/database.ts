
import mysql from 'mysql2/promise'
import { db as prismaClient } from './db'

// Configuración de conexión directa a MySQL
const mysqlConfig = {
  host: process.env.DB_HOST || '45.236.129.200',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'pcornej0',
  password: process.env.DB_PASSWORD || 'Pcornejo@2025',
  database: process.env.DB_NAME || 'aunClick_prod',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
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

// Exportar cliente de Prisma existente
export const prisma = prismaClient

// Función helper para ejecutar queries raw
export const executeQuery = async <T = any>(
  query: string,
  params?: any[]
): Promise<T[]> => {
  const pool = getMySQLPool()
  const [rows] = await pool.execute(query, params)
  return rows as T[]
}

export default {
  mysql: getMySQLPool,
  prisma,
  executeQuery,
  closeMySQLPool
}
