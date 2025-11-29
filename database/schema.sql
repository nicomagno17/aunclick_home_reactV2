-- ============================================================================
-- SCHEMA DE BASE DE DATOS PARA MARKETPLACE INFORMATIVO
-- Optimizado para MySQL 8.0+ con enfoque en rendimiento y escalabilidad
-- ============================================================================

-- Configuración inicial de la sesión
SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- ============================================================================
-- TABLA: usuarios
-- Gestión centralizada de usuarios del sistema con autenticación robusta
-- ============================================================================
CREATE TABLE usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    email VARCHAR(320) NOT NULL UNIQUE COMMENT 'RFC 5321 compliant email length',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt/Argon2 hash storage',
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    telefono VARCHAR(20),
    avatar_url VARCHAR(500),
    estado ENUM('activo', 'inactivo', 'suspendido', 'pendiente_verificacion') NOT NULL DEFAULT 'pendiente_verificacion',
    rol ENUM('usuario', 'propietario_negocio', 'moderador', 'admin') NOT NULL DEFAULT 'usuario',
    email_verificado_at TIMESTAMP NULL DEFAULT NULL,
    ultimo_acceso TIMESTAMP NULL DEFAULT NULL,
    
    -- OAuth security fields (encrypted storage)
    access_token VARCHAR(1000) NULL COMMENT 'OAuth access token (encrypted)',
    refresh_token VARCHAR(1000) NULL COMMENT 'OAuth refresh token (encrypted)',
    token_expires_at TIMESTAMP NULL COMMENT 'OAuth token expiration',
    oauth_provider ENUM('google', 'facebook', 'credentials') NULL COMMENT 'Authentication provider',
    oauth_provider_id VARCHAR(255) NULL COMMENT 'Provider user ID',
    
    -- Login audit fields
    ultimo_login_ip VARBINARY(16) NULL COMMENT 'Last login IP address (IPv4/IPv6)',
    ultimo_login_user_agent VARCHAR(500) NULL COMMENT 'Last login user agent',
    intentos_login_fallidos TINYINT UNSIGNED DEFAULT 0 COMMENT 'Failed login attempts counter',
    bloqueado_hasta TIMESTAMP NULL COMMENT 'Account lockout expiration',
    ultimo_cambio_password TIMESTAMP NULL COMMENT 'Last password change date',
    
    -- Password recovery fields
    password_reset_token VARCHAR(255) NULL COMMENT 'Password reset token',
    password_reset_expires TIMESTAMP NULL COMMENT 'Reset token expiration',
    
    -- Email verification fields
    email_verification_token VARCHAR(255) NULL COMMENT 'Email verification token',
    email_verification_expires TIMESTAMP NULL COMMENT 'Verification token expiration',
    
    preferencias JSON COMMENT 'Configuraciones de usuario y preferencias de notificación',
    metadata JSON COMMENT 'Campos adicionales flexibles',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete implementation',
    
    -- Índices optimizados para consultas frecuentes
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_estado (estado),
    INDEX idx_usuarios_rol (rol),
    INDEX idx_usuarios_ultimo_acceso (ultimo_acceso),
    INDEX idx_usuarios_created_at (created_at),
    INDEX idx_usuarios_soft_delete (deleted_at),
    
    -- Additional indexes for OAuth and security
    INDEX idx_usuarios_oauth_provider (oauth_provider, oauth_provider_id),
    INDEX idx_usuarios_password_reset (password_reset_token, password_reset_expires),
    INDEX idx_usuarios_email_verification (email_verification_token),
    INDEX idx_usuarios_bloqueado (bloqueado_hasta)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Gestión de usuarios con autenticación y perfiles';

