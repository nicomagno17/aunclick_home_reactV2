import { NextResponse } from 'next/server';
import { 
  executeQuery, 
  executeQuerySingle 
} from '@/lib/database';
import { 
  selectWithOptions, 
  countWithConditions, 
  insertRecord, 
  updateRecord, 
  deleteRecord 
} from '@/lib/mysql-helpers';

// GET para obtener todos los planes o con filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const orderBy = searchParams.get('orderBy') || 'id';
    const orderDirection = (searchParams.get('orderDirection') || 'ASC') as 'ASC' | 'DESC';
    
    // Construir filtros dinámicamente desde searchParams
    const where: Record<string, any> = {};
    if (searchParams.has('activo')) {
      where.activo = searchParams.get('activo') === 'true' ? 1 : 0;
    }
    
    // Buscar por nombre si se proporciona
    if (searchParams.has('nombre')) {
      where.nombre = `%${searchParams.get('nombre')}%`;
    }
    
    // Obtener datos con paginación y filtros
    const data = await selectWithOptions('planes_suscripcion', '*', {
      page, 
      limit, 
      orderBy, 
      orderDirection,
      where
    });
    
    // Contar total de registros para metadata de paginación
    const total = await countWithConditions('planes_suscripcion', where);
    
    return NextResponse.json({ 
      data, 
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error al obtener planes de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

// POST para crear un nuevo plan
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.nombre || !data.precio || !data.periodo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    
    // Insertar en la base de datos
    const id = await insertRecord('planes_suscripcion', {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    // Obtener el registro recién creado
    const newPlan = await executeQuerySingle(
      'SELECT * FROM planes_suscripcion WHERE id = ?',
      [id]
    );
    
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Error al crear plan de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}