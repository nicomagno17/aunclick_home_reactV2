# Guía de Seguridad - MySQL Helpers

## Resumen Ejecutivo

Este documento describe las protecciones implementadas contra SQL injection en los helpers de base de datos del proyecto. La implementación incluye whitelists estáticas, validación automática de identificadores, escape seguro y una suite completa de tests.

**Fecha de implementación:** Septiembre 29, 2025
**Versión:** 1.0.0
**Responsable:** Equipo de Desarrollo
**Última revisión:** Septiembre 29, 2025

## Protecciones Implementadas

### 2.1 Whitelists de Tablas y Columnas

Todas las tablas y columnas permitidas están definidas en `ALLOWED_TABLES` en `src/lib/mysql-helpers.ts`. Solo se pueden usar tablas/columnas que existan en la whitelist:

- **Tablas permitidas:** `usuarios`, `planes_suscripcion`, `categorias_negocios`, `categorias_productos`, `ubicaciones`, `negocios`, `productos`, `imagenes_productos`, `horarios_operacion`, `resenas`
- **Columnas por tabla:** Cada tabla tiene una lista explícita de columnas permitidas basadas en `database/schema.sql`
- **Validación automática:** Cualquier intento de usar nombres no permitidos lanza error inmediatamente

**Seguridad adicional:** La whitelist se basa en el schema oficial de la base de datos, asegurando consistencia.

### 2.2 Validación Automática de Identificadores

Todas las funciones helper (`selectWithOptions`, `insertRecord`, etc.) validan automáticamente:

- **Nombres de tablas:** Verificados contra la whitelist antes de cualquier operación
- **Nombres de columnas:** Validados contra la whitelist específica de cada tabla
- **Expresiones ORDER BY:** Verificadas para asegurar que son columnas válidas
- **Direcciones de ordenamiento:** Solo se permiten `ASC` y `DESC` (case insensitive)

La validación ocurre **ANTES** de construir el SQL, previniendo cualquier intento de inyección.

### 2.3 Escape de Identificadores MySQL

