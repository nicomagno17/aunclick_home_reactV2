import { executeQuery, executeQuerySingle, insertAndGetId, countRecords } from './database'

// ============================================================================
// WHITELISTS DE SEGURIDAD - SQL INJECTION PREVENTION
// ============================================================================

// Whitelist de tablas permitidas y sus columnas
const ALLOWED_TABLES = {
  'usuarios': [
    'id', 'uuid', 'email', 'password_hash', 'nombre', 'apellidos', 'telefono', 'avatar_url',
    'estado', 'rol', 'email_verificado_at', 'ultimo_acceso', 'preferencias', 'metadata',
    'created_at', 'updated_at', 'deleted_at'
  ] as const,
  'planes_suscripcion': [
    'id', 'nombre', 'descripcion', 'precio_mensual', 'precio_anual', 'descuento_anual',
    'max_negocios', 'max_productos_por_negocio', 'max_imagenes_por_producto', 'caracteristicas',
    'activo', 'orden_visualizacion', 'metadata', 'created_at', 'updated_at'
  ] as const,
  'categorias_negocios': [
    'id', 'nombre', 'slug', 'descripcion', 'icono', 'color_hex', 'parent_id', 'nivel',
    'activo', 'orden', 'seo_meta', 'created_at', 'updated_at'
  ] as const,
  'categorias_productos': [
    'id', 'nombre', 'slug', 'descripcion', 'parent_id', 'nivel', 'activo', 'orden',
    'metadata', 'created_at', 'updated_at'
  ] as const,
  'ubicaciones': [
    'id', 'pais', 'departamento_estado', 'ciudad', 'zona_barrio', 'direccion_completa',
    'codigo_postal', 'latitud', 'longitud', 'coordenadas', 'timezone', 'activo',
    'created_at', 'updated_at'
  ] as const,
  'negocios': [
    'id', 'uuid', 'propietario_id', 'categoria_id', 'ubicacion_id', 'plan_id',
    'nombre', 'slug', 'descripcion', 'descripcion_corta', 'telefono_principal', 'telefono_secundario',
    'email', 'sitio_web', 'whatsapp', 'redes_sociales', 'logo_url', 'banner_url',
    'galeria_imagenes', 'estado', 'verificado', 'destacado', 'permite_pedidos',
    'total_productos', 'total_resenas', 'promedio_calificacion', 'total_vistas',
    'seo_title', 'seo_description', 'seo_keywords', 'configuracion', 'metadata',
    'suscripcion_inicio', 'suscripcion_fin', 'created_at', 'updated_at', 'deleted_at'
  ] as const,
  'productos': [
    'id', 'uuid', 'negocio_id', 'categoria_id', 'nombre', 'slug', 'descripcion',
    'descripcion_corta', 'precio', 'precio_antes', 'moneda', 'sku', 'stock_disponible',
    'maneja_stock', 'stock_minimo', 'peso', 'dimensiones', 'estado', 'destacado',
    'permite_personalizacion', 'total_vistas', 'total_consultas', 'seo_title',
    'seo_description', 'seo_keywords', 'atributos', 'opciones_personalizacion', 'metadata',
    'fecha_disponibilidad', 'created_at', 'updated_at', 'deleted_at'
  ] as const,
  'imagenes_productos': [
    'id', 'producto_id', 'url_original', 'url_thumbnail', 'url_medium', 'url_large',
    'nombre_archivo', 'alt_text', 'titulo', 'descripcion', 'formato', 'tamano_bytes',
    'ancho', 'alto', 'orden', 'es_principal', 'activo', 'created_at', 'updated_at'
  ] as const,
  'horarios_operacion': [
    'id', 'negocio_id', 'dia_semana', 'hora_apertura', 'hora_cierre', 'hora_receso_inicio',
    'hora_receso_fin', 'cerrado', 'atencion_24h', 'notas', 'fecha_especial', 'es_excepcion',
    'activo', 'created_at', 'updated_at'
  ] as const,
  'resenas': [
    'id', 'negocio_id', 'usuario_id', 'calificacion', 'titulo', 'comentario',
    'calificacion_servicio', 'calificacion_calidad', 'calificacion_precio', 'calificacion_tiempo',
    'respuesta_negocio', 'respuesta_fecha', 'respondido_por', 'estado', 'verificada',
    'votos_util', 'votos_no_util', 'ip_address', 'user_agent', 'created_at', 'updated_at', 'deleted_at'
  ] as const,
} as const

