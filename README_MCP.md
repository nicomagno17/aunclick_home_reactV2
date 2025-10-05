# MCP (Model Context Protocol) Configuration Guide

## Overview

Model Context Protocol (MCP) enables AI assistants like GitHub Copilot to directly interact with databases, automate browser tasks, and enhance reasoning capabilities. This project includes 7 MCP servers that provide secure, controlled access to various databases and services.

**Benefits:**
- AI assistants can directly query databases for real-time data
- Browser automation for testing and web scraping
- Enhanced reasoning capabilities for complex problem-solving
- Secure, audited access through controlled permissions

## Table of Contents

- [Quick Setup](#quick-setup)
- [Available MCP Servers](#available-mcp-servers)
- [Environment Variables Configuration](#environment-variables-configuration)
- [VS Code Setup](#vs-code-setup)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [Testing MCP Connections](#testing-mcp-connections)
- [Additional Resources](#additional-resources)

## Quick Setup

Get MCP working in 5 simple steps:

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure required environment variables** in `.env.local`:
   - Uncomment and set credentials for the databases you need
   - See [Environment Variables Configuration](#environment-variables-configuration) for details

3. **Copy MCP configuration:**
   ```bash
   cp .vscode/mcp.json.example .vscode/mcp.json
   ```

4. **Restart VS Code** to load the new MCP configuration

5. **Verify MCP servers are running**:
   - Open Command Palette (Ctrl+Shift+P)
   - Type "MCP" to see available MCP commands
   - Check the VS Code output panel for MCP server status

## Available MCP Servers

This project includes 7 MCP servers:

### Database Servers (6)

| Server | Type | Database | Purpose | Allowed Operations |
|--------|------|----------|---------|-------------------|
| **mysql-tata-repuestos** | MySQL | Tata_Repuestos | Tata Repuestos inventory database | connect_db, list_tables, query, execute, describe_table |
| **mysql-database** | MySQL | operaciones_tqw | Operaciones TQW operations database | connect_db, list_tables, query, execute, describe_table |
| **mysql-aunclick** | MySQL | aunClick_prod | aunClick production database | connect_db, list_tables, query, execute, describe_table |
| **mysql-gestar** | MySQL | gestarse_experian | Gestar Experian database | connect_db, list_tables, query, execute, describe_table |
| **mysql-renovatio** | MySQL | renovatio | Renovatio database | list_tables, describe_table, connect_db, execute |
| **sqlserver-database** | SQL Server | telqway | Telqway SQL Server database | list_tables, read_query, write_query, describe_table, alter_table |

### Utility Servers (1)

| Server | Purpose | Key Capabilities |
|--------|---------|------------------|
| **playwright** | Browser automation | Navigate, click, type, take screenshots, evaluate JavaScript |

## Environment Variables Configuration

### Naming Convention

All MCP environment variables follow this pattern:
- `MCP_MYSQL_[DB_NAME]_[CONFIG]` for MySQL databases
- `MCP_SQLSERVER_[DB_NAME]_[CONFIG]` for SQL Server databases

### Required Variables by Database

#### MySQL Databases
Each MySQL database requires these variables:
- `MCP_MYSQL_[NAME]_HOST` - Database server IP address
- `MCP_MYSQL_[NAME]_PORT` - Database port (usually 3306)
- `MCP_MYSQL_[NAME]_USER` - Database username
- `MCP_MYSQL_[NAME]_PASSWORD` - Database password
- `MCP_MYSQL_[NAME]_DATABASE` - Database name

#### SQL Server Databases
SQL Server databases require these variables:
- `MCP_SQLSERVER_[NAME]_HOST` - Database server IP address
- `MCP_SQLSERVER_[NAME]_PORT` - Database port (usually 1433)
- `MCP_SQLSERVER_[NAME]_USER` - Database username
- `MCP_SQLSERVER_[NAME]_PASSWORD` - Database password
- `MCP_SQLSERVER_[NAME]_DATABASE` - Database name

### Complete Variable Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MCP_MYSQL_TATA_HOST` | Tata Repuestos server IP | `168.232.165.178` | Optional |
| `MCP_MYSQL_OPERACIONES_HOST` | Operaciones TQW server IP | `170.239.85.233` | Optional |
| `MCP_MYSQL_AUNCLICK_HOST` | aunClick server IP | `45.236.129.200` | Optional |
| `MCP_MYSQL_GESTAR_HOST` | Gestar server IP | `179.61.13.153` | Optional |
| `MCP_MYSQL_RENOVATIO_HOST` | Renovatio server IP | `45.236.129.200` | Optional |
| `MCP_SQLSERVER_TELQWAY_HOST` | Telqway server IP | `181.212.32.10` | Optional |

*Only configure the databases you need to use. Only variables for configured databases are required.*

## VS Code Setup

### MCP Configuration File

The `.vscode/mcp.json` file tells VS Code which MCP servers to load:

```json
{
  "servers": {
    "mysql-tata-repuestos": {
      "command": "npx",
      "args": ["@f4ww4z/mcp-mysql-server"],
      "env": {
        "DB_HOST": "${env:MCP_MYSQL_TATA_HOST}",
        "DB_PORT": "${env:MCP_MYSQL_TATA_PORT}",
        // ... other variables
      }
    }
    // ... other servers
  }
}
```

### Enabling/Disabling Servers

To disable a server, comment it out in `.vscode/mcp.json`:

```json
{
  "servers": {
    // "mysql-tata-repuestos": { ... },  // Disabled
    "mysql-database": { ... }           // Enabled
  }
}
```

### Checking MCP Status

1. **VS Code Output Panel:**
   - View → Output
   - Select "MCP" from dropdown
   - Shows server startup status and errors

2. **Command Palette:**
   - Ctrl+Shift+P
   - Type "MCP" to see available commands

3. **GitHub Copilot Integration:**
   - Copilot will automatically use available MCP servers
   - Look for "MCP" indicators in Copilot responses

## Security Best Practices

⚠️ **Critical Security Guidelines**

### 🚫 Never Commit Credentials
- **Rule:** Never commit `.env`, `.env.local`, or `.vscode/mcp.json` with real credentials
- **Protection:** These files are in `.gitignore`
- **Reason:** Prevents credential exposure in version control

### 🔐 Use Environment Variables
- **Rule:** Always use environment variables for database credentials
- **Avoid:** Never hardcode credentials in scripts or configuration files
- **Benefit:** Centralized, secure credential management

### 👥 Principle of Least Privilege
- **Rule:** Grant only necessary permissions to MCP database users
- **Example:** Use read-only users for MCP servers that only query data
- **Benefit:** Limits potential damage from compromised credentials

### 🔄 Rotate Credentials Regularly
- **Rule:** Change database credentials periodically (especially for production)
- **Frequency:** Every 30-90 days for production databases
- **Automation:** Use credential management tools where possible

### 📖 Use Read-Only Users
```sql
-- Example: Create read-only user for MCP
CREATE USER 'mcp_user'@'%' IDENTIFIED BY 'strong_password';
GRANT SELECT ON database_name.* TO 'mcp_user'@'%';
FLUSH PRIVILEGES;
```

### 📊 Monitor MCP Usage
- **Logs:** Check VS Code output and application logs for MCP activity
- **Auditing:** Enable database query logging for MCP users
- **Alerts:** Set up alerts for unusual query patterns

### 🏗️ Separate Development and Production
- **Rule:** Never use production credentials in development
- **Implementation:** Use different `.env.local` files for each environment
- **Benefit:** Prevents accidental production data modification

## Troubleshooting

### MCP Servers Not Appearing in VS Code

**Symptoms:** No MCP commands available, servers not listed

**Solutions:**
1. **Check `.vscode/mcp.json` exists and is valid JSON**
   ```bash
   # Validate JSON syntax
   cat .vscode/mcp.json | jq .
   ```

2. **Restart VS Code completely** (close and reopen)

3. **Check VS Code MCP settings:**
   - File → Preferences → Settings
   - Search for "MCP"
   - Ensure "Model Context Protocol" is enabled

4. **Check VS Code version:** MCP requires VS Code 1.84+ 

### Connection Errors

**Symptoms:** Connection timeout, authentication failed

**Solutions:**
1. **Verify environment variables:**
   ```bash
   # Check if variables are set
   echo $MCP_MYSQL_TATA_HOST
   printenv MCP_SQLSERVER_TELQWAY_USER
   ```

2. **Test database connectivity:**
   ```bash
   # MySQL test
   mysql -h $MCP_MYSQL_TATA_HOST -u $MCP_MYSQL_TATA_USER -p
   
   # SQL Server test (if sqlcmd is available)
   sqlcmd -S $MCP_SQLSERVER_TELQWAY_HOST -U $MCP_SQLSERVER_TELQWAY_USER -P $MCP_SQLSERVER_TELQWAY_PASSWORD
   ```

3. **Check firewall rules** and network connectivity
4. **Verify credentials** are correct and not expired

### Permission Denied Errors

**Symptoms:** Access denied, insufficient privileges

**Solutions:**
1. **Check database user permissions:**
   ```sql
   SHOW GRANTS FOR 'mcp_user'@'%';
   ```

2. **Review `alwaysAllow` configuration** in `.vscode/mcp.json`
3. **Ensure user has required privileges** for the operations you need

### npx Package Errors

**Symptoms:** "package not found", "permission denied"

**Solutions:**
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Remove node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check internet connectivity** for npx downloads
4. **Try updating npx:**
   ```bash
   npm install -g npx@latest
   ```

## Testing MCP Connections

### Using the Test Script

The `mcp-sql-query.js` script tests SQL Server connectivity:

```bash
# Run the test
node mcp-sql-query.js
```

**Expected output:**
```
🚀 Conectando via MCP a SQL Server...
📡 MCP Server: sqlserver-database
🌐 Servidor: 181.212.32.10
🗄️  Base de datos: telqway
🔍 Tabla: tb_user_tqw
---
🎯 Iniciando consulta MCP...
✅ MCP Server conectado exitosamente!
🔄 Ejecutando consulta MCP...
📈 Consulta MCP completada
📊 Resultado MCP: total_registros = 1234
```

### Testing Other Databases

To test other databases, modify `mcp-sql-query.js`:

```javascript
// Change the environment variable names
const host = process.env.MCP_MYSQL_TATA_HOST;
const user = process.env.MCP_MYSQL_TATA_USER;
// etc.

// And change the connection library for MySQL
// Use mysql2/promise instead of tedious
```

## Additional Resources

### Official Documentation
- **MCP Specification:** https://modelcontextprotocol.io
- **VS Code MCP Documentation:** https://code.visualstudio.com/docs/model-context-protocol/overview
- **GitHub Copilot MCP Integration:** https://docs.github.com/en/copilot

### MCP Server Packages
- **@f4ww4z/mcp-mysql-server:** MySQL database access
- **@executeautomation/database-server:** SQL Server and multi-database support
- **@playwright/mcp:** Browser automation

### Community and Support
- **GitHub Issues:** Report bugs in individual MCP server packages
- **VS Code Marketplace:** For MCP extension support
- **Stack Overflow:** Tag questions with `mcp` and `github-copilot`

### Development Resources
- **Environment Variables Guide:** See `.env.example` for complete reference
- **Security Best Practices:** Review the security section above
- **Troubleshooting:** Check logs and VS Code output panel for detailed errors

---

📝 **Last Updated:** September 30, 2025  
🔄 **Version:** 1.0  
👥 **Maintainer:** Development Team