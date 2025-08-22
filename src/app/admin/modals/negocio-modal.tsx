"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, PlusCircle, MinusCircle, Upload } from 'lucide-react'
import { format } from 'date-fns'
import ModalWrapper from './modal-wrapper'

// Esquema de validación para el formulario
const formSchema = z.object({
  // Campos básicos
  propietario_id: z.string().min(1, 'Debe seleccionar un propietario'),
  categoria_id: z.string().min(1, 'Debe seleccionar una categoría'),
  ubicacion_id: z.string().min(1, 'Debe seleccionar una ubicación'),
  plan_id: z.string().min(1, 'Debe seleccionar un plan'),
  
  // Información básica
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  descripcion: z.string().optional(),
  descripcion_corta: z.string().max(300, 'La descripción corta no puede exceder los 300 caracteres').optional(),
  
  // Información de contacto
  telefono_principal: z.string().optional(),
  telefono_secundario: z.string().optional(),
  email: z.string().email('Debe ser un email válido').optional(),
  sitio_web: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  
  // Redes sociales (JSON)
  redes_sociales: z.string().optional(),
  
  // Información visual
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  galeria_imagenes: z.string().optional(),
  
  // Estado y configuración
  estado: z.enum(['borrador', 'activo', 'inactivo', 'suspendido', 'eliminado']).default('borrador'),
  verificado: z.boolean().default(false),
  destacado: z.boolean().default(false),
  permite_pedidos: z.boolean().default(true),
  
  // SEO y marketing
  seo_title: z.string().max(70, 'El título SEO no debe exceder los 70 caracteres').optional(),
  seo_description: z.string().max(160, 'La descripción SEO no debe exceder los 160 caracteres').optional(),
  seo_keywords: z.string().max(300, 'Las keywords SEO no deben exceder los 300 caracteres').optional(),
  
  // Configuración
  configuracion: z.string().optional(),
  metadata: z.string().optional(),
  
  // Fechas de suscripción
  suscripcion_inicio: z.date().optional(),
  suscripcion_fin: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NegocioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  negocioToEdit?: any
  propietariosList?: any[]
  categoriasList?: any[]
  ubicacionesList?: any[]
  planesList?: any[]
}

export default function NegocioModal({ 
  open, 
  onOpenChange, 
  negocioToEdit,
  propietariosList = [],
  categoriasList = [],
  ubicacionesList = [],
  planesList = []
}: NegocioModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('informacion')

  // Inicializar formulario con valores por defecto o valores para editar
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: negocioToEdit || {
      propietario_id: '',
      categoria_id: '',
      ubicacion_id: '',
      plan_id: '1', // Plan gratuito por defecto
      
      nombre: '',
      slug: '',
      descripcion: '',
      descripcion_corta: '',
      
      telefono_principal: '',
      telefono_secundario: '',
      email: '',
      sitio_web: '',
      whatsapp: '',
      
      redes_sociales: JSON.stringify({
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      }, null, 2),
      
      logo_url: '',
      banner_url: '',
      galeria_imagenes: JSON.stringify([], null, 2),
      
      estado: 'borrador',
      verificado: false,
      destacado: false,
      permite_pedidos: true,
      
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      
      configuracion: JSON.stringify({}, null, 2),
      metadata: JSON.stringify({}, null, 2),
      
      suscripcion_inicio: undefined,
      suscripcion_fin: undefined,
    }
  })

  // Generar slug automáticamente a partir del nombre
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Actualizar el slug cuando cambia el nombre
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nombre = e.target.value;
    form.setValue('nombre', nombre);
    
    // Solo actualizar el slug si el usuario no lo ha modificado manualmente
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('nombre'))) {
      form.setValue('slug', generateSlug(nombre));
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true)
      console.log('Datos del formulario:', data)
      
      // Formatear datos con JSON
      const formattedData = {
        ...data,
        redes_sociales: JSON.parse(data.redes_sociales || '{}'),
        galeria_imagenes: JSON.parse(data.galeria_imagenes || '[]'),
        configuracion: JSON.parse(data.configuracion || '{}'),
        metadata: JSON.parse(data.metadata || '{}'),
      }
      
      // Aquí iría la lógica para guardar en la base de datos
      // await createNegocio(formattedData) o await updateNegocio(formattedData)
      
      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar el negocio:', error)
      setIsSaving(false)
    }
  }

  // Estado para imágenes simuladas
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  // Simulación de subida de imágenes
  const handleLogoUpload = () => {
    // En una implementación real, aquí se subiría la imagen a un servidor
    setLogoPreview('https://placehold.co/200x200/purple/white?text=LOGO')
    form.setValue('logo_url', 'https://placehold.co/200x200/purple/white?text=LOGO')
  }

  const handleBannerUpload = () => {
    // En una implementación real, aquí se subiría la imagen a un servidor
    setBannerPreview('https://placehold.co/800x200/purple/white?text=BANNER')
    form.setValue('banner_url', 'https://placehold.co/800x200/purple/white?text=BANNER')
  }

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={negocioToEdit ? 'Editar Negocio' : 'Crear Negocio'}
      description="Configura los detalles del negocio"
      onSave={form.handleSubmit(onSubmit)}
      saveLabel={negocioToEdit ? 'Actualizar' : 'Crear'}
      isSaving={isSaving}
      maxWidth="md:max-w-4xl"
    >
      <Tabs defaultValue="informacion" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="informacion">Información Básica</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form className="space-y-6">
            {/* Tab de Información Básica */}
            <TabsContent value="informacion">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Propietario */}
                  <FormField
                    control={form.control}
                    name="propietario_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Propietario</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un propietario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propietariosList.map(propietario => (
                              <SelectItem key={propietario.id} value={propietario.id.toString()}>
                                {propietario.nombre} ({propietario.email})
                              </SelectItem>
                            ))}
                            {/* Opción dummy para desarrollo */}
                            <SelectItem value="1">Usuario Demo (demo@example.com)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Plan de Suscripción */}
                  <FormField
                    control={form.control}
                    name="plan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan de Suscripción</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {planesList.map(plan => (
                              <SelectItem key={plan.id} value={plan.id.toString()}>
                                {plan.nombre}
                              </SelectItem>
                            ))}
                            {/* Opciones dummy para desarrollo */}
                            <SelectItem value="1">Gratuito</SelectItem>
                            <SelectItem value="2">Pro</SelectItem>
                            <SelectItem value="3">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nombre del negocio"
                            {...field}
                            onChange={handleNombreChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="slug-negocio" {...field} />
                        </FormControl>
                        <FormDescription>
                          Identificador único para URLs (solo minúsculas, números y guiones)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Categoría */}
                  <FormField
                    control={form.control}
                    name="categoria_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriasList.map(categoria => (
                              <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                {categoria.nombre}
                              </SelectItem>
                            ))}
                            {/* Opciones dummy para desarrollo */}
                            <SelectItem value="1">Restaurantes y Comida</SelectItem>
                            <SelectItem value="2">Retail y Comercio</SelectItem>
                            <SelectItem value="3">Servicios Profesionales</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ubicación */}
                  <FormField
                    control={form.control}
                    name="ubicacion_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una ubicación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ubicacionesList.map(ubicacion => (
                              <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                                {ubicacion.ciudad}, {ubicacion.departamento_estado}
                              </SelectItem>
                            ))}
                            {/* Opciones dummy para desarrollo */}
                            <SelectItem value="1">Bogotá, Bogotá D.C.</SelectItem>
                            <SelectItem value="2">Medellín, Antioquia</SelectItem>
                            <SelectItem value="3">Cali, Valle del Cauca</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Descripción Corta */}
                <FormField
                  control={form.control}
                  name="descripcion_corta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Corta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción del negocio (máx. 300 caracteres)"
                          {...field}
                          value={field.value || ''}
                          maxLength={300}
                          rows={2}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta descripción se mostrará en listados y previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Descripción Completa */}
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Completa</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción detallada del negocio"
                          {...field}
                          value={field.value || ''}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Tab de Contacto */}
            <TabsContent value="contacto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Teléfono Principal */}
                  <FormField
                    control={form.control}
                    name="telefono_principal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono Principal</FormLabel>
                        <FormControl>
                          <Input placeholder="+57 300 123 4567" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teléfono Secundario */}
                  <FormField
                    control={form.control}
                    name="telefono_secundario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono Secundario</FormLabel>
                        <FormControl>
                          <Input placeholder="+57 1 234 5678" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Contacto</FormLabel>
                        <FormControl>
                          <Input placeholder="contacto@negocio.com" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* WhatsApp */}
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+573001234567" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          Número en formato internacional sin espacios
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sitio Web */}
                <FormField
                  control={form.control}
                  name="sitio_web"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.negocio.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        URL completa incluyendo https://
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Redes Sociales */}
                <FormField
                  control={form.control}
                  name="redes_sociales"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redes Sociales (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`{
  "facebook": "https://facebook.com/minegocio",
  "instagram": "https://instagram.com/minegocio",
  "twitter": "https://twitter.com/minegocio",
  "linkedin": "https://linkedin.com/company/minegocio",
  "youtube": "https://youtube.com/channel/minegocio"
}`}
                          {...field}
                          value={field.value || '{}'}
                          className="font-mono"
                          rows={8}
                        />
                      </FormControl>
                      <FormDescription>
                        Enlaces a perfiles de redes sociales en formato JSON
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Tab de Multimedia */}
            <TabsContent value="multimedia">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo */}
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <div className="flex flex-col gap-4">
                          <FormControl>
                            <Input {...field} value={field.value || ''} className="hidden" />
                          </FormControl>
                          
                          {logoPreview ? (
                            <div className="border rounded-md p-2 max-w-xs">
                              <img 
                                src={logoPreview} 
                                alt="Logo preview" 
                                className="w-full h-auto"
                              />
                            </div>
                          ) : (
                            <div className="border rounded-md p-6 flex items-center justify-center bg-slate-50 max-w-xs">
                              <p className="text-slate-500 text-sm">No hay logo seleccionado</p>
                            </div>
                          )}
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleLogoUpload}
                            className="max-w-xs"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Logo
                          </Button>
                        </div>
                        <FormDescription>
                          Logotipo principal del negocio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Banner */}
                  <FormField
                    control={form.control}
                    name="banner_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner</FormLabel>
                        <div className="flex flex-col gap-4">
                          <FormControl>
                            <Input {...field} value={field.value || ''} className="hidden" />
                          </FormControl>
                          
                          {bannerPreview ? (
                            <div className="border rounded-md p-2">
                              <img 
                                src={bannerPreview} 
                                alt="Banner preview" 
                                className="w-full h-auto"
                              />
                            </div>
                          ) : (
                            <div className="border rounded-md p-6 flex items-center justify-center bg-slate-50 h-32">
                              <p className="text-slate-500 text-sm">No hay banner seleccionado</p>
                            </div>
                          )}
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleBannerUpload}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Banner
                          </Button>
                        </div>
                        <FormDescription>
                          Imagen de cabecera para el perfil del negocio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Galería de Imágenes */}
                <FormField
                  control={form.control}
                  name="galeria_imagenes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galería de Imágenes (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`[
  "https://example.com/imagen1.jpg",
  "https://example.com/imagen2.jpg",
  "https://example.com/imagen3.jpg"
]`}
                          {...field}
                          value={field.value || '[]'}
                          className="font-mono"
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Array de URLs de imágenes en formato JSON
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Tab de Configuración */}
            <TabsContent value="configuracion">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Estado */}
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="borrador">Borrador</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="inactivo">Inactivo</SelectItem>
                            <SelectItem value="suspendido">Suspendido</SelectItem>
                            <SelectItem value="eliminado">Eliminado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fechas de Suscripción */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Fecha Inicio */}
                    <FormField
                      control={form.control}
                      name="suscripcion_inicio"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Inicio Suscripción</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fecha Fin */}
                    <FormField
                      control={form.control}
                      name="suscripcion_fin"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fin Suscripción</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Verificado */}
                  <FormField
                    control={form.control}
                    name="verificado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Verificado</FormLabel>
                          <FormDescription>
                            Negocio verificado por administradores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Destacado */}
                  <FormField
                    control={form.control}
                    name="destacado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Destacado</FormLabel>
                          <FormDescription>
                            Mostrar en secciones destacadas
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Permite Pedidos */}
                  <FormField
                    control={form.control}
                    name="permite_pedidos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Permite Pedidos</FormLabel>
                          <FormDescription>
                            Habilitado para recibir pedidos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información SEO</h3>
                  
                  {/* SEO Title */}
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="Título para motores de búsqueda" {...field} value={field.value || ''} maxLength={70} />
                        </FormControl>
                        <FormDescription>
                          Máximo 70 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Description */}
                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción SEO</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción para motores de búsqueda" 
                            {...field} 
                            value={field.value || ''} 
                            maxLength={160}
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 160 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Keywords */}
                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palabras Clave SEO</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="palabra1, palabra2, palabra3, ..." 
                            {...field} 
                            value={field.value || ''} 
                            maxLength={300}
                          />
                        </FormControl>
                        <FormDescription>
                          Separadas por comas, máximo 300 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Configuración JSON */}
                <FormField
                  control={form.control}
                  name="configuracion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuración (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="{}"
                          {...field}
                          value={field.value || '{}'}
                          className="font-mono"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Configuraciones específicas del negocio en formato JSON
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Metadata JSON */}
                <FormField
                  control={form.control}
                  name="metadata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metadatos (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="{}"
                          {...field}
                          value={field.value || '{}'}
                          className="font-mono"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Datos adicionales flexibles en formato JSON
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </ModalWrapper>
  )
}