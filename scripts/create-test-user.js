/**
 * Script para crear un usuario de prueba en la base de datos
 * Ejecutar con: node scripts/create-test-user.js
 */

require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function createTestUser() {
  let connection

  try {
    console.log('🔍 Conectando a la base de datos...')

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✅ Conexión exitosa')

    // Datos del usuario de prueba
    const testUser = {
      email: 'test@aunclick.com',
      password: 'Test123!@#',
      nombre: 'Usuario',
      apellidos: 'De Prueba',
      telefono: '+56912345678',
      rol: 'usuario',
      estado: 'activo'
    }

    console.log('\n📝 Creando usuario de prueba...')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Password: ${testUser.password}`)
    console.log(`   Nombre: ${testUser.nombre} ${testUser.apellidos}`)

    // Verificar si el usuario ya existe
    const [existing] = await connection.execute(
      'SELECT id, email FROM usuarios WHERE email = ?',
      [testUser.email]
    )

    if (existing.length > 0) {
      console.log('\n⚠️  El usuario ya existe. Actualizando contraseña...')
      
      // Hash de la nueva contraseña
      const passwordHash = await bcrypt.hash(testUser.password, 10)
      
      await connection.execute(
        `UPDATE usuarios 
         SET password_hash = ?, 
             nombre = ?, 
             apellidos = ?, 
             telefono = ?,
             estado = ?,
             rol = ?,
             updated_at = NOW()
         WHERE email = ?`,
        [
          passwordHash,
          testUser.nombre,
          testUser.apellidos,
          testUser.telefono,
          testUser.estado,
          testUser.rol,
          testUser.email
        ]
      )
      
      console.log('✅ Usuario actualizado exitosamente')
    } else {
      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(testUser.password, 10)

      // Insertar usuario
      const [result] = await connection.execute(
        `INSERT INTO usuarios (
          uuid, email, password_hash, nombre, apellidos, telefono,
          rol, estado, email_verificado_at, created_at, updated_at
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
        [
          testUser.email,
          passwordHash,
          testUser.nombre,
          testUser.apellidos,
          testUser.telefono,
          testUser.rol,
          testUser.estado
        ]
      )

      console.log(`✅ Usuario creado exitosamente con ID: ${result.insertId}`)
    }

    // Verificar el usuario creado
    const [users] = await connection.execute(
      `SELECT id, uuid, email, nombre, apellidos, rol, estado, 
              email_verificado_at, created_at 
       FROM usuarios 
       WHERE email = ?`,
      [testUser.email]
    )

    console.log('\n📊 Datos del usuario:')
    console.log(JSON.stringify(users[0], null, 2))

    console.log('\n✅ ¡Listo! Puedes usar estas credenciales para hacer login:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Password: ${testUser.password}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n🔌 Conexión cerrada')
    }
  }
}

// Ejecutar
createTestUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

