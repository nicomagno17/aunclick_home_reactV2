# Sistema de Tiendas - Documentación

## 📋 Resumen del Sistema

El sistema de tiendas funciona con **nombres de tienda internos** que NO se muestran en las tarjetas de productos, pero se usan para:
- Filtrar productos por tienda
- Navegar a la página de una tienda específica
- Asociar productos con sus respectivas tiendas

## 🏪 Tiendas Actuales en el Sistema

### Listado de Tiendas con Productos:

1. **Apple Store** (4 productos)
   - iPhone 15 Pro Max
   - MacBook Pro 16"
   - iPad Pro 12.9"
   - AirPods Pro 2

2. **Nike Store** (3 productos)
   - Zapatillas Nike Air Max
   - Chaqueta Nike Sportswear
   - Mochila Nike Brasilia

3. **Samsung Store** (3 productos)
   - Samsung Galaxy S24 Ultra
   - Galaxy Tab S9
   - Buds2 Pro

4. **Adidas Store** (3 productos)
   - Adidas Ultraboost 22
   - Polera Adidas Originals
   - Pantalón Adidas Tiro 23

5. **CocinaPro** (3 productos)
   - Set de Cocina Antiadherente
   - Set de Cuchillos Profesionales
   - Batidora de Pie KitchenAid

6. **SportsMax** (3 productos)
   - Balón de Fútbol Profesional
   - Balón de Básquetbol Spalding
   - Pesas Ajustables 20kg

7. **BeautyPlus** (3 productos)
   - Kit de Maquillaje Profesional
   - Paleta de Sombras Nude
   - Set de Brochas Profesionales

8. **Lego Store** (3 productos)
   - Lego Technic Bugatti
   - Lego Star Wars Millennium Falcon
   - Lego City Estación de Policía

9. **Librería Central** (1 producto)
   - El Señor de los Anillos - Edición Especial

10. **AutoTech** (1 producto)
    - GPS para Automóvil Garmin

11. **FarmaciaPlus** (1 producto)
    - Vitaminas Complejas

**TOTAL: 28 productos en 11 tiendas**

## 🔍 Cómo Funciona

### 1. Campo `source` en Productos

Cada producto tiene un campo `source` que almacena el nombre de la tienda:

```typescript
{
  id: '1',
  name: 'iPhone 15 Pro Max',
  description: '...',
  price: 1299900,
  image: 'https://...',
  category: 'electronica',
  source: 'Apple Store', // ← Nombre de la tienda (USO INTERNO)
  rating: 4.8,
  reviews: 1234,
  inStock: true
}
```

### 2. NO se Muestra en Tarjetas

Las tarjetas de productos (`AdminProductCard`) **NO muestran** el nombre de la tienda visualmente. Solo muestran:
- Categoría
- Nombre del producto
- Precio

### 3. SÍ se Usa Internamente

El campo `source` se usa para:

#### a) Navegación desde el Popup
Cuando haces click en el icono de tienda (esquina superior izquierda del popup), el sistema:
1. Lee el campo `source` del producto
2. Genera un ID de tienda: `source.toLowerCase().replace(/\s+/g, '-')`
3. Navega a `/tienda/[id]`

**Ejemplo:**
- `source: 'Apple Store'` → navega a `/tienda/apple-store`
- `source: 'Nike Store'` → navega a `/tienda/nike-store`

#### b) Filtrado de Productos
La página de tienda filtra productos por el campo `source`:

```typescript
const storeProducts = data.filter((p: Product) => p.source === storeInfo.nombre)
```

#### c) Información del Popup
El popup muestra el nombre de la tienda en la parte superior:

```tsx
<h3 className="text-xs md:text-sm font-medium text-gray-500">
  {product.source || 'Tienda Ejemplo'}
</h3>
```

## 📝 Cómo Agregar Nuevos Productos

Para agregar un nuevo producto a una tienda existente:

```typescript
// En: src/app/api/products/route.ts

{
  id: '29', // ← ID único
  name: 'Nombre del Producto',
  description: 'Descripción del producto',
  price: 99990,
  originalPrice: 129990, // Opcional
  image: 'https://...',
  category: 'categoria',
  source: 'Apple Store', // ← USAR EXACTAMENTE el mismo nombre de la tienda
  rating: 4.5,
  reviews: 100,
  inStock: true,
  discount: 23 // Opcional
}
```

### ⚠️ IMPORTANTE: Nombres de Tienda

**DEBES usar exactamente el mismo nombre** que ya existe en el sistema. Los nombres son case-sensitive:

✅ CORRECTO:
```typescript
source: 'Apple Store'  // Coincide exactamente
source: 'Nike Store'   // Coincide exactamente
```

