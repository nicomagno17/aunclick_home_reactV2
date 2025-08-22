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

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  descripcion: z.string().optional(),
  parent_id: z.string().optional(),
  nivel: z.coerce.number().int().min(1, 'El nivel debe ser al menos 1').max(5, 'El nivel no puede ser mayor a 5'),
  activo: z.boolean().default(true),
  orden: z.coerce.number().int().min(1, 'El orden debe ser al menos 1'),
  metadata: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CategoriaProductoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoriaToEdit?: any // Tipo más específico cuando tengamos la estructura
  categoriasList?: any[] // Lista de categorías para seleccionar como padre
}

export default function CategoriaProductoModal({ 
  open, 
  onOpenChange, 
  categoriaToEdit,
  categoriasList = [] // Idealmente cargar desde la API
}: CategoriaProductoModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formulario con valores por defecto o valores para editar
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: categoriaToEdit || {
      nombre: '',
      slug: '',
      descripcion: '',
      parent_id: '',
      nivel: 1,
      activo: true,
      orden: 1,
      metadata: '{}'
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
      
      // Convertir el metadata de string a JSON
      const formattedData = {
        ...data,
        metadata: data.metadata ? JSON.parse(data.metadata) : {}
      }
      
      // Aquí iría la lógica para guardar en la base de datos
      // await createCategoriaProducto(formattedData) o await updateCategoriaProducto(formattedData)
      
      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar la categoría:', error)
      setIsSaving(false)
    }
  }

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={categoriaToEdit ? 'Editar Categoría de Producto' : 'Crear Categoría de Producto'}
      description="Configura los detalles de la categoría de producto"
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

          {/* Metadata (JSON) */}
          <FormField
            control={form.control}
            name="metadata"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metadatos (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='{"atributo1": "valor1", "atributo2": "valor2"}'
                    {...field}
                    value={field.value || '{}'}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  Atributos específicos de la categoría en formato JSON
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ModalWrapper>
  )
}