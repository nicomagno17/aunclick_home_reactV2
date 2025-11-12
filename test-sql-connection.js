const { Connection, Request } = require('tedious');

// Configuración de conexión SQL Server desde MCP
const config = {
    server: '181.212.32.10',
    authentication: {
        type: 'default',
        options: {
            userName: 'ncornejo',
            password: 'N1c0l7as17'
        }
    },
    database: 'telqway',
    options: {
        port: 1433,
        encrypt: false, // Para SQL Server local/general
        trustServerCertificate: true // Para evitar errores de certificado
    }
};

// Función para conectar y ejecutar consulta
function testConnection() {
    const connection = new Connection(config);
    
    connection.on('connect', function(err) {
        if (err) {
            console.error('Error de conexión:', err);
            return;
        }
        
        console.log('Conexión exitosa a SQL Server!');
        
        // Ejecutar consulta
        const request = new Request(
            'SELECT COUNT(*) as total_registros FROM tb_user_tqw',
            function(err, rowCount) {
                if (err) {
                    console.error('Error en consulta:', err);
                } else {
                    console.log(`Consulta completada. Filas afectadas: ${rowCount}`);
                }
                connection.close();
            }
        );
        
        request.on('row', function(columns) {
            columns.forEach(function(column) {
                if (column.metadata.colName === 'total_registros') {
                    console.log(`📊 Total registros en tb_user_tqw: ${column.value}`);
                }
            });
        });
        
        connection.execSql(request);
    });
    
    connection.on('error', function(err) {
        console.error('Error de conexión:', err);
    });
    
    connection.connect();
}

console.log('Intentando conectar a SQL Server MCP...');
console.log('Servidor: 181.212.32.10');
console.log('Base de datos: telqway');
console.log('Tabla: tb_user_tqw');
console.log('---');
testConnection();