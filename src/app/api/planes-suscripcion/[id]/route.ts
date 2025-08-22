import { NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/database';
import { updateRecord, deleteRecord } from '@/lib/mysql-helpers';

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
    const data = await request.json();
    
    // Validar que el ID es un número
    if (isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Validación básica
    if (!data.nombre || !data.precio || !data.periodo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    
    // Actualizar en la base de datos
    const updated = await updateRecord(
      'planes_suscripcion', 
      {
        ...data,
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
    
    // Validar que el ID es un número
    if (isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Eliminar de la base de datos
    const deleted = await deleteRecord('planes_suscripcion', { id: Number(id) });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Plan no encontrado o no eliminado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan de suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}