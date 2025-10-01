
import mysql from 'mysql2/promise'
import logger from './logger'

// Validate required environment variables and fail fast with a helpful message
function validateEnvVariables() {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
        `Create a local ".env.local" file based on ".env.example" and set these variables, or set them in your environment.`
    )
  }
}

validateEnvVariables()

/**
 * MySQL connection pool configuration.
 * All values are required and read from environment variables.
 */
const mysqlConfig = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
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

// Función helper para ejecutar queries raw
export const executeQuery = async <T = any>(
  query: string,
  params?: any[]
): Promise<T[]> => {
  const startTime = Date.now()
  const pool = getMySQLPool()
  
  try {
    const [rows] = await pool.execute(query, params)
    const duration = Date.now() - startTime
    
    await logger.logDatabaseQuery(query, duration, { rowCount: (rows as T[]).length })
    
    return rows as T[]
  } catch (error) {
    const duration = Date.now() - startTime
    await logger.error('Database query failed', error as Error, { 
      query: query.substring(0, 200), 
      duration, 
      params: params ? '(params provided)' : '(no params)' 
    })
    throw error
  }
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
  const startTime = Date.now()
  const pool = getMySQLPool()
  
  try {
    const [result] = await pool.execute(query, params)
    const duration = Date.now() - startTime
    const insertId = (result as any).insertId
    
    await logger.logDatabaseQuery(query, duration, { insertId })
    
    return insertId
  } catch (error) {
    const duration = Date.now() - startTime
    await logger.error('Database query failed', error as Error, { 
      query: query.substring(0, 200), 
      duration, 
      params: params ? '(params provided)' : '(no params)'.substring(0, 200),
      operation: 'insertAndGetId'
    })
    throw error
  }
}

// Función helper para contar registros
export const countRecords = async (
  query: string,
  params?: any[]
): Promise<number> => {
  const startTime = Date.now()
  const pool = getMySQLPool()
  
  try {
    const [rows] = await pool.execute(query, params)
    const duration = Date.now() - startTime
    const result = rows as any[]
    const count = result[0]?.count || 0
    
    await logger.logDatabaseQuery(query, duration, { count })
    
    return count
  } catch (error) {
    const duration = Date.now() - startTime
    await logger.error('Database query failed', error as Error, { 
      query: query.substring(0, 200), 
      duration, 
      params: params ? '(params provided)' : '(no params)',
      operation: 'countRecords'
    })
    throw error
  }
}

export default {
  mysql: getMySQLPool,
  executeQuery,
  executeQuerySingle,
  insertAndGetId,
  countRecords,
  closeMySQLPool
}
