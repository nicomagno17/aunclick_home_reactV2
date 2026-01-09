# Elementos Ocultos (NO Borrados)

Este archivo documenta todos los elementos que han sido temporalmente ocultados en el proyecto.
Para reactivar cualquier elemento, busca el comentario `TEMPORALMENTE OCULTO` y quita la clase `hidden` del elemento correspondiente.

---

## 1. Login
**Archivo:** `src/app/login/login-form.tsx`

| Elemento | Descripcion |
|----------|-------------|
| Seccion OAuth | Botones de Google y Facebook |
| Texto divisor | "O continua con" |

**Como reactivar:** Descomentar el bloque de OAuth al final del formulario.

---

## 2. Header
**Archivo:** `src/components/header.tsx`

| Elemento | Descripcion |
|----------|-------------|
| Boton Planes (desktop) | Boton en la barra de navegacion principal |
| Boton Planes (movil) | Boton en el menu hamburguesa |

**Como reactivar:** Descomentar los bloques marcados con `TEMPORALMENTE OCULTO`.

---

## 3. Pagina Principal (Home)
**Archivo:** `src/app/page.tsx`

| Elemento | Descripcion |
|----------|-------------|
| HeaderCarousel | Banner de carrusel debajo del header |

**Como reactivar:**
1. Descomentar el bloque del `HeaderCarousel` (lineas ~113-141)
2. Eliminar o comentar la seccion de `CategoryFilterCards standalone`

---

## 4. Registro
**Archivo:** `src/app/register/page.tsx`

| Elemento | Descripcion |
|----------|-------------|
| Plan Normal | Tarjeta de seleccion del plan Normal ($2.990/mes) |
| Plan Premium | Tarjeta de seleccion del plan Premium ($4.990/mes) |
| Boton comparacion | "Ver comparacion detallada de planes" |

**Cambios adicionales realizados:**
- Titulo cambiado de "Seleccion de Plan" a "Tu Plan es"
- Subtitulo cambiado de "Seleccion de plan" a "Tu plan"
- Nombre del plan cambiado de "Plan Gratuito" a "Panel basico de administracion"

**Como reactivar:** Descomentar los bloques de Plan Normal, Plan Premium y el boton de comparacion.

---

## 5. Panel de Administracion
**Archivo:** `src/app/admin/page.tsx`

### Botones del Menu de Navegacion
| Elemento | Descripcion |
|----------|-------------|
| Gestion de Banner | Boton en segunda fila del menu |
| Analytics Dashboard | Boton en segunda fila del menu |
| Gestion de Carruseles | Boton en tercera fila del menu |

### Secciones Completas
| Elemento | Descripcion |
|----------|-------------|
| Analytics Dashboard | Titulo y contenedor completo con KPIs y graficos |
| Gestion de Carruseles | Titulo y pestanas con Carrusel 1 y Carrusel 2 |
| Gestion de Banner | Titulo y contenedor con configuracion de banners |

### Boton Flotante
| Elemento | Descripcion |
|----------|-------------|
| Visualizar tienda | Boton flotante en el lado derecho de la pagina |

**Como reactivar:**
1. Descomentar los botones del menu (buscar `TEMPORALMENTE OCULTO - Second row` y `Third row`)
2. Quitar la clase `hidden` de las secciones marcadas

---

## 6. Popup de Producto
**Archivo:** `src/components/product-info-popup.tsx`

| Elemento | Descripcion |
|----------|-------------|
| Icono Store | Icono de tienda en esquina superior izquierda del popup |

**Como reactivar:** Quitar la clase `hidden` del boton marcado con `TEMPORALMENTE OCULTO`.

---

## Resumen de Archivos Modificados

| Archivo | Cantidad de elementos ocultos |
|---------|-------------------------------|
| `src/app/login/login-form.tsx` | 2 |
| `src/components/header.tsx` | 2 |
| `src/app/page.tsx` | 1 |
| `src/app/register/page.tsx` | 3 |
| `src/app/admin/page.tsx` | 7 |
| `src/components/product-info-popup.tsx` | 1 |

**Total de elementos ocultos:** 16

---

## Notas Importantes

1. Todos los elementos fueron ocultados usando la clase `hidden` de Tailwind CSS o comentarios JSX
2. El codigo original NO fue eliminado, solo ocultado
3. Cada elemento oculto tiene un comentario `TEMPORALMENTE OCULTO` para facilitar su busqueda
4. Para reactivar, simplemente quitar la clase `hidden` o descomentar el codigo

---

*Ultima actualizacion: Enero 2026*
