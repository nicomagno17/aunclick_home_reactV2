# Escalabilidad y Rendimiento - Marketplace Informativo
## Consideraciones de Base de Datos para Sistemas de Alta Escala

### Resumen Ejecutivo

Este documento presenta estrategias integrales de escalabilidad y rendimiento para un marketplace informativo diseñado para soportar miles de negocios y millones de productos. Las recomendaciones están optimizadas para MySQL en entornos de alta disponibilidad con proyecciones de crecimiento a 5 años.

**Métricas Objetivo:**
- **Latencia**: <200ms para consultas críticas
- **Throughput**: >10,000 QPS (consultas por segundo)
- **Disponibilidad**: 99.95% uptime
- **Escalabilidad**: Soporte para 50,000+ negocios, 10M+ productos

---

## 1. Estrategias de Indexación y Optimización de Consultas

### 1.1 Índices Primarios y Compuestos

```sql
-- Índices críticos para el rendimiento del marketplace
-- Tabla businesses
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX idx_businesses_category_status ON businesses(category_id, status, created_at);
CREATE INDEX idx_businesses_search ON businesses(business_name, city, category_id);

-- Tabla products
CREATE INDEX idx_products_business_category ON products(business_id, category_id, status);
CREATE INDEX idx_products_price_range ON products(price, discount_price, created_at);
CREATE INDEX idx_products_search ON products(product_name, business_id);
CREATE INDEX idx_products_featured ON products(is_featured, created_at DESC);

-- Tabla product_images (optimización para galería)
CREATE INDEX idx_images_product_order ON product_images(product_id, display_order);

-- Tabla reviews (consultas frecuentes por negocio)
CREATE INDEX idx_reviews_business_rating ON reviews(business_id, rating, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);

-- Tabla search_logs (analytics y trending)
CREATE INDEX idx_search_analytics ON search_logs(search_term, created_at);
CREATE INDEX idx_search_location ON search_logs(user_location, created_at);
```

### 1.2 Índices de Texto Completo

```sql
-- Búsqueda full-text optimizada
ALTER TABLE businesses ADD FULLTEXT(business_name, description);
ALTER TABLE products ADD FULLTEXT(product_name, description, keywords);

-- Configuración de búsqueda en lenguaje natural
SET GLOBAL ft_min_word_len = 3;
SET GLOBAL ft_boolean_syntax = '+ -><()~*:""&|';
```

### 1.3 Optimización de Consultas Críticas

```sql
-- Consulta optimizada para búsqueda geoespacial con filtros
SELECT 
    b.business_id, b.business_name, b.rating_average,
    (6371 * acos(cos(radians(?)) * cos(radians(b.latitude)) 
     * cos(radians(b.longitude) - radians(?)) 
     + sin(radians(?)) * sin(radians(b.latitude)))) AS distance
FROM businesses b
INNER JOIN business_categories bc ON b.category_id = bc.category_id
WHERE b.status = 'active'
  AND b.latitude BETWEEN ? - 0.1 AND ? + 0.1  -- Pre-filtro para optimización
  AND b.longitude BETWEEN ? - 0.1 AND ? + 0.1
  AND bc.category_name = ?
HAVING distance < 10
ORDER BY distance ASC, b.rating_average DESC
LIMIT 20;

-- Consulta optimizada para productos con filtros múltiples
SELECT p.*, b.business_name, pi.image_url
FROM products p
INNER JOIN businesses b ON p.business_id = b.business_id
LEFT JOIN product_images pi ON p.product_id = pi.product_id 
  AND pi.display_order = 1
WHERE p.status = 'active'
  AND p.category_id = ?
  AND p.price BETWEEN ? AND ?
  AND b.city = ?
ORDER BY p.is_featured DESC, p.created_at DESC
LIMIT 20 OFFSET ?;
```

---

## 2. Particionamiento de Tablas para Datos a Gran Escala

### 2.1 Particionamiento Horizontal por Rango

```sql
-- Particionamiento de search_logs por fecha (retención de 2 años)
CREATE TABLE search_logs (
    log_id BIGINT AUTO_INCREMENT,
    search_term VARCHAR(255),
    user_location VARCHAR(100),
    results_count INT,
    created_at DATETIME,
    PRIMARY KEY (log_id, created_at)
) PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p2027 VALUES LESS THAN (2028),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- Particionamiento de reviews por fecha
CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT,
    business_id BIGINT,
    user_id BIGINT,
    rating INT,
    comment TEXT,
    created_at DATETIME,
    PRIMARY KEY (review_id, created_at),
    KEY idx_business_rating (business_id, rating, created_at)
) PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p2027 VALUES LESS THAN (2028),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### 2.2 Particionamiento por Hash para Distribución Uniforme

```sql
-- Particionamiento de products por business_id para distribución uniforme
CREATE TABLE products (
    product_id BIGINT AUTO_INCREMENT,
    business_id BIGINT,
    product_name VARCHAR(255),
    price DECIMAL(10,2),
    category_id INT,
    status ENUM('active', 'inactive', 'pending'),
    created_at DATETIME,
    PRIMARY KEY (product_id, business_id),
    KEY idx_business_category (business_id, category_id, status)
) PARTITION BY HASH(business_id) PARTITIONS 16;
```

### 2.3 Estrategia de Archivado Automático

```sql
-- Procedure para archivado automático de datos históricos
DELIMITER //
CREATE PROCEDURE ArchiveOldData()
BEGIN
    -- Archivar búsquedas antigas (>2 años)
    INSERT INTO search_logs_archive 
    SELECT * FROM search_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    
    DELETE FROM search_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    
    -- Archivar reviews antigas (>3 años) manteniendo estadísticas
    INSERT INTO reviews_archive 
    SELECT * FROM reviews 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 YEAR);
    
    DELETE FROM reviews 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 YEAR);