// Whitelist de operadores SQL permitidos
const ALLOWED_OPERATORS = [
  '=', '!=', '<>', '>', '>=', '<', '<=',
  'LIKE', 'NOT LIKE',
  'IN', 'NOT IN',
  'IS NULL', 'IS NOT NULL',
  'BETWEEN'
] as const

// Whitelist de direcciones de ordenamiento
const ALLOWED_ORDER_DIRECTIONS = ['ASC', 'DESC'] as const

// ============================================================================
// TYPESCRIPT TYPES PARA SEGURIDAD
// ============================================================================

type AllowedTable = keyof typeof ALLOWED_TABLES
type AllowedColumn<T extends AllowedTable> = typeof ALLOWED_TABLES[T][number]
type OrderDirection = typeof ALLOWED_ORDER_DIRECTIONS[number]

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

// ============================================================================
// FUNCIONES DE VALIDACIÓN Y ESCAPE
// ============================================================================

/**
 * Escapa un identificador MySQL usando backticks para prevenir SQL injection.
 * @param identifier - El identificador a escapar (nombre de tabla, columna, etc.)
 * @returns Identificador escapado con backticks
 * @throws {Error} Si el identificador está vacío
 *
 * @example
 * escapeIdentifier('usuarios') // '`usuarios`'
 * escapeIdentifier('column_name') // '`column_name`'
 */
export const escapeIdentifier = (identifier: string): string => {
  if (!identifier || identifier.trim() === '') {
    throw new Error('El identificador no puede estar vacío')
  }

  // Remover backticks existentes para prevenir escape de escape
  const cleaned = identifier.replace(/`/g, '')

  // Envolver en backticks
  return `\`${cleaned}\``
}

/**
 * Valida que el nombre de tabla esté en la whitelist de tablas permitidas.
 *
 * @param table - Nombre de la tabla a validar
 * @throws {Error} Si la tabla no está en la whitelist
 *
 * @example
 * validateTableName('usuarios') // ✅ OK
 * validateTableName('usuarios; DROP TABLE--') // ❌ Lanza error
 *
 * @security Esta función previene SQL injection validando nombres de tablas
 * contra una whitelist estática. Nunca aceptar nombres de tablas del usuario
 * sin pasar por esta validación.
 */
export const validateTableName = (table: string): asserts table is AllowedTable => {
  if (!table || table.trim() === '') {
    throw new Error('El nombre de tabla no puede estar vacío')
  }

  if (!ALLOWED_TABLES[table as AllowedTable]) {
    const allowedTables = Object.keys(ALLOWED_TABLES).join(', ')
    throw new Error(`Nombre de tabla no permitido: ${table}. Tablas permitidas: ${allowedTables}`)
  }
}

/**
 * Valida que el nombre de columna esté en la whitelist de la tabla especificada.
 *
 * @param table - Nombre de la tabla
 * @param column - Nombre de la columna a validar
 * @throws {Error} Si la columna no está en la whitelist de la tabla
 */
export const validateColumnName = <T extends AllowedTable>(table: T, column: string): void => {
  if (!column || column.trim() === '') {
    throw new Error('El nombre de columna no puede estar vacío')
  }

  const allowedColumns = ALLOWED_TABLES[table]
  if (!allowedColumns.includes(column as AllowedColumn<T>)) {
    throw new Error(`Columna '${column}' no permitida en tabla '${table}'. Columnas permitidas: ${allowedColumns.join(', ')}`)
  }
}

/**
 * Valida y escapa una lista de columnas separadas por comas.
 *
 * @param table - Nombre de la tabla
 * @param columns - Lista de columnas (ej: "id, nombre, email") o "*" para todas
 * @returns Lista de columnas validadas y escapadas
 * @throws {Error} Si alguna columna no está permitida
 */
export const validateColumns = <T extends AllowedTable>(table: T, columns: string): string => {
  if (columns === '*') {
    return '*'
  }

  const columnList = columns.split(',').map(col => col.trim()).filter(col => col.length > 0)

  if (columnList.length === 0) {
    throw new Error('Se debe especificar al menos una columna')
  }

  const escapedColumns: string[] = []

  for (const column of columnList) {
    validateColumnName(table, column)
    escapedColumns.push(escapeIdentifier(column))
  }

  return escapedColumns.join(', ')
}

/**
 * Valida y escapa una expresión ORDER BY.
 *
 * @param table - Nombre de la tabla
 * @param orderBy - Columna para ordenamiento
 * @returns Columna validada y escapada
 * @throws {Error} Si la columna no está permitida
 */
export const validateOrderBy = <T extends AllowedTable>(table: T, orderBy: string): string => {
  if (!orderBy || orderBy.trim() === '') {
    throw new Error('La expresión ORDER BY no puede estar vacía')
  }

  validateColumnName(table, orderBy)
  return escapeIdentifier(orderBy)
}

/**
 * Valida una dirección de ordenamiento.
 *
 * @param direction - Dirección de ordenamiento (ASC/DESC)
 * @returns Dirección validada en mayúsculas
 * @throws {Error} Si la dirección no está permitida
 */
export const validateOrderDirection = (direction: string): OrderDirection => {
  const upperDirection = direction.toUpperCase()

  if (!ALLOWED_ORDER_DIRECTIONS.includes(upperDirection as OrderDirection)) {
    throw new Error(`Dirección de ordenamiento no permitida: ${direction}. Use ASC o DESC`)
  }

  return upperDirection as OrderDirection
}

// ============================================================================
// HELPER PARA CONSTRUIR CLÁUSULAS WHERE DINÁMICAS
// ============================================================================

/**
 * Construye cláusulas WHERE dinámicas con validación de seguridad.
 *
 * @param table - Nombre de la tabla para validar columnas
 * @param conditions - Objeto con condiciones WHERE
 * @returns Objeto con cláusula SQL y valores para prepared statements
 *
 * @example
 * buildWhereClause('usuarios', { estado: 'activo', rol: 'admin' })
 * // { clause: ' WHERE `estado` = ? AND `rol` = ?', values: ['activo', 'admin'] }
 */
export const buildWhereClause = <T extends AllowedTable>(
  table: T,
  conditions: Record<string, any>
): { clause: string, values: any[] } => {
  if (!conditions || Object.keys(conditions).length === 0) {
    return { clause: '', values: [] }
  }

  const clauses: string[] = []
  const values: any[] = []

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Validar que la columna existe en la tabla
      validateColumnName(table, key)
      const escapedKey = escapeIdentifier(key)

      if (Array.isArray(value)) {
        if (value.length > 0) {
          clauses.push(`${escapedKey} IN (${value.map(() => '?').join(', ')})`)
          values.push(...value)
        }
      } else if (typeof value === 'string' && value.includes('%')) {
        clauses.push(`${escapedKey} LIKE ?`)
        values.push(value)
      } else {
        clauses.push(`${escapedKey} = ?`)
        values.push(value)
      }
    }
  })

  return {
    clause: clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '',
    values
  }
}