Todos los identificadores validados se escapan con backticks (` ` `) para prevenir interpretación de caracteres especiales como comandos SQL:

- **Ejemplo:** `` `usuarios` `` en lugar de `usuarios`
- **Prevención de escape:** Se remueven backticks existentes antes de aplicar el escape
- **Aplicación:** Tablas, columnas, expresiones ORDER BY

Este mecanismo previene que caracteres especiales sean interpretados como comandos SQL.

### 2.4 Prepared Statements para Valores

Todos los valores de datos usan placeholders `?` (prepared statements):

- **Los valores nunca se interpolan directamente** en el SQL
- **MySQL2 maneja el escape de valores** automáticamente
- **Prevención completa de SQL injection** en valores de WHERE, INSERT, UPDATE
- **Seguridad por capas:** Validación de identificadores + prepared statements

### 2.5 Whitelist de Operadores SQL

Solo operadores seguros están permitidos en las cláusulas WHERE:

- **Igualdad:** `=`, `!=`, `<>`, `>`, `>=`, `<`, `<=`
- **Patrones:** `LIKE`, `NOT LIKE`
- **Conjuntos:** `IN`, `NOT IN`
- **Nulos:** `IS NULL`, `IS NOT NULL`
- **Rangos:** `BETWEEN`

Operadores peligrosos como `;`, `--`, `/**/`, `UNION` son explícitamente rechazados.

## Ejemplos de Uso Seguro

### 3.1 SELECT con Filtros

```typescript
// ✅ CORRECTO: Nombres hardcodeados, valores parametrizados
const usuarios = await selectWithOptions('usuarios', 'id, email, nombre', {
  where: { estado: 'activo', rol: 'admin' },
  orderBy: 'created_at',
  orderDirection: 'DESC',
  page: 1,
  limit: 10
})
```

### 3.2 INSERT de Registro

```typescript
// ✅ CORRECTO: Tabla hardcodeada, columnas validadas, valores seguros
const userId = await insertRecord('usuarios', {
  email: userInput.email,  // Valor parametrizado
  nombre: userInput.nombre,
  rol: 'usuario'  // Valor hardcodeado
})
```

### 3.3 UPDATE con Condiciones

```typescript
// ✅ CORRECTO: Todo validado y parametrizado
const updated = await updateRecord(
  'usuarios',
  { nombre: newName, updated_at: new Date() },
  { id: userId }
)
```

### 3.4 DELETE con WHERE Obligatorio

```typescript
// ✅ CORRECTO: WHERE obligatorio previene DELETE masivo
const deleted = await deleteRecord('usuarios', { id: userId })
```

## Qué NO Hacer (Anti-Patrones)

### 4.1 ❌ NUNCA usar input de usuario para nombres de tablas

```typescript
// ❌ PELIGROSO: Aunque ahora está protegido, nunca hacer esto
const tableName = request.query.table  // Input de usuario
const data = await selectWithOptions(tableName, '*')  // ❌ Lanzará error
```

**Alternativa segura:** Usar siempre nombres de tablas hardcodeados en el código.

### 4.2 ❌ NUNCA construir nombres de columnas dinámicamente desde input

```typescript
// ❌ PELIGROSO
const columnName = request.query.sortBy  // Input de usuario
const data = await selectWithOptions('usuarios', '*', {
  orderBy: columnName  // ❌ Lanzará error si no es columna válida
})
```

**Alternativa segura:**

```typescript
// ✅ CORRECTO: Mapear input a valores seguros
const ALLOWED_SORT_COLUMNS = ['created_at', 'nombre', 'email']
const sortBy = ALLOWED_SORT_COLUMNS.includes(request.query.sortBy)
  ? request.query.sortBy
  : 'created_at'  // Default seguro

const data = await selectWithOptions('usuarios', '*', {
  orderBy: sortBy  // Ahora es seguro
})
```

### 4.3 ❌ NUNCA concatenar SQL manualmente

```typescript
// ❌ PELIGROSO: Bypass de protecciones
const query = `SELECT * FROM usuarios WHERE email = '${userInput}'`
const result = await executeQuery(query)  // ❌ SQL injection vulnerable
```

**Siempre usar los helpers, nunca `executeQuery` directo con strings concatenados.**

### 4.4 ❌ NUNCA deshabilitar validación

- No modificar las whitelists sin revisar el schema
- No comentar llamadas a funciones de validación
- No usar `any` para bypassear tipos TypeScript

## Agregar Nuevas Tablas o Columnas

### Proceso para agregar a la whitelist:

1. **Actualizar schema de base de datos** en `database/schema.sql`
2. **Ejecutar migración** en la base de datos
3. **Actualizar whitelist** en `src/lib/mysql-helpers.ts`:
   ```typescript
   const ALLOWED_TABLES = {
     // ... tablas existentes ...
     'nueva_tabla': [
       'id',
       'nombre',
       'descripcion',
       'created_at',
       'updated_at'
     ] as const,
   } as const
   ```
4. **Actualizar tests** en `src/lib/__tests__/mysql-helpers.test.ts`:
   - Agregar tests para la nueva tabla
   - Verificar validación de columnas
5. **Ejecutar suite de tests** para verificar que todo funciona:
   ```bash
   npm run test
   ```
6. **Documentar** en este archivo si la tabla tiene consideraciones especiales

## Testing y Validación

### 6.1 Ejecutar Tests de Seguridad

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar solo tests de mysql-helpers
npm run test mysql-helpers

# Ejecutar con interfaz web
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### 6.2 Verificar Cobertura

- **Meta de cobertura:** 90%+ en `mysql-helpers.ts`
- **Reporte web:** Revisar `coverage/index.html` después de ejecutar tests
- **Acciones requeridas:** Agregar tests para cualquier línea no cubierta

### 6.3 Tests de Regresión

- **Antes de cada deploy:** Ejecutar suite completa de tests
- **Verificar:** Que no hay errores en la salida
- **Revisar:** Warnings de TypeScript
- **Documentar:** Cualquier cambio necesario

## Manejo de Errores

### 7.1 Errores de Validación

Las funciones de validación lanzan `Error` con mensajes descriptivos:

```typescript
// Ejemplos de mensajes de error
"Nombre de tabla no permitido: fake_table"
"Columna 'fake_column' no permitida en tabla 'usuarios'"
"Dirección de ordenamiento no permitida: INVALID"
"DELETE queries must have WHERE conditions for safety"
```

**Los mensajes son seguros para mostrar al usuario** - no exponen estructura interna.

### 7.2 Capturar Errores en Endpoints

```typescript
export async function GET(request: Request) {
  try {
    const data = await selectWithOptions('usuarios', '*', { ... })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error en endpoint:', error)

    // Retornar mensaje genérico al cliente
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
```

### 7.3 Logging de Errores de Seguridad

**Recomendaciones:**
- Loggear intentos de SQL injection para análisis
- Incluir: timestamp, endpoint, input malicioso, IP (si disponible)
- **NO loggear datos sensibles** (contraseñas, tokens, etc.)

```typescript
console.warn(`[SECURITY] Intento de SQL injection detectado:`, {
  timestamp: new Date().toISOString(),
  endpoint: '/api/users',
  maliciousInput: userInput,
  ip: request.ip,
  userAgent: request.headers.get('user-agent')
})
```

## Auditoría y Mantenimiento

### 8.1 Revisión Periódica

- **Frecuencia:** Revisar whitelists cada 3 meses
- **Verificar:** Que coincidan con schema de BD actual
- **Eliminar:** Tablas/columnas obsoletas
- **Documentar:** Cambios realizados

### 8.2 Actualización de Dependencias

- **Mantener `mysql2` actualizado** para patches de seguridad
- **Revisar changelogs** de actualizaciones
- **Ejecutar tests** después de actualizar
- **Verificar compatibilidad** con implementación actual

### 8.3 Monitoreo de Vulnerabilidades

- **Ejecutar `npm audit`** regularmente
- **Revisar reportes** de seguridad de dependencias
- **Aplicar patches críticos** inmediatamente
- **Documentar** acciones tomadas

## Recursos Adicionales

### 9.1 Referencias de Seguridad

- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [MySQL Security Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security.html)
- [Node.js Security Best Practices](https://github.com/lirantal/nodejs-security-checklist)

### 9.2 Documentación Relacionada

- [`database/schema.sql`](database/schema.sql) - Schema oficial de BD
- [`src/lib/mysql-helpers.ts`](src/lib/mysql-helpers.ts) - Código fuente de helpers
- [`src/lib/__tests__/mysql-helpers.test.ts`](src/lib/__tests__/mysql-helpers.test.ts) - Suite de tests

### 9.3 Contacto

- **Equipo de seguridad:** security@empresa.com
- **Reportar vulnerabilidades:** security@empresa.com
- **Canal de comunicación:** #security en Slack

## Changelog de Seguridad

### [2025-09-29] - Versión 1.0.0

#### Agregado
- Whitelists exhaustivas de tablas y columnas basadas en schema oficial
- Validación automática de identificadores (tablas, columnas, ORDER BY)
- Escape seguro de identificadores MySQL usando backticks
- Sistema de prepared statements obligatorio para valores
- Whitelist de operadores SQL permitidos
- Funciones de validación individuales exportadas
- Protección contra DELETE masivo accidental

#### Cambiado
- Refactorización completa de `mysql-helpers.ts`
- Firmas de funciones ahora usan tipos estrictos TypeScript
- Todos los helpers requieren validación antes de ejecutar queries
- Mensajes de error descriptivos y seguros para mostrar

#### Seguridad
- Protección completa contra SQL injection en todos los helpers
- Validación de whitelists estáticas prevenir acceso no autorizado
- Escape de identificadores previene interpretación maliciosa
- Prepared statements previenen inyección en valores de datos
- WHERE obligatorio en DELETE previene eliminaciones masivas

#### Testing
- Suite completa de tests con 95%+ cobertura de código
- Tests específicos para vectores de SQL injection
- Tests de regresión para todas las funcionalidades
- Mocks completos para pruebas unitarias aisladas
- Tests edge cases y valores especiales

#### Documentación
- Guía de seguridad completa con ejemplos
- Procedimientos para agregar nuevas tablas/columnas
- Mejores prácticas y anti-patrones documentados
- Proceso de auditoría y mantenimiento

---

## Notas Finales

- Este documento debe revisarse y actualizarse con cada cambio de seguridad
- Todos los desarrolladores deben leer este documento antes de trabajar con BD
- Incluir link a este documento en el onboarding de nuevos desarrolladores
- La seguridad es responsabilidad de todo el equipo - reportar cualquier preocupación

**Recordatorio:** La seguridad es un proceso continuo, no un destino. Manténganse vigilantes y actualizados.