-- ============================================================================
-- TABLA: planes_suscripcion
-- Sistema de monetización con planes flexibles
-- ============================================================================
CREATE TABLE planes_suscripcion (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    precio_anual DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento_anual TINYINT UNSIGNED DEFAULT 0 COMMENT 'Porcentaje de descuento anual',
    max_negocios SMALLINT UNSIGNED DEFAULT 1 COMMENT 'Número máximo de negocios permitidos',
    max_productos_por_negocio MEDIUMINT UNSIGNED DEFAULT 50,
    max_imagenes_por_producto TINYINT UNSIGNED DEFAULT 5,
    caracteristicas JSON NOT NULL COMMENT 'Array de características del plan',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden_visualizacion TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Orden para mostrar en UI',
    metadata JSON COMMENT 'Configuraciones adicionales del plan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimización
    INDEX idx_planes_activo (activo),
    INDEX idx_planes_precio (precio_mensual, precio_anual),
    INDEX idx_planes_orden (orden_visualizacion)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Planes de suscripción del marketplace';

-- ============================================================================
-- TABLA: categorias_negocios
-- Taxonomía jerárquica de categorías de negocios
-- ============================================================================
CREATE TABLE categorias_negocios (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE COMMENT 'URL-friendly identifier',
    descripcion TEXT,
    icono VARCHAR(50) COMMENT 'Nombre del icono o clase CSS',
    color_hex CHAR(7) DEFAULT '#3B82F6' COMMENT 'Color representativo de la categoría',
    parent_id SMALLINT UNSIGNED NULL,
    nivel TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Profundidad en la jerarquía (1-5)',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    seo_meta JSON COMMENT 'Meta tags para SEO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (parent_id) REFERENCES categorias_negocios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices optimizados
    INDEX idx_categorias_negocios_slug (slug),
    INDEX idx_categorias_negocios_parent (parent_id),
    INDEX idx_categorias_negocios_activo (activo),
    INDEX idx_categorias_negocios_nivel_orden (nivel, orden),
    
    -- Constraints
    CONSTRAINT chk_categorias_nivel CHECK (nivel >= 1 AND nivel <= 5),
    CONSTRAINT chk_categorias_orden CHECK (orden > 0)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Categorización jerárquica de tipos de negocios';

-- ============================================================================
-- TABLA: categorias_productos
-- Sistema de categorización de productos con jerarquía
-- ============================================================================
CREATE TABLE categorias_productos (
    id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    descripcion TEXT,
    parent_id MEDIUMINT UNSIGNED NULL,
    nivel TINYINT UNSIGNED NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    metadata JSON COMMENT 'Atributos específicos por categoría',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (parent_id) REFERENCES categorias_productos(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_categorias_productos_slug (slug),
    INDEX idx_categorias_productos_parent (parent_id),
    INDEX idx_categorias_productos_activo (activo),
    INDEX idx_categorias_productos_nivel_orden (nivel, orden),
    
    -- Constraints
    CONSTRAINT chk_productos_nivel CHECK (nivel >= 1 AND nivel <= 5),
    CONSTRAINT chk_productos_orden CHECK (orden > 0)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Taxonomía de productos con estructura jerárquica';

-- ============================================================================
-- TABLA: ubicaciones
-- Sistema de geolocalización optimizado para búsquedas espaciales
-- ============================================================================
CREATE TABLE ubicaciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(2) NOT NULL DEFAULT 'CO' COMMENT 'Código ISO 3166-1 alpha-2',
    departamento_estado VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    zona_barrio VARCHAR(150),
    direccion_completa VARCHAR(500),
    codigo_postal VARCHAR(20),
    latitud DECIMAL(10, 8) COMMENT 'Precisión de ~1.1 metros',
    longitud DECIMAL(11, 8) COMMENT 'Precisión de ~1.1 metros',
    coordenadas POINT AS (POINT(longitud, latitud)) STORED COMMENT 'Índice espacial optimizado',
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices geoespaciales para consultas de proximidad
    SPATIAL INDEX idx_ubicaciones_coordenadas (coordenadas),
    INDEX idx_ubicaciones_pais_departamento (pais, departamento_estado),
    INDEX idx_ubicaciones_ciudad (ciudad),
    INDEX idx_ubicaciones_activo (activo),
    INDEX idx_ubicaciones_lat_lng (latitud, longitud),
    
    -- Constraints de validación
    CONSTRAINT chk_latitud CHECK (latitud >= -90 AND latitud <= 90),
    CONSTRAINT chk_longitud CHECK (longitud >= -180 AND longitud <= 180)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Geolocalización con soporte para búsquedas espaciales optimizadas';

-- ============================================================================
-- TABLA: negocios
-- Información central de los negocios registrados
-- ============================================================================
CREATE TABLE negocios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    propietario_id BIGINT UNSIGNED NOT NULL,
    categoria_id SMALLINT UNSIGNED NOT NULL,
    ubicacion_id BIGINT UNSIGNED NOT NULL,
    plan_id INT UNSIGNED NOT NULL DEFAULT 1,
    
    -- Información básica
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE COMMENT 'SEO-friendly URL identifier',
    descripcion TEXT,
    descripcion_corta VARCHAR(300) COMMENT 'Para listados y previews',
    
    -- Información de contacto
    telefono_principal VARCHAR(20),
    telefono_secundario VARCHAR(20),
    email VARCHAR(320),
    sitio_web VARCHAR(500),
    whatsapp VARCHAR(20),
    
    -- Redes sociales
    redes_sociales JSON COMMENT 'URLs de redes sociales',
    
    -- Información visual
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    galeria_imagenes JSON COMMENT 'Array de URLs de imágenes',
    
    -- Estado y configuración
    estado ENUM('borrador', 'activo', 'inactivo', 'suspendido', 'eliminado') NOT NULL DEFAULT 'borrador',
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    permite_pedidos BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Métricas y engagement
    total_productos INT UNSIGNED NOT NULL DEFAULT 0,
    total_resenas INT UNSIGNED NOT NULL DEFAULT 0,
    promedio_calificacion DECIMAL(3,2) DEFAULT 0.00,
    total_vistas INT UNSIGNED NOT NULL DEFAULT 0,
    
    -- SEO y marketing
    seo_title VARCHAR(70) COMMENT 'Meta title optimizado',
    seo_description VARCHAR(160) COMMENT 'Meta description',
    seo_keywords VARCHAR(300) COMMENT 'Keywords separadas por comas',
    
    -- Configuración de negocio
    configuracion JSON COMMENT 'Configuraciones específicas del negocio',
    metadata JSON COMMENT 'Datos adicionales flexibles',
    
    -- Fechas de suscripción
    suscripcion_inicio DATE,
    suscripcion_fin DATE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Relaciones foráneas
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_negocios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES planes_suscripcion(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Índices optimizados para consultas frecuentes
    INDEX idx_negocios_propietario (propietario_id),
    INDEX idx_negocios_categoria (categoria_id),
    INDEX idx_negocios_ubicacion (ubicacion_id),
    INDEX idx_negocios_slug (slug),
    INDEX idx_negocios_estado (estado),
    INDEX idx_negocios_verificado (verificado),
    INDEX idx_negocios_destacado (destacado),
    INDEX idx_negocios_calificacion (promedio_calificacion DESC),
    INDEX idx_negocios_vistas (total_vistas DESC),
    INDEX idx_negocios_suscripcion (suscripcion_inicio, suscripcion_fin),
    INDEX idx_negocios_created_at (created_at DESC),
    INDEX idx_negocios_soft_delete (deleted_at),
    
    -- Índices compuestos para consultas complejas
    INDEX idx_negocios_categoria_estado_verificado (categoria_id, estado, verificado),
    INDEX idx_negocios_ubicacion_estado_destacado (ubicacion_id, estado, destacado),
    
    -- Constraints de validación
    CONSTRAINT chk_negocios_calificacion CHECK (promedio_calificacion >= 0 AND promedio_calificacion <= 5.00),
    CONSTRAINT chk_negocios_suscripcion CHECK (suscripcion_fin >= suscripcion_inicio OR suscripcion_fin IS NULL)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Información central de negocios con optimización para búsquedas';

-- ============================================================================
-- TABLA: productos
-- Catálogo de productos con soporte para variantes y precios
-- ============================================================================
CREATE TABLE productos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    negocio_id BIGINT UNSIGNED NOT NULL,
    categoria_id MEDIUMINT UNSIGNED NOT NULL,
    
    -- Información básica del producto
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(300),
    
    -- Información de precios
    precio DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    precio_antes DECIMAL(12,2) NULL COMMENT 'Precio anterior para mostrar descuentos',
    moneda CHAR(3) NOT NULL DEFAULT 'COP' COMMENT 'Código ISO 4217',
    
    -- Información de inventario
    sku VARCHAR(100) COMMENT 'Stock Keeping Unit',
    stock_disponible MEDIUMINT UNSIGNED DEFAULT 0,
    maneja_stock BOOLEAN NOT NULL DEFAULT FALSE,
    stock_minimo SMALLINT UNSIGNED DEFAULT 0,
    
    -- Características del producto
    peso DECIMAL(8,3) COMMENT 'Peso en kilogramos',
    dimensiones JSON COMMENT 'Largo, ancho, alto en centímetros',
    
    -- Estado y configuración
    estado ENUM('borrador', 'activo', 'inactivo', 'agotado', 'eliminado') NOT NULL DEFAULT 'borrador',
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    permite_personalizacion BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Métricas
    total_vistas INT UNSIGNED NOT NULL DEFAULT 0,
    total_consultas INT UNSIGNED NOT NULL DEFAULT 0,
    
    -- SEO
    seo_title VARCHAR(70),
    seo_description VARCHAR(160),
    seo_keywords VARCHAR(300),
    
    -- Datos adicionales
    atributos JSON COMMENT 'Atributos específicos del producto',
    opciones_personalizacion JSON COMMENT 'Opciones de personalización disponibles',
    metadata JSON,
    
    -- Fechas
    fecha_disponibilidad DATE COMMENT 'Fecha desde cuando está disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Relaciones foráneas
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_productos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Índices optimizados
    INDEX idx_productos_negocio (negocio_id),
    INDEX idx_productos_categoria (categoria_id),
    INDEX idx_productos_slug_negocio (slug, negocio_id),
    INDEX idx_productos_estado (estado),
    INDEX idx_productos_destacado (destacado),
    INDEX idx_productos_precio (precio),
    INDEX idx_productos_precio_rango (precio, estado),
    INDEX idx_productos_sku (sku),
    INDEX idx_productos_stock (stock_disponible),
    INDEX idx_productos_vistas (total_vistas DESC),
    INDEX idx_productos_created_at (created_at DESC),
    INDEX idx_productos_soft_delete (deleted_at),
    
    -- Índices compuestos
    INDEX idx_productos_negocio_estado_destacado (negocio_id, estado, destacado),
    INDEX idx_productos_categoria_estado_precio (categoria_id, estado, precio),
    INDEX idx_productos_busqueda (negocio_id, categoria_id, estado),
    
    -- Constraints
    CONSTRAINT chk_productos_precio CHECK (precio >= 0),
    CONSTRAINT chk_productos_precio_antes CHECK (precio_antes IS NULL OR precio_antes >= 0),
    CONSTRAINT chk_productos_stock CHECK (stock_disponible >= 0),
    CONSTRAINT chk_productos_peso CHECK (peso IS NULL OR peso >= 0)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Catálogo de productos con gestión de inventario y precios';

-- ============================================================================
-- TABLA: imagenes_productos
-- Sistema multimedia optimizado para productos
-- ============================================================================
CREATE TABLE imagenes_productos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT UNSIGNED NOT NULL,
    
    -- URLs de diferentes tamaños
    url_original VARCHAR(500) NOT NULL COMMENT 'URL de imagen original',
    url_thumbnail VARCHAR(500) COMMENT 'Miniatura 150x150',
    url_medium VARCHAR(500) COMMENT 'Mediana 400x400',
    url_large VARCHAR(500) COMMENT 'Grande 800x800',
    
    -- Metadata de la imagen
    nombre_archivo VARCHAR(255),
    alt_text VARCHAR(200) COMMENT 'Texto alternativo para accesibilidad',
    titulo VARCHAR(100),
    descripcion TEXT,
    
    -- Información técnica
    formato ENUM('jpg', 'jpeg', 'png', 'webp', 'svg') NOT NULL,
    tamano_bytes INT UNSIGNED COMMENT 'Tamaño del archivo en bytes',
    ancho SMALLINT UNSIGNED COMMENT 'Ancho en píxeles',
    alto SMALLINT UNSIGNED COMMENT 'Alto en píxeles',
    
    -- Organización
    orden TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Orden de visualización',
    es_principal BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Imagen principal del producto',
    
    -- Estado
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_imagenes_producto (producto_id),
    INDEX idx_imagenes_orden (producto_id, orden),
    INDEX idx_imagenes_principal (producto_id, es_principal),
    INDEX idx_imagenes_activo (activo),
    INDEX idx_imagenes_formato (formato),
    
    -- Constraints
    CONSTRAINT chk_imagenes_orden CHECK (orden > 0 AND orden <= 20),
    CONSTRAINT chk_imagenes_dimensiones CHECK (
        (ancho IS NULL AND alto IS NULL) OR 
        (ancho > 0 AND alto > 0)
    )
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Gestión de imágenes de productos con múltiples resoluciones';

-- ============================================================================
-- TABLA: horarios_operacion
-- Sistema de gestión de horarios de negocio
-- ============================================================================
CREATE TABLE horarios_operacion (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    negocio_id BIGINT UNSIGNED NOT NULL,
    
    -- Día de la semana (1=Lunes, 7=Domingo)
    dia_semana TINYINT UNSIGNED NOT NULL,
    
    -- Horarios (formato 24h: HH:MM:SS)
    hora_apertura TIME,
    hora_cierre TIME,
    
    -- Horarios de receso (opcional)
    hora_receso_inicio TIME,
    hora_receso_fin TIME,
    
    -- Estados especiales
    cerrado BOOLEAN NOT NULL DEFAULT FALSE,
    atencion_24h BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Notas especiales
    notas VARCHAR(300) COMMENT 'Notas adicionales sobre el horario',
    
    -- Fechas especiales (anulaciones temporales)
    fecha_especial DATE COMMENT 'Para días específicos con horarios diferentes',
    es_excepcion BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indica si es una excepción al horario regular',
    
    -- Estado
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_horarios_negocio (negocio_id),
    INDEX idx_horarios_dia (dia_semana),
    INDEX idx_horarios_negocio_dia (negocio_id, dia_semana),
    INDEX idx_horarios_fecha_especial (fecha_especial),
    INDEX idx_horarios_activo (activo),
    
    -- Constraints
    CONSTRAINT chk_horarios_dia_semana CHECK (dia_semana >= 1 AND dia_semana <= 7),
    CONSTRAINT chk_horarios_apertura_cierre CHECK (
        cerrado = TRUE OR atencion_24h = TRUE OR 
        (hora_apertura IS NOT NULL AND hora_cierre IS NOT NULL)
    ),
    CONSTRAINT chk_horarios_receso CHECK (
        (hora_receso_inicio IS NULL AND hora_receso_fin IS NULL) OR
        (hora_receso_inicio IS NOT NULL AND hora_receso_fin IS NOT NULL)
    )
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Horarios de operación de negocios con soporte para excepciones';

-- ============================================================================
-- TABLA: resenas
-- Sistema de calificaciones y reseñas
-- ============================================================================
CREATE TABLE resenas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    negocio_id BIGINT UNSIGNED NOT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    
    -- Calificación y contenido
    calificacion TINYINT UNSIGNED NOT NULL COMMENT 'Calificación de 1 a 5 estrellas',
    titulo VARCHAR(150),
    comentario TEXT,
    
    -- Calificaciones específicas (opcional)
    calificacion_servicio TINYINT UNSIGNED COMMENT '1-5 estrellas',
    calificacion_calidad TINYINT UNSIGNED COMMENT '1-5 estrellas',
    calificacion_precio TINYINT UNSIGNED COMMENT '1-5 estrellas',
    calificacion_tiempo TINYINT UNSIGNED COMMENT '1-5 estrellas',
    
    -- Respuesta del negocio
    respuesta_negocio TEXT,
    respuesta_fecha TIMESTAMP NULL,
    respondido_por BIGINT UNSIGNED NULL COMMENT 'ID del usuario que respondió',
    
    -- Estados y moderación
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'reportada') NOT NULL DEFAULT 'pendiente',
    verificada BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indica si se verificó que es cliente real',
    
    -- Métricas de utilidad
    votos_util INT NOT NULL DEFAULT 0 COMMENT 'Votos de "útil" de otros usuarios',
    votos_no_util INT NOT NULL DEFAULT 0 COMMENT 'Votos de "no útil"',
    
    -- Información adicional
    ip_address VARBINARY(16) COMMENT 'IP address para prevenir spam',
    user_agent VARCHAR(500) COMMENT 'User agent del navegador',
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Relaciones foráneas
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (respondido_por) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices optimizados
    INDEX idx_resenas_negocio (negocio_id),
    INDEX idx_resenas_usuario (usuario_id),
    INDEX idx_resenas_calificacion (calificacion),
    INDEX idx_resenas_estado (estado),
    INDEX idx_resenas_verificada (verificada),
    INDEX idx_resenas_created_at (created_at DESC),
    INDEX idx_resenas_soft_delete (deleted_at),
    
    -- Índices compuestos
    INDEX idx_resenas_negocio_estado_calificacion (negocio_id, estado, calificacion DESC),
    INDEX idx_resenas_negocio_created (negocio_id, created_at DESC),
    INDEX idx_resenas_utilidad (votos_util DESC, votos_no_util ASC),
    
    -- Constraint único para prevenir múltiples reseñas del mismo usuario por negocio
    UNIQUE KEY uk_resenas_usuario_negocio (usuario_id, negocio_id),
    
    -- Constraints de validación
    CONSTRAINT chk_resenas_calificacion CHECK (calificacion >= 1 AND calificacion <= 5),
    CONSTRAINT chk_resenas_calificacion_servicio CHECK (calificacion_servicio IS NULL OR (calificacion_servicio >= 1 AND calificacion_servicio <= 5)),
    CONSTRAINT chk_resenas_calificacion_calidad CHECK (calificacion_calidad IS NULL OR (calificacion_calidad >= 1 AND calificacion_calidad <= 5)),
    CONSTRAINT chk_resenas_calificacion_precio CHECK (calificacion_precio IS NULL OR (calificacion_precio >= 1 AND calificacion_precio <= 5)),
    CONSTRAINT chk_resenas_calificacion_tiempo CHECK (calificacion_tiempo IS NULL OR (calificacion_tiempo >= 1 AND calificacion_tiempo <= 5)),
    CONSTRAINT chk_resenas_votos CHECK (votos_util >= 0 AND votos_no_util >= 0)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Sistema de reseñas y calificaciones con moderación';

-- ============================================================================
-- TRIGGERS PARA MANTENER MÉTRICAS ACTUALIZADAS
-- ============================================================================

-- Trigger para actualizar contador de productos en negocios
DELIMITER //
CREATE TRIGGER tr_productos_count_insert 
    AFTER INSERT ON productos 
    FOR EACH ROW
BEGIN
    IF NEW.estado != 'eliminado' THEN
        UPDATE negocios 
        SET total_productos = (
            SELECT COUNT(*) 
            FROM productos 
            WHERE negocio_id = NEW.negocio_id 
            AND estado NOT IN ('eliminado')
        )
        WHERE id = NEW.negocio_id;
    END IF;
END//

CREATE TRIGGER tr_productos_count_update 
    AFTER UPDATE ON productos 
    FOR EACH ROW
BEGIN
    IF OLD.negocio_id != NEW.negocio_id OR OLD.estado != NEW.estado THEN
        -- Actualizar negocio anterior
        UPDATE negocios 
        SET total_productos = (
            SELECT COUNT(*) 
            FROM productos 
            WHERE negocio_id = OLD.negocio_id 
            AND estado NOT IN ('eliminado')
        )
        WHERE id = OLD.negocio_id;
        
        -- Actualizar negocio nuevo (si cambió)
        IF OLD.negocio_id != NEW.negocio_id THEN
            UPDATE negocios 
            SET total_productos = (
                SELECT COUNT(*) 
                FROM productos 
                WHERE negocio_id = NEW.negocio_id 
                AND estado NOT IN ('eliminado')
            )
            WHERE id = NEW.negocio_id;
        END IF;
    END IF;
END//

-- Trigger para actualizar métricas de reseñas
CREATE TRIGGER tr_resenas_metricas_insert 
    AFTER INSERT ON resenas 
    FOR EACH ROW
BEGIN
    IF NEW.estado = 'aprobada' THEN
        UPDATE negocios 
        SET 
            total_resenas = (
                SELECT COUNT(*) 
                FROM resenas 
                WHERE negocio_id = NEW.negocio_id 
                AND estado = 'aprobada'
            ),
            promedio_calificacion = (
                SELECT ROUND(AVG(calificacion), 2) 
                FROM resenas 
                WHERE negocio_id = NEW.negocio_id 
                AND estado = 'aprobada'
            )
        WHERE id = NEW.negocio_id;
    END IF;
END//

CREATE TRIGGER tr_resenas_metricas_update 
    AFTER UPDATE ON resenas 
    FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado OR OLD.calificacion != NEW.calificacion THEN
        UPDATE negocios 
        SET 
            total_resenas = (
                SELECT COUNT(*) 
                FROM resenas 
                WHERE negocio_id = NEW.negocio_id 
                AND estado = 'aprobada'
            ),
            promedio_calificacion = (
                SELECT COALESCE(ROUND(AVG(calificacion), 2), 0.00)
                FROM resenas 
                WHERE negocio_id = NEW.negocio_id 
                AND estado = 'aprobada'
            )
        WHERE id = NEW.negocio_id;
    END IF;
END//

DELIMITER ;

-- ============================================================================
-- DATOS INICIALES DEL SISTEMA
-- ============================================================================

-- Insertar planes de suscripción por defecto
INSERT INTO planes_suscripcion (nombre, descripcion, precio_mensual, precio_anual, descuento_anual, max_negocios, max_productos_por_negocio, max_imagenes_por_producto, caracteristicas, orden_visualizacion) VALUES
('Gratuito', 'Plan básico para empezar', 0.00, 0.00, 0, 1, 10, 3, 
 '["Registro de 1 negocio", "Hasta 10 productos", "3 imágenes por producto", "Perfil básico", "Soporte por email"]', 1),

('Pro', 'Plan profesional para negocios en crecimiento', 29900.00, 299000.00, 17, 1, 100, 10,
 '["Registro de 1 negocio", "Hasta 100 productos", "10 imágenes por producto", "Perfil destacado", "Analíticas básicas", "Soporte prioritario", "Sin marca de agua"]', 2),

('Premium', 'Plan completo para negocios establecidos', 59900.00, 599000.00, 17, 3, 500, 20,
 '["Hasta 3 negocios", "Productos ilimitados", "20 imágenes por producto", "Posicionamiento premium", "Analíticas avanzadas", "API access", "Soporte 24/7", "Manager dedicado"]', 3);

-- Insertar categorías de negocios principales
INSERT INTO categorias_negocios (nombre, slug, descripcion, icono, nivel, orden) VALUES
('Restaurantes y Comida', 'restaurantes-comida', 'Restaurantes, cafeterías, comida rápida y servicios de alimentación', 'restaurant', 1, 1),
('Retail y Comercio', 'retail-comercio', 'Tiendas, boutiques, supermercados y comercio en general', 'store', 1, 2),
('Servicios Profesionales', 'servicios-profesionales', 'Consultorías, servicios legales, contabilidad y profesionales independientes', 'business', 1, 3),
('Salud y Bienestar', 'salud-bienestar', 'Centros médicos, farmacias, gimnasios y servicios de bienestar', 'health', 1, 4),
('Educación', 'educacion', 'Colegios, universidades, academias y centros de formación', 'education', 1, 5),
('Entretenimiento', 'entretenimiento', 'Cines, teatros, bares, discotecas y centros de entretenimiento', 'entertainment', 1, 6),
('Automotriz', 'automotriz', 'Concesionarios, talleres, repuestos y servicios automotrices', 'car', 1, 7),
('Belleza y Estética', 'belleza-estetica', 'Peluquerías, spas, centros de estética y belleza', 'beauty', 1, 8),
('Hogar y Construcción', 'hogar-construccion', 'Ferreterías, decoración, construcción y mejoras del hogar', 'home', 1, 9),
('Tecnología', 'tecnologia', 'Tiendas de tecnología, reparación y servicios informáticos', 'tech', 1, 10);

-- Insertar categorías de productos principales
INSERT INTO categorias_productos (nombre, slug, descripcion, nivel, orden) VALUES
('Alimentos y Bebidas', 'alimentos-bebidas', 'Comida, bebidas, productos alimenticios', 1, 1),
('Ropa y Accesorios', 'ropa-accesorios', 'Vestuario, zapatos, accesorios de moda', 1, 2),
('Electrónicos', 'electronicos', 'Dispositivos electrónicos, gadgets, tecnología', 1, 3),
('Hogar y Jardín', 'hogar-jardin', 'Muebles, decoración, productos para el hogar', 1, 4),
('Salud y Belleza', 'salud-belleza', 'Productos de cuidado personal, cosméticos, salud', 1, 5),
('Deportes y Recreación', 'deportes-recreacion', 'Equipos deportivos, artículos de recreación', 1, 6),
('Libros y Medios', 'libros-medios', 'Libros, música, películas, contenido digital', 1, 7),
('Servicios', 'servicios', 'Servicios profesionales y especializados', 1, 8),
('Automotriz', 'automotriz', 'Repuestos, accesorios, productos automotrices', 1, 9),
('Otros', 'otros', 'Productos que no encajan en otras categorías', 1, 10);

-- Insertar ubicaciones principales de Colombia
INSERT INTO ubicaciones (pais, departamento_estado, ciudad, latitud, longitud, timezone) VALUES
('CO', 'Bogotá D.C.', 'Bogotá', 4.7109886, -74.072092, 'America/Bogota'),
('CO', 'Antioquia', 'Medellín', 6.2476376, -75.5658153, 'America/Bogota'),
('CO', 'Valle del Cauca', 'Cali', 3.4516467, -76.5319854, 'America/Bogota'),
('CO', 'Atlántico', 'Barranquilla', 10.9639451, -74.7964464, 'America/Bogota'),
('CO', 'Santander', 'Bucaramanga', 7.1253137, -73.1198505, 'America/Bogota'),
('CO', 'Bolívar', 'Cartagena', 10.3997222, -75.5144444, 'America/Bogota'),
('CO', 'Cundinamarca', 'Soacha', 4.5875886, -74.2256525, 'America/Bogota'),
('CO', 'Norte de Santander', 'Cúcuta', 7.8890971, -72.4964778, 'America/Bogota'),
('CO', 'Risaralda', 'Pereira', 4.8143089, -75.6946373, 'America/Bogota'),
('CO', 'Quindío', 'Armenia', 4.5305737, -75.6919395, 'America/Bogota');

-- ============================================================================
-- CONFIGURACIONES FINALES
-- ============================================================================

-- Restaurar configuración de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Crear usuario de aplicación (opcional - ajustar credenciales según necesidad)
-- CREATE USER 'marketplace_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace.* TO 'marketplace_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================================
-- NOTAS DE IMPLEMENTACIÓN
-- ============================================================================
/*
CONSIDERACIONES DE RENDIMIENTO:
1. Todas las tablas usan InnoDB para soporte completo de transacciones y foreign keys
2. Índices optimizados para las consultas más frecuentes del marketplace
3. Campos JSON para flexibilidad sin comprometer rendimiento en consultas principales
4. Triggers para mantener métricas actualizadas automáticamente

ESCALABILIDAD:
1. Uso de BIGINT para IDs principales para soportar alto volumen
2. Índices espaciales para búsquedas de geolocalización eficientes
3. Soft deletes implementados donde es necesario preservar integridad referencial
4. Estructura preparada para sharding futuro por ubicación geográfica

SEGURIDAD:
1. Constraints de validación para mantener integridad de datos
2. Campos para auditoría (created_at, updated_at, deleted_at)
3. Soporte para almacenamiento seguro de contraseñas con hash
4. Campos para tracking de IP y user agent para prevenir spam

MANTENIMIENTO:
1. Comentarios descriptivos en todas las tablas y campos importantes
2. Naming conventions consistentes en inglés/español según contexto
3. Estructura modular que facilita modificaciones futuras
4. Triggers documentados para mantenimiento de métricas

PRÓXIMOS PASOS RECOMENDADOS:
1. Implementar particionado por fecha en tablas de alto volumen (resenas, productos)
2. Configurar replica read-only para consultas de solo lectura
3. Implementar cache Redis para datos consultados frecuentemente
4. Considerar implementar full-text search con Elasticsearch para búsquedas avanzadas
*/