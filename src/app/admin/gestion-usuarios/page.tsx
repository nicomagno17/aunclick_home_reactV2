'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Edit, Trash2, Search, Shield, User } from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user' | 'moderator'
    status: 'active' | 'inactive'
    createdAt: string
    lastLogin: string
}

export default function GestionUsuariosPage() {
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'Administrador',
            email: 'admin@ejemplo.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-15',
            lastLogin: '2024-11-03'
        },
        {
            id: '2',
            name: 'Usuario Ejemplo',
            email: 'usuario@ejemplo.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-02-20',
            lastLogin: '2024-11-02'
        }
    ])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user' as 'admin' | 'user' | 'moderator',
        status: 'active' as 'active' | 'inactive'
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const roles = [
        { value: 'admin', label: 'Administrador' },
        { value: 'moderator', label: 'Moderador' },
        { value: 'user', label: 'Usuario' }
    ]

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing && editingId) {
            // Editar usuario existente
            setUsers(prev => prev.map(user =>
                user.id === editingId
                    ? {
                        ...user,
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        status: formData.status
                    }
                    : user
            ))
        } else {
            // Agregar nuevo usuario
            const newUser: User = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: new Date().toISOString().split('T')[0]
            }
            setUsers(prev => [...prev, newUser])
        }

        // Resetear formulario
        setFormData({
            name: '',
            email: '',
            role: 'user',
            status: 'active'
        })
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEdit = (user: User) => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        })
        setIsEditing(true)
        setEditingId(user.id)
    }

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            setUsers(prev => prev.filter(user => user.id !== id))
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        return matchesSearch && matchesRole
    })

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-500">Administrador</Badge>
            case 'moderator':
                return <Badge className="bg-blue-500">Moderador</Badge>
            default:
                return <Badge className="bg-green-500">Usuario</Badge>
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                    <p className="text-gray-400">Administra los usuarios del sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario de Usuario */}
                <div className="lg:col-span-1">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                {isEditing ? <Edit className="h-5 w-5 text-yellow-400" /> : <Plus className="h-5 w-5 text-yellow-400" />}
                                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-gray-300">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="juan@ejemplo.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="role" className="text-gray-300">Rol</Label>
                                    <Select value={formData.role} onValueChange={(value: 'admin' | 'user' | 'moderator') => handleInputChange('role', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="status" className="text-gray-300">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                                    >
                                        {isEditing ? 'Actualizar' : 'Agregar'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                            onClick={() => {
                                                setIsEditing(false)
                                                setEditingId(null)
                                                setFormData({
                                                    name: '',
                                                    email: '',
                                                    role: 'user',
                                                    status: 'active'
                                                })
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de Usuarios */}
                <div className="lg:col-span-2">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-yellow-400" />
                                    Lista de Usuarios ({filteredUsers.length})
                                </span>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white pl-10 w-48"
                                            placeholder="Buscar..."
                                        />
                                    </div>
                                    <Select value={filterRole} onValueChange={setFilterRole}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            {roles.map(role => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredUsers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No se encontraron usuarios</p>
                                    </div>
                                ) : (
                                    filteredUsers.map(user => (
                                        <div key={user.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">{user.name}</h3>
                                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {getRoleBadge(user.role)}
                                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">Creado: {user.createdAt}</p>
                                                    <p className="text-gray-400 text-sm">Último login: {user.lastLogin}</p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
