'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, Download, Upload, Calendar, CheckCircle, XCircle, AlertTriangle, Clock, HardDrive } from 'lucide-react'

export default function RespaldosPage() {
    const [backups, setBackups] = useState([
        {
            id: 1,
            name: 'backup_2024_01_15_15_30.sql',
            date: '2024-01-15 15:30:00',
            size: '45.2 MB',
            type: 'automatic',
            status: 'completed',
            description: 'Respaldo automático diario'
        },
        {
            id: 2,
            name: 'backup_2024_01_14_15_30.sql',
            date: '2024-01-14 15:30:00',
            size: '44.8 MB',
            type: 'automatic',
            status: 'completed',
            description: 'Respaldo automático diario'
        },
        {
            id: 3,
            name: 'backup_manual_2024_01_13_10_15.sql',
            date: '2024-01-13 10:15:00',
            size: '43.5 MB',
            type: 'manual',
            status: 'completed',
            description: 'Respaldo manual antes de actualización'
        },
        {
            id: 4,
            name: 'backup_2024_01_12_15_30.sql',
            date: '2024-01-12 15:30:00',
            size: '42.1 MB',
            type: 'automatic',
            status: 'failed',
            description: 'Respaldo automático diario - Falló'
        }
    ])

    const [backupSettings, setBackupSettings] = useState({
        automaticBackup: true,
        frequency: 'daily',
        retentionDays: 30,
        compressionEnabled: true,
        emailNotifications: true,
        backupLocation: 'local'
    })

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newBackupName, setNewBackupName] = useState('')

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-400" />
            case 'in_progress':
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-400" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500">Completado</Badge>
            case 'failed':
                return <Badge className="bg-red-500">Falló</Badge>
            case 'in_progress':
            default:
                return <Badge className="bg-yellow-500">En Progreso</Badge>
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'automatic':
                return <Badge className="bg-blue-500">Automático</Badge>
            case 'manual':
            default:
                return <Badge className="bg-purple-500">Manual</Badge>
        }
    }

    const handleCreateBackup = () => {
        const backup = {
            id: backups.length + 1,
            name: newBackupName || `backup_manual_${new Date().toISOString().replace(/[:.]/g, '_')}.sql`,
            date: new Date().toLocaleString(),
            size: 'Calculando...',
            type: 'manual',
            status: 'in_progress',
            description: 'Respaldo manual creado ahora'
        }
        setBackups([backup, ...backups])
        setNewBackupName('')
        setShowCreateForm(false)

        // Simular completion después de 2 segundos
        setTimeout(() => {
            setBackups(prev => prev.map(b =>
                b.id === backup.id
                    ? { ...b, status: 'completed', size: '46.1 MB' }
                    : b
            ))
        }, 2000)

        alert('Respaldo iniciado exitosamente')
    }

    const handleDownloadBackup = (backup: any) => {
        alert(`Descargando respaldo: ${backup.name}`)
        // Aquí iría la lógica de descarga real
    }

    const handleRestoreBackup = (backup: any) => {
        if (confirm(`¿Estás seguro de que quieres restaurar el respaldo "${backup.name}"? Esta acción reemplazará todos los datos actuales.`)) {
            alert(`Restaurando respaldo: ${backup.name}`)
            // Aquí iría la lógica de restauración real
        }
    }

    const handleDeleteBackup = (backupId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este respaldo?')) {
            setBackups(prev => prev.filter(backup => backup.id !== backupId))
            alert('Respaldo eliminado exitosamente')
        }
    }

    const handleSaveSettings = () => {
        alert('Configuración de respaldos guardada exitosamente')
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Database className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Respaldos</h1>
                    <p className="text-gray-400">Gestiona los respaldos de la base de datos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Respaldos */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Historial de Respaldos</h2>
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        >
                            Crear Respaldo
                        </Button>
                    </div>

                    {backups.map((backup) => (
                        <Card key={backup.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <HardDrive className="h-5 w-5 text-yellow-400" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{backup.name}</h3>
                                            <p className="text-gray-400 text-sm">{backup.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(backup.status)}
                                        {getStatusBadge(backup.status)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Fecha</p>
                                        <p className="text-white">{backup.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Tamaño</p>
                                        <p className="text-white">{backup.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Tipo</p>
                                        <div>{getTypeBadge(backup.type)}</div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">ID</p>
                                        <p className="text-white">#{backup.id}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadBackup(backup)}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center gap-1"
                                        disabled={backup.status !== 'completed'}
                                    >
                                        <Download className="h-3 w-3" />
                                        Descargar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRestoreBackup(backup)}
                                        className="border-blue-600 text-blue-400 hover:bg-blue-900 flex items-center gap-1"
                                        disabled={backup.status !== 'completed'}
                                    >
                                        <Upload className="h-3 w-3" />
                                        Restaurar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteBackup(backup.id)}
                                        className="border-red-600 text-red-400 hover:bg-red-900"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Configuración y Crear Respaldo */}
                <div className="space-y-6">
                    {/* Crear Nuevo Respaldo */}
                    {showCreateForm && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Crear Nuevo Respaldo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="backupName" className="text-gray-300">Nombre del Respaldo</Label>
                                    <Input
                                        id="backupName"
                                        value={newBackupName}
                                        onChange={(e) => setNewBackupName(e.target.value)}
                                        placeholder="Opcional: nombre personalizado"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCreateBackup}
                                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                                    >
                                        Crear Ahora
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Configuración de Respaldos */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Configuración Automática</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="automaticBackup" className="text-gray-300">Respaldo Automático</Label>
                                <Select value={backupSettings.automaticBackup ? 'enabled' : 'disabled'} onValueChange={(value) => setBackupSettings(prev => ({ ...prev, automaticBackup: value === 'enabled' }))}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="enabled">Habilitado</SelectItem>
                                        <SelectItem value="disabled">Deshabilitado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="frequency" className="text-gray-300">Frecuencia</Label>
                                <Select value={backupSettings.frequency} onValueChange={(value) => setBackupSettings(prev => ({ ...prev, frequency: value }))}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hourly">Cada hora</SelectItem>
                                        <SelectItem value="daily">Diario</SelectItem>
                                        <SelectItem value="weekly">Semanal</SelectItem>
                                        <SelectItem value="monthly">Mensual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="retentionDays" className="text-gray-300">Días de Retención</Label>
                                <Input
                                    id="retentionDays"
                                    type="number"
                                    value={backupSettings.retentionDays}
                                    onChange={(e) => setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="backupLocation" className="text-gray-300">Ubicación</Label>
                                <Select value={backupSettings.backupLocation} onValueChange={(value) => setBackupSettings(prev => ({ ...prev, backupLocation: value }))}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="local">Local</SelectItem>
                                        <SelectItem value="cloud">Nube</SelectItem>
                                        <SelectItem value="both">Ambos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={handleSaveSettings}
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                            >
                                Guardar Configuración
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Estadísticas de Respaldos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Respaldos</p>
                                <p className="text-2xl font-bold text-white">{backups.length}</p>
                            </div>
                            <Database className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Completados</p>
                                <p className="text-2xl font-bold text-white">
                                    {backups.filter(b => b.status === 'completed').length}
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
                                <p className="text-gray-400 text-sm">Fallidos</p>
                                <p className="text-2xl font-bold text-white">
                                    {backups.filter(b => b.status === 'failed').length}
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
                                <p className="text-gray-400 text-sm">Espacio Total</p>
                                <p className="text-2xl font-bold text-white">~180 MB</p>
                            </div>
                            <HardDrive className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
