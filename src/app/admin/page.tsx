"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Clock, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  
  const openModal = (section: string) => {
    setSelectedSection(section)
    setIsModalOpen(true)
  }

  // Categorías y subcategorías de ejemplo
  const categories = {
    productos: [
      { value: 'electronica', label: 'Electrónica' },
      { value: 'ropa', label: 'Ropa y Accesorios' },
      { value: 'hogar', label: 'Hogar y Decoración' },
      { value: 'deportes', label: 'Deportes' },
      { value: 'libros', label: 'Libros' }
    ],
    servicios: [
      { value: 'profesionales', label: 'Servicios Profesionales' },
      { value: 'mantenimiento', label: 'Mantenimiento' },
      { value: 'educacion', label: 'Educación' },
      { value: 'salud', label: 'Salud y Bienestar' },
      { value: 'belleza', label: 'Belleza' }
    ],
    arriendos: [
      { value: 'propiedades', label: 'Propiedades' },
      { value: 'vehiculos', label: 'Vehículos' },
      { value: 'equipos', label: 'Equipos' },
      { value: 'espacios', label: 'Espacios' },
      { value: 'herramientas', label: 'Herramientas' }
    ]
  }

  const subcategories = {
    electronica: [
      { value: 'smartphones', label: 'Smartphones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'tablets', label: 'Tablets' },
      { value: 'audio', label: 'Audio' },
      { value: 'gaming', label: 'Gaming' }
    ],
    ropa: [
      { value: 'hombre', label: 'Hombre' },
      { value: 'mujer', label: 'Mujer' },
      { value: 'niños', label: 'Niños' },
      { value: 'calzado', label: 'Calzado' },
      { value: 'accesorios', label: 'Accesorios' }
    ],
    hogar: [
      { value: 'muebles', label: 'Muebles' },
      { value: 'cocina', label: 'Cocina' },
      { value: 'baño', label: 'Baño' },
      { value: 'decoracion', label: 'Decoración' },
      { value: 'jardin', label: 'Jardín' }
    ],
    deportes: [
      { value: 'futbol', label: 'Fútbol' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'ciclismo', label: 'Ciclismo' },
      { value: 'natacion', label: 'Natación' },
      { value: 'outdoor', label: 'Outdoor' }
    ],
    libros: [
      { value: 'ficcion', label: 'Ficción' },
      { value: 'no-ficcion', label: 'No Ficción' },
      { value: 'academicos', label: 'Académicos' },
      { value: 'infantiles', label: 'Infantiles' },
      { value: 'comics', label: 'Cómics' }
    ],
    profesionales: [
      { value: 'legal', label: 'Legal' },
      { value: 'contable', label: 'Contable' },
      { value: 'consultoria', label: 'Consultoría' },
      { value: 'diseno', label: 'Diseño' },
      { value: 'marketing', label: 'Marketing' }
    ],
    mantenimiento: [
      { value: 'electricidad', label: 'Electricidad' },
      { value: 'plomeria', label: 'Plomería' },
      { value: 'climatizacion', label: 'Climatización' },
      { value: 'pintura', label: 'Pintura' },
      { value: 'limpieza', label: 'Limpieza' }
    ],
    educacion: [
      { value: 'idiomas', label: 'Idiomas' },
      { value: 'musica', label: 'Música' },
      { value: 'arte', label: 'Arte' },
      { value: 'tecnologia', label: 'Tecnología' },
      { value: 'cocina', label: 'Cocina' }
    ],
    salud: [
      { value: 'medicina', label: 'Medicina' },
      { value: 'terapia', label: 'Terapia' },
      { value: 'nutricion', label: 'Nutrición' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'salud-mental', label: 'Salud Mental' }
    ],
    belleza: [
      { value: 'corte', label: 'Corte de Cabello' },
      { value: 'maquillaje', label: 'Maquillaje' },
      { value: 'uñas', label: 'Uñas' },
      { value: 'spa', label: 'Spa' },
      { value: 'depilacion', label: 'Depilación' }
    ],
    propiedades: [
      { value: 'casas', label: 'Casas' },
      { value: 'departamentos', label: 'Departamentos' },
      { value: 'oficinas', label: 'Oficinas' },
      { value: 'locales', label: 'Locales Comerciales' },
      { value: 'terrenos', label: 'Terrenos' }
    ],
    vehiculos: [
      { value: 'autos', label: 'Autos' },
      { value: 'motos', label: 'Motos' },
      { value: 'camiones', label: 'Camiones' },
      { value: 'buses', label: 'Buses' },
      { value: 'maquinaria', label: 'Maquinaria' }
    ],
    equipos: [
      { value: 'construccion', label: 'Construcción' },
      { value: 'oficina', label: 'Oficina' },
      { value: 'eventos', label: 'Eventos' },
      { value: 'audiovisual', label: 'Audiovisual' },
      { value: 'medico', label: 'Médico' }
    ],
    espacios: [
      { value: 'bodegas', label: 'Bodegas' },
      { value: 'salones', label: 'Salones de Eventos' },
      { value: 'estudios', label: 'Estudios' },
      { value: 'garages', label: 'Garages' },
      { value: 'cocheras', label: 'Cocheras' }
    ],
    herramientas: [
      { value: 'jardineria', label: 'Jardinería' },
      { value: 'construccion', label: 'Construcción' },
      { value: 'mecanica', label: 'Mecánica' },
      { value: 'cocina', label: 'Cocina' },
      { value: 'limpieza', label: 'Limpieza' }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Container principal con título y pestañas */}
      <div className="w-full">
        {/* Sección: Datos del Negocio */}
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Datos del Negocio</h1>
          <p className="text-gray-400">Administra la información del negocio</p>
        </div>

        {/* Formulario */}
        <div className="px-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Información General</h2>
            <p className="text-gray-400 mb-6">Ingresa los datos básicos del negocio</p>
            
            {/* Formulario único */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-nombre" className="text-gray-300">Nombre del Negocio</Label>
                  <Input 
                    id="entidad-nombre" 
                    placeholder="Ingresa el nombre del negocio"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entidad-direccion" className="text-gray-300">Dirección</Label>
                  <Input 
                    id="entidad-direccion" 
                    placeholder="Ingresa la dirección completa"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Teléfono y WhatsApp en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entidad-telefono" className="text-gray-300">Teléfono</Label>
                    <Input 
                      id="entidad-telefono" 
                      placeholder="Ingresa el número"
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="entidad-whatsapp" className="text-gray-300">WhatsApp</Label>
                    <Input 
                      id="entidad-whatsapp" 
                      placeholder="Ingresa el número"
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="entidad-email" className="text-gray-300">Email</Label>
                  <Input 
                    id="entidad-email" 
                    type="email"
                    placeholder="Ingresa el correo electrónico"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-responsable" className="text-gray-300">Nombre del Responsable del Negocio</Label>
                  <Input 
                    id="entidad-responsable" 
                    placeholder="Ingresa el nombre del responsable del negocio"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Sección de Horarios */}
                <div>
                  <Label className="text-gray-300 flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Horarios de Atención
                  </Label>
                  
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-3">
                    {/* Lunes a Viernes */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Lunes a Viernes</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-lv-inicio"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-lv-fin"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Sábado */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Sábado</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-sabado-inicio"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-sabado-fin"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Domingo */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Domingo</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-domingo-inicio"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-domingo-fin"
                          type="time"
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                Guardar Información
              </Button>
            </div>
          </div>
        </div>

        {/* Modal para agregar producto */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Agregar Producto a {selectedSection}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Cargar imagen */}
              <div>
                <Label htmlFor="producto-imagen" className="text-gray-300 mb-2 block">
                  Cargar Imagen (JPG, PNG)
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors w-64 h-48 mx-auto bg-white">
                  <input
                    id="producto-imagen"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const container = document.getElementById('imagen-container');
                          if (container && e.target?.result) {
                            container.innerHTML = `
                              <img src="${e.target.result}" alt="Producto" class="w-full h-full object-contain" />
                            `;
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="producto-imagen" className="cursor-pointer h-full flex items-center justify-center">
                    <div id="imagen-container" className="flex flex-col items-center justify-center space-y-2 h-full">
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-400 text-sm">Haz clic para subir imagen</span>
                      <span className="text-gray-500 text-xs">Formatos: JPG, PNG</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fila con tres campos: Tipo de Negocio, Categoría, Subcategoría */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo de Negocio */}
                <div>
                  <Label htmlFor="tipo-negocio" className="text-gray-300 mb-2 block">
                    Tipo de Negocio
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="productos">Productos</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="arriendos">Arriendos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Categoría */}
                <div>
                  <Label htmlFor="categoria" className="text-gray-300 mb-2 block">
                    Categoría
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="electronica">Electrónica</SelectItem>
                      <SelectItem value="ropa">Ropa y Accesorios</SelectItem>
                      <SelectItem value="hogar">Hogar y Decoración</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                      <SelectItem value="libros">Libros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategoría */}
                <div>
                  <Label htmlFor="subcategoria" className="text-gray-300 mb-2 block">
                    Subcategoría
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="smartphones">Smartphones</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nombre o Título del Producto */}
              <div>
                <Label htmlFor="producto-nombre" className="text-gray-300 mb-2 block">
                  Nombre o Título del Producto
                </Label>
                <Input 
                  id="producto-nombre"
                  placeholder="Ingresa el nombre del producto"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  Agregar Producto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Separador entre secciones */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Sección: Gestión de Productos */}
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">Administra las diferentes secciones de productos del marketplace</p>
        </div>

        {/* Pestañas de Productos */}
        <Tabs defaultValue="destacados" className="w-full">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto px-6 mb-8 bg-gray-800 border border-gray-700 rounded-lg p-1">
            <TabsTrigger 
              value="destacados" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Destacados
            </TabsTrigger>
            <TabsTrigger 
              value="ofertas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Ofertas
            </TabsTrigger>
            <TabsTrigger 
              value="novedades" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Novedades
            </TabsTrigger>
            <TabsTrigger 
              value="tendencias" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Tendencias
            </TabsTrigger>
            <TabsTrigger 
              value="no-te-lo-pierdas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              ¡No te lo Pierdas!
            </TabsTrigger>
            <TabsTrigger 
              value="liquidaciones" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Liquidaciones
            </TabsTrigger>
          </TabsList>

          {/* Contenido de cada pestaña de productos */}
          <div className="px-6">
            {/* Tab Destacados */}
            <TabsContent value="destacados" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Destacados</h2>
                <p className="text-gray-400 mb-6">Los productos más populares del momento</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('Destacados')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos a la sección Destacados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Ofertas */}
            <TabsContent value="ofertas" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Ofertas</h2>
                <p className="text-gray-400 mb-6">Descuentos exclusivos por tiempo limitado</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('Ofertas')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos con descuento a la sección Ofertas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Novedades */}
            <TabsContent value="novedades" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Novedades</h2>
                <p className="text-gray-400 mb-6">Los últimos lanzamientos del mercado</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('Novedades')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos nuevos a la sección Novedades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Tendencias */}
            <TabsContent value="tendencias" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Tendencias</h2>
                <p className="text-gray-400 mb-6">Lo más buscado y deseado actualmente</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('Tendencias')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos populares a la sección Tendencias
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab ¡No te lo Pierdas! */}
            <TabsContent value="no-te-lo-pierdas" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: ¡No te lo Pierdas!</h2>
                <p className="text-gray-400 mb-6">Oportunidades únicas que no puedes dejar pasar</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('¡No te lo Pierdas!')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos especiales a la sección ¡No te lo Pierdas!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Liquidaciones */}
            <TabsContent value="liquidaciones" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Liquidaciones</h2>
                <p className="text-gray-400 mb-6">Precios increíbles en productos seleccionados</p>
                
                {/* Tarjeta con botón agregar */}
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => openModal('Liquidaciones')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 h-full">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        Añadir productos en liquidación a la sección Liquidaciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}