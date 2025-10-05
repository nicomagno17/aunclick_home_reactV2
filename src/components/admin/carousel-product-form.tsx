'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductoCarrusel } from '@/types/product'

interface CarouselProductFormProps {
  onSave: (productData: ProductoCarrusel) => void
  onCancel: () => void
  existingData?: ProductoCarrusel
}

export function CarouselProductForm({ onSave, onCancel, existingData }: CarouselProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    subcategoria: '',
    descripcion: '',
    precioActual: '',
    precioAnterior: '',
    genero: '',
    medidas: '',
    unidadMedida: 'cm',
    tallasCalzado: [] as string[],
    tallasRopa: [] as string[]
  })

  const [opcionesProducto, setOpcionesProducto] = useState({
    tallasCalzado: false,
    tallasRopa: false,
    genero: false,
    medidas: false
  })

  // Cargar datos existentes si los hay
  useEffect(() => {
    if (existingData) {
      setFormData({
        nombre: existingData.nombre || '',
        categoria: existingData.categoria || '',
        subcategoria: existingData.subcategoria || '',
        descripcion: existingData.descripcion || '',
        precioActual: existingData.precioActual || '',
        precioAnterior: existingData.precioAnterior || '',
        genero: existingData.genero || '',
        medidas: existingData.medidas || '',
        unidadMedida: existingData.unidadMedida || 'cm',
        tallasCalzado: existingData.tallasCalzado || [],
        tallasRopa: existingData.tallasRopa || []
      })

      setOpcionesProducto({
        tallasCalzado: !!(existingData.tallasCalzado && existingData.tallasCalzado.length > 0),
        tallasRopa: !!(existingData.tallasRopa && existingData.tallasRopa.length > 0),
        genero: !!(existingData.genero && existingData.genero !== 'generico'),
        medidas: !!existingData.medidas
      })
    }
  }, [existingData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleOpcion = (opcion: keyof typeof opcionesProducto) => {
    setOpcionesProducto(prev => ({
      ...prev,
      [opcion]: !prev[opcion]
    }))
  }

  const handleTallaToggle = (tipo: 'tallasCalzado' | 'tallasRopa', talla: string) => {
    setFormData(prev => {
      const currentTallas = prev[tipo]
      const isSelected = currentTallas.includes(talla)

      if (isSelected) {
        return {
          ...prev,
          [tipo]: currentTallas.filter(t => t !== talla)
        }
      } else {
        return {
          ...prev,
          [tipo]: [...currentTallas, talla]
        }
      }
    })
  }

  const handleSubmit = () => {
    if (!formData.nombre || !formData.precioActual) {
      alert('Por favor completa al menos el nombre y precio actual del producto')
      return
    }

    const data: ProductoCarrusel = {
      id: existingData?.id || Date.now().toString(),
      nombre: formData.nombre,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria,
      descripcion: formData.descripcion,
      precioActual: parseFloat(formData.precioActual),
      precioAnterior: formData.precioAnterior ? parseFloat(formData.precioAnterior) : undefined,
      genero: formData.genero || undefined,
      medidas: formData.medidas || undefined,
      unidadMedida: formData.unidadMedida,
      imagen: existingData?.imagen ?? '',
      tallasCalzado: formData.tallasCalzado,
      tallasRopa: formData.tallasRopa
    }

    onSave(data)
  }

  // Función de autollenado
  const handleAutoFill = () => {
    const ejemplos = [
      {
        nombre: 'iPhone 15 Pro Max',
        categoria: 'electronica',
        subcategoria: 'smartphones',
        descripcion: 'El último iPhone con cámara profesional de 48MP y chip A17 Pro. Diseño en titanio con pantalla Super Retina XDR de 6.7 pulgadas.',
        precioActual: '1299.99',
        precioAnterior: '1499.99',
        genero: 'generico',
        medidas: '159.9',
        unidadMedida: 'mm'
      },
      {
        nombre: 'Camisa Formal Premium',
        categoria: 'ropa',
        subcategoria: 'hombre',
        descripcion: 'Camisa formal de algodón premium con corte moderno. Ideal para ocasiones especiales y entorno laboral profesional.',
        precioActual: '29.99',
        precioAnterior: '59.99',
        genero: 'hombre',
        tallasRopa: ['L', 'XL', 'XXL']
      },
      {
        nombre: 'Zapatillas Deportivas Pro',
        categoria: 'ropa',
        subcategoria: 'calzado',
        descripcion: 'Zapatillas deportivas de alta tecnología con amortiguación avanzada y materiales transpirables.',
        precioActual: '89.99',
        precioAnterior: '129.99',
        genero: 'generico',
        tallasCalzado: ['40', '41', '42', '43']
      },
      {
        nombre: 'Set de Ollas Premium',
        categoria: 'hogar',
        subcategoria: 'cocina',
        descripcion: 'Juego de ollas de acero inoxidable con distribución de calor uniforme. Incluye tapas de vidrio templado.',
        precioActual: '199.99',
        precioAnterior: '299.99',
        genero: 'generico',
        medidas: '25',
        unidadMedida: 'cm'
      }
    ]

    const randomEjemplo = ejemplos[Math.floor(Math.random() * ejemplos.length)]

    setFormData({
      nombre: randomEjemplo.nombre,
      categoria: randomEjemplo.categoria,
      subcategoria: randomEjemplo.subcategoria,
      descripcion: randomEjemplo.descripcion,
      precioActual: randomEjemplo.precioActual,
      precioAnterior: randomEjemplo.precioAnterior,
      genero: randomEjemplo.genero,
      medidas: randomEjemplo.medidas || '',
      unidadMedida: randomEjemplo.unidadMedida || 'cm',
      tallasCalzado: randomEjemplo.tallasCalzado || [],
      tallasRopa: randomEjemplo.tallasRopa || []
    })

    setOpcionesProducto({
      tallasCalzado: !!(randomEjemplo.tallasCalzado && randomEjemplo.tallasCalzado.length > 0),
      tallasRopa: !!(randomEjemplo.tallasRopa && randomEjemplo.tallasRopa.length > 0),
      genero: randomEjemplo.genero !== 'generico',
      medidas: !!randomEjemplo.medidas
    })
  }

  const contarPalabras = (texto: string) => {
    const palabras = texto.trim().split(/\s+/).filter(palabra => palabra.length > 0)
    return palabras.length
  }

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value
    const palabras = contarPalabras(texto)

    if (palabras <= 50) {
      handleInputChange('descripcion', texto)
    } else {
      const palabrasArray = texto.trim().split(/\s+/)
      const textoLimitado = palabrasArray.slice(0, 50).join(' ')
      handleInputChange('descripcion', textoLimitado)
    }
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Botón de autollenado */}
      <div className="flex justify-end">
        <Button
          onClick={handleAutoFill}
          variant="outline"
          className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
        >
          Autollenado
        </Button>
      </div>

      {/* Nombre del producto */}
      <div>
        <Label htmlFor="carousel-nombre" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
          Nombre del Producto
        </Label>
        <Input
          id="carousel-nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          placeholder="Ingresa el nombre del producto"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-xs md:text-sm h-8 md:h-10"
        />
      </div>

      {/* Categoría y Subcategoría */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <Label htmlFor="carousel-categoria" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Categoría
          </Label>
          <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="electronica" className="text-[11px] md:text-sm">Electrónica</SelectItem>
              <SelectItem value="ropa" className="text-[11px] md:text-sm">Ropa y Accesorios</SelectItem>
              <SelectItem value="hogar" className="text-[11px] md:text-sm">Hogar y Decoración</SelectItem>
              <SelectItem value="deportes" className="text-[11px] md:text-sm">Deportes</SelectItem>
              <SelectItem value="libros" className="text-[11px] md:text-sm">Libros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carousel-subcategoria" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Subcategoría
          </Label>
          <Select value={formData.subcategoria} onValueChange={(value) => handleInputChange('subcategoria', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="smartphones" className="text-[11px] md:text-sm">Smartphones</SelectItem>
              <SelectItem value="laptops" className="text-[11px] md:text-sm">Laptops</SelectItem>
              <SelectItem value="hombre" className="text-[11px] md:text-sm">Hombre</SelectItem>
              <SelectItem value="mujer" className="text-[11px] md:text-sm">Mujer</SelectItem>
              <SelectItem value="calzado" className="text-[11px] md:text-sm">Calzado</SelectItem>
              <SelectItem value="cocina" className="text-[11px] md:text-sm">Cocina</SelectItem>
              <SelectItem value="muebles" className="text-[11px] md:text-sm">Muebles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div>
        <Label className="text-gray-300 mb-2 md:mb-3 block text-xs md:text-sm">
          Tu producto necesita mostrar:
        </Label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="flex items-center space-x-1">
            <div className="relative">
              <input
                type="checkbox"
                id="carousel-genero"
                className="sr-only"
                checked={opcionesProducto.genero}
                onChange={() => toggleOpcion('genero')}
              />
              <label
                htmlFor="carousel-genero"
                className={`flex items-center justify-center w-3 h-3 md:w-3.5 md:h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.genero
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-400 hover:border-gray-300'
                  }`}
              >
                {opcionesProducto.genero && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </label>
            </div>
            <label htmlFor="carousel-genero" className="text-gray-300 cursor-pointer text-[10px] md:text-xs">
              Género
            </label>
          </div>

          <div className="flex items-center space-x-1">
            <div className="relative">
              <input
                type="checkbox"
                id="carousel-medidas"
                className="sr-only"
                checked={opcionesProducto.medidas}
                onChange={() => toggleOpcion('medidas')}
              />
              <label
                htmlFor="carousel-medidas"
                className={`flex items-center justify-center w-3 h-3 md:w-3.5 md:h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.medidas
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-400 hover:border-gray-300'
                  }`}
              >
                {opcionesProducto.medidas && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </label>
            </div>
            <label htmlFor="carousel-medidas" className="text-gray-300 cursor-pointer text-[10px] md:text-xs">
              Medidas
            </label>
          </div>

          <div className="flex items-center space-x-1">
            <div className="relative">
              <input
                type="checkbox"
                id="carousel-tallas-calzado"
                className="sr-only"
                checked={opcionesProducto.tallasCalzado}
                onChange={() => toggleOpcion('tallasCalzado')}
              />
              <label
                htmlFor="carousel-tallas-calzado"
                className={`flex items-center justify-center w-3 h-3 md:w-3.5 md:h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.tallasCalzado
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-400 hover:border-gray-300'
                  }`}
              >
                {opcionesProducto.tallasCalzado && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </label>
            </div>
            <label htmlFor="carousel-tallas-calzado" className="text-gray-300 cursor-pointer text-[10px] md:text-xs">
              Talla Calzado
            </label>
          </div>

          <div className="flex items-center space-x-1">
            <div className="relative">
              <input
                type="checkbox"
                id="carousel-tallas-ropa"
                className="sr-only"
                checked={opcionesProducto.tallasRopa}
                onChange={() => toggleOpcion('tallasRopa')}
              />
              <label
                htmlFor="carousel-tallas-ropa"
                className={`flex items-center justify-center w-3 h-3 md:w-3.5 md:h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.tallasRopa
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-400 hover:border-gray-300'
                  }`}
              >
                {opcionesProducto.tallasRopa && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </label>
            </div>
            <label htmlFor="carousel-tallas-ropa" className="text-gray-300 cursor-pointer text-[10px] md:text-xs">
              Talla Ropa
            </label>
          </div>
        </div>
      </div>

      {/* Campos dinámicos */}
      {(opcionesProducto.genero || opcionesProducto.medidas) && (
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {opcionesProducto.genero && (
            <div>
              <Label htmlFor="carousel-genero-select" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
                Género
              </Label>
              <Select value={formData.genero} onValueChange={(value) => handleInputChange('genero', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 md:h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="hombre" className="text-xs md:text-sm">Hombre</SelectItem>
                  <SelectItem value="mujer" className="text-xs md:text-sm">Mujer</SelectItem>
                  <SelectItem value="niño" className="text-xs md:text-sm">Niño</SelectItem>
                  <SelectItem value="niña" className="text-xs md:text-sm">Niña</SelectItem>
                  <SelectItem value="generico" className="text-xs md:text-sm">Genérico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {opcionesProducto.medidas && (
            <div>
              <Label className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
                Medidas
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={formData.medidas}
                  onChange={(e) => handleInputChange('medidas', e.target.value)}
                  placeholder="0"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-1 h-8 md:h-10 text-xs md:text-sm"
                />
                <Select value={formData.unidadMedida} onValueChange={(value) => handleInputChange('unidadMedida', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-12 md:w-16 h-8 md:h-10 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="mm">mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tallas de Calzado */}
      {opcionesProducto.tallasCalzado && (
        <div>
          <Label className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Tallas de Calzado
          </Label>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1 p-2 bg-gray-700 rounded-lg border border-gray-600">
            {['22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map((talla) => (
              <button
                key={talla}
                type="button"
                onClick={() => handleTallaToggle('tallasCalzado', talla)}
                className={`px-0.5 md:px-1 py-0.5 text-[10px] md:text-xs rounded transition-colors text-center ${formData.tallasCalzado.includes(talla)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tallas de Ropa */}
      {opcionesProducto.tallasRopa && (
        <div>
          <Label className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Tallas de Ropa
          </Label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1 p-1.5 md:p-2 bg-gray-700 rounded-lg border border-gray-600">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'T.Única'].map((talla) => (
              <button
                key={talla}
                type="button"
                onClick={() => handleTallaToggle('tallasRopa', talla === 'T.Única' ? 'Talla Única' : talla)}
                className={`px-0.5 md:px-1 py-0.5 text-[10px] md:text-xs rounded transition-colors text-center ${formData.tallasRopa.includes(talla === 'T.Única' ? 'Talla Única' : talla)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Precios */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <Label htmlFor="carousel-precio-actual" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Precio Actual
          </Label>
          <div className="relative">
            <span className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm">$</span>
            <Input
              id="carousel-precio-actual"
              type="number"
              value={formData.precioActual}
              onChange={(e) => handleInputChange('precioActual', e.target.value)}
              placeholder="0.00"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-6 md:pl-8 h-8 md:h-10 text-xs md:text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="carousel-precio-anterior" className="text-gray-300 mb-1 md:mb-2 block text-xs md:text-sm">
            Precio Anterior
          </Label>
          <div className="relative">
            <span className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm">$</span>
            <Input
              id="carousel-precio-anterior"
              type="number"
              value={formData.precioAnterior}
              onChange={(e) => handleInputChange('precioAnterior', e.target.value)}
              placeholder="0.00"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-6 md:pl-8 h-8 md:h-10 text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <Label htmlFor="carousel-descripcion" className="text-gray-300 text-xs md:text-sm">
            Descripción
          </Label>
          <span className={`text-[10px] md:text-sm ${contarPalabras(formData.descripcion) > 45
              ? 'text-yellow-400'
              : contarPalabras(formData.descripcion) > 48
                ? 'text-red-400'
                : 'text-gray-400'
            }`}>
            {contarPalabras(formData.descripcion)}/50 palabras
          </span>
        </div>
        <Textarea
          id="carousel-descripcion"
          value={formData.descripcion}
          onChange={handleDescripcionChange}
          placeholder="Escribe una descripción del producto..."
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none text-xs md:text-sm"
          rows={2}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 md:space-x-3 pt-3 md:pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 h-8 md:h-10"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 h-8 md:h-10"
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}