/**
 * MCP SQL Server Connection Test Script
 * 
 * This script tests the connection to the Telqway SQL Server database
 * using MCP (Model Context Protocol) configuration.
 * 
 * Requirements:
 * - Environment variables must be set in .env.local
 * - See .env.example for required variables
 * - See README_MCP.md for setup instructions
 * 
 * Usage: node mcp-sql-query.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Request } = require('tedious');

/**
 * Validate required MCP environment variables for SQL Server
 * 
 * Takes no parameters. Reads environment variables from process.env,
 * throws an error if required variables are missing or contain placeholder values,
 * and validates MCP configuration as a side effect.
 * 
 * @throws {Error} When required environment variables are missing or contain placeholder values
 * @returns {void} No return value, validates configuration via side effects
 */
function validateMCPEnvVariables() {
    const required = [
        'MCP_SQLSERVER_TELQWAY_HOST',
        'MCP_SQLSERVER_TELQWAY_PORT',
        'MCP_SQLSERVER_TELQWAY_USER',
        'MCP_SQLSERVER_TELQWAY_PASSWORD',
        'MCP_SQLSERVER_TELQWAY_DATABASE'
    ];

    // Check for missing or placeholder values
    const placeholderValues = ['your_username', 'your_password', 'your_database'];
    const missing = required.filter(key => {
        const value = process.env[key];
        return !value || placeholderValues.includes(value);
    });

    if (missing.length > 0) {
        throw new Error(
            `Missing required MCP environment variables: ${missing.join(', ')}.
` +
            `Create a ".env.local" file based on ".env.example" and set these variables.
` +
            `Make sure to replace placeholder values (your_username, your_password, your_database) with actual credentials.
` +
            `See README_MCP.md for detailed setup instructions.`
        );
    }
}

// Validate environment variables before proceeding
validateMCPEnvVariables();

console.log('🚀 Conectando via MCP a SQL Server...');
console.log('📡 MCP Server: sqlserver-database');
console.log('🌐 Servidor:', process.env.MCP_SQLSERVER_TELQWAY_HOST);
console.log('🗄️  Base de datos:', process.env.MCP_SQLSERVER_TELQWAY_DATABASE);
console.log('🔍 Tabla: tb_user_tqw');
console.log('---');

// Usamos la configuración MCP desde variables de entorno
const config = {
    server: process.env.MCP_SQLSERVER_TELQWAY_HOST,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.MCP_SQLSERVER_TELQWAY_USER,
            password: process.env.MCP_SQLSERVER_TELQWAY_PASSWORD
        }
    },
    database: process.env.MCP_SQLSERVER_TELQWAY_DATABASE,
    options: {
        port: parseInt(process.env.MCP_SQLSERVER_TELQWAY_PORT || '1433'),
        encrypt: false,
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: true
    }
};

/**
 * Execute a SQL query using MCP server connection
 * 
 * Takes no parameters. Establishes an asynchronous connection to the MCP server,
 * executes a SQL query to count records in tb_user_tqw, logs results or errors,
 * and closes the connection.
 * 
 * @returns {void} No return value, performs asynchronous operations as side effects
 * @sideeffect Establishes asynchronous connection to MCP server
 * @sideeffect Executes SQL query and logs results
 * @sideeffect Handles and logs connection errors
 * @sideeffect Closes database connection after query completion
 */
function executeMCPQuery() {
    const connection = new Connection(config);

    connection.on('connect', function (err) {
        if (err) {
            console.error('❌ Error MCP:', err.message);
            return;
        }

        console.log('✅ MCP Server conectado exitosamente!');
        console.log('🔄 Ejecutando consulta MCP...');

        const request = new Request(
            'SELECT COUNT(*) as total_registros FROM tb_user_tqw',
            function (err, rowCount, rows) {
                if (err) {
                    console.error('❌ Error en consulta MCP:', err.message);
                } else {
                    console.log('📈 Consulta MCP completada');
                }
                connection.close();
            }
        );

        request.on('row', function (columns) {
            columns.forEach(column => {
                console.log(`📊 Resultado MCP: ${column.metadata.colName} = ${column.value}`);
            });
        });

        connection.execSql(request);
    });

    connection.on('error', function (err) {
        console.error('❌ Error MCP Server:', err.message);
    });

    connection.connect();
}

console.log('🎯 Iniciando consulta MCP...');
executeMCPQuery();