"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Importar modales de entidades (los implementaremos más adelante)
import PlanSuscripcionModal from './modals/plan-suscripcion-modal'
import CategoriaNegocioModal from './modals/categoria-negocio-modal'
import CategoriaProductoModal from './modals/categoria-producto-modal'
import UbicacionModal from './modals/ubicacion-modal'
import NegocioModal from './modals/negocio-modal'
import ProductoModal from './modals/producto-modal'

export default function AdminPage() {
  // Estados para controlar la visibilidad de los modales
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [categoriaNegocioModalOpen, setCategoriaNegocioModalOpen] = useState(false)
  const [categoriaProductoModalOpen, setCategoriaProductoModalOpen] = useState(false)
  const [ubicacionModalOpen, setUbicacionModalOpen] = useState(false)
  const [negocioModalOpen, setNegocioModalOpen] = useState(false)
  const [productoModalOpen, setProductoModalOpen] = useState(false)

  return (
    <div className="py-6">
      <p className="text-muted-foreground mb-6">Gestión de entidades del marketplace</p>

      <Tabs defaultValue="planes" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="planes">Planes</TabsTrigger>
          <TabsTrigger value="categorias-negocios">Categorías de Negocios</TabsTrigger>
          <TabsTrigger value="categorias-productos">Categorías de Productos</TabsTrigger>
          <TabsTrigger value="ubicaciones">Ubicaciones</TabsTrigger>
          <TabsTrigger value="negocios">Negocios</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
        </TabsList>

        {/* Tab de Planes de Suscripción */}
        <TabsContent value="planes">
          <Card>
            <CardHeader>
              <CardTitle>Planes de Suscripción</CardTitle>
              <CardDescription>
                Gestiona los planes disponibles para los negocios en el marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setPlanModalOpen(true)}>Crear Nuevo Plan</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de planes existentes */}
                <p className="text-gray-500">La lista de planes se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Categorías de Negocios */}
        <TabsContent value="categorias-negocios">
          <Card>
            <CardHeader>
              <CardTitle>Categorías de Negocios</CardTitle>
              <CardDescription>
                Administra las categorías para clasificar los negocios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCategoriaNegocioModalOpen(true)}>Crear Nueva Categoría</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de categorías existentes */}
                <p className="text-gray-500">La lista de categorías se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Categorías de Productos */}
        <TabsContent value="categorias-productos">
          <Card>
            <CardHeader>
              <CardTitle>Categorías de Productos</CardTitle>
              <CardDescription>
                Administra las categorías para clasificar los productos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCategoriaProductoModalOpen(true)}>Crear Nueva Categoría</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de categorías existentes */}
                <p className="text-gray-500">La lista de categorías se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Ubicaciones */}
        <TabsContent value="ubicaciones">
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones</CardTitle>
              <CardDescription>
                Gestiona las ubicaciones geográficas disponibles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setUbicacionModalOpen(true)}>Crear Nueva Ubicación</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de ubicaciones existentes */}
                <p className="text-gray-500">La lista de ubicaciones se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Negocios */}
        <TabsContent value="negocios">
          <Card>
            <CardHeader>
              <CardTitle>Negocios</CardTitle>
              <CardDescription>
                Administra los negocios registrados en el marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setNegocioModalOpen(true)}>Crear Nuevo Negocio</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de negocios existentes */}
                <p className="text-gray-500">La lista de negocios se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Productos */}
        <TabsContent value="productos">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>
                Gestiona los productos disponibles en el marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setProductoModalOpen(true)}>Crear Nuevo Producto</Button>
              
              <div className="mt-6">
                {/* Aquí iría una tabla o lista de productos existentes */}
                <p className="text-gray-500">La lista de productos se cargará desde la base de datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales para crear/editar entidades */}
      <PlanSuscripcionModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      <CategoriaNegocioModal open={categoriaNegocioModalOpen} onOpenChange={setCategoriaNegocioModalOpen} />
      <CategoriaProductoModal open={categoriaProductoModalOpen} onOpenChange={setCategoriaProductoModalOpen} />
      <UbicacionModal open={ubicacionModalOpen} onOpenChange={setUbicacionModalOpen} />
      <NegocioModal open={negocioModalOpen} onOpenChange={setNegocioModalOpen} />
      <ProductoModal open={productoModalOpen} onOpenChange={setProductoModalOpen} />
    </div>
  )
}