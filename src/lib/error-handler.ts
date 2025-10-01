import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import logger, { getCorrelationId } from './logger'

// Error type enumeration
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  INTERNAL = 'INTERNAL'
}

// Error response interface
export interface ErrorResponse {
  error: string
  type?: ErrorType
  details?: any
  correlationId?: string
  timestamp?: string
}

// Error context interface
export interface ErrorContext {
  [key: string]: any
  endpoint?: string
  method?: string
  userId?: string
  productId?: string
  negocioId?: string
  categoriaId?: string
  planId?: string
  filters?: any
  pagination?: any
  email?: string
}

// Success response interface
export interface SuccessResponse {
  data?: any
  correlationId?: string
  timestamp?: string
}

// Generic error classification
export function classifyError(error: Error | { [key: string]: any }): ErrorType {
  // Zod validation errors
  if (error instanceof ZodError) {
    return ErrorType.VALIDATION
  }
  
  // Database errors (MySQL)
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  const errorCode = (error as any).code
  
  if (errorCode === 'ER_DUP_ENTRY' || errorCode === 'ER_NO_REFERENCED_ROW_2' || 
      errorCode === 'ER_ROW_IS_REFERENCED_2' || typeof errorCode === 'string' && errorCode.startsWith('ER_')) {
    return ErrorType.DATABASE
  }
  
  if (errorMsg.includes('duplicate entry') || errorMsg.includes('foreign key constraint')) {
    return ErrorType.DATABASE
  }
  
  // Authentication errors
  if (errorMsg.includes('unauthorized') || errorMsg.includes('unauthenticated') ||
      errorMsg.includes('token') || errorMsg.includes('jwt')) {
    return ErrorType.AUTHENTICATION
  }
  
  // Authorization errors
  if (errorMsg.includes('forbidden') || errorMsg.includes('permission') ||
      errorMsg.includes('access denied') || errorMsg.includes('not allowed')) {
    return ErrorType.AUTHORIZATION
  }
  
  // Not found errors
  if (errorMsg.includes('not found') || errorMsg.includes('does not exist') ||
      errorMsg.includes('no record found')) {
    return ErrorType.NOT_FOUND
  }
  
  // External service errors
  if (errorMsg.includes('network') || errorMsg.includes('timeout') ||
      errorMsg.includes('service unavailable')) {
    return ErrorType.EXTERNAL_SERVICE
  }
  
  // Default to internal error
  return ErrorType.INTERNAL
}

// Get HTTP status code based on error type
export function getStatusCode(errorType: ErrorType): number {
  switch (errorType) {
    case ErrorType.VALIDATION:
      return 400
    case ErrorType.AUTHENTICATION:
      return 401
    case ErrorType.AUTHORIZATION:
      return 403
    case ErrorType.NOT_FOUND:
      return 404
    case ErrorType.DATABASE:
      return 500
    case ErrorType.EXTERNAL_SERVICE:
      return 502
    case ErrorType.INTERNAL:
    default:
      return 500
  }
}

// Sanitize error message for client consumption
function sanitizeErrorMessage(error: Error | { [key: string]: any }, errorType: ErrorType): string {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  // In development, always return the original error message
  if (isDevelopment) {
    return error instanceof Error ? error.message : String(error)
  }
  
  // In production, return generic messages based on error type
  switch (errorType) {
    case ErrorType.VALIDATION:
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
    case ErrorType.NOT_FOUND:
      // These error types can safely show specific messages
      return error instanceof Error ? error.message : String(error)
    
    case ErrorType.DATABASE:
      return 'Error en la base de datos. Por favor, inténtelo de nuevo más tarde.'
    
    case ErrorType.EXTERNAL_SERVICE:
      return 'Error en el servicio externo. Por favor, inténtelo de nuevo más tarde.'
    
    case ErrorType.INTERNAL:
    default:
      return 'Error interno del servidor. Por favor, contacte al administrador.'
  }
}

