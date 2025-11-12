const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function getUsuarios() {
    let connection = null

    try {
        console.log('🔍 Conectando a la base de datos...')

        // Crear conexión usando las variables de entorno
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })

        console.log('✅ Conexión exitosa')
        console.log('🔍 Consultando registros de la tabla usuarios...')

        const [usuarios] = await connection.execute(`
      SELECT
        id,
        uuid,
        email,
        nombre,
        apellidos,
        telefono,
        estado,
        rol,
        email_verificado_at,
        ultimo_acceso,
        created_at,
        updated_at
      FROM usuarios
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 50
    `)

        console.log(`📊 Total de registros encontrados: ${usuarios.length}`)
        console.log('📋 Registros:')

        if (usuarios.length === 0) {
            console.log('   No hay registros en la tabla usuarios')
        } else {
            usuarios.forEach((usuario, index) => {
                console.log(`\n${index + 1}. Usuario ID: ${usuario.id}`)
                console.log(`   UUID: ${usuario.uuid}`)
                console.log(`   Email: ${usuario.email}`)
                console.log(`   Nombre: ${usuario.nombre} ${usuario.apellidos || ''}`)
                console.log(`   Teléfono: ${usuario.telefono || 'No especificado'}`)
                console.log(`   Estado: ${usuario.estado}`)
                console.log(`   Rol: ${usuario.rol}`)
                console.log(`   Email verificado: ${usuario.email_verificado_at || 'No'}`)
                console.log(`   Último acceso: ${usuario.ultimo_acceso || 'Nunca'}`)
                console.log(`   Creado: ${usuario.created_at}`)
                console.log(`   Actualizado: ${usuario.updated_at}`)
            })
        }

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    } finally {
        if (connection) {
            await connection.end()
        }
    }
}

// Ejecutar la consulta
getUsuarios().then(() => {
    console.log('\n✅ Consulta completada')
    process.exit(0)
}).catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
})