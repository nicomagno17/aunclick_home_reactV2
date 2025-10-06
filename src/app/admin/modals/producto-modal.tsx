"use client"

import { useState, useEffect } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { productosService } from '@/services'
import { ProductoAPI, NegocioAPI, CategoriaAPI } from '@/types/product'

// Tipo para imágenes de productos
interface ImagenProducto {
  url: string;
  esPrincipal: boolean;
}

// Esquema de validación para el formulario
const formSchema = z.object({
  // Relaciones
  negocio_id: z.number().min(1, 'Debe seleccionar un negocio'),
  categoria_id: z.number().min(1, 'Debe seleccionar una categoría'),

  // Información básica
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  descripcion: z.string().optional(),
  descripcion_corta: z.string().max(300, 'La descripción corta no puede exceder los 300 caracteres').optional(),

  // Información de precios
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  precio_antes: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
  moneda: z.string(),

  // Información de inventario
  sku: z.string().optional(),
  stock_disponible: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
  maneja_stock: z.boolean(),
  stock_minimo: z.number().int().min(0, 'El stock mínimo debe ser mayor o igual a 0'),

  // Características del producto
  peso: z.number().min(0, 'El peso debe ser mayor o igual a 0').optional(),
  dimensiones: z.string().optional(),

  // Estado y configuración
  estado: z.enum(['borrador', 'activo', 'inactivo', 'agotado', 'eliminado']),
  destacado: z.boolean(),
  permite_personalizacion: z.boolean(),

  // SEO y marketing
  seo_title: z.string().max(70, 'El título SEO no debe exceder los 70 caracteres').optional(),
  seo_description: z.string().max(160, 'La descripción SEO no debe exceder los 160 caracteres').optional(),
  seo_keywords: z.string().max(300, 'Las keywords SEO no deben exceder los 300 caracteres').optional(),

  // Datos adicionales
  atributos: z.string().optional(),
  opciones_personalizacion: z.string().optional(),
  metadata: z.string().optional(),

  // Fechas
  fecha_disponibilidad: z.date().optional(),
}).refine((data) => typeof data.negocio_id === 'number', {
  message: 'El ID del negocio debe ser un número',
  path: ['negocio_id'],
}).refine((data) => typeof data.categoria_id === 'number', {
  message: 'El ID de la categoría debe ser un número',
  path: ['categoria_id'],
})

type FormValues = {
  negocio_id: number
  categoria_id: number
  nombre: string
  slug: string
  descripcion?: string
  descripcion_corta?: string
  precio: number
  precio_antes?: number
  moneda: string
  sku?: string
  stock_disponible: number
  maneja_stock: boolean
  stock_minimo: number
  peso?: number
  dimensiones?: string
  estado: 'borrador' | 'activo' | 'inactivo' | 'agotado' | 'eliminado'
  destacado: boolean
  permite_personalizacion: boolean
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  atributos?: string
  opciones_personalizacion?: string
  metadata?: string
  fecha_disponibilidad?: Date
}

interface ProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productoToEdit?: ProductoAPI
  negociosList?: NegocioAPI[]
  categoriasList?: CategoriaAPI[]
}

