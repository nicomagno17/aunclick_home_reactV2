'use client'

import { useState } from 'react'
import { ResponsiveContentContainer, ResponsiveCard, ResponsiveText } from '@/components/admin/ResponsiveContentContainer'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react'

const statsData = [
  { title: 'Usuarios Activos', value: '2,543', change: '+12%', icon: Users, color: 'from-blue-500 to-indigo-600' },
  { title: 'Ventas Hoy', value: '$45,678', change: '+8%', icon: ShoppingCart, color: 'from-green-500 to-emerald-600' },
  { title: 'Productos', value: '1,234', change: '+23', icon: Package, color: 'from-purple-500 to-pink-600' },
  { title: 'Tasa Conversión', value: '3.2%', change: '+0.5%', icon: TrendingUp, color: 'from-yellow-500 to-orange-600' }
]

const recentActivity = [
  { id: 1, user: 'Juan Pérez', action: 'Compró producto X', time: 'Hace 2 min', icon: ShoppingCart },
  { id: 2, user: 'María García', action: 'Se registró', time: 'Hace 5 min', icon: Users },
  { id: 3, user: 'Carlos López', action: 'Actualizó perfil', time: 'Hace 10 min', icon: Activity },
  { id: 4, user: 'Ana Martínez', action: 'Dejó reseña', time: 'Hace 15 min', icon: Star }
]

export default function DemoResponsivePage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <ResponsiveText variant="heading" className="text-white font-bold mb-2">
          Dashboard Responsivo Demo
        </ResponsiveText>
        <ResponsiveText variant="body" className="text-gray-300">
          Este contenido se adapta dinámicamente según el estado del aside y el tamaño de pantalla.
        </ResponsiveText>
      </div>

      {/* Stats Grid */}
      <ResponsiveContentContainer enableGrid gridCols={4}>
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <ResponsiveCard
              key={index}
              clickable
              onClick={() => setSelectedCard(selectedCard === index ? null : index)}
              className={cn(
                'cursor-pointer transform transition-all duration-300',
                selectedCard === index && 'ring-2 ring-yellow-400 scale-105'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <ResponsiveText variant="caption" className="text-gray-500 uppercase tracking-wider">
                    {stat.title}
                  </ResponsiveText>
                  <ResponsiveText variant="heading" className="text-gray-900 dark:text-white font-bold mt-1">
                    {stat.value}
                  </ResponsiveText>
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <ResponsiveText variant="caption" className="text-green-600">
                      {stat.change}
                    </ResponsiveText>
                  </div>
                </div>
                <div className={cn(
                  'w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center text-white',
                  stat.color
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </ResponsiveCard>
          )
        })}
      </ResponsiveContentContainer>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <ResponsiveCard className="h-96">
          <div className="flex items-center justify-between mb-4">
            <ResponsiveText variant="subheading" className="text-gray-900 dark:text-white font-semibold">
              Actividad Reciente
            </ResponsiveText>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <ResponsiveText variant="body" className="text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-500 ml-2">{activity.action}</span>
                    </ResponsiveText>
                    <ResponsiveText variant="caption" className="text-gray-400">
                      {activity.time}
                    </ResponsiveText>
                  </div>
                </div>
              )
            })}
          </div>
        </ResponsiveCard>

        {/* Quick Actions */}
        <ResponsiveCard className="h-96">
          <div className="flex items-center justify-between mb-4">
            <ResponsiveText variant="subheading" className="text-gray-900 dark:text-white font-semibold">
              Acciones Rápidas
            </ResponsiveText>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: 'Nuevo Producto', color: 'from-blue-500 to-indigo-600' },
              { icon: Users, label: 'Gestión Usuarios', color: 'from-green-500 to-emerald-600' },
              { icon: BarChart3, label: 'Ver Reportes', color: 'from-purple-500 to-pink-600' },
              { icon: PieChart, label: 'Analytics', color: 'from-yellow-500 to-orange-600' }
            ].map((action, index) => {
              const IconComponent = action.icon
              return (
                <button
                  key={index}
                  className={cn(
                    'p-4 rounded-lg bg-gradient-to-r text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    'flex flex-col items-center justify-center space-y-2',
                    action.color
                  )}
                >
                  <IconComponent className="w-8 h-8" />
                  <ResponsiveText variant="caption" className="text-white text-center">
                    {action.label}
                  </ResponsiveText>
                </button>
              )
            })}
          </div>
        </ResponsiveCard>
      </div>

      {/* Instructions */}
      <ResponsiveCard className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <ResponsiveText variant="subheading" className="text-gray-900 dark:text-white font-semibold mb-3">
          🎯 Características de Responsividad Demostradas:
        </ResponsiveText>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Adaptación automática:</strong> El contenido se ajusta según el tamaño de pantalla
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Aside dinámico:</strong> El contenido se reorganiza cuando el aside se colapsa/expande
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Grid responsivo:</strong> Las tarjetas cambian de columna automáticamente
            </ResponsiveText>
          </div>
          <div className="space-y-2">
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Texto escalable:</strong> Los tamaños de fuente se ajustan al espacio disponible
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Transiciones suaves:</strong> Todos los cambios tienen animaciones fluidas
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-gray-700 dark:text-gray-300">
              • <strong>Experiencia mobile-first:</strong> Optimizado para dispositivos táctiles
            </ResponsiveText>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  )
}