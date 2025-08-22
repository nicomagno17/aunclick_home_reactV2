
import { executeQuery, executeQuerySingle, insertAndGetId, countRecords } from './database'

// Interfaces para tipos comunes
interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

interface QueryOptions extends PaginationOptions {
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
  where?: Record<string, any>
}

// Helper para construir cláusulas WHERE dinámicas
export const buildWhereClause = (conditions: Record<string, any>): { clause: string, values: any[] } => {
  if (!conditions || Object.keys(conditions).length === 0) {
    return { clause: '', values: [] }
  }

  const clauses: string[] = []
  const values: any[] = []

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        clauses.push(`${key} IN (${value.map(() => '?').join(', ')})`)
        values.push(...value)
      } else if (typeof value === 'string' && value.includes('%')) {
        clauses.push(`${key} LIKE ?`)
        values.push(value)
      } else {
        clauses.push(`${key} = ?`)
        values.push(value)
      }
    }
  })

  return {
    clause: clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '',
    values
  }
}

// Helper para paginación
export const buildPaginationClause = (options: PaginationOptions): { clause: string, values: any[] } => {
  const { page = 1, limit = 10, offset } = options
  
  if (offset !== undefined) {
    return { clause: ' LIMIT ? OFFSET ?', values: [limit, offset] }
  }
  
  const calculatedOffset = (page - 1) * limit
  return { clause: ' LIMIT ? OFFSET ?', values: [limit, calculatedOffset] }
}

// Helper genérico para SELECT con opciones
export const selectWithOptions = async <T = any>(
  table: string,
  columns: string = '*',
  options: QueryOptions = {}
): Promise<T[]> => {
  const { orderBy, orderDirection = 'ASC', where } = options

  let query = `SELECT ${columns} FROM ${table}`
  let values: any[] = []

  // Agregar WHERE clause
  if (where) {
    const whereClause = buildWhereClause(where)
    query += whereClause.clause
    values.push(...whereClause.values)
  }

  // Agregar ORDER BY
  if (orderBy) {
    query += ` ORDER BY ${orderBy} ${orderDirection}`
  }

  // Agregar LIMIT/OFFSET
  const paginationClause = buildPaginationClause(options)
  query += paginationClause.clause
  values.push(...paginationClause.values)

  return await executeQuery<T>(query, values)
}

// Helper para contar con condiciones
export const countWithConditions = async (
  table: string,
  where?: Record<string, any>
): Promise<number> => {
  let query = `SELECT COUNT(*) as count FROM ${table}`
  let values: any[] = []

  if (where) {
    const whereClause = buildWhereClause(where)
    query += whereClause.clause
    values = whereClause.values
  }

  const result = await executeQuerySingle<{ count: number }>(query, values)
  return result?.count || 0
}

// Helper para INSERT
export const insertRecord = async (
  table: string,
  data: Record<string, any>
): Promise<number> => {
  const columns = Object.keys(data).join(', ')
  const placeholders = Object.keys(data).map(() => '?').join(', ')
  const values = Object.values(data)

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  return await insertAndGetId(query, values)
}

// Helper para UPDATE
export const updateRecord = async (
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<boolean> => {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ')
  const whereClause = buildWhereClause(where)
  
  const query = `UPDATE ${table} SET ${setClause}${whereClause.clause}`
  const values = [...Object.values(data), ...whereClause.values]

  const result = await executeQuery(query, values)
  return (result as any).affectedRows > 0
}

// Helper para DELETE
export const deleteRecord = async (
  table: string,
  where: Record<string, any>
): Promise<boolean> => {
  const whereClause = buildWhereClause(where)
  
  if (!whereClause.clause) {
    throw new Error('DELETE queries must have WHERE conditions for safety')
  }

  const query = `DELETE FROM ${table}${whereClause.clause}`
  const result = await executeQuery(query, whereClause.values)
  return (result as any).affectedRows > 0
}

export default {
  buildWhereClause,
  buildPaginationClause,
  selectWithOptions,
  countWithConditions,
  insertRecord,
  updateRecord,
  deleteRecord
}
