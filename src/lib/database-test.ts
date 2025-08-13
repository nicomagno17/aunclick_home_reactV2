
import { getMySQLPool, prisma, executeQuery } from './database'
import mysql from 'mysql2/promise'

interface ConnectionTestResult {
  mysql: {
    success: boolean
    message: string
    serverInfo?: string
    error?: string
  }
  prisma: {
    success: boolean
    message: string
    error?: string
  }
}

// Test de conexión MySQL directa
export const testMySQLConnection = async () => {
  try {
    const pool = getMySQLPool()
    const connection = await pool.getConnection()
    
    // Test básico de conexión
    const [rows] = await connection.execute('SELECT 1 as test')
    
    // Obtener información del servidor
    const [serverInfo] = await connection.execute('SELECT VERSION() as version')
    
    connection.release()
    
    return {
      success: true,
      message: 'Conexión MySQL exitosa',
      serverInfo: (serverInfo as any)[0]?.version,
      testResult: rows
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error en conexión MySQL',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test de conexión Prisma
export const testPrismaConnection = async () => {
  try {
    // Test simple con Prisma
    await prisma.$queryRaw`SELECT 1 as test`
    
    return {
      success: true,
      message: 'Conexión Prisma exitosa'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error en conexión Prisma',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test completo de ambas conexiones
export const testAllConnections = async (): Promise<ConnectionTestResult> => {
  console.log('🔍 Iniciando pruebas de conexión...')
  
  const mysqlResult = await testMySQLConnection()
  const prismaResult = await testPrismaConnection()
  
  const result: ConnectionTestResult = {
    mysql: mysqlResult,
    prisma: prismaResult
  }
  
  // Log de resultados
  console.log('📊 Resultados de las pruebas:')
  console.log('MySQL:', mysqlResult.success ? '✅' : '❌', mysqlResult.message)
  if (mysqlResult.serverInfo) {
    console.log('   Versión del servidor:', mysqlResult.serverInfo)
  }
  if (mysqlResult.error) {
    console.log('   Error:', mysqlResult.error)
  }
  
  console.log('Prisma:', prismaResult.success ? '✅' : '❌', prismaResult.message)
  if (prismaResult.error) {
    console.log('   Error:', prismaResult.error)
  }
  
  return result
}

// Función de ejemplo para probar queries
export const testDatabaseQueries = async () => {
  try {
    console.log('🧪 Probando queries de ejemplo...')
    
    // Test con MySQL directo
    const mysqlResult = await executeQuery('SHOW TABLES')
    console.log('📋 Tablas disponibles (MySQL):', mysqlResult.length)
    
    // Test con Prisma
    const prismaResult = await prisma.$queryRaw`SHOW TABLES`
    console.log('📋 Tablas disponibles (Prisma):', Array.isArray(prismaResult) ? prismaResult.length : 'N/A')
    
    return {
      success: true,
      mysqlTables: mysqlResult,
      prismaTables: prismaResult
    }
  } catch (error) {
    console.error('❌ Error probando queries:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
