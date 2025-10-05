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
import ModalWrapper from './modal-wrapper'
import { CategoriaAPI } from '@/types/product'

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  descripcion: z.string().optional(),
  icono: z.string().optional(),
  color_hex: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un valor hexadecimal válido (ej: #FF5500)'),
  parent_id: z.string().optional(),
  nivel: z.number().int().min(1, 'El nivel debe ser al menos 1').max(5, 'El nivel no puede ser mayor a 5'),
  activo: z.boolean(),
  orden: z.number().int().min(1, 'El orden debe ser al menos 1'),
})

type FormValues = z.infer<typeof formSchema>

interface CategoriaNegocioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoriaToEdit?: CategoriaAPI // Tipo más específico cuando tengamos la estructura
  categoriasList?: CategoriaAPI[] // Lista de categorías para seleccionar como padre
}

export default function CategoriaNegocioModal({
  open,
  onOpenChange,
  categoriaToEdit,
  categoriasList = [] // Idealmente cargar desde la API
}: CategoriaNegocioModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formulario con valores por defecto o valores para editar
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: categoriaToEdit || {
      nombre: '',
      slug: '',
      descripcion: '',
      icono: '',
      color_hex: '#3B82F6',
      parent_id: '',
      nivel: 1,
      activo: true,
      orden: 1
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

      // Aquí iría la lógica para guardar en la base de datos
      // await createCategoriaNegocio(data) o await updateCategoriaNegocio(data)

      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar la categoría:', error)
      setIsSaving(false)
    }
  }

  // Lista de iconos de ejemplo (puedes expandir esta lista)
  const iconOptions = [
    { value: 'restaurant', label: 'Restaurante' },
    { value: 'store', label: 'Tienda' },
    { value: 'business', label: 'Negocios' },
    { value: 'health', label: 'Salud' },
    { value: 'education', label: 'Educación' },
    { value: 'entertainment', label: 'Entretenimiento' },
    { value: 'car', label: 'Automotriz' },
    { value: 'beauty', label: 'Belleza' },
    { value: 'home', label: 'Hogar' },
    { value: 'tech', label: 'Tecnología' }
  ]

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={categoriaToEdit ? 'Editar Categoría de Negocio' : 'Crear Categoría de Negocio'}
      description="Configura los detalles de la categoría de negocio"
      onSave={form.handleSubmit(onSubmit)}
      saveLabel={categoriaToEdit ? 'Actualizar' : 'Crear'}
      isSaving={isSaving}
    >
      <Form {...form}>
        <form className="space-y-6">
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
                      placeholder="Nombre de la categoría"
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
                    <Input placeholder="slug-categoria" {...field} />
                  </FormControl>
                  <FormDescription>
                    Identificador único para URLs (solo minúsculas, números y guiones)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción detallada de la categoría"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icono */}
            <FormField
              control={form.control}
              name="icono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un icono" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map(icon => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Icono representativo para la categoría
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Hex */}
            <FormField
              control={form.control}
              name="color_hex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input type="text" placeholder="#3B82F6" {...field} />
                    </FormControl>
                    <Input
                      type="color"
                      className="w-12 p-1 h-10"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                  <FormDescription>
                    Color representativo (formato hexadecimal)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría Padre */}
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría Padre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría padre (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ninguna (Categoría principal)</SelectItem>
                      {categoriasList.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Dejar vacío si es una categoría principal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nivel */}
            <FormField
              control={form.control}
              name="nivel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel Jerárquico</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Nivel 1 (Principal)</SelectItem>
                      <SelectItem value="2">Nivel 2</SelectItem>
                      <SelectItem value="3">Nivel 3</SelectItem>
                      <SelectItem value="4">Nivel 4</SelectItem>
                      <SelectItem value="5">Nivel 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Profundidad en la jerarquía de categorías
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orden */}
            <FormField
              control={form.control}
              name="orden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Determina el orden de visualización (menor número = mayor prioridad)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado activo */}
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Activo</FormLabel>
                    <FormDescription>
                      Mostrar esta categoría a los usuarios
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
        </form>
      </Form>
    </ModalWrapper>
  )
}