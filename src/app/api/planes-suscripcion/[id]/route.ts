import { NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/database';
import { updateRecord, deleteRecord } from '@/lib/mysql-helpers';
import { updatePlanSuscripcionSchema } from '@/schemas';
import { ZodError } from 'zod';
import { requireRole, handleAuthError } from '@/lib/auth-helpers';

// GET para obtener un plan por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validar que el ID es un número
    if (isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Buscar en la base de datos
    const plan = await executeQuerySingle(
      'SELECT * FROM planes_suscripcion WHERE id = ?',
      [id]
    );
    
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error al obtener plan de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

// PUT para actualizar un plan
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autorización - solo admins pueden modificar planes
    const authResult = await requireRole(['admin'])
    const authError = handleAuthError(authResult)
    if (authError) return authError

    const data = await request.json();
    
    // Validar que el ID es un número positivo
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Validar datos con Zod (permite actualizaciones parciales)
    const validation = updatePlanSuscripcionSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json({
        error: 'Datos de entrada inválidos',
        details: validation.error.format()
      }, { status: 400 });
    }
    
    const validatedData = validation.data;
    
    // Actualizar en la base de datos con datos validados y sanitizados
    const updated = await updateRecord(
      'planes_suscripcion', 
      {
        ...validatedData,
        updated_at: new Date(),
      },
      { id: Number(id) }
    );
    
    if (!updated) {
      return NextResponse.json({ error: 'Plan no encontrado o no actualizado' }, { status: 404 });
    }
    
    // Obtener el registro actualizado
    const updatedPlan = await executeQuerySingle(
      'SELECT * FROM planes_suscripcion WHERE id = ?',
      [id]
    );
    
    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Error al actualizar plan de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

// DELETE para eliminar un plan
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autorización - solo admins pueden eliminar planes
    const authResult = await requireRole(['admin'])
    const authError = handleAuthError(authResult)
    if (authError) return authError
    
    // Validar que el ID es un número positivo
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Verificar que el plan no esté en uso por negocios activos
    const negociosConPlan = await executeQuerySingle(
      'SELECT COUNT(*) as count FROM negocios WHERE plan_id = ? AND deleted_at IS NULL',
      [Number(id)]
    )
    
    if (negociosConPlan && negociosConPlan.count > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un plan que está en uso por negocios activos' },
        { status: 400 }
      )
    }
    
    // Verificar que el plan no esté asignado a usuarios
    const usuariosConPlan = await executeQuerySingle(
      'SELECT COUNT(*) as count FROM usuarios WHERE plan_id = ? AND deleted_at IS NULL',
      [Number(id)]
    )
    
    if (usuariosConPlan && usuariosConPlan.count > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un plan que está asignado a usuarios' },
        { status: 400 }
      )
    }
    
    // Soft delete en lugar de DELETE físico
    const deleted = await updateRecord(
      'planes_suscripcion',
      { 
        activo: false, 
        deleted_at: new Date(),
        updated_at: new Date()
      },
      { id: Number(id) }
    );
    
    if (!deleted) {
      return NextResponse.json({ error: 'Plan no encontrado o no eliminado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}