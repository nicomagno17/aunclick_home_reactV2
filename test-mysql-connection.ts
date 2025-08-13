
#!/usr/bin/env tsx

import { testAllConnections, testDatabaseQueries } from './src/lib/database-test'
import { closeMySQLPool } from './src/lib/database'

async function main() {
  console.log('🚀 Iniciando prueba de conexión a MySQL...\n')
  
  try {
    // Probar conexiones
    const connectionResults = await testAllConnections()
    
    console.log('\n' + '='.repeat(50))
    
    // Si las conexiones son exitosas, probar queries
    if (connectionResults.mysql.success && connectionResults.prisma.success) {
      console.log('✅ Todas las conexiones exitosas! Probando queries...\n')
      await testDatabaseQueries()
    } else {
      console.log('❌ Algunas conexiones fallaron. Revisa la configuración.')
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
