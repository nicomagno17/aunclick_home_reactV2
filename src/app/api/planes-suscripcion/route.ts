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
import { createPlanSuscripcionSchema } from '@/schemas';
import { ZodError } from 'zod';
import { requireRole, handleAuthError } from '@/lib/auth-helpers';
import logger, { setCorrelationContextFromRequest } from '@/lib/logger'
import { handleError, validationError, successResponse } from '@/lib/error-handler'

// GET para obtener todos los planes o con filtros
export async function GET(request: Request) {
  // Set correlation context from request headers
  setCorrelationContextFromRequest(request)
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const orderBy = searchParams.get('orderBy') || 'id';
    const orderDirection = (searchParams.get('orderDirection') || 'ASC') as 'ASC' | 'DESC';
    
    // Construir filtros dinámicamente desde searchParams
    const where: Record<string, any> = {};
    
    // Para usuarios no autenticados, solo mostrar planes activos
    if (!searchParams.has('activo') || searchParams.get('activo') === 'true') {
      where.activo = 1;
    }
    
    // Buscar por nombre si se proporciona
    if (searchParams.has('nombre')) {
      where.nombre = `%${searchParams.get('nombre')}%`;
    }
    
    await logger.debug('Fetching subscription plans', { 
      endpoint: '/api/planes-suscripcion', 
      method: 'GET', 
      filters: where, 
      pagination: { page, limit, orderBy, orderDirection } 
    });
    
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

    await logger.info(`Retrieved ${data.length} subscription plans`, { 
      endpoint: '/api/planes-suscripcion', 
      method: 'GET', 
      total, 
      page, 
      limit 
    });
    
    return successResponse({ 
      planes: data, 
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(error as Error, { 
      endpoint: '/api/planes-suscripcion', 
      method: 'GET' 
    });
  }
}

// POST para crear un nuevo plan
export async function POST(request: Request) {
  // Set correlation context from request headers
  setCorrelationContextFromRequest(request)
  
  try {
    // Verificar autorización - solo admins pueden crear planes
    const authResult = await requireRole(['admin'])
    const authError = handleAuthError(authResult)
    if (authError) return authError

    const data = await request.json();
    
    await logger.debug('Creating new subscription plan', { 
      endpoint: '/api/planes-suscripcion', 
      method: 'POST', 
      nombre: data.nombre 
    });
    
    // Validar datos con Zod
    const validation = createPlanSuscripcionSchema.safeParse(data);
    
    if (!validation.success) {
      return validationError('Datos de entrada inválidos', validation.error.format(), { 
        endpoint: '/api/planes-suscripcion', 
        method: 'POST' 
      });
    }
    
    const validatedData = validation.data;
    
    // Insertar en la base de datos con datos validados y sanitizados
    const id = await insertRecord('planes_suscripcion', {
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    // Obtener el registro recién creado
    const newPlan = await executeQuerySingle(
      'SELECT * FROM planes_suscripcion WHERE id = ?',
      [id]
    );
    
    await logger.info('Subscription plan created successfully', { 
      endpoint: '/api/planes-suscripcion', 
      method: 'POST', 
      planId: id, 
      nombre: validatedData.nombre 
    });
    
    return successResponse(newPlan, 201);
  } catch (error) {
    return handleError(error as Error, { 
      endpoint: '/api/planes-suscripcion', 
      method: 'POST' 
    });
  }
}