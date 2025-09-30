
import { NextRequest, NextResponse } from 'next/server'
import { getMySQLPool } from '@/lib/database'
import { createProductoSchema, updateProductoSchema } from '@/schemas'
import { ZodError } from 'zod'
import { getSession, requireRole, canAccessNegocio, canAccessProducto, handleAuthError } from '@/lib/auth-helpers'

// GET /api/productos - Obtener todos los productos
export async function GET(request: NextRequest) {
  let connection
  
  try {
    const pool = getMySQLPool()
    connection = await pool.getConnection()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const negocio_id = searchParams.get('negocio_id')
    const categoria_id = searchParams.get('categoria_id')
    const estado = searchParams.get('estado')
    const search = searchParams.get('search')
    
    let whereConditions = ['p.deleted_at IS NULL']
    let queryParams: any[] = []
    
    if (negocio_id) {
      whereConditions.push('p.negocio_id = ?')
      queryParams.push(negocio_id)
    }
    
    if (categoria_id) {
      whereConditions.push('p.categoria_id = ?')
      queryParams.push(categoria_id)
    }
    
    if (estado) {
      whereConditions.push('p.estado = ?')
      queryParams.push(estado)
    }
    
    if (search) {
      whereConditions.push('(p.nombre LIKE ? OR p.descripcion LIKE ? OR p.sku LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Consulta para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM productos p 
      ${whereClause}
    `
    
    const [countResult] = await connection.execute(countQuery, queryParams)
    const total = (countResult as any)[0].total
    
    // Consulta principal con paginación
    const offset = (page - 1) * limit
    const query = `
      SELECT 
        p.*,
        n.nombre as negocio_nombre,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN negocios n ON p.negocio_id = n.id
      LEFT JOIN categorias_productos c ON p.categoria_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const finalParams = [...queryParams, limit, offset]
    const [rows] = await connection.execute(query, finalParams)
    
    return NextResponse.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
    
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// POST /api/productos - Crear nuevo producto
export async function POST(request: NextRequest) {
  let connection
  
  try {
    // Verificar autenticación y autorización
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { status: 401 }
      )
    }
    
    // Verificar que el usuario tiene rol adecuado
    if (!['propietario_negocio', 'admin'].includes(session.user?.rol)) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear productos' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validar datos con Zod
    const validation = createProductoSchema.safeParse(data)
    
    if (!validation.success) {
      return NextResponse.json({
        error: 'Datos de entrada inválidos',
        details: validation.error.format()
      }, { status: 400 })
    }
    
    const validatedData = validation.data

    const pool = getMySQLPool()
    connection = await pool.getConnection()

    // Verificar que el negocio y categoría existen
    const [negocioCheck] = await connection.execute(
      'SELECT id FROM negocios WHERE id = ? AND deleted_at IS NULL',
      [validatedData.negocio_id]
    )
    
    if ((negocioCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'El negocio especificado no existe' },
        { status: 400 }
      )
    }

    // Verificar que el usuario tiene acceso al negocio (ownership)
    if (session.user.rol !== 'admin') {
      const canAccess = await canAccessNegocio(session, validatedData.negocio_id)
      if (!canAccess) {
        return NextResponse.json(
          { error: 'No tienes permisos para crear productos en este negocio' },
          { status: 403 }
        )
      }
    }

    const [categoriaCheck] = await connection.execute(
      'SELECT id FROM categorias_productos WHERE id = ?',
      [validatedData.categoria_id]
    )
    
    if ((categoriaCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 }
      )
    }

    // Verificar que el slug es único para este negocio
    const [slugCheck] = await connection.execute(
      'SELECT id FROM productos WHERE slug = ? AND negocio_id = ? AND deleted_at IS NULL',
      [validatedData.slug, validatedData.negocio_id]
    )
    
    if ((slugCheck as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug en el negocio' },
        { status: 400 }
      )
    }

    // Preparar datos para inserción con datos validados y sanitizados
    const insertData = {
      negocio_id: validatedData.negocio_id,
      categoria_id: validatedData.categoria_id,
      nombre: validatedData.nombre,
      slug: validatedData.slug,
      descripcion: validatedData.descripcion || null,
      descripcion_corta: validatedData.descripcion_corta || null,
      precio: validatedData.precio,
      precio_antes: validatedData.precio_antes ?? null,
      moneda: validatedData.moneda,
      sku: validatedData.sku || null,
      stock_disponible: validatedData.stock_disponible,
      maneja_stock: validatedData.maneja_stock ? 1 : 0,
      stock_minimo: validatedData.stock_minimo,
      peso: validatedData.peso ?? null,
      dimensiones: validatedData.dimensiones ? JSON.stringify(validatedData.dimensiones) : null,
      estado: validatedData.estado,
      destacado: validatedData.destacado ? 1 : 0,
      permite_personalizacion: validatedData.permite_personalizacion ? 1 : 0,
      seo_title: validatedData.seo_title || null,
      seo_description: validatedData.seo_description || null,
      seo_keywords: validatedData.seo_keywords || null,
      atributos: validatedData.atributos ? JSON.stringify(validatedData.atributos) : null,
      opciones_personalizacion: validatedData.opciones_personalizacion ? JSON.stringify(validatedData.opciones_personalizacion) : null,
      metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : null,
      fecha_disponibilidad: validatedData.fecha_disponibilidad ? new Date(validatedData.fecha_disponibilidad).toISOString().split('T')[0] : null
    }

    // Insertar producto
    const insertQuery = `
      INSERT INTO productos (
        negocio_id, categoria_id, nombre, slug, descripcion, descripcion_corta,
        precio, precio_antes, moneda, sku, stock_disponible, maneja_stock, stock_minimo,
        peso, dimensiones, estado, destacado, permite_personalizacion,
        seo_title, seo_description, seo_keywords, atributos, opciones_personalizacion,
        metadata, fecha_disponibilidad
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const insertValues = [
      insertData.negocio_id,
      insertData.categoria_id,
      insertData.nombre,
      insertData.slug,
      insertData.descripcion,
      insertData.descripcion_corta,
      insertData.precio,
      insertData.precio_antes,
      insertData.moneda,
      insertData.sku,
      insertData.stock_disponible,
      insertData.maneja_stock,
      insertData.stock_minimo,
      insertData.peso,
      insertData.dimensiones,
      insertData.estado,
      insertData.destacado,
      insertData.permite_personalizacion,
      insertData.seo_title,
      insertData.seo_description,
      insertData.seo_keywords,
      insertData.atributos,
      insertData.opciones_personalizacion,
      insertData.metadata,
      insertData.fecha_disponibilidad
    ]

    const [result] = await connection.execute(insertQuery, insertValues)
    const insertId = (result as any).insertId

    // Obtener el producto creado con información adicional
    const [newProduct] = await connection.execute(`
      SELECT 
        p.*,
        n.nombre as negocio_nombre,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN negocios n ON p.negocio_id = n.id
      LEFT JOIN categorias_productos c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [insertId])

    return NextResponse.json((newProduct as any[])[0], { status: 201 })

  } catch (error) {
    console.error('Error al crear producto:', error)
    
    // Manejo específico de errores de MySQL
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe un producto con estos datos únicos' },
        { status: 400 }
      )
    }
    
    if ((error as any).code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { error: 'Referencia inválida a negocio o categoría' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// PUT /api/productos/[id] - Actualizar producto
export async function PUT(request: NextRequest) {
  let connection
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      )
    }

    // Verificar autenticación
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { status: 401 }
      )
    }
    
    // Verificar que el usuario tiene rol adecuado
    if (!['propietario_negocio', 'admin'].includes(session.user?.rol)) {
      return NextResponse.json(
        { error: 'No tienes permisos para modificar productos' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validar datos con Zod (permite actualizaciones parciales)
    const validation = updateProductoSchema.safeParse(data)
    
    if (!validation.success) {
      return NextResponse.json({
        error: 'Datos de entrada inválidos',
        details: validation.error.format()
      }, { status: 400 })
    }
    
    const validatedData = validation.data
    
    const pool = getMySQLPool()
    connection = await pool.getConnection()

    // Verificar que el producto existe
    const [productCheck] = await connection.execute(
      'SELECT id FROM productos WHERE id = ? AND deleted_at IS NULL',
      [id]
    )
    
    if ((productCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el usuario tiene acceso al producto (ownership)
    if (session.user.rol !== 'admin') {
      const canAccess = await canAccessProducto(session, Number(id))
      if (!canAccess) {
        return NextResponse.json(
          { error: 'No tienes permisos para modificar este producto' },
          { status: 403 }
        )
      }
    }

    // Construir query de actualización dinámicamente
    const updateFields: string[] = []
    const updateValues: any[] = []

    // Lista de campos actualizables
    const allowedFields = [
      'categoria_id', 'nombre', 'slug', 'descripcion', 'descripcion_corta',
      'precio', 'precio_antes', 'moneda', 'sku', 'stock_disponible', 
      'maneja_stock', 'stock_minimo', 'peso', 'dimensiones', 'estado',
      'destacado', 'permite_personalizacion', 'seo_title', 'seo_description',
      'seo_keywords', 'atributos', 'opciones_personalizacion', 'metadata',
      'fecha_disponibilidad'
    ]

    for (const field of allowedFields) {
      if (validatedData[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        
        // Manejar campos especiales
        if (['maneja_stock', 'destacado', 'permite_personalizacion'].includes(field)) {
          updateValues.push(validatedData[field] ? 1 : 0)
        } else if (['dimensiones', 'atributos', 'opciones_personalizacion', 'metadata'].includes(field)) {
          updateValues.push(validatedData[field] ? JSON.stringify(validatedData[field]) : null)
        } else if (field === 'fecha_disponibilidad') {
          updateValues.push(validatedData[field] ? new Date(validatedData[field]).toISOString().split('T')[0] : null)
        } else if (field === 'precio_antes' || field === 'peso') {
          updateValues.push(validatedData[field] ?? null)
        } else {
          updateValues.push(validatedData[field])
        }
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      )
    }

    // Agregar updated_at
    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(id)

    const updateQuery = `
      UPDATE productos 
      SET ${updateFields.join(', ')} 
      WHERE id = ? AND deleted_at IS NULL
    `

    await connection.execute(updateQuery, updateValues)

    // Obtener el producto actualizado
    const [updatedProduct] = await connection.execute(`
      SELECT 
        p.*,
        n.nombre as negocio_nombre,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN negocios n ON p.negocio_id = n.id
      LEFT JOIN categorias_productos c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id])

    return NextResponse.json((updatedProduct as any[])[0])

  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// DELETE /api/productos/[id] - Eliminar producto (soft delete)
export async function DELETE(request: NextRequest) {
  let connection
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      )
    }

    // Verificar autenticación
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { status: 401 }
      )
    }
    
    // Verificar que el usuario tiene rol adecuado
    if (!['propietario_negocio', 'admin'].includes(session.user?.rol)) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar productos' },
        { status: 403 }
      )
    }

    const pool = getMySQLPool()
    connection = await pool.getConnection()

    // Verificar que el producto existe
    const [productCheck] = await connection.execute(
      'SELECT id FROM productos WHERE id = ? AND deleted_at IS NULL',
      [id]
    )
    
    if ((productCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el usuario tiene acceso al producto (ownership)
    if (session.user.rol !== 'admin') {
      const canAccess = await canAccessProducto(session, Number(id))
      if (!canAccess) {
        return NextResponse.json(
          { error: 'No tienes permisos para eliminar este producto' },
          { status: 403 }
        )
      }
    }

    // Soft delete
    await connection.execute(
      'UPDATE productos SET deleted_at = CURRENT_TIMESTAMP, estado = "eliminado" WHERE id = ?',
      [id]
    )

    return NextResponse.json({ message: 'Producto eliminado correctamente' })

  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
