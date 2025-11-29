'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, CheckCircle, Clock, Users, Key, Eye, EyeOff } from 'lucide-react'

export default function SeguridadPage() {
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireStrongPassword: true,
        loginAttempts: 5,
        lockoutDuration: 15,
        ipWhitelist: false,
        emailNotifications: true
    })

    const [activeSessions, setActiveSessions] = useState([
        {
            id: 1,
            user: 'admin@site.com',
            device: 'Chrome on Windows',
            ip: '192.168.1.100',
            location: 'Santiago, Chile',
            startTime: '2024-01-15 14:30:00',
            lastActivity: '2024-01-15 15:45:00',
            status: 'active'
        },
        {
            id: 2,
            user: 'admin@site.com',
            device: 'Safari on iPhone',
            ip: '192.168.1.101',
            location: 'Santiago, Chile',
            startTime: '2024-01-15 12:15:00',
            lastActivity: '2024-01-15 14:20:00',
            status: 'active'
        }
    ])

    const [securityLogs, setSecurityLogs] = useState([
        {
            id: 1,
            timestamp: '2024-01-15 15:45:00',
            event: 'Login exitoso',
            user: 'admin@site.com',
            ip: '192.168.1.100',
            status: 'success'
        },
        {
            id: 2,
            timestamp: '2024-01-15 15:30:00',
            event: 'Intento de acceso fallido',
            user: 'unknown',
            ip: '192.168.1.200',
            status: 'warning'
        },
        {
            id: 3,
            timestamp: '2024-01-15 15:15:00',
            event: 'Cambio de contraseña',
            user: 'admin@site.com',
            ip: '192.168.1.100',
            status: 'info'
        }
    ])

    const [showPassword, setShowPassword] = useState(false)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            case 'info':
            default:
                return <Shield className="h-4 w-4 text-blue-400" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <Badge className="bg-green-500">Éxito</Badge>
            case 'warning':
                return <Badge className="bg-yellow-500">Advertencia</Badge>
            case 'info':
            default:
                return <Badge className="bg-blue-500">Info</Badge>
        }
    }

    const handleSaveSettings = () => {
        alert('Configuración de seguridad guardada exitosamente')
    }

    const handleTerminateSession = (sessionId: number) => {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
        alert('Sesión terminada exitosamente')
    }

    const handleTerminateAllSessions = () => {
        if (confirm('¿Estás seguro de que quieres terminar todas las sesiones excepto la actual?')) {
            setActiveSessions(prev => prev.slice(0, 1))
            alert('Todas las sesiones han sido terminadas')
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Seguridad</h1>
                    <p className="text-gray-400">Administra la configuración de seguridad del sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuración de Seguridad */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Key className="h-5 w-5 text-yellow-400" />
                            Configuración de Seguridad
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Autenticación de Dos Factores</Label>
                                <p className="text-gray-400 text-sm">Requerir 2FA para todos los usuarios</p>
                            </div>
                            <Switch
                                checked={securitySettings.twoFactorAuth}
                                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="sessionTimeout" className="text-gray-300">Tiempo de Sesión (minutos)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                value={securitySettings.sessionTimeout}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="passwordMinLength" className="text-gray-300">Longitud Mínima de Contraseña</Label>
                            <Input
                                id="passwordMinLength"
                                type="number"
                                value={securitySettings.passwordMinLength}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Requerir Contraseña Fuerte</Label>
                                <p className="text-gray-400 text-sm">Incluir mayúsculas, números y símbolos</p>
                            </div>
                            <Switch
                                checked={securitySettings.requireStrongPassword}
                                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireStrongPassword: checked }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="loginAttempts" className="text-gray-300">Intentos de Login Permitidos</Label>
                            <Input
                                id="loginAttempts"
                                type="number"
                                value={securitySettings.loginAttempts}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lockoutDuration" className="text-gray-300">Duración de Bloqueo (minutos)</Label>
                            <Input
                                id="lockoutDuration"
                                type="number"
                                value={securitySettings.lockoutDuration}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Lista Blanca de IPs</Label>
                                <p className="text-gray-400 text-sm">Permitir solo IPs específicas</p>
                            </div>
                            <Switch
                                checked={securitySettings.ipWhitelist}
                                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Notificaciones por Email</Label>
                                <p className="text-gray-400 text-sm">Alertas de eventos de seguridad</p>
                            </div>
                            <Switch
                                checked={securitySettings.emailNotifications}
                                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, emailNotifications: checked }))}
                            />
                        </div>
                        <Button
                            onClick={handleSaveSettings}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        >
                            Guardar Configuración
                        </Button>
                    </CardContent>
                </Card>

                {/* Sesiones Activas */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-yellow-400" />
                            Sesiones Activas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeSessions.map((session) => (
                                <div key={session.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="text-white font-medium">{session.user}</p>
                                            <p className="text-gray-400 text-sm">{session.device}</p>
                                        </div>
                                        <Badge className="bg-green-500">Activa</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                                        <div>IP: {session.ip}</div>
                                        <div>Ubicación: {session.location}</div>
                                        <div>Inicio: {session.startTime}</div>
                                        <div>Última actividad: {session.lastActivity}</div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleTerminateSession(session.id)}
                                        className="border-red-600 text-red-400 hover:bg-red-900"
                                    >
                                        Terminar Sesión
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleTerminateAllSessions}
                            className="w-full mt-4 border-red-600 text-red-400 hover:bg-red-900"
                        >
                            Terminar Todas las Sesiones (excepto actual)
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Logs de Seguridad */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-400" />
                        Logs de Seguridad
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {securityLogs.map((log) => (
                            <div key={log.id} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(log.status)}
                                        <span className="text-white font-medium">{log.event}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">{log.timestamp}</span>
                                        {getStatusBadge(log.status)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                                    <div>Usuario: {log.user}</div>
                                    <div>IP: {log.ip}</div>
                                    <div>ID: #{log.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Estadísticas de Seguridad */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Sesiones Activas</p>
                                <p className="text-2xl font-bold text-white">{activeSessions.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Eventos Hoy</p>
                                <p className="text-2xl font-bold text-white">{securityLogs.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Alertas</p>
                                <p className="text-2xl font-bold text-white">
                                    {securityLogs.filter(l => l.status === 'warning').length}
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
                                <p className="text-gray-400 text-sm">2FA Habilitado</p>
                                <p className="text-2xl font-bold text-white">
                                    {securitySettings.twoFactorAuth ? 'Sí' : 'No'}
                                </p>
                            </div>
                            <Shield className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
