# Login & Security Improvements

Resumen de las mejoras implementadas y guía rápida para configuración y despliegue.

## Resumen ejecutivo
Se han implementado mejoras para endurecer la seguridad del login y modernizar la experiencia de usuario:

- Integración completa con NextAuth (Credentials + Google + Facebook)
- Validación y sanitización client-side con Zod y React Hook Form
- Rate limiting opcional con Upstash Redis (fallback in-memory si no está configurado)
- Uso de sessions JWT mediante NextAuth y SessionProvider global
- UI mejorada del formulario de login con componentes shadcn/ui
- Header actualizado para usar `useSession` en vez de `localStorage`

## Variables de entorno requeridas
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
- UPSTASH_REDIS_REST_URL (opcional)
- UPSTASH_REDIS_REST_TOKEN (opcional)
- BCRYPT_COST (opcional, default: 12)
- COOKIE_DOMAIN (opcional, para producción)

## Rate Limiting
- Recomendado para prevenir ataques de fuerza bruta.
- Si no se configura Upstash, se utiliza un fallback in-memory (no recomendado para producción).
- Login: 5 intentos por 10 minutos por IP + email
- Login por cuenta: 10 intentos por hora por email
- OAuth: 10 intentos por 5 minutos por IP
- Registro: 3 intentos por hora por IP
- Recuperación de contraseña: 3 intentos por hora por IP

## OAuth Token Lifecycle
- **Almacenamiento seguro**: Tokens OAuth se almacenan en base de datos con campos dedicados (`access_token`, `refresh_token`, `token_expires_at`)
- **Refresh automático**: Implementado en callback JWT de NextAuth, refresca tokens 5 minutos antes de expirar
- **Revocación**: Endpoint `POST /api/auth/oauth/revoke` para revocar tokens con proveedores
- **Limpieza**: Tokens se eliminan de BD al revocar o cuando fallan operaciones
- **Google OAuth**:
  - Endpoint refresh: `https://oauth2.googleapis.com/token`
  - Endpoint revoke: `https://oauth2.googleapis.com/revoke`
  - Redirect URI: `http://localhost:3000/api/auth/callback/google` (desarrollo) y `https://YOUR_DOMAIN/api/auth/callback/google` (producción)
- **Facebook OAuth**:
  - Endpoint refresh: `https://graph.facebook.com/oauth/access_token`
  - Endpoint revoke: `https://graph.facebook.com/me/permissions` (DELETE)
  - Redirect URI: `http://localhost:3000/api/auth/callback/facebook` (desarrollo) y `https://YOUR_DOMAIN/api/auth/callback/facebook` (producción)
- **Gestión de errores**: Refresh fallido no rompe sesión, permite re-autenticación
- **Logging**: Eventos de refresh y revocación se registran para auditoría

## Recuperación de Contraseña
- Flujo completo implementado con tokens de un solo uso y expiración (1 hora)
- Endpoints:
  - `POST /api/auth/password/forgot` - Solicita recuperación de contraseña
  - `POST /api/auth/password/reset` - Restablece contraseña con token
- Páginas:
  - `/password/forgot` - Formulario para solicitar recuperación
  - `/password/reset/[token]` - Formulario para restablecer contraseña
- Protección contra enumeración de emails (siempre retorna 200)
- Rate limiting aplicado a ambos endpoints

## Opción "Recordarme"
- Checkbox "Recordarme en este dispositivo" en formulario de login
- Permite extender la duración de la sesión del usuario
- Implementado con flags seguros en cookies JWT
- Configuración de sesiones:
  - **Sin "Recordarme"**: Sesión expira en 24 horas
  - **Con "Recordarme"**: Sesión expira en 30 días
- La expiración se establece dinámicamente en el callback `session` de NextAuth
- El flag `rememberMe` se almacena en el token JWT para validación
## Multi-Factor Authentication (MFA)
- **Implementación completa** con soporte TOTP (Time-based One-Time Passwords)
- **Base de datos**: Tablas dedicadas para secrets MFA, intentos, dispositivos confiables y códigos de recuperación
- **Bibliotecas**: `otplib` para TOTP y `qrcode` para generación de códigos QR
- **Flujo de autenticación**:
  - Usuario habilita MFA en `/mfa/setup`
  - Escanea código QR con app autenticadora (Google Authenticator, Authy, etc.)
  - Verifica código para activar MFA
  - En login, si MFA está habilitado, redirige a `/mfa/verify`
- **Características de seguridad**:
  - Secrets TOTP encriptados en base de datos
  - Ventana de tiempo de 30 segundos para códigos
  - 10 códigos de recuperación de un solo uso
  - Dispositivos confiables opcionales (30 días)
  - Rate limiting específico para MFA (5 intentos por hora)
  - Logging de intentos fallidos
- **API Endpoints**:
  - `POST /api/auth/mfa/setup` - Genera secret TOTP y código QR
  - `PUT /api/auth/mfa/setup` - Verifica y habilita MFA
  - `POST /api/auth/mfa/verify` - Verifica código MFA para login
  - `POST /api/auth/mfa/resend` - Reenvía código (rate limited)
- **Integración NextAuth**: Redirección automática cuando MFA es requerido
- **Protección**: Prevención de enumeración de emails en respuestas

- OAuth providers siempre usan sesión corta (24 horas) por defecto

## Notas de seguridad
- Hashing de contraseñas con bcrypt (server-side). No almacenar contraseñas en el cliente.
- Validación de complejidad de contraseñas en servidor y cliente:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos un número
  - Al menos un carácter especial
- Configuración de coste bcrypt ajustable (BCRYPT_COST, default: 12)
## Protección CSRF/State
- **NextAuth.js CSRF Protection**: Habilitada por defecto en todos los endpoints de autenticación
- **Mecanismo**: Tokens CSRF únicos generados por sesión, validados en cada request POST
- **Cookies**: `next-auth.csrf-token` con flags seguros (`httpOnly`, `secure`, `sameSite: 'lax'`)
- **State Parameter**: OAuth flows incluyen parámetro `state` para prevenir ataques CSRF
- **Validación automática**: NextAuth valida automáticamente tokens CSRF en formularios
- **Protección de redirección**: URLs de callback validadas contra lista blanca
- **Verificación de secreto**: `NEXTAUTH_SECRET` validado en startup (mínimo 32 caracteres en producción)
- **Entropía del secreto**: Verificación básica de entropía para detectar secrets débiles
- **Logging**: Intentos CSRF inválidos se registran para monitoreo de seguridad
- Las cookies de sesión están configuradas con flags seguros:
  - `httpOnly`: Previene acceso desde JavaScript (protección contra XSS)
  - `secure`: Solo se envían sobre HTTPS en producción
  - `sameSite`: 'lax' para protección CSRF básica
  - `path`: '/' para ámbito de aplicación completo
  - `domain`: Configurable para producción (opcional)

## Cómo probar localmente
1. Añadir variables de entorno en `.env.local`.
2. Instalar dependencias: `npm install`.
3. Ejecutar servidor: `npm run dev`.

## Troubleshooting
- Si ves problemas con Upstash, revisa las variables de entorno y el tablero de Upstash.
- Si OAuth falla, revisa los redirect URIs configurados en la consola del proveedor.

## Referencias
- NextAuth: https://next-auth.js.org/
- Upstash: https://upstash.com/
- OWASP Rate Limiting: https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_for_Web_Applications.html
