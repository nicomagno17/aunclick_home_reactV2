'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Search, Filter, Download, AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

export default function LogsPage() {
    const [logs, setLogs] = useState([
        {
            id: 1,
            timestamp: '2024-01-15 14:30:25',
            level: 'error',
            message: 'Error al conectar con la base de datos',
            module: 'Database',
            user: 'system',
            details: 'Connection timeout after 30 seconds'
        },
        {
            id: 2,
            timestamp: '2024-01-15 14:25:10',
            level: 'warning',
            message: 'Intento de acceso fallido',
            module: 'Auth',
            user: 'user@example.com',
            details: 'Invalid password for user user@example.com'
        },
        {
            id: 3,
            timestamp: '2024-01-15 14:20:05',
            level: 'info',
            message: 'Usuario inició sesión',
            module: 'Auth',
            user: 'admin@site.com',
            details: 'Successful login from IP 192.168.1.100'
        },
        {
            id: 4,
            timestamp: '2024-01-15 14:15:30',
            level: 'success',
            message: 'Producto actualizado exitosamente',
            module: 'Products',
            user: 'admin',
            details: 'Product ID: 12345 updated'
        },
        {
            id: 5,
            timestamp: '2024-01-15 14:10:15',
            level: 'info',
            message: 'Sistema iniciado',
            module: 'System',
            user: 'system',
            details: 'All services started successfully'
        }
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [filterLevel, setFilterLevel] = useState('all')
    const [filterModule, setFilterModule] = useState('all')
    const [selectedLog, setSelectedLog] = useState(null)

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error':
                return <X className="h-4 w-4 text-red-400" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'info':
            default:
                return <Info className="h-4 w-4 text-blue-400" />
        }
    }

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'error':
                return <Badge className="bg-red-500">Error</Badge>
            case 'warning':
                return <Badge className="bg-yellow-500">Advertencia</Badge>
            case 'success':
                return <Badge className="bg-green-500">Éxito</Badge>
            case 'info':
            default:
                return <Badge className="bg-blue-500">Info</Badge>
        }
    }

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLevel = filterLevel === 'all' || log.level === filterLevel
        const matchesModule = filterModule === 'all' || log.module === filterModule
        return matchesSearch && matchesLevel && matchesModule
    })

    const handleExportLogs = () => {
        const csvContent = [
            ['Timestamp', 'Level', 'Module', 'User', 'Message', 'Details'],
            ...filteredLogs.map(log => [
                log.timestamp,
                log.level,
                log.module,
                log.user,
                log.message,
                log.details
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const handleClearLogs = () => {
        if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
            setLogs([])
            alert('Logs limpiados exitosamente')
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Logs del Sistema</h1>
                    <p className="text-gray-400">Monitorea la actividad y eventos del sistema</p>
                </div>
            </div>

            {/* Filtros y Acciones */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar logs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <Select value={filterLevel} onValueChange={setFilterLevel}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="warning">Advertencia</SelectItem>
                                    <SelectItem value="success">Éxito</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterModule} onValueChange={setFilterModule}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-[150px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="Auth">Autenticación</SelectItem>
                                    <SelectItem value="Database">Base de Datos</SelectItem>
                                    <SelectItem value="Products">Productos</SelectItem>
                                    <SelectItem value="System">Sistema</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleExportLogs}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Exportar
                            </Button>
                            <Button
                                onClick={handleClearLogs}
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-900"
                            >
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Estadísticas de Logs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Logs</p>
                                <p className="text-2xl font-bold text-white">{logs.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Errores</p>
                                <p className="text-2xl font-bold text-white">
                                    {logs.filter(l => l.level === 'error').length}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Advertencias</p>
                                <p className="text-2xl font-bold text-white">
                                    {logs.filter(l => l.level === 'warning').length}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Éxitos</p>
                                <p className="text-2xl font-bold text-white">
                                    {logs.filter(l => l.level === 'success').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Logs */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Registro de Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                                onClick={() => setSelectedLog(log)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {getLevelIcon(log.level)}
                                        <span className="text-gray-300 text-sm">{log.timestamp}</span>
                                        <span className="text-white font-medium">{log.message}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">{log.module}</span>
                                        {getLevelBadge(log.level)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>Usuario: {log.user}</span>
                                    <span>ID: #{log.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredLogs.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No se encontraron logs</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Detalles */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Detalles del Log</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLog(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">ID</p>
                                    <p className="text-white">#{selectedLog.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Timestamp</p>
                                    <p className="text-white">{selectedLog.timestamp}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Nivel</p>
                                    <div className="flex items-center gap-2">
                                        {getLevelIcon(selectedLog.level)}
                                        {getLevelBadge(selectedLog.level)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Módulo</p>
                                    <p className="text-white">{selectedLog.module}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Usuario</p>
                                    <p className="text-white">{selectedLog.user}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-2">Mensaje</p>
                                <p className="text-white bg-gray-700 p-3 rounded">{selectedLog.message}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-2">Detalles</p>
                                <p className="text-white bg-gray-700 p-3 rounded">{selectedLog.details}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