// ============================================================================
// HELPER PARA PAGINACIÓN
// ============================================================================

export const buildPaginationClause = (options: PaginationOptions): { clause: string, values: any[] } => {
  const { page = 1, limit = 10, offset } = options

  if (offset !== undefined) {
    return { clause: ' LIMIT ? OFFSET ?', values: [limit, offset] }
  }

  const calculatedOffset = (page - 1) * limit
  return { clause: ' LIMIT ? OFFSET ?', values: [limit, calculatedOffset] }
}

// ============================================================================
// HELPERS PRINCIPALES CON SEGURIDAD INTEGRADA
// ============================================================================

/**
 * Ejecuta un SELECT con opciones de paginación, filtrado y ordenamiento.
 *
 * @security Todos los identificadores (tabla, columnas, orderBy) son validados
 * contra whitelists y escapados automáticamente. Los valores en WHERE usan
 * prepared statements (?) para prevenir SQL injection.
 *
 * @example Uso seguro:
 * ```typescript
 * const usuarios = await selectWithOptions('usuarios', 'id, email, nombre', {
 *   where: { estado: 'activo' },
 *   orderBy: 'created_at',
 *   orderDirection: 'DESC',
 *   page: 1,
 *   limit: 10
 * })
 * ```
 *
 * @example ❌ NUNCA hacer esto (aunque ahora está protegido):
 * ```typescript
 * const data = await selectWithOptions(userInput, '*') // ❌ Lanzará error
 * ```
 */