// Extract safe error details for client response
function extractSafeErrorDetails(error: Error | { [key: string]: any }, errorType: ErrorType): any {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  // Zod errors are always safe to show to clients
  if (error instanceof ZodError) {
    return error.format()
  }
  
  // In development, show more details
  if (isDevelopment) {
    return {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any).code || undefined
    }
  }
  
  // In production, don't show error details except for validation errors
  return undefined
}

// Main error handling function
export function handleError(
  error: Error | { [key: string]: any },
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  const errorType = classifyError(error)
  const statusCode = getStatusCode(errorType)
  const sanitizedMessage = sanitizeErrorMessage(error, errorType)
  const safeDetails = extractSafeErrorDetails(error, errorType)
  
  // Log the full error internally with all details
  logger.error(`${errorType}: ${sanitizedMessage}`, error, {
    ...context,
    errorType,
    statusCode,
    type: 'error'
  })
  
  // Return sanitized error response
  const errorResponse: ErrorResponse = {
    error: sanitizedMessage,
    type: errorType,
    correlationId,
    timestamp: new Date().toISOString()
  }
  
  // Only include details in development or for validation errors
  if (safeDetails) {
    errorResponse.details = safeDetails
  }
  
  return NextResponse.json(errorResponse, { status: statusCode })
}

// Convenience functions for common error types
export function validationError(
  message: string,
  details?: any,
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  
  logger.warn(`Validation error: ${message}`, {
    ...context,
    type: 'validation_error'
  })
  
  return NextResponse.json({
    error: message,
    type: ErrorType.VALIDATION,
    details,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status: 400 })
}

export function authenticationError(
  message: string = 'Autenticación requerida',
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  
  logger.warn(`Authentication error: ${message}`, {
    ...context,
    type: 'authentication_error'
  })
  
  return NextResponse.json({
    error: message,
    type: ErrorType.AUTHENTICATION,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status: 401 })
}

export function authorizationError(
  message: string = 'No tienes permisos para realizar esta acción',
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  
  logger.warn(`Authorization error: ${message}`, {
    ...context,
    type: 'authorization_error'
  })
  
  return NextResponse.json({
    error: message,
    type: ErrorType.AUTHORIZATION,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status: 403 })
}

export function notFoundError(
  resource: string = 'Recurso solicitado',
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  const message = `${resource} no encontrado`
  
  logger.warn(`Not found error: ${message}`, {
    ...context,
    resource,
    type: 'not_found_error'
  })
  
  return NextResponse.json({
    error: message,
    type: ErrorType.NOT_FOUND,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status: 404 })
}

export function databaseError(
  message: string = 'Error en la base de datos',
  error?: Error | { [key: string]: any },
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId()
  
  logger.error(`Database error: ${message}`, error, {
    ...context,
    type: 'database_error'
  })
  
  return NextResponse.json({
    error: message,
    type: ErrorType.DATABASE,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status: 500 })
}

// Success response function
export function successResponse(
  data?: any,
  status: number = 200
): NextResponse<SuccessResponse> {
  const correlationId = getCorrelationId()
  
  return NextResponse.json({
    data,
    correlationId,
    timestamp: new Date().toISOString()
  }, { status })
}

// Wrapper function for API endpoints to automatically handle errors
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context?: ErrorContext
) {
  return async (...args: T): Promise<R | NextResponse<ErrorResponse>> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleError(error as Error, context)
    }
  }
}

// Utility functions to check error types
export function isValidationError(error: any): error is ZodError {
  return error instanceof ZodError
}

export function isDatabaseError(error: any): boolean {
  return classifyError(error) === ErrorType.DATABASE
}

// Export all functions
export default {
  handleError,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  databaseError,
  successResponse,
  withErrorHandler,
  isValidationError,
  isDatabaseError,
  classifyError,
  getStatusCode,
  ErrorType
}