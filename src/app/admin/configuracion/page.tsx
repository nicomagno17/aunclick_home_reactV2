'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Settings, Save, Globe, Bell, Shield, Palette } from 'lucide-react'

export default function ConfiguracionPage() {
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'Mi Tienda',
        siteDescription: 'Descripción de la tienda',
        contactEmail: 'contacto@mitienda.com',
        timezone: 'America/Santiago',
        language: 'es'
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        orderNotifications: true,
        userNotifications: true,
        marketingEmails: false
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireStrongPassword: true
    })

    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'dark',
        primaryColor: '#f59e0b',
        sidebarCollapsed: false,
        compactMode: false
    })

    const handleSave = () => {
        // Aquí iría la lógica para guardar la configuración
        alert('Configuración guardada exitosamente')
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Settings className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Configuración</h1>
                    <p className="text-gray-400">Administra la configuración del sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuración General */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Globe className="h-5 w-5 text-yellow-400" />
                            Configuración General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="siteName" className="text-gray-300">Nombre del Sitio</Label>
                            <Input
                                id="siteName"
                                value={generalSettings.siteName}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="siteDescription" className="text-gray-300">Descripción</Label>
                            <Input
                                id="siteDescription"
                                value={generalSettings.siteDescription}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactEmail" className="text-gray-300">Email de Contacto</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={generalSettings.contactEmail}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="timezone" className="text-gray-300">Zona Horaria</Label>
                            <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="America/Santiago">America/Santiago</SelectItem>
                                    <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
                                    <SelectItem value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</SelectItem>
                                    <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuración de Notificaciones */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-400" />
                            Notificaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Notificaciones por Email</Label>
                                <p className="text-gray-400 text-sm">Recibir notificaciones importantes por email</p>
                            </div>
                            <Switch
                                checked={notificationSettings.emailNotifications}
                                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Notificaciones Push</Label>
                                <p className="text-gray-400 text-sm">Notificaciones en tiempo real</p>
                            </div>
                            <Switch
                                checked={notificationSettings.pushNotifications}
                                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Notificaciones de Pedidos</Label>
                                <p className="text-gray-400 text-sm">Alertas de nuevos pedidos</p>
                            </div>
                            <Switch
                                checked={notificationSettings.orderNotifications}
                                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Notificaciones de Usuarios</Label>
                                <p className="text-gray-400 text-sm">Nuevos registros de usuarios</p>
                            </div>
                            <Switch
                                checked={notificationSettings.userNotifications}
                                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, userNotifications: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Emails de Marketing</Label>
                                <p className="text-gray-400 text-sm">Promociones y novedades</p>
                            </div>
                            <Switch
                                checked={notificationSettings.marketingEmails}
                                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Configuración de Seguridad */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-yellow-400" />
                            Seguridad
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Autenticación de Dos Factores</Label>
                                <p className="text-gray-400 text-sm">Capa adicional de seguridad</p>
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
                    </CardContent>
                </Card>

                {/* Configuración de Apariencia */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Palette className="h-5 w-5 text-yellow-400" />
                            Apariencia
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="theme" className="text-gray-300">Tema</Label>
                            <Select value={appearanceSettings.theme} onValueChange={(value) => setAppearanceSettings(prev => ({ ...prev, theme: value }))}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dark">Oscuro</SelectItem>
                                    <SelectItem value="light">Claro</SelectItem>
                                    <SelectItem value="auto">Automático</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="primaryColor" className="text-gray-300">Color Primario</Label>
                            <Input
                                id="primaryColor"
                                type="color"
                                value={appearanceSettings.primaryColor}
                                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white h-10"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Sidebar Colapsado</Label>
                                <p className="text-gray-400 text-sm">Mantener sidebar contraído por defecto</p>
                            </div>
                            <Switch
                                checked={appearanceSettings.sidebarCollapsed}
                                onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, sidebarCollapsed: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-gray-300">Modo Compacto</Label>
                                <p className="text-gray-400 text-sm">Interfaz más densa</p>
                            </div>
                            <Switch
                                checked={appearanceSettings.compactMode}
                                onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, compactMode: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                </Button>
            </div>
        </div>
    )
}