export const selectWithOptions = async <T = any>(
  table: AllowedTable,
  columns: string = '*',
  options: QueryOptions = {}
): Promise<T[]> => {
  const { orderBy, orderDirection = 'ASC', where } = options

  // Validar tabla
  validateTableName(table)
  const escapedTable = escapeIdentifier(table)

  // Validar y escapar columnas
  const validatedColumns = validateColumns(table, columns)

  let query = `SELECT ${validatedColumns} FROM ${escapedTable}`
  let values: any[] = []

  // Agregar WHERE clause con validación
  if (where) {
    const whereClause = buildWhereClause(table, where)
    query += whereClause.clause
    values.push(...whereClause.values)
  }

  // Agregar ORDER BY con validación
  if (orderBy) {
    const validatedOrderBy = validateOrderBy(table, orderBy)
    const validatedDirection = validateOrderDirection(orderDirection)
    query += ` ORDER BY ${validatedOrderBy} ${validatedDirection}`
  }

  // Agregar LIMIT/OFFSET
  const paginationClause = buildPaginationClause(options)
  query += paginationClause.clause
  values.push(...paginationClause.values)

  return await executeQuery<T>(query, values)
}

/**
 * Cuenta registros con condiciones WHERE.
 *
 * @param table - Tabla donde contar registros
 * @param where - Condiciones para filtrar
 * @returns Número de registros que coinciden con las condiciones
 */
export const countWithConditions = async (
  table: AllowedTable,
  where?: Record<string, any>
): Promise<number> => {
  validateTableName(table)
  const escapedTable = escapeIdentifier(table)

  let query = `SELECT COUNT(*) as count FROM ${escapedTable}`
  let values: any[] = []

  if (where) {
    const whereClause = buildWhereClause(table, where)
    query += whereClause.clause
    values = whereClause.values
  }

  const result = await executeQuerySingle<{ count: number }>(query, values)
  return result?.count || 0
}

/**
 * Inserta un nuevo registro en la tabla especificada.
 *
 * @security Los nombres de tabla y columnas son validados y escapados.
 * Los valores usan prepared statements.
 *
 * @param table - Tabla donde insertar
 * @param data - Datos a insertar
 * @returns ID del registro insertado
 */
export const insertRecord = async (
  table: AllowedTable,
  data: Record<string, any>
): Promise<number> => {
  validateTableName(table)

  // Validar todas las columnas en los datos
  Object.keys(data).forEach(column => validateColumnName(table, column))

  const escapedTable = escapeIdentifier(table)
  const escapedColumns = Object.keys(data).map(col => escapeIdentifier(col)).join(', ')
  const placeholders = Object.keys(data).map(() => '?').join(', ')
  const values = Object.values(data)

  const query = `INSERT INTO ${escapedTable} (${escapedColumns}) VALUES (${placeholders})`
  return await insertAndGetId(query, values)
}

/**
 * Actualiza registros en la tabla especificada.
 *
 * @security Nombres de tabla y columnas validados. WHERE obligatorio para seguridad.
 *
 * @param table - Tabla a actualizar
 * @param data - Datos a actualizar
 * @param where - Condiciones para seleccionar registros a actualizar
 * @returns true si se actualizó al menos un registro
 */
export const updateRecord = async (
  table: AllowedTable,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<boolean> => {
  validateTableName(table)

  // Validar columnas en datos y condiciones
  Object.keys(data).forEach(column => validateColumnName(table, column))
  Object.keys(where).forEach(column => validateColumnName(table, column))

  const escapedTable = escapeIdentifier(table)
  const setClause = Object.keys(data).map(key => `${escapeIdentifier(key)} = ?`).join(', ')
  const whereClause = buildWhereClause(table, where)

  const query = `UPDATE ${escapedTable} SET ${setClause}${whereClause.clause}`
  const values = [...Object.values(data), ...whereClause.values]

  const result = await executeQuery(query, values)
  return (result as any).affectedRows > 0
}

/**
 * Elimina registros de la tabla especificada.
 *
 * @security WHERE obligatorio para prevenir DELETE masivo accidental.
 * Todos los identificadores son validados.
 *
 * @param table - Tabla donde eliminar
 * @param where - Condiciones para seleccionar registros a eliminar
 * @returns true si se eliminó al menos un registro
 */
export const deleteRecord = async (
  table: AllowedTable,
  where: Record<string, any>
): Promise<boolean> => {
  validateTableName(table)

  // Validar columnas en condiciones
  Object.keys(where).forEach(column => validateColumnName(table, column))

  const whereClause = buildWhereClause(table, where)

  if (!whereClause.clause) {
    throw new Error('DELETE queries must have WHERE conditions for safety')
  }

  const escapedTable = escapeIdentifier(table)
  const query = `DELETE FROM ${escapedTable}${whereClause.clause}`
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
  deleteRecord,

  // Exportar funciones de validación para uso externo
  validateTableName,
  validateColumnName,
  validateColumns,
  validateOrderBy,
  escapeIdentifier
}