export default function ProductoModal({
  open,
  onOpenChange,
  productoToEdit
}: ProductoModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [negociosList, setNegociosList] = useState<NegocioAPI[]>([])
  const [categoriasList, setCategoriasList] = useState<CategoriaAPI[]>([])
  const [activeTab, setActiveTab] = useState('informacion')
  const [imagenes, setImagenes] = useState<ImagenProducto[]>([])
  const [imagenActual, setImagenActual] = useState<string | null>(null)
  const { toast } = useToast()

  // Configuración de los pasos
  const steps = ['informacion', 'precios', 'inventario', 'imagenes', 'avanzado']
  const currentStepIndex = steps.indexOf(activeTab)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const goToNextStep = () => {
    if (!isLastStep) {
      setActiveTab(steps[currentStepIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setActiveTab(steps[currentStepIndex - 1])
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: productoToEdit || {
      negocio_id: 0,
      categoria_id: 0,

      nombre: '',
      slug: '',
      descripcion: '',
      descripcion_corta: '',

      precio: 0,
      precio_antes: undefined,
      moneda: 'COP',

      sku: '',
      stock_disponible: 0,
      maneja_stock: false,
      stock_minimo: 0,

      peso: undefined,
      dimensiones: JSON.stringify({
        largo: 0,
        ancho: 0,
        alto: 0
      }, null, 2),

      estado: 'borrador',
      destacado: false,
      permite_personalizacion: false,

      seo_title: '',
      seo_description: '',
      seo_keywords: '',

      atributos: JSON.stringify({}, null, 2),
      opciones_personalizacion: JSON.stringify({}, null, 2),
      metadata: JSON.stringify({}, null, 2),

      fecha_disponibilidad: undefined,
    },
    values: productoToEdit || {
      negocio_id: 0,
      categoria_id: 0,
      nombre: '',
      slug: '',
      descripcion: '',
      descripcion_corta: '',
      precio: 0,
      precio_antes: undefined,
      moneda: 'COP',
      sku: '',
      stock_disponible: 0,
      maneja_stock: false,
      stock_minimo: 0,
      peso: undefined,
      dimensiones: JSON.stringify({ largo: 0, ancho: 0, alto: 0 }, null, 2),
      estado: 'borrador' as const,
      destacado: false,
      permite_personalizacion: false,
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      atributos: JSON.stringify({}, null, 2),
      opciones_personalizacion: JSON.stringify({}, null, 2),
      metadata: JSON.stringify({}, null, 2),
      fecha_disponibilidad: undefined,
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

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      console.log('Datos del formulario:', values)

      // Validar que los campos requeridos tengan valor
      if (!values.negocio_id) {
        toast({
          title: "Error",
          description: "Debe seleccionar un negocio",
          variant: "destructive",
        })
        return
      }

      if (!values.categoria_id) {
        toast({
          title: "Error",
          description: "Debe seleccionar una categoría",
          variant: "destructive",
        })
        return
      }

      // Formatear datos con JSON
      const formattedData = {
        ...values,
        dimensiones: JSON.parse(values.dimensiones || '{}'),
        atributos: JSON.parse(values.atributos || '{}'),
        opciones_personalizacion: JSON.parse(values.opciones_personalizacion || '{}'),
        metadata: JSON.parse(values.metadata || '{}'),
        imagenes // Agregar las imágenes
      }

      // Llamar al servicio para crear el producto
      const newProducto = await productosService.create(formattedData)

      toast({
        title: "¡Éxito!",
        description: "Producto creado correctamente",
      })

      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error al crear producto:', error)
      toast({
        title: "Error",
        description: "Error al crear el producto. Inténtelo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simulación de subida de imágenes
  const handleImageUpload = () => {
    // En una implementación real, aquí se subiría la imagen a un servidor
    const nuevaImagen = {
      url: `https://placehold.co/600x400/purple/white?text=Producto+${imagenes.length + 1}`,
      esPrincipal: imagenes.length === 0 // La primera imagen es la principal por defecto
    }

    setImagenes([...imagenes, nuevaImagen])
    setImagenActual(nuevaImagen.url)
  }

  const setPrincipal = (index: number) => {
    const nuevasImagenes = imagenes.map((img, i) => ({
      ...img,
      esPrincipal: i === index
    }))
    setImagenes(nuevasImagenes)
  }

  const eliminarImagen = (index: number) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index)

    // Si eliminamos la imagen actual, seleccionamos otra
    if (imagenes[index].url === imagenActual) {
      setImagenActual(nuevasImagenes.length > 0 ? nuevasImagenes[0].url : null)
    }

    // Si eliminamos la principal, hacemos la primera como principal
    if (imagenes[index].esPrincipal && nuevasImagenes.length > 0) {
      nuevasImagenes[0].esPrincipal = true
    }

    setImagenes(nuevasImagenes)
  }

  // Lista de monedas disponibles
  const monedaOptions = [
    { value: 'COP', label: 'Peso Colombiano (COP)' },
    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'ARS', label: 'Peso Argentino (ARS)' },
    { value: 'CLP', label: 'Peso Chileno (CLP)' },
    { value: 'PEN', label: 'Sol Peruano (PEN)' }
  ]

  // Cargar datos para los selects
  useEffect(() => {
    if (open) {
      // Cargar negocios y categorías reales
      const loadData = async () => {
        try {
          const [negociosResponse, categoriasResponse] = await Promise.all([
            fetch('/api/negocios'),
            fetch('/api/categorias-productos')
          ])

          const negociosData = await negociosResponse.json()
          const categoriasData = await categoriasResponse.json()

          setNegociosList(negociosData.data || [])
          setCategoriasList(categoriasData.data || [])
        } catch (error) {
          console.error('Error al cargar datos:', error)
          toast({
            title: "Error",
            description: "Error al cargar los datos necesarios",
            variant: "destructive",
          })
        }
      }

      loadData()
    }
  }, [open, toast])


  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={productoToEdit ? 'Editar Producto' : 'Crear Producto'}
      description={`Paso ${currentStepIndex + 1} de ${steps.length}: Configura los detalles del producto`}
      onSave={isLastStep ? form.handleSubmit(onSubmit) : undefined}
      saveLabel={productoToEdit ? 'Actualizar' : 'Crear'}
      isSaving={isLoading}
      maxWidth="md:max-w-4xl"
      customFooter={
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            {!isLastStep ? (
              <Button
                type="button"
                onClick={goToNextStep}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : (productoToEdit ? 'Actualizar' : 'Crear')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <Tabs defaultValue="informacion" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="precios">Precios</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
          <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form className="space-y-6">
            {/* Tab de Información Básica */}
            <TabsContent value="informacion">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Negocio */}
                  <FormField
                    control={form.control}
                    name="negocio_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negocio</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un negocio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {negociosList.map((negocio) => (
                              <SelectItem key={negocio.id} value={negocio.id.toString()}>
                                {negocio.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Categoría */}
                  <FormField
                    control={form.control}
                    name="categoria_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriasList.map((categoria) => (
                              <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                {categoria.nombre}
                              </SelectItem>
                            ))}
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
                            placeholder="Nombre del producto"
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
                          <Input placeholder="slug-producto" {...field} />
                        </FormControl>
                        <FormDescription>
                          Identificador único para URLs (solo minúsculas, números y guiones)
                        </FormDescription>
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
                          placeholder="Breve descripción del producto (máx. 300 caracteres)"
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
                          placeholder="Descripción detallada del producto"
                          {...field}
                          value={field.value || ''}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <SelectItem value="agotado">Agotado</SelectItem>
                            <SelectItem value="eliminado">Eliminado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
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

                  {/* Fecha de Disponibilidad */}
                  <FormField
                    control={form.control}
                    name="fecha_disponibilidad"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Disponible desde</FormLabel>
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
                        <FormDescription>
                          Fecha desde cuando estará disponible
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab de Precios */}
            <TabsContent value="precios">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio */}
                  <FormField
                    control={form.control}
                    name="precio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Precio Anterior (para mostrar descuentos) */}
                  <FormField
                    control={form.control}
                    name="precio_antes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Anterior</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Para mostrar descuentos (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Moneda */}
                <FormField
                  control={form.control}
                  name="moneda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {monedaOptions.map(moneda => (
                            <SelectItem key={moneda.value} value={moneda.value}>
                              {moneda.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Código ISO 4217 de la moneda
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Tab de Inventario */}
            <TabsContent value="inventario">
              <div className="space-y-6">
                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU123456" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        Código de identificación único del producto (Stock Keeping Unit)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Maneja Stock */}
                <FormField
                  control={form.control}
                  name="maneja_stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Maneja Inventario</FormLabel>
                        <FormDescription>
                          Llevar control de stock disponible
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stock Disponible */}
                  <FormField
                    control={form.control}
                    name="stock_disponible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Disponible</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            {...field}
                            disabled={!form.watch('maneja_stock')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stock Mínimo */}
                  <FormField
                    control={form.control}
                    name="stock_minimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Mínimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            {...field}
                            disabled={!form.watch('maneja_stock')}
                          />
                        </FormControl>
                        <FormDescription>
                          Nivel mínimo para alertas de reposición
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Peso */}
                  <FormField
                    control={form.control}
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.001"
                            placeholder="Ej: 1.5"
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Peso en kilogramos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dimensiones (JSON) */}
                  <FormField
                    control={form.control}
                    name="dimensiones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensiones (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`{
  "largo": 10,
  "ancho": 5,
  "alto": 2
}`}
                            {...field}
                            value={field.value || '{}'}
                            className="font-mono"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Dimensiones en centímetros (formato JSON)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Permite Personalización */}
                <FormField
                  control={form.control}
                  name="permite_personalizacion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Permite Personalización</FormLabel>
                        <FormDescription>
                          El cliente puede personalizar este producto
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

                {/* Opciones de Personalización */}
                {form.watch('permite_personalizacion') && (
                  <FormField
                    control={form.control}
                    name="opciones_personalizacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opciones de Personalización (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`{
  "color": ["rojo", "azul", "verde"],
  "tamaño": ["S", "M", "L", "XL"],
  "texto": {
    "maximo_caracteres": 20,
    "placeholder": "Ingrese su texto personalizado"
  }
}`}
                            {...field}
                            value={field.value || '{}'}
                            className="font-mono"
                            rows={8}
                          />
                        </FormControl>
                        <FormDescription>
                          Opciones disponibles para personalización en formato JSON
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </TabsContent>

            {/* Tab de Imágenes */}
            <TabsContent value="imagenes">
              <div className="space-y-6">
                {/* Subir Imagen */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Imágenes del Producto</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImageUpload}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Imagen
                    </Button>
                  </div>

                  {/* Vista previa de la imagen actual */}
                  {imagenActual ? (
                    <div className="border rounded-md p-2">
                      <img
                        src={imagenActual}
                        alt="Imagen preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 flex items-center justify-center bg-slate-50 h-64">
                      <p className="text-slate-500 text-sm">No hay imágenes seleccionadas</p>
                    </div>
                  )}

                  {/* Lista de miniaturas */}
                  {imagenes.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {imagenes.map((imagen, index) => (
                        <div
                          key={index}
                          className={`border rounded-md overflow-hidden relative cursor-pointer
                                    ${imagen.url === imagenActual ? 'ring-2 ring-purple-500' : ''}
                                    ${imagen.esPrincipal ? 'border-purple-500 border-2' : ''}`}
                          onClick={() => setImagenActual(imagen.url)}
                        >
                          <img
                            src={imagen.url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute top-0 right-0 p-1 flex gap-1">
                            <button
                              type="button"
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${imagen.esPrincipal ? 'bg-purple-500 text-white' : 'bg-white text-gray-700 border'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrincipal(index);
                              }}
                              title="Establecer como principal"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              className="w-6 h-6 bg-white border rounded-full flex items-center justify-center text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarImagen(index);
                              }}
                              title="Eliminar imagen"
                            >
                              ×
                            </button>
                          </div>
                          {imagen.esPrincipal && (
                            <div className="absolute bottom-0 left-0 right-0 bg-purple-500 text-white text-xs py-0.5 text-center">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FormDescription>
                  Sube las imágenes del producto. La imagen marcada como principal se mostrará en listados y búsquedas.
                </FormDescription>
              </div>
            </TabsContent>

            {/* Tab de Configuración Avanzada */}
            <TabsContent value="avanzado">
              <div className="space-y-6">
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

                {/* Atributos JSON */}
                <FormField
                  control={form.control}
                  name="atributos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atributos (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`{
  "marca": "Nombre de la Marca",
  "modelo": "ABC-123",
  "material": "Algodón",
  "fabricante": "Fabricante S.A.",
  "origen": "Colombia"
}`}
                          {...field}
                          value={field.value || '{}'}
                          className="font-mono"
                          rows={8}
                        />
                      </FormControl>
                      <FormDescription>
                        Atributos específicos del producto en formato JSON
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