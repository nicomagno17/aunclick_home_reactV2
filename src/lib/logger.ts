import { promises as fs } from 'fs'
import path from 'path'
import { AsyncLocalStorage } from 'async_hooks'

// Type definitions
export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export interface LogContext {
  [key: string]: any
  correlationId?: string
  userId?: string
  endpoint?: string
  method?: string
  query?: string
  duration?: number
  rowCount?: number
  insertId?: number
  count?: number
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  correlationId?: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
    code?: string | number
  }
}

// Configuration from environment variables
const config = {
  logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
  logToFile: process.env.LOG_TO_FILE === 'true' && process.env.NODE_ENV === 'production',
  logFilePath: process.env.LOG_FILE_PATH || './logs/app.log',
  maxFileSize: (parseInt(process.env.LOG_MAX_FILE_SIZE || '10') || 10) * 1024 * 1024, // Convert MB to bytes
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '5') || 5,
  isDevelopment: process.env.NODE_ENV !== 'production'
}

// Log level hierarchy
const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

// ANSI color codes for console output in development
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  white: '\x1b[37m'
}

// AsyncLocalStorage for correlation IDs
export const correlationStorage = new AsyncLocalStorage<LogContext>()

// Get current correlation ID from storage
export function getCorrelationId(): string | undefined {
  const store = correlationStorage.getStore()
  return store?.correlationId
}

// Set correlation context
export function setCorrelationContext(context: LogContext): void {
  const currentStore = correlationStorage.getStore() || {}
  correlationStorage.enterWith({ ...currentStore, ...context })
}

// Helper to set correlation context from request headers
export function setCorrelationContextFromRequest(request: Request | { headers?: { get: (name: string) => string | null } }): void {
  const correlationId = request.headers?.get?.('X-Correlation-ID')
  if (correlationId) {
    setCorrelationContext({ correlationId })
  }
}

// Ensure log directory exists
async function ensureLogDirectory(): Promise<void> {
  if (!config.logToFile) return
  
  const logDir = path.dirname(config.logFilePath)
  try {
    await fs.access(logDir)
  } catch {
    await fs.mkdir(logDir, { recursive: true })
  }
}

// Check if log file should be rotated
async function shouldRotateLog(): Promise<boolean> {
  if (!config.logToFile) return false
  
  try {
    const stats = await fs.stat(config.logFilePath)
    return stats.size >= config.maxFileSize
  } catch {
    return false // File doesn't exist or can't be accessed
  }
}

// Rotate log files
async function rotateLogFile(): Promise<void> {
  if (!config.logToFile) return
  
  try {
    // Remove the oldest log file if it exists
    const oldestFile = `${config.logFilePath}.${config.maxFiles}`
    try {
      await fs.unlink(oldestFile)
    } catch {
      // File doesn't exist, continue
    }
    
    // Shift existing log files
    for (let i = config.maxFiles - 1; i >= 1; i--) {
      const currentFile = `${config.logFilePath}.${i}`
      const nextFile = `${config.logFilePath}.${i + 1}`
      
      try {
        await fs.rename(currentFile, nextFile)
      } catch {
        // File doesn't exist, continue
      }
    }
    
    // Rename current log file
    try {
      const stats = await fs.stat(config.logFilePath)
      if (stats.size > 0) {
        await fs.rename(config.logFilePath, `${config.logFilePath}.1`)
      }
    } catch {
      // File doesn't exist or is empty, continue
    }
    
  } catch (error) {
    // If rotation fails, log to console only in development
    if (config.isDevelopment) {
      console.error('Failed to rotate log file:', error)
    }
    // In production, silently fail to avoid polluting logs
  }
}

// Format error for logging
function formatError(error?: Error | { [key: string]: any }): LogEntry['error'] {
  if (!error) return undefined
  
  const formatted: LogEntry['error'] = {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
    code: (error as any).code
  }
  
  // Only include stack trace in development
  if (config.isDevelopment && error instanceof Error && error.stack) {
    formatted.stack = error.stack
  }
  
  return formatted
}

// Create log entry with correlation ID
function createLogEntry(
  level: LogLevel,
  message: string,
  error?: Error | { [key: string]: any },
  context?: LogContext
): LogEntry {
  const correlationId = getCorrelationId()
  const existingContext = correlationStorage.getStore() || {}
  
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    correlationId,
    context: { ...existingContext, ...(context || {}) },
    error: formatError(error)
  }
}

// Check if log level should be logged
function shouldLog(level: LogLevel): boolean {
  return logLevels[level] <= logLevels[config.logLevel]
}

