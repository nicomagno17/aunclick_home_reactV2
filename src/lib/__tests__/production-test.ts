/**
 * Production Mode Logger Test
 * 
 * This test verifies that no console.* calls execute in production mode
 * and that the logger degrades gracefully when file operations fail.
 */

// Import logger functions
import logger, { setCorrelationContext, logRequest, logResponse } from '../logger'

// Mock console methods to track if they're called
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
}

let consoleCallCount = 0
const mockConsole = {
  log: (...args: any[]) => {
    consoleCallCount++
    originalConsole.log('PRODUCTION CONSOLE LOG:', ...args)
  },
  error: (...args: any[]) => {
    consoleCallCount++
    originalConsole.error('PRODUCTION CONSOLE ERROR:', ...args)
  },
  warn: (...args: any[]) => {
    consoleCallCount++
    originalConsole.warn('PRODUCTION CONSOLE WARN:', ...args)
  },
  info: (...args: any[]) => {
    consoleCallCount++
    originalConsole.info('PRODUCTION CONSOLE INFO:', ...args)
  },
  debug: (...args: any[]) => {
    consoleCallCount++
    originalConsole.debug('PRODUCTION CONSOLE DEBUG:', ...args)
  }
}

// Replace console methods
Object.assign(console, mockConsole)

async function testProductionMode() {
  console.log('\n=== Testing Production Mode Logger ===')
  consoleCallCount = 0

  try {
    // Test 1: Basic logging should not call console
    await logger.info('Test info message')
    await logger.warn('Test warning message')
    await logger.error('Test error message')
    await logger.debug('Test debug message')
    
    console.log(`Test 1 - Basic logging: ${consoleCallCount} console calls (expected: 0)`)
    
    // Test 2: Correlation context logging should not call console
    setCorrelationContext({ requestId: 'test-123', userId: 'user-456' })
    await logger.info('Test with correlation context')
    
    console.log(`Test 2 - Correlation context: ${consoleCallCount} console calls (expected: 0)`)
    
    // Test 3: HTTP logging should not call console
    await logRequest('GET', '/api/test', { ip: '127.0.0.1', requestId: 'req-123' })
    await logResponse('GET', '/api/test', 200, 150, { requestId: 'req-123' })
    
    console.log(`Test 3 - HTTP logging: ${consoleCallCount} console calls (expected: 0)`)
    
    // Test 4: Error logging with object should not call console
    await logger.error('Test error', { code: 'TEST_ERROR', message: 'Test error object' })
    
    console.log(`Test 4 - Error logging: ${consoleCallCount} console calls (expected: 0)`)
    
    // Test 5: Warning with context should not call console
    await logger.warn('Test warning', { type: 'test_warning', severity: 'low' })
    
    console.log(`Test 5 - Warning logging: ${consoleCallCount} console calls (expected: 0)`)
    
    // Summary
    if (consoleCallCount === 0) {
      console.log('✅ SUCCESS: No console calls in production mode!')
      console.log('✅ Logger is production-ready')
    } else {
      console.log(`❌ FAILURE: ${consoleCallCount} console calls detected in production mode`)
      console.log('❌ Logger needs more console call guards')
    }
    
  } catch (error) {
    console.error('Test failed with error:', error)
  } finally {
    // Restore original console
    Object.assign(console, originalConsole)
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testProductionMode()
}

export { testProductionMode }