'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Book, Search, FileText, Video, Code, Download, Eye, Plus, Edit, Trash2 } from 'lucide-react'

export default function DocumentacionPage() {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            title: 'Guía de Inicio Rápido',
            description: 'Guía completa para comenzar a usar el sistema',
            type: 'guide',
            category: 'usuario',
            lastUpdated: '2024-01-15',
            size: '2.5 MB',
            downloads: 145,
            status: 'published'
        },
        {
            id: 2,
            title: 'API Reference',
            description: 'Documentación completa de la API REST',
            type: 'api',
            category: 'desarrollador',
            lastUpdated: '2024-01-14',
            size: '1.8 MB',
            downloads: 89,
            status: 'published'
        },
        {
            id: 3,
            title: 'Video Tutorial: Administración',
            description: 'Tutorial en video para administradores',
            type: 'video',
            category: 'administrador',
            lastUpdated: '2024-01-13',
            size: '15.2 MB',
            downloads: 67,
            status: 'published'
        },
        {
            id: 4,
            title: 'Guía de Seguridad',
            description: 'Mejores prácticas de seguridad',
            type: 'guide',
            category: 'seguridad',
            lastUpdated: '2024-01-12',
            size: '1.2 MB',
            downloads: 234,
            status: 'draft'
        }
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [showAddForm, setShowAddForm] = useState(false)

    const [newDocument, setNewDocument] = useState({
        title: '',
        description: '',
        type: '',
        category: '',
        content: ''
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'guide':
                return <Book className="h-4 w-4 text-blue-400" />
            case 'api':
                return <Code className="h-4 w-4 text-green-400" />
            case 'video':
                return <Video className="h-4 w-4 text-purple-400" />
            case 'document':
            default:
                return <FileText className="h-4 w-4 text-yellow-400" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'guide':
                return <Badge className="bg-blue-500">Guía</Badge>
            case 'api':
                return <Badge className="bg-green-500">API</Badge>
            case 'video':
                return <Badge className="bg-purple-500">Video</Badge>
            case 'document':
            default:
                return <Badge className="bg-yellow-500">Documento</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-500">Publicado</Badge>
            case 'draft':
            default:
                return <Badge className="bg-gray-500">Borrador</Badge>
        }
    }

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'usuario':
                return <Badge className="bg-blue-500">Usuario</Badge>
            case 'administrador':
                return <Badge className="bg-red-500">Administrador</Badge>
            case 'desarrollador':
                return <Badge className="bg-green-500">Desarrollador</Badge>
            case 'seguridad':
                return <Badge className="bg-yellow-500">Seguridad</Badge>
            default:
                return <Badge className="bg-gray-500">General</Badge>
        }
    }

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
        const matchesType = filterType === 'all' || doc.type === filterType
        return matchesSearch && matchesCategory && matchesType
    })

    const handleAddDocument = () => {
        if (newDocument.title && newDocument.description && newDocument.type && newDocument.category) {
            const document = {
                id: documents.length + 1,
                title: newDocument.title,
                description: newDocument.description,
                type: newDocument.type,
                category: newDocument.category,
                lastUpdated: new Date().toISOString().split('T')[0],
                size: '0 MB',
                downloads: 0,
                status: 'draft'
            }
            setDocuments([document, ...documents])
            setNewDocument({ title: '', description: '', type: '', category: '', content: '' })
            setShowAddForm(false)
            alert('Documento agregado exitosamente')
        }
    }

    const handleEditDocument = (id: number) => {
        alert(`Editando documento ID: ${id}`)
        // Aquí iría la lógica de edición
    }

    const handleDeleteDocument = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            setDocuments(prev => prev.filter(doc => doc.id !== id))
            alert('Documento eliminado exitosamente')
        }
    }

    const handleDownloadDocument = (doc: any) => {
        alert(`Descargando: ${doc.title}`)
        // Aquí iría la lógica de descarga
    }

    const handleViewDocument = (doc: any) => {
        alert(`Abriendo: ${doc.title}`)
        // Aquí iría la lógica para abrir el documento
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Book className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Documentación</h1>
                    <p className="text-gray-400">Gestiona la documentación del sistema</p>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar documentos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-[150px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="usuario">Usuario</SelectItem>
                                    <SelectItem value="administrador">Administrador</SelectItem>
                                    <SelectItem value="desarrollador">Desarrollador</SelectItem>
                                    <SelectItem value="seguridad">Seguridad</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="guide">Guía</SelectItem>
                                    <SelectItem value="api">API</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="document">Documento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Documento
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Formulario Agregar Documento */}
            {showAddForm && (
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Agregar Nuevo Documento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 text-sm">Título</label>
                                <Input
                                    value={newDocument.title}
                                    onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Título del documento"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm">Tipo</label>
                                <Select value={newDocument.type} onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="guide">Guía</SelectItem>
                                        <SelectItem value="api">API</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="document">Documento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm">Descripción</label>
                            <Input
                                value={newDocument.description}
                                onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Descripción breve del documento"
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 text-sm">Categoría</label>
                                <Select value={newDocument.category} onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Selecciona categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usuario">Usuario</SelectItem>
                                        <SelectItem value="administrador">Administrador</SelectItem>
                                        <SelectItem value="desarrollador">Desarrollador</SelectItem>
                                        <SelectItem value="seguridad">Seguridad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAddDocument}
                                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                            >
                                Agregar Documento
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {getTypeIcon(doc.type)}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                                        <p className="text-gray-400 text-sm">{doc.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {getTypeBadge(doc.type)}
                                {getCategoryBadge(doc.category)}
                                {getStatusBadge(doc.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
                                <div>Actualizado: {doc.lastUpdated}</div>
                                <div>Tamaño: {doc.size}</div>
                                <div>Descargas: {doc.downloads}</div>
                                <div>ID: #{doc.id}</div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDocument(doc)}
                                    className="border-blue-600 text-blue-400 hover:bg-blue-900 flex items-center gap-1"
                                >
                                    <Eye className="h-3 w-3" />
                                    Ver
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc)}
                                    className="border-green-600 text-green-400 hover:bg-green-900 flex items-center gap-1"
                                >
                                    <Download className="h-3 w-3" />
                                    Descargar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditDocument(doc.id)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="border-red-600 text-red-400 hover:bg-red-900"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                    <Book className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No se encontraron documentos</p>
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Documentos</p>
                                <p className="text-2xl font-bold text-white">{documents.length}</p>
                            </div>
                            <Book className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Publicados</p>
                                <p className="text-2xl font-bold text-white">
                                    {documents.filter(d => d.status === 'published').length}
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Borradores</p>
                                <p className="text-2xl font-bold text-white">
                                    {documents.filter(d => d.status === 'draft').length}
                                </p>
                            </div>
                            <Edit className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Descargas</p>
                                <p className="text-2xl font-bold text-white">
                                    {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
                                </p>
                            </div>
                            <Download className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