// Format console output for development
function formatConsoleOutput(entry: LogEntry): string {
  const { timestamp, level, message, correlationId, context, error } = entry
  
  // Select color based on level
  let colorMethod: string
  let bgMethod: string = ''
  switch (level) {
    case 'error':
      colorMethod = colors.red
      bgMethod = colors.bgRed
      break
    case 'warn':
      colorMethod = colors.yellow
      bgMethod = colors.bgYellow
      break
    case 'info':
      colorMethod = colors.blue
      break
    case 'debug':
      colorMethod = colors.green
      break
    default:
      colorMethod = colors.reset
  }
  
  // Format: [TIMESTAMP] [LEVEL] [CORRELATION-ID] MESSAGE
  let output = `${colors.gray}[${timestamp}]${colors.reset} `
  
  if (level === 'error' || level === 'warn') {
    output += `${bgMethod}${colors.white} ${level.toUpperCase()} ${colors.reset} `
  } else {
    output += `${colorMethod}${level.toUpperCase()}${colors.reset} `
  }
  
  if (correlationId) {
    output += `${colors.gray}[${correlationId}]${colors.reset} `
  }
  
  output += `${colorMethod}${message}${colors.reset}`
  
  // Add context if provided
  if (context && Object.keys(context).length > 0) {
    // Remove correlationId from context display since it's already shown
    const displayContext = { ...context }
    delete displayContext.correlationId
    
    if (Object.keys(displayContext).length > 0) {
      output += `\n${colors.gray}Context:${colors.reset} ${JSON.stringify(displayContext, null, 2)}`
    }
  }
  
  // Add error details if provided
  if (error) {
    output += `\n${colorMethod}Error: ${error.name}: ${error.message}${colors.reset}`
    if (error.stack) {
      output += `\n${colors.gray}${error.stack}${colors.reset}`
    }
  }
  
  return output
}

// Write log entry to console and/or file
async function writeLog(entry: LogEntry): Promise<void> {
  // Development: output to console with colors
  if (config.isDevelopment) {
    const formatted = formatConsoleOutput(entry)
    
    switch (entry.level) {
      case 'error':
        console.error(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'debug':
        console.debug(formatted)
        break
    }
  }
  
  // Write to file if configured and in production
  if (!config.logToFile) return
  
  try {
    await ensureLogDirectory()
    
    // Check if we need to rotate the log file
    if (await shouldRotateLog()) {
      await rotateLogFile()
    }
    
    // Write structured JSON log to file (one entry per line)
    const logLine = JSON.stringify(entry) + '\n'
    await fs.appendFile(config.logFilePath, logLine)
    
  } catch (error) {
    // Fallback to console only in development if file writing fails
    if (config.isDevelopment) {
      console.error('Failed to write log to file:', error)
      console.error('Original log entry:', JSON.stringify(entry))
    }
    // In production, silently fail to avoid polluting logs
  }
}

// Public logging functions
export async function error(
  message: string,
  errorObj?: Error | { [key: string]: any },
  context?: LogContext
): Promise<void> {
  if (!shouldLog('error')) return
  
  const entry = createLogEntry('error', message, errorObj, context)
  await writeLog(entry)
}

export async function warn(message: string, context?: LogContext): Promise<void> {
  if (!shouldLog('warn')) return
  
  const entry = createLogEntry('warn', message, undefined, context)
  await writeLog(entry)
}

export async function info(message: string, context?: LogContext): Promise<void> {
  if (!shouldLog('info')) return
  
  const entry = createLogEntry('info', message, undefined, context)
  await writeLog(entry)
}

export async function debug(message: string, context?: LogContext): Promise<void> {
  if (!shouldLog('debug')) return
  
  const entry = createLogEntry('debug', message, undefined, context)
  await writeLog(entry)
}

// Specialized logging functions for common operations
export async function logRequest(
  method: string,
  url: string,
  context?: LogContext
): Promise<void> {
  await info(`${method} ${url}`, { ...context, type: 'request' })
}

export async function logResponse(
  method: string,
  url: string,
  status: number,
  duration: number,
  context?: LogContext
): Promise<void> {
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
  const message = `${method} ${url} ${status} (${duration}ms)`
  
  await level === 'error' 
    ? error(message, undefined, { ...context, type: 'response', status, duration })
    : level === 'warn'
    ? warn(message, { ...context, type: 'response', status, duration })
    : info(message, { ...context, type: 'response', status, duration })
}

export async function logDatabaseQuery(
  query: string,
  duration: number,
  context?: LogContext
): Promise<void> {
  // Truncate long queries for readability
  const displayQuery = query.length > 200 ? query.substring(0, 200) + '...' : query
  
  await debug(`DB Query (${duration}ms): ${displayQuery}`, { 
    ...context, 
    type: 'database',
    query: displayQuery,
    duration
  })
}

// correlationStorage is already exported as a named export above

// Default export
export default {
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  logDatabaseQuery,
  getCorrelationId,
  setCorrelationContext
}