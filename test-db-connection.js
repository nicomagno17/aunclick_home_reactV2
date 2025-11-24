// Script de prueba para verificar la conexión a la base de datos
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...\n')

  console.log('Configuración:')
  console.log('- Host:', process.env.DB_HOST)
  console.log('- Puerto:', process.env.DB_PORT)
  console.log('- Usuario:', process.env.DB_USER)
  console.log('- Base de datos:', process.env.DB_NAME)
  console.log('')

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✅ Conexión exitosa a la base de datos!\n')

    // Verificar que la tabla usuarios existe
    const [tables] = await connection.query("SHOW TABLES LIKE 'usuarios'")

    if (tables.length > 0) {
      console.log('✅ Tabla "usuarios" encontrada!\n')

      // Contar registros
      const [rows] = await connection.query('SELECT COUNT(*) as total FROM usuarios')
      console.log(`📊 Total de usuarios registrados: ${rows[0].total}\n`)
    } else {
      console.log('❌ Tabla "usuarios" NO encontrada')
      console.log('Por favor ejecuta el script SQL para crear la tabla\n')
    }

    await connection.end()
    console.log('✅ Todo listo para usar!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    console.error('\nVerifica que:')
    console.error('1. MariaDB esté corriendo')
    console.error('2. Las credenciales en .env.local sean correctas')
    console.error('3. La base de datos "solo_a_un_click" exista')
    console.error('4. El usuario "app_user" tenga los permisos correctos\n')
    process.exit(1)
  }
}

testConnection()
