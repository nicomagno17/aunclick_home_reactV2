/**
 * MCP (Model Context Protocol) Environment Variable Validator
 * 
 * This utility provides centralized validation for all MCP database environment variables.
 * It follows the same pattern as src/lib/database.ts for consistency.
 * 
 * Features:
 * - Type-safe environment variable validation
 * - Optional validation (only validates databases being used)
 * - Helpful error messages for developers
 * - Reusable across MCP-related scripts and components
 */

// Define MCP database types for type safety
export type MCPDatabaseType =
    | 'mysql-tata'
    | 'mysql-operaciones'
    | 'mysql-aunclick'
    | 'mysql-gestar'
    | 'mysql-renovatio'
    | 'sqlserver-telqway';

// Environment variable mapping for each MCP database
const MCP_DATABASE_ENV_VARS = {
    'mysql-tata': [
        'MCP_MYSQL_TATA_HOST',
        'MCP_MYSQL_TATA_PORT',
        'MCP_MYSQL_TATA_USER',
        'MCP_MYSQL_TATA_PASSWORD',
        'MCP_MYSQL_TATA_DATABASE'
    ],
    'mysql-operaciones': [
        'MCP_MYSQL_OPERACIONES_HOST',
        'MCP_MYSQL_OPERACIONES_PORT',
        'MCP_MYSQL_OPERACIONES_USER',
        'MCP_MYSQL_OPERACIONES_PASSWORD',
        'MCP_MYSQL_OPERACIONES_DATABASE'
    ],
    'mysql-aunclick': [
        'MCP_MYSQL_AUNCLICK_HOST',
        'MCP_MYSQL_AUNCLICK_PORT',
        'MCP_MYSQL_AUNCLICK_USER',
        'MCP_MYSQL_AUNCLICK_PASSWORD',
        'MCP_MYSQL_AUNCLICK_DATABASE'
    ],
    'mysql-gestar': [
        'MCP_MYSQL_GESTAR_HOST',
        'MCP_MYSQL_GESTAR_PORT',
        'MCP_MYSQL_GESTAR_USER',
        'MCP_MYSQL_GESTAR_PASSWORD',
        'MCP_MYSQL_GESTAR_DATABASE'
    ],
    'mysql-renovatio': [
        'MCP_MYSQL_RENOVATIO_HOST',
        'MCP_MYSQL_RENOVATIO_PORT',
        'MCP_MYSQL_RENOVATIO_USER',
        'MCP_MYSQL_RENOVATIO_PASSWORD',
        'MCP_MYSQL_RENOVATIO_DATABASE'
    ],
    'sqlserver-telqway': [
        'MCP_SQLSERVER_TELQWAY_HOST',
        'MCP_SQLSERVER_TELQWAY_PORT',
        'MCP_SQLSERVER_TELQWAY_USER',
        'MCP_SQLSERVER_TELQWAY_PASSWORD',
        'MCP_SQLSERVER_TELQWAY_DATABASE'
    ]
} as const;

/**
 * Interface for validation result when throwOnMissing is false
 */
export interface ValidationResult {
    valid: boolean;
    missing: string[];
    databases: MCPDatabaseType[];
}

/**
 * Interface for MySQL database configuration
 */
export interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

/**
 * Interface for SQL Server database configuration
 */
export interface SQLServerConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

/**
 * Validate MCP environment variables for specified databases
 * 
 * @param databases - Array of database types to validate. If not provided, validates all configured databases
 * @param throwOnMissing - Whether to throw error on missing variables (default: true)
 * @returns ValidationResult if throwOnMissing is false
 * 
 * @example
 * // Validate all configured databases
 * validateMCPEnvVariables();
 * 
 * // Validate specific databases
 * validateMCPEnvVariables(['mysql-tata', 'sqlserver-telqway']);
 * 
 * // Check without throwing
 * const result = validateMCPEnvVariables(['mysql-tata'], false);
 * if (!result.valid) {
 *   console.warn('MCP not configured:', result.missing);
 * }
 */
export function validateMCPEnvVariables(
    databases?: MCPDatabaseType[],
    throwOnMissing: boolean = true
): ValidationResult | void {
    // If no databases specified, auto-detect which ones are configured
    if (!databases) {
        databases = Object.keys(MCP_DATABASE_ENV_VARS) as MCPDatabaseType[];
        // Filter to only include databases that are fully configured (all variables set and no placeholders)
        databases = databases.filter(db => isMCPDatabaseConfigured(db));
    }

    const allMissing: string[] = [];
    const validatedDatabases: MCPDatabaseType[] = [];
    const placeholderValues = ['your_username', 'your_password', 'your_database'];

    for (const database of databases) {
        const envVars = MCP_DATABASE_ENV_VARS[database];
        const missing = envVars.filter(varName => {
            const value = process.env[varName];
            return !value || placeholderValues.includes(value);
        });

        if (missing.length > 0) {
            allMissing.push(...missing);
        } else {
            validatedDatabases.push(database);
        }
    } if (allMissing.length > 0 && throwOnMissing) {
        const databaseNames = databases.map(db => {
            if (db.startsWith('mysql-')) return db.replace('mysql-', 'MySQL ');
            if (db.startsWith('sqlserver-')) return db.replace('sqlserver-', 'SQL Server ');
            return db;
        });

        throw new Error(
            `Missing required MCP environment variables for [${databaseNames.join(', ')}]: ${allMissing.join(', ')}.\n` +
            `Create a ".env.local" file based on ".env.example" and set these variables.\n` +
            `See README_MCP.md for detailed MCP setup instructions.`
        );
    }

    if (!throwOnMissing) {
        return {
            valid: allMissing.length === 0,
            missing: allMissing,
            databases: validatedDatabases
        };
    }
}

