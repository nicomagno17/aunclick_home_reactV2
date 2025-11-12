
import { getMySQLPool, executeQuery } from './database'

interface ConnectionTestResult {
  mysql: {
    success: boolean
    message: string
    serverInfo?: string
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

// Test completo de conexión MySQL
export const testAllConnections = async (): Promise<ConnectionTestResult> => {
  console.log('🔍 Iniciando prueba de conexión MySQL...')
  
  const mysqlResult = await testMySQLConnection()
  
  const result: ConnectionTestResult = {
    mysql: mysqlResult
  }
  
  // Log de resultados
  console.log('📊 Resultados de la prueba:')
  console.log('MySQL:', mysqlResult.success ? '✅' : '❌', mysqlResult.message)
  if (mysqlResult.serverInfo) {
    console.log('   Versión del servidor:', mysqlResult.serverInfo)
  }
  if (mysqlResult.error) {
    console.log('   Error:', mysqlResult.error)
  }
  
  return result
}

// Función de ejemplo para probar queries
export const testDatabaseQueries = async () => {
  try {
    console.log('🧪 Probando queries de ejemplo...')
    
    // Test con MySQL directo
    const tablesResult = await executeQuery('SHOW TABLES')
    console.log('📋 Tablas disponibles:', tablesResult.length)
    
    // Mostrar las tablas encontradas
    if (tablesResult.length > 0) {
      console.log('📄 Nombres de tablas:')
      tablesResult.forEach((table: any) => {
        const tableName = Object.values(table)[0]
        console.log(`   - ${tableName}`)
      })
    }
    
    return {
      success: true,
      tablesCount: tablesResult.length,
      tables: tablesResult
    }
  } catch (error) {
    console.error('❌ Error probando queries:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test de operaciones CRUD básicas
export const testCRUDOperations = async () => {
  try {
    console.log('🔧 Probando operaciones CRUD...')
    
    // Crear tabla de prueba
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Insertar datos de prueba
    const insertResult = await executeQuery(
      'INSERT INTO test_table (name, email) VALUES (?, ?)',
      ['Test User', 'test@example.com']
    )
    
    // Leer datos
    const selectResult = await executeQuery('SELECT * FROM test_table LIMIT 5')
    
    // Limpiar tabla de prueba
    await executeQuery('DROP TABLE test_table')
    
    console.log('✅ Operaciones CRUD completadas exitosamente')
    
    return {
      success: true,
      insertResult,
      selectResult,
      recordsFound: selectResult.length
    }
  } catch (error) {
    console.error('❌ Error en operaciones CRUD:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