END //
DELIMITER ;

-- Programar ejecución mensual
CREATE EVENT ArchiveMonthly
ON SCHEDULE EVERY 1 MONTH
STARTS '2024-01-01 02:00:00'
DO CALL ArchiveOldData();
```

---

## 3. Estrategias de Caché para Mejora de Rendimiento

### 3.1 Caché de Aplicación (Redis)

```bash
# Configuración Redis para alta disponibilidad
# redis.conf
maxmemory 8gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Configuración de cluster Redis
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
cluster-require-full-coverage no
```

**Estrategias de Caché por Tipo de Datos:**

```javascript
// Patrones de caché con TTL diferenciado
const CACHE_PATTERNS = {
  // Datos estáticos - TTL largo
  business_categories: { ttl: 86400 }, // 24 horas
  business_info: { ttl: 3600 },        // 1 hora
  
  // Datos dinámicos - TTL medio
  product_listings: { ttl: 1800 },     // 30 minutos
  search_results: { ttl: 900 },        // 15 minutos
  
  // Datos críticos - TTL corto
  user_sessions: { ttl: 300 },         // 5 minutos
  real_time_stats: { ttl: 60 }         // 1 minuto
};

// Implementación de caché inteligente
class MarketplaceCache {
  // Cache warmer para datos frecuentemente accedidos
  async warmupCache() {
    const popularBusinesses = await this.getPopularBusinesses();
    const trendingProducts = await this.getTrendingProducts();
    
    // Pre-cargar en caché
    await Promise.all([
      this.cacheBusinessData(popularBusinesses),
      this.cacheProductData(trendingProducts)
    ]);
  }
  
