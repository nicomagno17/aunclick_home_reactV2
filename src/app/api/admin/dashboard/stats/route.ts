import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET() {
  try {
    const [
      totalUsuarios,
      totalNegocios,
      totalProductos,
      // totalVentas // Placeholder for now
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as total FROM usuarios WHERE deleted_at IS NULL'),
      executeQuery('SELECT COUNT(*) as total FROM negocios WHERE deleted_at IS NULL'),
      executeQuery('SELECT COUNT(*) as total FROM productos WHERE deleted_at IS NULL'),
      // executeQuery('SELECT SUM(monto) as total FROM ventas WHERE estado = "completada"'), // Example
    ]);

    const stats = {
      totalUsuarios: (totalUsuarios[0] as any)?.total || 0,
      totalNegocios: (totalNegocios[0] as any)?.total || 0,
      totalProductos: (totalProductos[0] as any)?.total || 0,
      totalVentas: 12500.50, // Placeholder value
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
