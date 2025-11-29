'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Plus, Edit, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    stock: number
    image: string
    status: 'active' | 'inactive'
    featured: boolean
}

export default function GestionProductosPage() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: 'Producto Ejemplo 1',
            description: 'Descripción del producto ejemplo',
            price: 29990,
            category: 'electronics',
            stock: 50,
            image: '/placeholder-product.jpg',
            status: 'active',
            featured: true
        },
        {
            id: '2',
            name: 'Producto Ejemplo 2',
            description: 'Otro producto de ejemplo',
            price: 19990,
            category: 'clothing',
            stock: 25,
            image: '/placeholder-product.jpg',
            status: 'active',
            featured: false
        }
    ])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        status: 'active' as 'active' | 'inactive',
        featured: false
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const categories = [
        { value: 'electronics', label: 'Electrónica' },
        { value: 'clothing', label: 'Ropa' },
        { value: 'home', label: 'Hogar' },
        { value: 'sports', label: 'Deportes' },
        { value: 'books', label: 'Libros' }
    ]

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing && editingId) {
            // Editar producto existente
            setProducts(prev => prev.map(product =>
                product.id === editingId
                    ? {
                        ...product,
                        name: formData.name,
                        description: formData.description,
                        price: Number(formData.price),
                        category: formData.category,
                        stock: Number(formData.stock),
                        image: formData.image,
                        status: formData.status,
                        featured: formData.featured
                    }
                    : product
            ))
        } else {
            // Agregar nuevo producto
            const newProduct: Product = {
                id: Date.now().toString(),
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                stock: Number(formData.stock),
                image: formData.image,
                status: formData.status,
                featured: formData.featured
            }
            setProducts(prev => [...prev, newProduct])
        }

        // Resetear formulario
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: '',
            status: 'active',
            featured: false
        })
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
            image: product.image,
            status: product.status,
            featured: product.featured
        })
        setIsEditing(true)
        setEditingId(product.id)
    }

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setProducts(prev => prev.filter(product => product.id !== id))
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="h-8 w-8 text-yellow-400" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
                    <p className="text-gray-400">Administra tu catálogo de productos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario de Producto */}
                <div className="lg:col-span-1">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                {isEditing ? <Edit className="h-5 w-5 text-yellow-400" /> : <Plus className="h-5 w-5 text-yellow-400" />}
                                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-gray-300">Nombre del Producto</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-gray-300">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="Describe el producto..."
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price" className="text-gray-300">Precio</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            placeholder="29990"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="stock" className="text-gray-300">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => handleInputChange('stock', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            placeholder="50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="category" className="text-gray-300">Categoría</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="image" className="text-gray-300">URL de Imagen</Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => handleInputChange('featured', e.target.checked)}
                                            className="rounded border-gray-600 bg-gray-700 text-yellow-400"
                                        />
                                        <Label htmlFor="featured" className="text-gray-300">Producto Destacado</Label>
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
                                                    description: '',
                                                    price: '',
                                                    category: '',
                                                    stock: '',
                                                    image: '',
                                                    status: 'active',
                                                    featured: false
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

                {/* Lista de Productos */}
                <div className="lg:col-span-2">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-yellow-400" />
                                    Lista de Productos ({filteredProducts.length})
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
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No se encontraron productos</p>
                                    </div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <div key={product.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">{product.name}</h3>
                                                    <p className="text-gray-400 text-sm">{product.description}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                                            {product.status === 'active' ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                        {product.featured && (
                                                            <Badge className="bg-yellow-500 text-gray-900">Destacado</Badge>
                                                        )}
                                                        <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <p className="text-white font-bold">${product.price.toLocaleString('es-CL')}</p>
                                                    <p className="text-gray-400 text-sm">{categories.find(c => c.value === product.category)?.label}</p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                                                        onClick={() => handleDelete(product.id)}
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
