"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import ModalWrapper from './modal-wrapper'
import { PlusCircle, MinusCircle } from 'lucide-react'

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  precio_mensual: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
  precio_anual: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
  descuento_anual: z.coerce.number().min(0, 'El descuento debe ser mayor o igual a 0').max(100, 'El descuento no puede superar el 100%'),
  max_negocios: z.coerce.number().int().min(1, 'Debe permitir al menos 1 negocio'),
  max_productos_por_negocio: z.coerce.number().int().min(1, 'Debe permitir al menos 1 producto'),
  max_imagenes_por_producto: z.coerce.number().int().min(1, 'Debe permitir al menos 1 imagen'),
  caracteristicas: z.array(z.string().min(1, 'La característica no puede estar vacía')),
  activo: z.boolean().default(true),
  orden_visualizacion: z.coerce.number().int().min(1, 'El orden debe ser al menos 1')
})

type FormValues = z.infer<typeof formSchema>

interface PlanSuscripcionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: any // Tipo más específico cuando tengamos la estructura
}

export default function PlanSuscripcionModal({ open, onOpenChange, planToEdit }: PlanSuscripcionModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formulario con valores por defecto o valores para editar
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: planToEdit || {
      nombre: '',
      descripcion: '',
      precio_mensual: 0,
      precio_anual: 0,
      descuento_anual: 0,
      max_negocios: 1,
      max_productos_por_negocio: 50,
      max_imagenes_por_producto: 5,
      caracteristicas: [''],
      activo: true,
      orden_visualizacion: 1
    }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true)
      console.log('Datos del formulario:', data)
      
      // Aquí iría la lógica para guardar en la base de datos
      // await createPlanSuscripcion(data) o await updatePlanSuscripcion(data)
      
      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar el plan:', error)
      setIsSaving(false)
    }
  }

  const agregarCaracteristica = () => {
    const caracteristicas = form.getValues('caracteristicas')
    form.setValue('caracteristicas', [...caracteristicas, ''])
  }

  const eliminarCaracteristica = (index: number) => {
    const caracteristicas = form.getValues('caracteristicas')
    if (caracteristicas.length > 1) {
      form.setValue(
        'caracteristicas',
        caracteristicas.filter((_, i) => i !== index)
      )
    }
  }

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={planToEdit ? 'Editar Plan de Suscripción' : 'Crear Plan de Suscripción'}
      description="Configura los detalles del plan de suscripción"
      onSave={form.handleSubmit(onSubmit)}
      saveLabel={planToEdit ? 'Actualizar' : 'Crear'}
      isSaving={isSaving}
      maxWidth="md:max-w-3xl"
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
                    <Input placeholder="Nombre del plan" {...field} />
                  </FormControl>
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
                      Mostrar este plan a los usuarios
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

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción detallada del plan"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Precio mensual */}
            <FormField
              control={form.control}
              name="precio_mensual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Mensual</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio anual */}
            <FormField
              control={form.control}
              name="precio_anual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Anual</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descuento anual */}
            <FormField
              control={form.control}
              name="descuento_anual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento Anual (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Máximo negocios */}
            <FormField
              control={form.control}
              name="max_negocios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Negocios</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Máximo productos por negocio */}
            <FormField
              control={form.control}
              name="max_productos_por_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Productos por Negocio</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Máximo imágenes por producto */}
            <FormField
              control={form.control}
              name="max_imagenes_por_producto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Imágenes por Producto</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Orden de visualización */}
          <FormField
            control={form.control}
            name="orden_visualizacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden de Visualización</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  Determina el orden en que se mostrará este plan (menor número = mayor prioridad)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Características */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Características</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarCaracteristica}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Agregar característica
              </Button>
            </div>
            
            {form.watch('caracteristicas').map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`caracteristicas.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="Descripción de la característica" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => eliminarCaracteristica(index)}
                  disabled={form.watch('caracteristicas').length <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </form>
      </Form>
    </ModalWrapper>
  )
}