❌ INCORRECTO:
```typescript
source: 'apple store'  // Minúsculas - NO coincide
source: 'Apple store'  // Diferente capitalización - NO coincide
source: 'AppleStore'   // Sin espacio - NO coincide
```

## 🆕 Cómo Crear una Nueva Tienda

### Paso 1: Agregar Productos con el Nuevo Nombre

```typescript
{
  id: '29',
  name: 'PlayStation 5',
  description: 'Consola de última generación',
  price: 549990,
  image: 'https://...',
  category: 'electronica',
  source: 'GameStore Chile', // ← NUEVA TIENDA
  rating: 4.8,
  reviews: 567,
  inStock: true
}
```

### Paso 2: El Sistema lo Detectará Automáticamente

No necesitas hacer nada más. El sistema:
1. Detectará que hay productos con `source: 'GameStore Chile'`
2. Permitirá navegar a `/tienda/gamestore-chile`
3. Filtrará y mostrará solo los productos de esa tienda

### Paso 3: (Opcional) Agregar al Carrusel de Tiendas

Si quieres que la tienda aparezca en el carrusel circular del home:

```tsx
// En: src/app/page.tsx

<ImageCarouselContinuous2
  images={[
    // ... imágenes existentes ...
    "https://imagen-del-logo-tienda.jpg", // Nueva
  ]}
  sourceNames={[
    // ... nombres existentes ...
    "GameStore Chile", // Nueva - DEBE COINCIDIR CON `source`
  ]}
  showSource={true}
/>
```

## 🔄 Cuando se Conecte a Base de Datos

Cuando implementes la base de datos real:

### 1. Mapeo del Campo

El campo `source` se mapeará desde:

```typescript
// ProductoAPI tiene:
negocio_id: number        // ID del negocio en la DB
negocio_nombre: string    // Nombre del negocio

// Se mapea a Product:
source: negocio_nombre    // ← Usar el nombre del negocio
```

### 2. Ejemplo de Transformación

```typescript
// Al obtener productos de la API:
const transformProduct = (apiProduct: ProductoAPI): Product => ({
  id: apiProduct.id.toString(),
  name: apiProduct.nombre,
  description: apiProduct.descripcion || '',
  price: apiProduct.precio,
  originalPrice: apiProduct.precio_antes,
  image: apiProduct.imagen || '/placeholder.jpg',
  category: apiProduct.categoria_nombre || 'general',
  source: apiProduct.negocio_nombre, // ← MAPEO DEL NOMBRE DE LA TIENDA
  rating: 4.5,
  reviews: 0,
  inStock: apiProduct.stock_disponible > 0,
  discount: apiProduct.precio_antes
    ? Math.round(((apiProduct.precio_antes - apiProduct.precio) / apiProduct.precio_antes) * 100)
    : 0
})
```

### 3. Página de Tienda con DB

Cuando implementes la base de datos, cambiarás:

```typescript
// ANTES (Mock):
const storeProducts = data.filter((p: Product) => p.source === storeInfo.nombre)

// DESPUÉS (Con DB):
const response = await fetch(`/api/productos?negocio_id=${tiendaId}`)
```

## 📊 Estructura de Navegación

```
HOME (/)
  │
  ├─ Click en tarjeta circular del carrusel
  │  └─→ /tienda/[id] (preserva scroll)
  │
  ├─ Click en tarjeta de producto
  │  └─→ Abre popup
  │       │
  │       └─ Click en icono de tienda
  │          └─→ /tienda/[id] (preserva popup + scroll)
  │
TIENDA (/tienda/[id])
  │
  └─ Click en botón Volver
     └─→ / (restaura scroll + reabre popup si corresponde)
```

## 🎨 Personalización por Tienda

Actualmente, cada tienda usa información mock. En el futuro, estos datos vendrán de la base de datos:

```typescript
// Información que se mostrará desde la DB:
{
  nombre: string           // Nombre de la tienda
  descripcion: string      // Descripción breve
  logo: string            // URL del logo
  telefono: string        // Teléfono de contacto
  whatsapp: string        // Número de WhatsApp
  email: string           // Email de contacto
  direccion: string       // Dirección física
  horarios: {             // Horarios de atención
    'L-V': '09:00 - 18:00',
    'S': '10:00 - 14:00',
    'D': 'Cerrado'
  },
  banners: Array          // Imágenes de banners
  carouselProducts: Array // Productos destacados
}
```

## 🚀 Resumen

✅ **Campo `source`**: Almacena el nombre de la tienda INTERNAMENTE
✅ **NO visible**: No se muestra en las tarjetas de productos
✅ **Uso**: Filtrado, navegación, y asociación producto-tienda
✅ **Consistencia**: Usar SIEMPRE el mismo nombre exacto para cada tienda
✅ **Multi-usuario**: Sistema preparado para base de datos real

---

**Fecha de Creación**: $(date)
**Versión**: 1.0
