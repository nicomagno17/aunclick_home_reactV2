
import { NextResponse } from 'next/server'
import { testAllConnections, testDatabaseQueries } from '@/lib/database-test'

export async function GET() {
  try {
    const connectionResults = await testAllConnections()
    const queryResults = await testDatabaseQueries()
    
    return NextResponse.json({
      success: true,
      connections: connectionResults,
      queries: queryResults,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error en test de base de datos:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
