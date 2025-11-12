"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ModalWrapper from './modal-wrapper'
import { UbicacionAPI } from '@/types/product'

// Esquema de validación para el formulario
const formSchema = z.object({
  pais: z.string().length(2, 'El código de país debe tener exactamente 2 caracteres'),
  departamento_estado: z.string().min(2, 'El departamento/estado debe tener al menos 2 caracteres'),
  ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  zona_barrio: z.string().optional(),
  direccion_completa: z.string().optional(),
  codigo_postal: z.string().optional(),
  latitud: z.number().min(-90, 'La latitud debe estar entre -90 y 90').max(90, 'La latitud debe estar entre -90 y 90').optional(),
  longitud: z.number().min(-180, 'La longitud debe estar entre -180 y 180').max(180, 'La longitud debe estar entre -180 y 180').optional(),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  activo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface UbicacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ubicacionToEdit?: UbicacionAPI
}

export default function UbicacionModal({
  open,
  onOpenChange,
  ubicacionToEdit
}: UbicacionModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formulario con valores por defecto o valores para editar
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: ubicacionToEdit ? {
      pais: ubicacionToEdit.pais,
      departamento_estado: ubicacionToEdit.departamento_estado,
      ciudad: ubicacionToEdit.ciudad,
      zona_barrio: ubicacionToEdit.zona_barrio || '',
      direccion_completa: ubicacionToEdit.direccion_completa || '',
      codigo_postal: ubicacionToEdit.codigo_postal || '',
      latitud: ubicacionToEdit.latitud,
      longitud: ubicacionToEdit.longitud,
      timezone: ubicacionToEdit.timezone || 'America/Bogota',
      activo: ubicacionToEdit.activo
    } : {
      pais: 'CO',
      departamento_estado: '',
      ciudad: '',
      zona_barrio: '',
      direccion_completa: '',
      codigo_postal: '',
      latitud: undefined,
      longitud: undefined,
      timezone: 'America/Bogota',
      activo: true
    }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true)
      console.log('Datos del formulario:', data)

      // Aquí iría la lógica para guardar en la base de datos
      // await createUbicacion(data) o await updateUbicacion(data)

      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar la ubicación:', error)
      setIsSaving(false)
    }
  }

  // Lista de países (puedes expandir esta lista)
  const paisOptions = [
    { value: 'CO', label: 'Colombia' },
    { value: 'MX', label: 'México' },
    { value: 'AR', label: 'Argentina' },
    { value: 'PE', label: 'Perú' },
    { value: 'CL', label: 'Chile' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'PY', label: 'Paraguay' }
  ]

  // Lista de zonas horarias para América Latina
  const timezoneOptions = [
    { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
    { value: 'America/Lima', label: 'Lima (GMT-5)' },
    { value: 'America/Santiago', label: 'Santiago (GMT-4)' },
    { value: 'America/Guayaquil', label: 'Guayaquil (GMT-5)' },
    { value: 'America/Caracas', label: 'Caracas (GMT-4)' },
    { value: 'America/La_Paz', label: 'La Paz (GMT-4)' },
    { value: 'America/Montevideo', label: 'Montevideo (GMT-3)' },
    { value: 'America/Asuncion', label: 'Asunción (GMT-4)' }
  ]

  // Obtener coordenadas por API (simulado)
  const buscarCoordenadas = () => {
    // En una implementación real, se usaría una API de geocodificación como Google Maps o Mapbox
    const direccion = `${form.getValues('direccion_completa')}, ${form.getValues('ciudad')}, ${form.getValues('departamento_estado')}, ${form.getValues('pais')}`

    // Simulamos una respuesta de coordenadas aleatorias
    const latitud = (Math.random() * 180) - 90
    const longitud = (Math.random() * 360) - 180

    form.setValue('latitud', Math.round(latitud * 1000000) / 1000000)
    form.setValue('longitud', Math.round(longitud * 1000000) / 1000000)

    console.log(`Simulando geocodificación para: ${direccion}`)
  }

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={ubicacionToEdit ? 'Editar Ubicación' : 'Crear Ubicación'}
      description="Configura los detalles de la ubicación geográfica"
      onSave={form.handleSubmit(onSubmit)}
      saveLabel={ubicacionToEdit ? 'Actualizar' : 'Crear'}
      isSaving={isSaving}
    >
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* País */}
            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paisOptions.map(pais => (
                        <SelectItem key={pais.value} value={pais.value}>
                          {pais.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Código ISO 3166-1 alpha-2 del país
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Zona Horaria */}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona Horaria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona zona horaria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timezoneOptions.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
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
            {/* Departamento/Estado */}
            <FormField
              control={form.control}
              name="departamento_estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento / Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cundinamarca" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ciudad */}
            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bogotá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zona/Barrio */}
            <FormField
              control={form.control}
              name="zona_barrio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona / Barrio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Chapinero" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código Postal */}
            <FormField
              control={form.control}
              name="codigo_postal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 110231" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dirección Completa */}
          <FormField
            control={form.control}
            name="direccion_completa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección Completa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Calle 100 # 15-20, Edificio Torre Empresarial, Piso 5"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Dirección detallada para localizar exactamente el lugar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={buscarCoordenadas}
            >
              Buscar coordenadas automáticamente
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Latitud */}
            <FormField
              control={form.control}
              name="latitud"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitud</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 4.7109"
                      step="0.000001"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Coordenada de -90 a 90 grados
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Longitud */}
            <FormField
              control={form.control}
              name="longitud"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: -74.0721"
                      step="0.000001"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Coordenada de -180 a 180 grados
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Estado activo */}
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Activo</FormLabel>
                  <FormDescription>
                    Permitir que esta ubicación se utilice en el sistema
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
        </form>
      </Form>
    </ModalWrapper>
  )
}