
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Database, Users, CheckCircle, XCircle } from 'lucide-react'

interface Usuario {
  id: number
  uuid: string
  email: string
  nombre: string
  apellidos?: string
  telefono?: string
  estado: 'activo' | 'inactivo' | 'suspendido' | 'pendiente_verificacion'
  rol: 'usuario' | 'propietario_negocio' | 'moderador' | 'admin'
  email_verificado_at?: string
  ultimo_acceso?: string
  created_at: string
  updated_at: string
}

interface ConnectionStatus {
  mysql: {
    success: boolean
    message: string
    serverInfo?: string
    error?: string
  }
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const { toast } = useToast()

  const testConnection = async () => {
    setTestingConnection(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      setConnectionStatus(data.connection)
      
      if (data.success) {
        toast({
          title: "Conexión exitosa",
          description: "La conexión a MySQL se estableció correctamente",
          variant: "default"
        })
      } else {
        toast({
          title: "Error de conexión",
          description: data.error || "No se pudo conectar a la base de datos",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al probar la conexión",
        variant: "destructive"
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const loadUsuarios = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/usuarios')
      const data = await response.json()
      
      if (data.success) {
        setUsuarios(data.usuarios)
        toast({
          title: "Datos cargados",
          description: `Se encontraron ${data.usuarios.length} usuarios`,
          variant: "default"
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al cargar usuarios",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al conectar con la API",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activo': return 'default'
      case 'inactivo': return 'secondary'
      case 'suspendido': return 'destructive'
      case 'pendiente_verificacion': return 'outline'
      default: return 'secondary'
    }
  }

  const getRolBadgeVariant = (rol: string) => {
    switch (rol) {
      case 'admin': return 'destructive'
      case 'moderador': return 'default'
      case 'propietario_negocio': return 'secondary'
      case 'usuario': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      </div>

      {/* Card de estado de conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado de Conexión MySQL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={testConnection} 
              disabled={testingConnection}
              variant="outline"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Probar Conexión
                </>
              )}
            </Button>
            
            {connectionStatus && (
              <div className="flex items-center gap-2">
                {connectionStatus.mysql.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={connectionStatus.mysql.success ? 'text-green-600' : 'text-red-600'}>
                  {connectionStatus.mysql.message}
                </span>
              </div>
            )}
          </div>
          
          {connectionStatus?.mysql.serverInfo && (
            <p className="text-sm text-gray-600">
              Servidor: {connectionStatus.mysql.serverInfo}
            </p>
          )}
          
          {connectionStatus?.mysql.error && (
            <p className="text-sm text-red-600">
              Error: {connectionStatus.mysql.error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuarios Registrados
            </div>
            <Button onClick={loadUsuarios} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar Usuarios'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay usuarios cargados. Haz clic en "Cargar Usuarios" para ver los datos.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usuarios.map((usuario) => (
                  <Card key={usuario.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{usuario.nombre} {usuario.apellidos}</h3>
                        <Badge variant={getEstadoBadgeVariant(usuario.estado)}>
                          {usuario.estado}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      
                      {usuario.telefono && (
                        <p className="text-sm text-gray-600">📞 {usuario.telefono}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={getRolBadgeVariant(usuario.rol)}>
                          {usuario.rol}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          ID: {usuario.id}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Creado: {new Date(usuario.created_at).toLocaleDateString()}</p>
                        {usuario.ultimo_acceso && (
                          <p>Último acceso: {new Date(usuario.ultimo_acceso).toLocaleDateString()}</p>
                        )}
                        {usuario.email_verificado_at ? (
                          <p className="text-green-600">✅ Email verificado</p>
                        ) : (
                          <p className="text-orange-600">⏳ Email pendiente</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-500">
                Total: {usuarios.length} usuarios encontrados
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
