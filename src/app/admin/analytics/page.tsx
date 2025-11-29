'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Eye, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
    const stats = [
        {
            title: 'Visitas Totales',
            value: '24,563',
            change: '+12.5%',
            icon: Eye,
            color: 'text-blue-400'
        },
        {
            title: 'Usuarios Activos',
            value: '1,234',
            change: '+8.2%',
            icon: Users,
            color: 'text-green-400'
        },
        {
            title: 'Ventas',
            value: '456',
            change: '+23.1%',
            icon: ShoppingCart,
            color: 'text-yellow-400'
        },
        {
            title: 'Ingresos',
            value: '$2.3M',
            change: '+18.7%',
            icon: DollarSign,
            color: 'text-purple-400'
        }
    ]

    const chartData = [
        { name: 'Ene', visitas: 4000, ventas: 240 },
        { name: 'Feb', visitas: 3000, ventas: 139 },
        { name: 'Mar', visitas: 2000, ventas: 380 },
        { name: 'Abr', visitas: 2780, ventas: 390 },
        { name: 'May', visitas: 1890, ventas: 480 },
        { name: 'Jun', visitas: 2390, ventas: 380 },
        { name: 'Jul', visitas: 3490, ventas: 430 }
    ]

    const topProducts = [
        { name: 'Producto Premium', sales: 234, revenue: '$45,678' },
        { name: 'Producto Estándar', sales: 189, revenue: '$23,456' },
        { name: 'Producto Básico', sales: 156, revenue: '$12,345' },
        { name: 'Servicio Plus', sales: 98, revenue: '$8,901' }
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400">Estadísticas y métricas de tu negocio</p>
                </div>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-green-400">
                                {stat.change} respecto al mes anterior
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Visitas y Ventas */}
                <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-yellow-400" />
                            Visitas y Ventas Mensuales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {chartData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-300 w-12">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-400 h-2 rounded-full"
                                                    style={{ width: `${(item.visitas / 4000) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-blue-400 text-sm w-16">{item.visitas}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${(item.ventas / 480) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-yellow-400 text-sm w-12">{item.ventas}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                                <span className="text-gray-300 text-sm">Visitas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                                <span className="text-gray-300 text-sm">Ventas</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Productos Más Vendidos */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-yellow-400" />
                            Productos Más Vendidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-medium">{product.name}</h4>
                                        <p className="text-gray-400 text-sm">{product.sales} ventas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">{product.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actividad Reciente */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-yellow-400" />
                            Actividad Reciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">Nuevo usuario registrado</p>
                                    <p className="text-gray-400 text-xs">Hace 2 minutos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">Venta completada #1234</p>
                                    <p className="text-gray-400 text-xs">Hace 15 minutos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">Producto actualizado</p>
                                    <p className="text-gray-400 text-xs">Hace 1 hora</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">Nuevo comentario</p>
                                    <p className="text-gray-400 text-xs">Hace 2 horas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">Usuario eliminado</p>
                                    <p className="text-gray-400 text-xs">Hace 3 horas</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
