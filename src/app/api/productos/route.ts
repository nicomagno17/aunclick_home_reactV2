
import { NextRequest, NextResponse } from 'next/server'
import { getMySQLPool } from '@/lib/database'

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
    let queryParams = []
    
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
  // Definir modo desarrollo globalmente para este endpoint
  const MODO_DESARROLLO = false; // Ya está configurado para usar la BD real
  
  let connection
  
  try {
    const data = await request.json()
    console.log('Creando producto:', data)
    
    // Loguear los valores recibidos para debugging
    console.log('Valores para debugging:')
    console.log('- negocio_id:', data.negocio_id, typeof data.negocio_id)
    console.log('- categoria_id:', data.categoria_id, typeof data.categoria_id)
    console.log('- nombre:', data.nombre)
    console.log('- slug:', data.slug)

    // Validaciones básicas con mensajes más específicos
    if (!data.nombre) {
      return NextResponse.json(
        { error: 'Validación fallida', details: 'El campo nombre es requerido' },
        { status: 400 }
      )
    }
    
    if (!data.negocio_id) {
      return NextResponse.json(
        { error: 'Validación fallida', details: 'El campo negocio_id es requerido' },
        { status: 400 }
      )
    }
    
    if (!data.categoria_id) {
      return NextResponse.json(
        { error: 'Validación fallida', details: 'El campo categoria_id es requerido' },
        { status: 400 }
      )
    }
    
    // Log para diagnóstico
    console.log('Datos recibidos en API:', {
      negocio_id: data.negocio_id,
      categoria_id: data.categoria_id,
      nombre: data.nombre,
      slug: data.slug
    })

    // Validaciones de tipos y rangos
    if (data.precio < 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor o igual a 0' },
        { status: 400 }
      )
    }

    if (data.precio_antes !== undefined && data.precio_antes < 0) {
      return NextResponse.json(
        { error: 'El precio anterior debe ser mayor o igual a 0' },
        { status: 400 }
      )
    }

    if (data.stock_disponible < 0) {
      return NextResponse.json(
        { error: 'El stock disponible debe ser mayor o igual a 0' },
        { status: 400 }
      )
    }

    if (data.peso !== undefined && data.peso < 0) {
      return NextResponse.json(
        { error: 'El peso debe ser mayor o igual a 0' },
        { status: 400 }
      )
    }

    const pool = getMySQLPool()
    connection = await pool.getConnection()

    // Convertir los IDs a números si vienen como strings
    const negocio_id = typeof data.negocio_id === 'string' ? parseInt(data.negocio_id, 10) : data.negocio_id;
    const categoria_id = typeof data.categoria_id === 'string' ? parseInt(data.categoria_id, 10) : data.categoria_id;
    
    console.log('IDs convertidos:', { negocio_id, categoria_id });
    
    // NOTA: Durante el desarrollo, usamos validación simulada para permitir la creación de productos
    // sin requerir una base de datos real con negocios y categorías.
    
    if (MODO_DESARROLLO) {
      console.log('Ejecutando en modo desarrollo - saltando validaciones de BD real');
      
      // Simulando datos de negocios
      const negociosSimulados = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const categoriasSimuladas = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
      const productosSimulados: any[] = []; // Simular que no hay productos con el mismo slug
      
      // Verificar negocio
      const negocioExiste = negociosSimulados.some(n => n.id === negocio_id);
      if (!negocioExiste) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `El negocio con ID ${negocio_id} no existe (simulado)` 
          },
          { status: 400 }
        );
      }
      
      // Verificar categoría
      const categoriaExiste = categoriasSimuladas.some(c => c.id === categoria_id);
      if (!categoriaExiste) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `La categoría con ID ${categoria_id} no existe (simulada)` 
          },
          { status: 400 }
        );
      }
      
      // Verificar slug único
      const slugExiste = productosSimulados.some(p => p.slug === data.slug && p.negocio_id === negocio_id);
      if (slugExiste) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `Ya existe un producto con el slug "${data.slug}" en el negocio ID ${negocio_id} (simulado)` 
          },
          { status: 400 }
        );
      }
    } else {
      // Código original para validación con base de datos real
      const [negocioCheck] = await connection.execute(
        'SELECT id FROM negocios WHERE id = ? AND deleted_at IS NULL',
        [negocio_id]
      )
      
      if ((negocioCheck as any[]).length === 0) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `El negocio con ID ${negocio_id} no existe o está eliminado` 
          },
          { status: 400 }
        )
      }
      
      // Log detallado para verificar las filas retornadas
      console.log('Negocio encontrado:', negocioCheck);
  
      const [categoriaCheck] = await connection.execute(
        'SELECT id FROM categorias_productos WHERE id = ?',
        [categoria_id]
      )
      
      console.log('Categoria check result:', categoriaCheck);
      
      if ((categoriaCheck as any[]).length === 0) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `La categoría con ID ${categoria_id} no existe` 
          },
          { status: 400 }
        )
      }
  
      // Verificar que el slug es único para este negocio
      const [slugCheck] = await connection.execute(
        'SELECT id FROM productos WHERE slug = ? AND negocio_id = ? AND deleted_at IS NULL',
        [data.slug, negocio_id]
      )
      
      console.log('Slug check result:', slugCheck);
      
      if ((slugCheck as any[]).length > 0) {
        return NextResponse.json(
          { 
            error: 'Validación fallida', 
            details: `Ya existe un producto con el slug "${data.slug}" en el negocio ID ${negocio_id}` 
          },
          { status: 400 }
        )
      }
    }

    // Preparar datos para inserción
    const insertData = {
      negocio_id: negocio_id,
      categoria_id: categoria_id,
      nombre: data.nombre,
      slug: data.slug,
      descripcion: data.descripcion || null,
      descripcion_corta: data.descripcion_corta || null,
      precio: data.precio,
      precio_antes: data.precio_antes || null,
      moneda: data.moneda || 'COP',
      sku: data.sku || null,
      stock_disponible: data.stock_disponible || 0,
      maneja_stock: data.maneja_stock ? 1 : 0,
      stock_minimo: data.stock_minimo || 0,
      peso: data.peso || null,
      dimensiones: data.dimensiones ? JSON.stringify(data.dimensiones) : null,
      estado: data.estado || 'borrador',
      destacado: data.destacado ? 1 : 0,
      permite_personalizacion: data.permite_personalizacion ? 1 : 0,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
      atributos: data.atributos ? JSON.stringify(data.atributos) : null,
      opciones_personalizacion: data.opciones_personalizacion ? JSON.stringify(data.opciones_personalizacion) : null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      fecha_disponibilidad: data.fecha_disponibilidad ? new Date(data.fecha_disponibilidad).toISOString().split('T')[0] : null
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

    // En modo desarrollo, simulamos la inserción
    let insertId;
    if (MODO_DESARROLLO) {
      // Simular inserción exitosa
      console.log('Simulando inserción en modo desarrollo');
      insertId = Date.now(); // Usar timestamp como ID único
    } else {
      // Inserción real en la base de datos
      const [result] = await connection.execute(insertQuery, insertValues)
      insertId = (result as any).insertId
    }

    // Obtener el producto creado con información adicional
    let newProduct;
    if (MODO_DESARROLLO) {
      // Simular producto creado
      console.log('Simulando obtención de producto creado');
      const negociosSimulados = [
        { id: 1, nombre: 'Negocio Demo 1' },
        { id: 2, nombre: 'Negocio Demo 2' },
        { id: 3, nombre: 'Negocio Demo 3' }
      ];
      const categoriasSimuladas = [
        { id: 1, nombre: 'Electrónicos' },
        { id: 2, nombre: 'Ropa y Accesorios' },
        { id: 3, nombre: 'Hogar y Jardín' },
        { id: 4, nombre: 'Deportes' },
        { id: 5, nombre: 'Libros' }
      ];
      
      const negocio = negociosSimulados.find(n => n.id === negocio_id) || { nombre: 'Negocio Desconocido' };
      const categoria = categoriasSimuladas.find(c => c.id === categoria_id) || { nombre: 'Categoría Desconocida' };
      
      newProduct = [{
        id: insertId,
        ...insertData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        negocio_nombre: negocio.nombre,
        categoria_nombre: categoria.nombre
      }];
    } else {
      // Obtención real desde la base de datos
      [newProduct] = await connection.execute(`
        SELECT 
          p.*,
          n.nombre as negocio_nombre,
          c.nombre as categoria_nombre
        FROM productos p
        LEFT JOIN negocios n ON p.negocio_id = n.id
        LEFT JOIN categorias_productos c ON p.categoria_id = c.id
        WHERE p.id = ?
      `, [insertId])
    }

    // Regresar el producto creado
    if (MODO_DESARROLLO) {
      return NextResponse.json(newProduct[0], { status: 201 })
    } else {
      return NextResponse.json((newProduct as any[])[0], { status: 201 })
    }

  } catch (error) {
    console.error('Error al crear producto:', error)
    
    // Extraer toda la información del error que podamos
    const errorObj = error as any
    
    // Manejo específico de errores de MySQL
    if (errorObj.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { 
          error: 'Ya existe un producto con estos datos únicos',
          details: errorObj.message || '',
          code: errorObj.code
        },
        { status: 400 }
      )
    }
    
    if (errorObj.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { 
          error: 'Referencia inválida a negocio o categoría',
          details: errorObj.message || '',
          code: errorObj.code
        },
        { status: 400 }
      )
    }
    
    // Si es un error de conexión
    if (errorObj.code === 'ECONNREFUSED' || errorObj.errno === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: 'Error de conexión a la base de datos',
          details: 'No se pudo establecer conexión con el servidor MySQL',
          code: errorObj.code || errorObj.errno
        },
        { status: 500 }
      )
    }

    // Error detallado para debugging
    console.error('Error detallado al crear producto:', error)
    console.error('Error stack:', errorObj.stack || 'No stack available')
    console.error('Error code:', errorObj.code || errorObj.errno || 'No code available')
    console.error('Error message:', errorObj.message || 'No message available')
    
    // Manejo más detallado del error para ayudar en depuración
    return NextResponse.json(
      { 
        error: 'Error al crear el producto', 
        details: errorObj.message || (error instanceof Error ? error.message : 'Error desconocido'),
        code: errorObj.code || errorObj.errno || 'UNKNOWN_ERROR',
        sqlState: errorObj.sqlState || null,
        sqlMessage: errorObj.sqlMessage || null
      },
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

    const data = await request.json()
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

    // Construir query de actualización dinámicamente
    const updateFields = []
    const updateValues = []

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
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        
        // Manejar campos especiales
        if (['maneja_stock', 'destacado', 'permite_personalizacion'].includes(field)) {
          updateValues.push(data[field] ? 1 : 0)
        } else if (['dimensiones', 'atributos', 'opciones_personalizacion', 'metadata'].includes(field)) {
          updateValues.push(data[field] ? JSON.stringify(data[field]) : null)
        } else if (field === 'fecha_disponibilidad') {
          updateValues.push(data[field] ? new Date(data[field]).toISOString().split('T')[0] : null)
        } else {
          updateValues.push(data[field])
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
