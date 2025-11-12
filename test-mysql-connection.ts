import { testAllConnections, testDatabaseQueries, testCRUDOperations } from './src/lib/database-test'
import { closeMySQLPool } from './src/lib/database'

async function main() {
  console.log('🚀 Iniciando prueba de conexión a MySQL...\n')
  
  try {
    // Probar conexión MySQL
    const connectionResults = await testAllConnections()
    
    console.log('\n' + '='.repeat(50))
    
    // Si la conexión es exitosa, probar queries
    if (connectionResults.mysql.success) {
      console.log('✅ Conexión exitosa! Probando queries...\n')
      
      // Probar queries básicas
      await testDatabaseQueries()
      
      console.log('\n' + '-'.repeat(30))
      
      // Probar operaciones CRUD
      await testCRUDOperations()
      
    } else {
      console.log('❌ Conexión fallida. Revisa la configuración.')
    }
    
  } catch (error) {
    console.error('💥 Error durante las pruebas:', error)
  } finally {
    // Limpiar conexiones
    await closeMySQLPool()
    console.log('\n🔒 Conexiones cerradas.')
    process.exit(0)
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main()
}