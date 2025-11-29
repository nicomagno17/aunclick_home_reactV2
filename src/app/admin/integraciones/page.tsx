'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plug, CheckCircle, XCircle, AlertTriangle, Plus, Settings, RefreshCw } from 'lucide-react'

export default function IntegracionesPage() {
    const [integrations, setIntegrations] = useState([
        {
            id: 1,
            name: 'Stripe',
            description: 'Procesamiento de pagos',
            status: 'connected',
            lastSync: '2024-01-15 15:30:00',
            icon: '💳'
        },
        {
            id: 2,
            name: 'SendGrid',
            description: 'Envío de emails',
            status: 'connected',
            lastSync: '2024-01-15 15:25:00',
            icon: '📧'
        },
        {
            id: 3,
            name: 'Google Analytics',
            description: 'Análisis de tráfico',
            status: 'error',
            lastSync: '2024-01-15 14:00:00',
            icon: '📊'
        },
        {
            id: 4,
            name: 'Slack',
            description: 'Notificaciones del equipo',
            status: 'disconnected',
            lastSync: '2024-01-14 10:00:00',
            icon: '💬'
        }
    ])

    const [newIntegration, setNewIntegration] = useState({
        name: '',
        type: '',
        apiKey: '',
        webhookUrl: ''
    })

    const [showAddForm, setShowAddForm] = useState(false)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'error':
                return <XCircle className="h-4 w-4 text-red-400" />
            case 'disconnected':
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-400" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
                return <Badge className="bg-green-500">Conectado</Badge>
            case 'error':
                return <Badge className="bg-red-500">Error</Badge>
            case 'disconnected':
            default:
                return <Badge className="bg-yellow-500">Desconectado</Badge>
        }
    }

    const handleConnect = (id: number) => {
        setIntegrations(prev => prev.map(integration =>
            integration.id === id
                ? { ...integration, status: 'connected', lastSync: new Date().toLocaleString() }
                : integration
        ))
        alert('Integración conectada exitosamente')
    }

    const handleDisconnect = (id: number) => {
        if (confirm('¿Estás seguro de que quieres desconectar esta integración?')) {
            setIntegrations(prev => prev.map(integration =>
                integration.id === id
                    ? { ...integration, status: 'disconnected' }
                    : integration
            ))
            alert('Integración desconectada')
        }
    }

    const handleSync = (id: number) => {
        setIntegrations(prev => prev.map(integration =>
            integration.id === id
                ? { ...integration, lastSync: new Date().toLocaleString() }
                : integration
        ))
        alert('Sincronización iniciada')
    }

    const handleAddIntegration = () => {
        if (newIntegration.name && newIntegration.type) {
            const integration = {
                id: integrations.length + 1,
                name: newIntegration.name,
                description: `Integración de ${newIntegration.type}`,
                status: 'disconnected',
                lastSync: 'Nunca',
                icon: '🔌'
            }
            setIntegrations([integration, ...integrations])
            setNewIntegration({ name: '', type: '', apiKey: '', webhookUrl: '' })
            setShowAddForm(false)
            alert('Integración agregada exitosamente')
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Plug className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Integraciones</h1>
                    <p className="text-gray-400">Gestiona las integraciones con servicios externos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Integraciones */}
                <div className="lg:col-span-2 space-y-4">
                    {integrations.map((integration) => (
                        <Card key={integration.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{integration.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                                            <p className="text-gray-400 text-sm">{integration.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(integration.status)}
                                        {getStatusBadge(integration.status)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm text-gray-400">
                                        <p>Última sincronización: {integration.lastSync}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {integration.status === 'connected' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSync(integration.id)}
                                                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center gap-1"
                                            >
                                                <RefreshCw className="h-3 w-3" />
                                                Sincronizar
                                            </Button>
                                        )}
                                        {integration.status === 'connected' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDisconnect(integration.id)}
                                                className="border-red-600 text-red-400 hover:bg-red-900"
                                            >
                                                Desconectar
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => handleConnect(integration.id)}
                                                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                                            >
                                                Conectar
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            <Settings className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Agregar Nueva Integración */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Plus className="h-5 w-5 text-yellow-400" />
                            Nueva Integración
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!showAddForm ? (
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                            >
                                Agregar Integración
                            </Button>
                        ) : (
                            <>
                                <div>
                                    <Label htmlFor="name" className="text-gray-300">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={newIntegration.name}
                                        onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ej: Mi Servicio"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                                    <Select value={newIntegration.type} onValueChange={(value) => setNewIntegration(prev => ({ ...prev, type: value }))}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="payment">Pago</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="analytics">Análisis</SelectItem>
                                            <SelectItem value="notification">Notificación</SelectItem>
                                            <SelectItem value="storage">Almacenamiento</SelectItem>
                                            <SelectItem value="api">API</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="apiKey" className="text-gray-300">API Key</Label>
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        value={newIntegration.apiKey}
                                        onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                                        placeholder="Ingresa tu API key"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="webhookUrl" className="text-gray-300">Webhook URL (opcional)</Label>
                                    <Input
                                        id="webhookUrl"
                                        value={newIntegration.webhookUrl}
                                        onChange={(e) => setNewIntegration(prev => ({ ...prev, webhookUrl: e.target.value }))}
                                        placeholder="https://tu-webhook-url.com"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddIntegration}
                                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                                    >
                                        Agregar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Estadísticas de Integraciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Integraciones</p>
                                <p className="text-2xl font-bold text-white">{integrations.length}</p>
                            </div>
                            <Plug className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Conectadas</p>
                                <p className="text-2xl font-bold text-white">
                                    {integrations.filter(i => i.status === 'connected').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Con Errores</p>
                                <p className="text-2xl font-bold text-white">
                                    {integrations.filter(i => i.status === 'error').length}
                                </p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Desconectadas</p>
                                <p className="text-2xl font-bold text-white">
                                    {integrations.filter(i => i.status === 'disconnected').length}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
