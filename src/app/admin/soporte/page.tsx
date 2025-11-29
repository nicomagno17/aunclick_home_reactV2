'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, MessageCircle, Search, Filter, Plus, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function SoportePage() {
    const [tickets, setTickets] = useState([
        {
            id: 'TKT-001',
            subject: 'Problema con el pago',
            status: 'open',
            priority: 'high',
            user: 'Juan Pérez',
            date: '2024-01-15',
            category: 'Pagos'
        },
        {
            id: 'TKT-002',
            subject: 'No puedo acceder a mi cuenta',
            status: 'in-progress',
            priority: 'medium',
            user: 'María García',
            date: '2024-01-14',
            category: 'Acceso'
        },
        {
            id: 'TKT-003',
            subject: 'Error en el catálogo de productos',
            status: 'resolved',
            priority: 'low',
            user: 'Carlos López',
            date: '2024-01-13',
            category: 'Productos'
        }
    ])

    const [newTicket, setNewTicket] = useState({
        subject: '',
        category: '',
        priority: 'medium',
        description: ''
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <AlertCircle className="h-4 w-4 text-red-400" />
            case 'in-progress':
                return <Clock className="h-4 w-4 text-yellow-400" />
            case 'resolved':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            default:
                return <XCircle className="h-4 w-4 text-gray-400" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-red-500">Abierto</Badge>
            case 'in-progress':
                return <Badge className="bg-yellow-500">En Progreso</Badge>
            case 'resolved':
                return <Badge className="bg-green-500">Resuelto</Badge>
            default:
                return <Badge className="bg-gray-500">Desconocido</Badge>
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge className="bg-red-600">Alta</Badge>
            case 'medium':
                return <Badge className="bg-yellow-600">Media</Badge>
            case 'low':
                return <Badge className="bg-blue-600">Baja</Badge>
            default:
                return <Badge className="bg-gray-600">Normal</Badge>
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const handleCreateTicket = () => {
        if (newTicket.subject && newTicket.category && newTicket.description) {
            const ticket = {
                id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
                subject: newTicket.subject,
                status: 'open',
                priority: newTicket.priority,
                user: 'Administrador',
                date: new Date().toISOString().split('T')[0],
                category: newTicket.category
            }
            setTickets([ticket, ...tickets])
            setNewTicket({ subject: '', category: '', priority: 'medium', description: '' })
            alert('Ticket creado exitosamente')
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Soporte</h1>
                    <p className="text-gray-400">Gestiona las solicitudes de soporte técnico</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crear Nuevo Ticket */}
                <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Plus className="h-5 w-5 text-yellow-400" />
                            Nuevo Ticket
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="subject" className="text-gray-300">Asunto</Label>
                            <Input
                                id="subject"
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Describe el problema..."
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="category" className="text-gray-300">Categoría</Label>
                            <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pagos">Pagos</SelectItem>
                                    <SelectItem value="Acceso">Acceso</SelectItem>
                                    <SelectItem value="Productos">Productos</SelectItem>
                                    <SelectItem value="Technical">Técnico</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="priority" className="text-gray-300">Prioridad</Label>
                            <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-gray-300">Descripción</Label>
                            <Textarea
                                id="description"
                                value={newTicket.description}
                                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe el problema en detalle..."
                                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                            />
                        </div>
                        <Button
                            onClick={handleCreateTicket}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        >
                            Crear Ticket
                        </Button>
                    </CardContent>
                </Card>

                {/* Lista de Tickets */}
                <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-yellow-400" />
                            Tickets de Soporte
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Filtros */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Buscar tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="open">Abiertos</SelectItem>
                                        <SelectItem value="in-progress">En Progreso</SelectItem>
                                        <SelectItem value="resolved">Resueltos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tabla de Tickets */}
                        <div className="space-y-3">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(ticket.status)}
                                            <span className="text-white font-medium">{ticket.id}</span>
                                            <span className="text-gray-300">{ticket.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getPriorityBadge(ticket.priority)}
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-gray-400">
                                            <span>Usuario: {ticket.user}</span>
                                            <span>Categoría: {ticket.category}</span>
                                            <span>Fecha: {ticket.date}</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTickets.length === 0 && (
                            <div className="text-center py-8">
                                <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No se encontraron tickets</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tickets Abiertos</p>
                                <p className="text-2xl font-bold text-white">
                                    {tickets.filter(t => t.status === 'open').length}
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
                                <p className="text-gray-400 text-sm">En Progreso</p>
                                <p className="text-2xl font-bold text-white">
                                    {tickets.filter(t => t.status === 'in-progress').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Resueltos</p>
                                <p className="text-2xl font-bold text-white">
                                    {tickets.filter(t => t.status === 'resolved').length}
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
                                <p className="text-gray-400 text-sm">Total Tickets</p>
                                <p className="text-2xl font-bold text-white">{tickets.length}</p>
                            </div>
                            <MessageCircle className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