  // Cache-aside pattern con fallback a BD
  async getBusinessData(businessId) {
    const cacheKey = `business:${businessId}`;
    let data = await redis.get(cacheKey);
    
    if (!data) {
      data = await database.getBusinessById(businessId);
      await redis.setex(cacheKey, 3600, JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    
    return data;
  }
}
```

### 3.2 Caché de Base de Datos (MySQL Query Cache)

```sql
-- Configuración de Query Cache MySQL
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 2048M;
SET GLOBAL query_cache_limit = 16M;

-- Consultas optimizadas para caché
SELECT SQL_CACHE 
    bc.category_name, COUNT(b.business_id) as business_count
FROM business_categories bc
LEFT JOIN businesses b ON bc.category_id = b.category_id
WHERE b.status = 'active'
GROUP BY bc.category_id, bc.category_name
ORDER BY business_count DESC;
```

---

## 4. Optimizaciones para Búsquedas Geoespaciales

### 4.1 Índices Espaciales

```sql
-- Conversión a columnas espaciales para mejor rendimiento
ALTER TABLE businesses 
ADD COLUMN location POINT GENERATED ALWAYS AS (POINT(longitude, latitude)) STORED,
ADD SPATIAL INDEX idx_location (location);

-- Consulta optimizada con funciones espaciales
SELECT 
    business_id, business_name, rating_average,
    ST_Distance_Sphere(location, POINT(?, ?)) as distance_meters
FROM businesses 
WHERE ST_Distance_Sphere(location, POINT(?, ?)) <= 10000  -- 10km radio
  AND status = 'active'
  AND category_id = ?
ORDER BY distance_meters ASC
LIMIT 20;
```

### 4.2 Implementación de Geohashing

```sql
-- Tabla auxiliar para geohashing (búsquedas ultra-rápidas)
CREATE TABLE business_geohash (
    business_id BIGINT PRIMARY KEY,
    geohash_4 CHAR(4),   -- ~20km precision
    geohash_6 CHAR(6),   -- ~1.2km precision  
    geohash_8 CHAR(8),   -- ~150m precision
    INDEX idx_geohash_4 (geohash_4),
    INDEX idx_geohash_6 (geohash_6),
    INDEX idx_geohash_8 (geohash_8),
    FOREIGN KEY (business_id) REFERENCES businesses(business_id)
);

-- Trigger para actualizar geohash automáticamente
DELIMITER //
CREATE TRIGGER update_geohash
AFTER INSERT ON businesses
FOR EACH ROW
BEGIN
    INSERT INTO business_geohash (business_id, geohash_4, geohash_6, geohash_8)
    VALUES (
        NEW.business_id,
        GEOHASH_ENCODE(NEW.latitude, NEW.longitude, 4),
        GEOHASH_ENCODE(NEW.latitude, NEW.longitude, 6),
        GEOHASH_ENCODE(NEW.latitude, NEW.longitude, 8)
    );
END //
DELIMITER ;
```

---

## 5. Estrategias para Manejo de Imágenes y Multimedia

### 5.1 Arquitectura de Almacenamiento Distribuido

```yaml
# docker-compose.yml para infraestructura multimedia
version: '3.8'
services:
  # MinIO para almacenamiento de objetos
  minio:
    image: minio/minio
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password123
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    
  # Redis para metadatos de imágenes
  redis-images:
    image: redis:7-alpine
    volumes:
      - redis_images_data:/data
      
  # ImageProxy para redimensionamiento on-the-fly
  imageproxy:
    image: willnorris/imageproxy
    command: ["-addr", "0.0.0.0:8080", "-cache", "redis://redis-images:6379"]
```

### 5.2 Optimización de Base de Datos para Multimedia

```sql
-- Tabla optimizada para metadatos de imágenes
CREATE TABLE media_files (
    file_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    business_id BIGINT,
    product_id BIGINT NULL,
    original_filename VARCHAR(255),
    storage_path VARCHAR(500),
    file_size INT,
    mime_type VARCHAR(50),
    width INT,
    height INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices optimizados
    INDEX idx_business_media (business_id, created_at DESC),
    INDEX idx_product_media (product_id, created_at DESC),
    INDEX idx_file_size (file_size),
    
    FOREIGN KEY (business_id) REFERENCES businesses(business_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

-- Vista optimizada para imágenes de productos
CREATE VIEW product_images_optimized AS
SELECT 
    p.product_id,
    p.product_name,
    mf.file_id,
    CONCAT('https://cdn.marketplace.com/', mf.storage_path) as image_url,
    CONCAT('https://cdn.marketplace.com/', mf.storage_path, '?w=300&h=300') as thumbnail_url,
    mf.width,
    mf.height
FROM products p
LEFT JOIN media_files mf ON p.product_id = mf.product_id
WHERE mf.mime_type LIKE 'image/%'
ORDER BY p.product_id, mf.created_at ASC;
```

### 5.3 CDN y Optimización de Entrega

```javascript
// Configuración de CDN con múltiples formatos
const CDN_CONFIG = {
  baseUrl: 'https://cdn.marketplace.com',
  formats: ['webp', 'jpg', 'png'],
  sizes: [150, 300, 600, 1200],
  quality: [60, 80, 95],
  
  // Generación automática de URLs optimizadas
  generateImageUrl(path, options = {}) {
    const { width = 300, height = 300, quality = 80, format = 'webp' } = options;
    return `${this.baseUrl}/${path}?w=${width}&h=${height}&q=${quality}&f=${format}`;
  }
};

// Lazy loading con progressive enhancement
class ImageOptimizer {
  static generateSrcSet(imagePath, sizes = [300, 600, 1200]) {
    return sizes.map(size => 
      `${CDN_CONFIG.generateImageUrl(imagePath, { width: size })} ${size}w`
    ).join(', ');
  }
  
  static createPictureElement(imagePath, alt) {
    return `
      <picture>
        <source srcset="${this.generateSrcSet(imagePath)}" type="image/webp">
        <img src="${CDN_CONFIG.generateImageUrl(imagePath)}" 
             alt="${alt}" 
             loading="lazy"
             decoding="async">
      </picture>
    `;
  }
}
```

---

## 6. Optimización de Consultas de Búsqueda y Filtrado

### 6.1 Índices Especializados para Filtros

```sql
-- Índices compuestos para filtros frecuentes
CREATE INDEX idx_products_filters ON products(category_id, price, status, created_at DESC);
CREATE INDEX idx_business_location_filter ON businesses(city, category_id, status, rating_average DESC);

-- Índice funcional para búsquedas case-insensitive
CREATE INDEX idx_business_name_lower ON businesses((LOWER(business_name)));
CREATE INDEX idx_product_name_lower ON products((LOWER(product_name)));
```

### 6.2 Implementación de Elasticsearch para Búsqueda Avanzada

```yaml
# docker-compose.yml para Elasticsearch
elasticsearch:
  image: elasticsearch:8.11.0
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false
    - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
  volumes:
    - elasticsearch_data:/usr/share/elasticsearch/data

kibana:
  image: kibana:8.11.0
  environment:
    - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
  depends_on:
    - elasticsearch
```

```json
// Mapping optimizado para búsquedas de productos
{
  "mappings": {
    "properties": {
      "product_id": { "type": "long" },
      "product_name": {
        "type": "text",
        "analyzer": "spanish",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "spanish"
      },
      "price": { "type": "double" },
      "category": {
        "type": "nested",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "keyword" }
        }
      },
      "business": {
        "type": "nested",
        "properties": {
          "id": { "type": "long" },
          "name": { "type": "text", "analyzer": "spanish" },
          "location": { "type": "geo_point" },
          "rating": { "type": "float" }
        }
      },
      "tags": { "type": "keyword" },
      "created_at": { "type": "date" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "spanish": {
          "type": "standard",
          "stopwords": "_spanish_"
        }
      }
    }
  }
}
```

### 6.3 Consultas Híbridas SQL + Elasticsearch

```javascript
// Implementación de búsqueda híbrida
class HybridSearch {
  async searchProducts(query, filters = {}) {
    const { location, category, priceRange, radius = 10 } = filters;
    
    // Búsqueda en Elasticsearch para relevancia de texto
    const esQuery = {
      bool: {
        must: [
          {
            multi_match: {
              query: query,
              fields: ['product_name^2', 'description'],
              type: 'best_fields',
              fuzziness: 'AUTO'
            }
          }
        ],
        filter: []
      }
    };
    
    // Filtros geoespaciales
    if (location) {
      esQuery.bool.filter.push({
        geo_distance: {
          distance: `${radius}km`,
          'business.location': location
        }
      });
    }
    
    // Filtros de categoría y precio
    if (category) {
      esQuery.bool.filter.push({ term: { 'category.id': category } });
    }
    
    if (priceRange) {
      esQuery.bool.filter.push({
        range: {
          price: {
            gte: priceRange.min,
            lte: priceRange.max
          }
        }
      });
    }
    
    const esResults = await this.elasticsearch.search({
      index: 'products',
      body: {
        query: esQuery,
        sort: [
          { _score: { order: 'desc' } },
          { 'business.rating': { order: 'desc' } }
        ],
        size: 100
      }
    });
    
    // Enriquecer con datos de MySQL para información actualizada
    const productIds = esResults.body.hits.hits.map(hit => hit._source.product_id);
    const detailedProducts = await this.mysql.query(`
      SELECT p.*, b.business_name, b.rating_average,
             pi.image_url as main_image
      FROM products p
      JOIN businesses b ON p.business_id = b.business_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id 
        AND pi.display_order = 1
      WHERE p.product_id IN (${productIds.join(',')})
        AND p.status = 'active'
    `);
    
    return detailedProducts;
  }
}
```

---

## 7. Balanceo de Carga y Alta Disponibilidad

### 7.1 Configuración de MySQL Master-Slave

```sql
-- Configuración Master (my.cnf)
[mysqld]
server-id = 1
log-bin = mysql-bin
log-bin-format = ROW
binlog-do-db = marketplace
expire_logs_days = 7
max_binlog_size = 100M

# Optimizaciones para replicación
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1
innodb_support_xa = 1

-- Configuración Slave (my.cnf)
[mysqld]
server-id = 2
relay-log = relay-bin
log-slave-updates = 1
read_only = 1

# Optimizaciones para lectura
innodb_buffer_pool_size = 8G
query_cache_size = 512M
query_cache_type = 1
```

```sql
-- Setup de replicación
-- En el Master:
CREATE USER 'replication'@'%' IDENTIFIED BY 'strong_password_2024';
GRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';
FLUSH PRIVILEGES;
SHOW MASTER STATUS;

-- En el Slave:
CHANGE MASTER TO
  MASTER_HOST='master-db-server',
  MASTER_USER='replication',
  MASTER_PASSWORD='strong_password_2024',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

START SLAVE;
SHOW SLAVE STATUS\G
```

### 7.2 Proxy de Base de Datos con HAProxy

```bash
# /etc/haproxy/haproxy.cfg
global
    daemon
    maxconn 4096
    
defaults
    mode tcp
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    
# Frontend para escrituras (Master)
frontend mysql_write
    bind *:3306
    default_backend mysql_master
    
# Frontend para lecturas (Slaves)  
frontend mysql_read
    bind *:3307
    default_backend mysql_slaves
    
# Backend Master (escrituras)
backend mysql_master
    balance roundrobin
    server master1 master-db-1:3306 check
    server master2 master-db-2:3306 check backup
    
# Backend Slaves (lecturas)
backend mysql_slaves
    balance roundrobin
    server slave1 slave-db-1:3306 check
    server slave2 slave-db-2:3306 check
    server slave3 slave-db-3:3306 check
    
# Monitoreo de salud
listen stats
    bind *:8080
    stats enable
    stats uri /stats
    stats refresh 30s
```

### 7.3 Configuración de Aplicación para HA

```javascript
// Pool de conexiones inteligente
const mysql = require('mysql2/promise');

class DatabasePool {
  constructor() {
    // Pool para escrituras (Master)
    this.writePool = mysql.createPool({
      host: 'mysql-master-lb',
      port: 3306,
      user: 'app_user',
      password: 'secure_password',
      database: 'marketplace',
      connectionLimit: 50,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    });
    
    // Pool para lecturas (Slaves)
    this.readPool = mysql.createPool({
      host: 'mysql-slaves-lb',
      port: 3307,
      user: 'app_readonly',
      password: 'readonly_password', 
      database: 'marketplace',
      connectionLimit: 100,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    });
  }
  
  // Método inteligente que enruta consultas
  async query(sql, params = [], options = {}) {
    const { forceWrite = false, readPreference = 'slave' } = options;
    
    // Detectar tipo de consulta
    const isWriteQuery = /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sql.trim());
    
    if (isWriteQuery || forceWrite) {
      return await this.writePool.execute(sql, params);
    } else {
      try {
        return await this.readPool.execute(sql, params);
      } catch (error) {
        // Fallback al master si slave falla
        console.warn('Slave query failed, falling back to master:', error.message);
        return await this.writePool.execute(sql, params);
      }
    }
  }
  
  // Método para transacciones (siempre en master)
  async transaction(callback) {
    const connection = await this.writePool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

// Implementación con circuit breaker
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

---

## 8. Estrategias de Sharding para Datos Distribuidos

### 8.1 Sharding por Ubicación Geográfica

```sql
-- Shard 1: Región Norte
-- businesses_north, products_north
CREATE DATABASE marketplace_north;

-- Shard 2: Región Centro  
-- businesses_center, products_center
CREATE DATABASE marketplace_center;

-- Shard 3: Región Sur
-- businesses_south, products_south
CREATE DATABASE marketplace_south;

-- Tabla de routing para shards
CREATE TABLE shard_routing (
    shard_id INT PRIMARY KEY,
    shard_name VARCHAR(50),
    region VARCHAR(50),
    database_host VARCHAR(255),
    database_name VARCHAR(50),
    latitude_min DECIMAL(10,8),
    latitude_max DECIMAL(10,8),
    longitude_min DECIMAL(11,8),
    longitude_max DECIMAL(11,8),
    status ENUM('active', 'readonly', 'maintenance') DEFAULT 'active'
);

INSERT INTO shard_routing VALUES
(1, 'north', 'Norte', 'db-north.internal', 'marketplace_north', 19.0, 32.7, -118.0, -86.0, 'active'),
(2, 'center', 'Centro', 'db-center.internal', 'marketplace_center', 16.0, 25.0, -106.0, -97.0, 'active'),
(3, 'south', 'Sur', 'db-south.internal', 'marketplace_south', 14.5, 19.0, -118.0, -86.0, 'active');
```

### 8.2 Implementación de Shard Manager

```javascript
class ShardManager {
  constructor() {
    this.shards = new Map();
    this.routingTable = new Map();
    this.init();
  }
  
  async init() {
    // Cargar configuración de shards
    const shardConfigs = await this.loadShardConfigs();
    
    for (const config of shardConfigs) {
      const pool = mysql.createPool({
        host: config.database_host,
        database: config.database_name,
        user: 'shard_user',
        password: 'shard_password',
        connectionLimit: 25
      });
      
      this.shards.set(config.shard_id, {
        pool,
        region: config.region,
        bounds: {
          lat: [config.latitude_min, config.latitude_max],
          lng: [config.longitude_min, config.longitude_max]
        }
      });
    }
  }
  
  // Determinar shard basado en ubicación
  getShardByLocation(latitude, longitude) {
    for (const [shardId, shard] of this.shards) {
      const { bounds } = shard;
      if (latitude >= bounds.lat[0] && latitude <= bounds.lat[1] &&
          longitude >= bounds.lng[0] && longitude <= bounds.lng[1]) {
        return shardId;
      }
    }
    return 1; // Shard por defecto
  }
  
  // Consulta cross-shard para búsquedas globales
  async queryAllShards(sql, params = []) {
    const promises = Array.from(this.shards.entries()).map(([shardId, shard]) => {
      return shard.pool.execute(sql, params)
        .then(([rows]) => ({ shardId, rows }))
        .catch(error => ({ shardId, error }));
    });
    
    const results = await Promise.all(promises);
    
    // Combinar y ordenar resultados
    const combinedRows = [];
    for (const result of results) {
      if (!result.error && result.rows) {
        combinedRows.push(...result.rows);
      }
    }
    
    return combinedRows;
  }
  
  // Inserción inteligente basada en ubicación de negocio
  async insertBusiness(businessData) {
    const { latitude, longitude } = businessData;
    const shardId = this.getShardByLocation(latitude, longitude);
    const shard = this.shards.get(shardId);
    
    const [result] = await shard.pool.execute(`
      INSERT INTO businesses (business_name, latitude, longitude, city, category_id)
      VALUES (?, ?, ?, ?, ?)
    `, [businessData.business_name, latitude, longitude, businessData.city, businessData.category_id]);
    
    // Actualizar routing table para consultas futuras
    await this.updateBusinessRouting(result.insertId, shardId);
    
    return result.insertId;
  }
}
```

### 8.3 Consistencia Cross-Shard

```javascript
// Implementación de Saga Pattern para transacciones distribuidas
class DistributedTransaction {
  constructor(shardManager) {
    this.shardManager = shardManager;
    this.compensationActions = [];
  }
  
  async executeDistributedTransaction(operations) {
    const results = [];
    
    try {
      for (const operation of operations) {
        const result = await this.executeOperation(operation);
        results.push(result);
        
        // Agregar acción de compensación
        this.compensationActions.unshift(operation.compensate);
      }
      
      return results;
    } catch (error) {
      // Ejecutar compensaciones en orden inverso
      await this.compensate();
      throw error;
    }
  }
  
  async compensate() {
    for (const compensateAction of this.compensationActions) {
      try {
        await compensateAction();
      } catch (error) {
        console.error('Compensation failed:', error);
      }
    }
  }
  
  async executeOperation(operation) {
    const shard = this.shardManager.shards.get(operation.shardId);
    return await shard.pool.execute(operation.sql, operation.params);
  }
}

// Ejemplo de uso para crear negocio con productos
async function createBusinessWithProducts(businessData, productsData) {
  const transaction = new DistributedTransaction(shardManager);
  
  const operations = [
    {
      shardId: shardManager.getShardByLocation(businessData.latitude, businessData.longitude),
      sql: 'INSERT INTO businesses (business_name, latitude, longitude, city) VALUES (?, ?, ?, ?)',
      params: [businessData.business_name, businessData.latitude, businessData.longitude, businessData.city],
      compensate: async () => {
        // Rollback business creation
      }
    },
    ...productsData.map(product => ({
      shardId: shardManager.getShardByLocation(businessData.latitude, businessData.longitude),
      sql: 'INSERT INTO products (business_id, product_name, price) VALUES (?, ?, ?)',
      params: [businessData.business_id, product.product_name, product.price],
      compensate: async () => {
        // Rollback product creation
      }
    }))
  ];
  
  return await transaction.executeDistributedTransaction(operations);
}
```

---

## 9. Optimizaciones para Reportes y Analytics

### 9.1 Data Warehouse con Tablas OLAP

```sql
-- Tablas dimensionales para analytics
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    date_value DATE,
    year INT,
    quarter INT,
    month INT,
    week INT,
    day_of_week INT,
    is_weekend BOOLEAN,
    INDEX idx_year_month (year, month)
) ENGINE=InnoDB;

CREATE TABLE dim_business (
    business_key BIGINT PRIMARY KEY,
    business_id BIGINT,
    business_name VARCHAR(255),
    category_name VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    region VARCHAR(50),
    created_date DATE,
    INDEX idx_category_region (category_name, region)
) ENGINE=InnoDB;

-- Tabla de hechos para métricas de búsqueda
CREATE TABLE fact_search_metrics (
    metric_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_key INT,
    business_key BIGINT,
    search_term VARCHAR(255),
    search_count INT,
    click_through_count INT,
    conversion_count INT,
    revenue_generated DECIMAL(12,2),
    
    INDEX idx_date_business (date_key, business_key),
    INDEX idx_search_term (search_term),
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (business_key) REFERENCES dim_business(business_key)
) ENGINE=InnoDB;

-- Tabla de hechos agregada por día
CREATE TABLE fact_daily_business_metrics (
    metric_date DATE,
    business_id BIGINT,
    total_views INT DEFAULT 0,
    total_searches INT DEFAULT 0,
    total_clicks INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    
    PRIMARY KEY (metric_date, business_id),
    INDEX idx_date (metric_date),
    INDEX idx_business (business_id)
) ENGINE=InnoDB PARTITION BY RANGE (YEAR(metric_date)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### 9.2 ETL Pipeline para Analytics

```sql
-- Procedimiento ETL para métricas diarias
DELIMITER //
CREATE PROCEDURE ProcessDailyMetrics(IN process_date DATE)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE business_id_var BIGINT;
    
    -- Cursor para procesar cada negocio
    DECLARE business_cursor CURSOR FOR
        SELECT DISTINCT business_id FROM businesses WHERE status = 'active';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Limpiar datos del día si ya existen
    DELETE FROM fact_daily_business_metrics WHERE metric_date = process_date;
    
    OPEN business_cursor;
    
    business_loop: LOOP
        FETCH business_cursor INTO business_id_var;
        IF done THEN
            LEAVE business_loop;
        END IF;
        
        -- Agregar métricas del día
        INSERT INTO fact_daily_business_metrics (
            metric_date, business_id, total_views, total_searches, 
            total_clicks, conversion_rate, revenue
        )
        SELECT 
            process_date,
            business_id_var,
            COALESCE(v.total_views, 0),
            COALESCE(s.total_searches, 0),
            COALESCE(c.total_clicks, 0),
            CASE 
                WHEN COALESCE(c.total_clicks, 0) > 0 
                THEN ROUND((COALESCE(conv.conversions, 0) / c.total_clicks) * 100, 2)
                ELSE 0 
            END,
            COALESCE(r.revenue, 0)
        FROM 
            (SELECT business_id_var as business_id) b
        LEFT JOIN (
            -- Views del día
            SELECT business_id, COUNT(*) as total_views
            FROM business_views 
            WHERE DATE(created_at) = process_date 
              AND business_id = business_id_var
            GROUP BY business_id
        ) v ON b.business_id = v.business_id
        LEFT JOIN (
            -- Búsquedas del día
            SELECT COUNT(*) as total_searches
            FROM search_logs sl
            JOIN search_results sr ON sl.log_id = sr.log_id
            WHERE DATE(sl.created_at) = process_date 
              AND sr.business_id = business_id_var
        ) s ON 1=1
        LEFT JOIN (
            -- Clicks del día
            SELECT business_id, COUNT(*) as total_clicks
            FROM business_clicks
            WHERE DATE(created_at) = process_date 
              AND business_id = business_id_var
            GROUP BY business_id
        ) c ON b.business_id = c.business_id
        LEFT JOIN (
            -- Conversiones del día
            SELECT COUNT(*) as conversions
            FROM conversions
            WHERE DATE(created_at) = process_date 
              AND business_id = business_id_var
        ) conv ON 1=1
        LEFT JOIN (
            -- Revenue del día
            SELECT SUM(amount) as revenue
            FROM transactions
            WHERE DATE(created_at) = process_date 
              AND business_id = business_id_var
        ) r ON 1=1;
        
    END LOOP;
    
    CLOSE business_cursor;
    
    -- Actualizar estadísticas de tabla
    ANALYZE TABLE fact_daily_business_metrics;
    
END //
DELIMITER ;

-- Event scheduler para ejecutar ETL diariamente
CREATE EVENT daily_metrics_etl
ON SCHEDULE EVERY 1 DAY
STARTS '2024-01-01 01:00:00'
DO
    CALL ProcessDailyMetrics(DATE_SUB(CURDATE(), INTERVAL 1 DAY));
```

### 9.3 Consultas Optimizadas para Dashboards

```sql
-- Vista materializada para top businesses por región
CREATE VIEW top_businesses_by_region AS
SELECT 
    b.region,
    b.business_name,
    dm.total_views,
    dm.total_clicks,
    dm.conversion_rate,
    dm.revenue,
    RANK() OVER (PARTITION BY b.region ORDER BY dm.revenue DESC) as revenue_rank
FROM dim_business b
JOIN fact_daily_business_metrics dm ON b.business_id = dm.business_id
WHERE dm.metric_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Consulta optimizada para trending searches
SELECT 
    sl.search_term,
    COUNT(*) as search_count,
    COUNT(DISTINCT sl.user_ip) as unique_users,
    AVG(sr.results_count) as avg_results,
    RANK() OVER (ORDER BY COUNT(*) DESC) as trend_rank
FROM search_logs sl
LEFT JOIN search_results sr ON sl.log_id = sr.log_id
WHERE sl.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY sl.search_term
HAVING search_count >= 10
ORDER BY search_count DESC
LIMIT 50;

-- Consulta para business performance metrics
SELECT 
    b.business_name,
    b.category_name,
    SUM(dm.total_views) as views_7d,
    SUM(dm.total_clicks) as clicks_7d,
    AVG(dm.conversion_rate) as avg_conversion_rate,
    SUM(dm.revenue) as revenue_7d,
    SUM(dm.revenue) / NULLIF(SUM(dm.total_clicks), 0) as revenue_per_click
FROM dim_business b
JOIN fact_daily_business_metrics dm ON b.business_id = dm.business_id
WHERE dm.metric_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY b.business_key, b.business_name, b.category_name
ORDER BY revenue_7d DESC
LIMIT 100;
```

---

## 10. Manejo de Crecimiento a Largo Plazo (Proyección 5 años)

### 10.1 Proyecciones de Crecimiento

```yaml
# Proyección de Crecimiento 2024-2029
growth_projections:
  year_1_2024:
    businesses: 5000
    products: 500000
    users: 100000
    searches_per_day: 50000
    storage_gb: 500
    
  year_2_2025:
    businesses: 12000
    products: 1200000
    users: 300000
    searches_per_day: 150000
    storage_gb: 2000
    
  year_3_2026:
    businesses: 25000
    products: 3000000
    users: 750000
    searches_per_day: 400000
    storage_gb: 8000
    
  year_4_2027:
    businesses: 40000
    products: 6000000
    users: 1500000
    searches_per_day: 800000
    storage_gb: 20000
    
  year_5_2029:
    businesses: 50000
    products: 10000000
    users: 3000000
    searches_per_day: 1500000
    storage_gb: 50000
```

### 10.2 Arquitectura Evolutiva

```yaml
# Evolución de Infraestructura por Fase
infrastructure_evolution:
  
  phase_1_foundation:
    timeline: "Meses 1-12"
    database: "Single MySQL Master-Slave"
    cache: "Single Redis instance"
    storage: "Local file system"
    search: "MySQL full-text search"
    target_scale: "5K businesses, 500K products"
    
  phase_2_scaling:
    timeline: "Meses 13-24"  
    database: "MySQL Master-Slave with read replicas"
    cache: "Redis cluster (3 nodes)"
    storage: "MinIO object storage"
    search: "Elasticsearch single node"
    target_scale: "12K businesses, 1.2M products"
    
  phase_3_distribution:
    timeline: "Meses 25-36"
    database: "Geographic sharding (3 regions)"
    cache: "Redis cluster per region"
    storage: "Distributed MinIO (multi-region)"
    search: "Elasticsearch cluster (3 nodes)"
    target_scale: "25K businesses, 3M products"
    
  phase_4_enterprise:
    timeline: "Meses 37-48"
    database: "Full sharding + federated queries"
    cache: "Multi-tier caching strategy"
    storage: "CDN + global object storage"
    search: "Multi-region Elasticsearch"
    target_scale: "40K businesses, 6M products"
    
  phase_5_hyperscale:
    timeline: "Meses 49-60"
    database: "Microservices with dedicated DBs"
    cache: "Intelligent caching with AI"
    storage: "Global edge distribution"
    search: "Hybrid search with AI ranking"
    target_scale: "50K+ businesses, 10M+ products"
```

### 10.3 Migration Scripts para Evolución

```sql
-- Script de migración Fase 1 -> Fase 2
-- Preparación para sharding geográfico

-- 1. Agregar columnas de metadatos para sharding
ALTER TABLE businesses 
ADD COLUMN shard_id INT DEFAULT 1,
ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD INDEX idx_shard_id (shard_id, last_updated);

-- 2. Crear tabla de configuración de shards
CREATE TABLE shard_configuration (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shard_name VARCHAR(50),
    region_name VARCHAR(50),
    latitude_min DECIMAL(10,8),
    latitude_max DECIMAL(10,8),
    longitude_min DECIMAL(11,8),
    longitude_max DECIMAL(11,8),
    database_host VARCHAR(255),
    status ENUM('active', 'readonly', 'maintenance'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Función para determinar shard basado en ubicación
DELIMITER //
CREATE FUNCTION GetShardByLocation(lat DECIMAL(10,8), lng DECIMAL(11,8))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE shard_result INT DEFAULT 1;
    
    SELECT sc.id INTO shard_result
    FROM shard_configuration sc
    WHERE lat BETWEEN sc.latitude_min AND sc.latitude_max
      AND lng BETWEEN sc.longitude_min AND sc.longitude_max
      AND sc.status = 'active'
    LIMIT 1;
    
    RETURN shard_result;
END //
DELIMITER ;

-- 4. Actualizar shard_id existente
UPDATE businesses 
SET shard_id = GetShardByLocation(latitude, longitude)
WHERE shard_id = 1;

-- Script de migración Fase 2 -> Fase 3
-- Preparación para búsqueda híbrida

-- 1. Crear tabla de sincronización con Elasticsearch
CREATE TABLE elasticsearch_sync (
    entity_type ENUM('business', 'product'),
    entity_id BIGINT,
    action ENUM('index', 'update', 'delete'),
    sync_status ENUM('pending', 'synced', 'failed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    
    PRIMARY KEY (entity_type, entity_id, created_at),
    INDEX idx_sync_status (sync_status, created_at)
);

-- 2. Triggers para sincronización automática
DELIMITER //
CREATE TRIGGER business_elasticsearch_sync
AFTER INSERT ON businesses
FOR EACH ROW
BEGIN
    INSERT INTO elasticsearch_sync (entity_type, entity_id, action)
    VALUES ('business', NEW.business_id, 'index');
END //

CREATE TRIGGER business_elasticsearch_update
AFTER UPDATE ON businesses  
FOR EACH ROW
BEGIN
    INSERT INTO elasticsearch_sync (entity_type, entity_id, action)
    VALUES ('business', NEW.business_id, 'update');
END //

CREATE TRIGGER product_elasticsearch_sync
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    INSERT INTO elasticsearch_sync (entity_type, entity_id, action)
    VALUES ('product', NEW.product_id, 'index');
END //
DELIMITER ;
```

### 10.4 Monitoring y Alertas para Escalabilidad

```yaml
# Configuración de monitoring escalable
monitoring_thresholds:
  
  database_metrics:
    connection_utilization:
      warning: 70%
      critical: 85%
    query_response_time:
      warning: 500ms
      critical: 1000ms
    replication_lag:
      warning: 5s
      critical: 30s
    disk_usage:
      warning: 80%
      critical: 90%
      
  application_metrics:
    search_response_time:
      warning: 200ms
      critical: 500ms
    cache_hit_ratio:
      warning: 85%
      critical: 75%
    error_rate:
      warning: 1%
      critical: 5%
      
  business_metrics:
    daily_new_businesses:
      warning: growth_rate < 5%
      critical: growth_rate < 0%
    search_volume:
      warning: 50% above normal
      critical: 100% above normal
```

```javascript
// Sistema de alertas inteligente
class ScalabilityMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = this.loadThresholds();
    this.alertHistory = new Map();
  }
  
  async checkDatabaseScalability() {
    const metrics = await this.collectDatabaseMetrics();
    
    // Predicción de crecimiento basada en tendencias
    const growthRate = this.calculateGrowthRate(metrics.recordCount, 30); // 30 días
    const projectedCapacity = this.projectCapacity(growthRate, 90); // 90 días
    
    if (projectedCapacity > this.thresholds.database.maxCapacity * 0.8) {
      await this.triggerScaleUpAlert('database', {
        currentCapacity: metrics.recordCount,
        projectedCapacity,
        recommendedAction: 'prepare_new_shard'
      });
    }
    
    // Análisis de performance de consultas
    const slowQueries = await this.analyzeSlowQueries();
    if (slowQueries.length > this.thresholds.performance.slowQueryLimit) {
      await this.optimizeQueries(slowQueries);
    }
  }
  
  async triggerScaleUpAlert(component, details) {
    const alertKey = `${component}_scale_up`;
    
    // Evitar spam de alertas
    if (this.alertHistory.has(alertKey)) {
      const lastAlert = this.alertHistory.get(alertKey);
      if (Date.now() - lastAlert < 3600000) { // 1 hora
        return;
      }
    }
    
    // Enviar alerta
    await this.sendAlert({
      type: 'scale_up_required',
      component,
      details,
      priority: 'high',
      recommendations: this.getScaleUpRecommendations(component, details)
    });
    
    this.alertHistory.set(alertKey, Date.now());
  }
  
  getScaleUpRecommendations(component, details) {
    const recommendations = {
      database: [
        'Prepare new database shard',
        'Review partition strategy',
        'Consider read replica addition',
        'Optimize expensive queries'
      ],
      cache: [
        'Scale Redis cluster',
        'Review cache eviction policies', 
        'Optimize cache key distribution',
        'Consider cache warming strategy'
      ],
      search: [
        'Add Elasticsearch nodes',
        'Review index optimization',
        'Consider search result caching',
        'Optimize query patterns'
      ]
    };
    
    return recommendations[component] || ['Contact DevOps team'];
  }
}
```

### 10.5 Plan de Contingencia para Crecimiento Explosivo

```yaml
# Plan de respuesta rápida para crecimiento inesperado
emergency_scaling_plan:
  
  trigger_conditions:
    traffic_spike: "300% above normal for 30 minutes"
    database_load: "CPU > 90% for 15 minutes"
    search_latency: "Response time > 2 seconds"
    
  immediate_actions:
    - Enable aggressive caching
    - Activate read replicas
    - Scale application servers
    - Enable CDN caching
    
  short_term_actions: # 24-48 hours
    - Deploy additional database slaves
    - Scale Elasticsearch cluster
    - Increase Redis memory
    - Optimize critical queries
    
  medium_term_actions: # 1-2 weeks  
    - Implement geographic sharding
    - Deploy multi-region infrastructure
    - Optimize data access patterns
    - Enhanced monitoring and alerting
    
  long_term_actions: # 1-3 months
    - Microservices architecture
    - Advanced caching strategies
    - AI-powered query optimization
    - Global content distribution
```

---

## Conclusiones y Recomendaciones

### Implementación por Fases

**Fase 1 (Meses 1-6): Fundación Sólida**
- Implementar índices críticos y optimización de consultas
- Configurar sistema de caché básico con Redis
- Establecer monitoreo y alertas
- **Inversión estimada**: $15,000 USD
- **ROI esperado**: Mejora de 60% en tiempos de respuesta

**Fase 2 (Meses 7-12): Escalabilidad Horizontal**
- Desplegar arquitectura Master-Slave
- Implementar particionamiento temporal
- Integrar Elasticsearch para búsquedas
- **Inversión estimada**: $35,000 USD
- **ROI esperado**: Soporte para 10x más usuarios

**Fase 3 (Meses 13-18): Distribución Geográfica**
- Implementar sharding geográfico
- Desplegar CDN para contenido multimedia
- Optimizar para búsquedas geoespaciales
- **Inversión estimada**: $75,000 USD
- **ROI esperado**: Expansión a múltiples regiones

### Métricas de Éxito

- **Performance**: <200ms respuesta promedio
- **Escalabilidad**: Soportar 50,000+ negocios
- **Disponibilidad**: 99.95% uptime
- **Costo**: <$0.10 por consulta a escala

### Tecnologías Clave Recomendadas

1. **Base de Datos**: MySQL 8.0+ con InnoDB Cluster
2. **Caché**: Redis Cluster 7.0+
3. **Búsqueda**: Elasticsearch 8.0+
4. **Storage**: MinIO para objetos
5. **CDN**: CloudFlare o AWS CloudFront
6. **Monitoreo**: Prometheus + Grafana
7. **Load Balancer**: HAProxy o NGINX Plus

Este documento proporciona una hoja de ruta clara para escalar el marketplace desde una aplicación pequeña hasta una plataforma de nivel empresarial, manteniendo alta performance y disponibilidad en cada etapa del crecimiento.