/**
 * Validate environment variables for a single MCP database
 * 
 * @param database - Database type to validate
 * @param throwOnMissing - Whether to throw error on missing variables (default: true)
 * @returns ValidationResult if throwOnMissing is false
 */
export function validateSingleDatabase(
    database: MCPDatabaseType,
    throwOnMissing: boolean = true
): ValidationResult | void {
    return validateMCPEnvVariables([database], throwOnMissing);
}

/**
 * Get typed environment variables for a specific MCP database
 * 
 * @param database - Database type to get configuration for
 * @returns Typed configuration object
 * 
 * @example
 * const telqwayConfig = getMCPEnvVars('sqlserver-telqway');
 * console.log(`Connecting to ${telqwayConfig.host}:${telqwayConfig.port}`);
 */
export function getMCPEnvVars(database: MCPDatabaseType): MySQLConfig | SQLServerConfig {
    // Validate first to ensure all required variables are present
    validateSingleDatabase(database, true);

    if (database.startsWith('mysql-')) {
        const dbName = database.replace('mysql-', '').toUpperCase();
        return {
            host: process.env[`MCP_MYSQL_${dbName}_HOST`]!,
            port: parseInt(process.env[`MCP_MYSQL_${dbName}_PORT`]!),
            user: process.env[`MCP_MYSQL_${dbName}_USER`]!,
            password: process.env[`MCP_MYSQL_${dbName}_PASSWORD`]!,
            database: process.env[`MCP_MYSQL_${dbName}_DATABASE`]!
        } as MySQLConfig;
    }

    if (database.startsWith('sqlserver-')) {
        const dbName = database.replace('sqlserver-', '').toUpperCase();
        return {
            host: process.env[`MCP_SQLSERVER_${dbName}_HOST`]!,
            port: parseInt(process.env[`MCP_SQLSERVER_${dbName}_PORT`]!),
            user: process.env[`MCP_SQLSERVER_${dbName}_USER`]!,
            password: process.env[`MCP_SQLSERVER_${dbName}_PASSWORD`]!,
            database: process.env[`MCP_SQLSERVER_${dbName}_DATABASE`]!
        } as SQLServerConfig;
    }

    throw new Error(`Unknown database type: ${database}`);
}

/**
 * Check if a MCP database is configured (has at least one environment variable set)
 * 
 * @param database - Database type to check
 * @returns True if database is configured, false otherwise
 */
export function isMCPDatabaseConfigured(database: MCPDatabaseType): boolean {
    const envVars = MCP_DATABASE_ENV_VARS[database];
    const placeholderValues = ['your_username', 'your_password', 'your_database'];

    // Only consider database configured if ALL required variables are set and none are placeholders
    return envVars.every(varName => {
        const value = process.env[varName];
        return value !== undefined && value !== '' && !placeholderValues.includes(value);
    });
}

/**
 * Get all configured MCP databases (those with at least one environment variable set)
 * 
 * @returns Array of configured database types
 */
export function getConfiguredMCPDatabases(): MCPDatabaseType[] {
    return (Object.keys(MCP_DATABASE_ENV_VARS) as MCPDatabaseType[])
        .filter(database => isMCPDatabaseConfigured(database));
}

/**
 * Get human-readable database name
 * 
 * @param database - Database type
 * @returns Human-readable name
 */
export function getDatabaseDisplayName(database: MCPDatabaseType): string {
    const displayNames: Record<MCPDatabaseType, string> = {
        'mysql-tata': 'MySQL - Tata Repuestos',
        'mysql-operaciones': 'MySQL - Operaciones TQW',
        'mysql-aunclick': 'MySQL - aunClick Production',
        'mysql-gestar': 'MySQL - Gestar Experian',
        'mysql-renovatio': 'MySQL - Renovatio',
        'sqlserver-telqway': 'SQL Server - Telqway'
    };

    return displayNames[database] || database;
}

/**
 * Export all functions for convenience
 */
export default {
    validateMCPEnvVariables,
    validateSingleDatabase,
    getMCPEnvVars,
    isMCPDatabaseConfigured,
    getConfiguredMCPDatabases,
    getDatabaseDisplayName
};