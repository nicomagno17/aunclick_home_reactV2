import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from 'bcrypt'
import { executeQuerySingle, insertAndGetId } from '@/lib/database'
import { JWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
import { checkLoginPerAccountRateLimit } from '@/lib/rate-limit'
import {
  isMFAEnabled,
  verifyMFASessionToken,
  generateMFASessionToken,
  storeMFASessionToken,
  isTrustedDevice
} from '@/lib/mfa'
import { AuthErrorException, AuthErrorCode } from '@/lib/auth-errors'
import crypto from 'crypto'

// Verify NEXTAUTH_SECRET strength on startup
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required for security. Generate a strong random string.')
}

if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_SECRET.length < 32) {
  throw new Error('NEXTAUTH_SECRET must be at least 32 characters long in production.')
}

// Additional entropy check
const secretEntropy = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET).digest('hex')
if (secretEntropy.match(/(.)\1{10,}/)) {
  console.warn('Warning: NEXTAUTH_SECRET appears to have low entropy. Consider using a more random secret.')
}

/**
 * Refresh OAuth tokens for Google and Facebook
 */
async function refreshOAuthToken(provider: string, refreshToken: string) {
  try {
    if (provider === 'google') {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to refresh Google token')
      }

      const data = await response.json()
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // Google may return a new refresh token
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      }
    } else if (provider === 'facebook') {
      const response = await fetch('https://graph.facebook.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.FACEBOOK_CLIENT_ID!,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to refresh Facebook token')
      }

      const data = await response.json()
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // Facebook may return a new refresh token
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      }
    }
  } catch (error) {
    console.error(`Error refreshing ${provider} token:`, error)
    return null
  }
}

/**
 * Update OAuth tokens in database
 */
async function updateOAuthTokens(userId: number, tokens: any) {
  try {
    // Store tokens securely in database
    // In a real implementation, you would encrypt these tokens
    await executeQuerySingle(
      'UPDATE usuarios SET access_token = ?, refresh_token = ?, token_expires_at = ? WHERE id = ?',
      [tokens.access_token, tokens.refresh_token, new Date(tokens.expires_at * 1000), userId]
    )
  } catch (error) {
    console.error('Error updating OAuth tokens:', error)
  }
}

// Interface para el usuario basada en la tabla usuarios
interface Usuario {
  id: number
  uuid: string
  email: string
  password_hash: string
  nombre: string
  apellidos?: string
  telefono?: string
  avatar_url?: string
  rol: 'usuario' | 'propietario_negocio' | 'moderador' | 'admin'
  estado: 'activo' | 'inactivo' | 'suspendido' | 'pendiente_verificacion'
  email_verificado_at?: Date | null
  ultimo_acceso?: Date | null
  created_at: Date
  updated_at: Date
}

// Extender los tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      uuid: string
      rol: Usuario['rol']
      estado: Usuario['estado']
      nombre: string
      apellidos?: string
      avatar_url?: string
      email: string
      accessToken?: string
      refreshToken?: string
      expiresAt?: number
      mfaRequired?: boolean
      mfaVerified?: boolean
      mfaSessionToken?: string
      trustedDevice?: boolean
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends Usuario {
    rememberMe?: boolean
    mfaRequired?: boolean
    mfaVerified?: boolean
    mfaSessionToken?: string
    trustedDevice?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    uuid: string
    rol: Usuario['rol']
    estado: Usuario['estado']
    nombre: string
    apellidos?: string
    avatar_url?: string
    email: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    rememberMe?: boolean
    mfaRequired?: boolean
    mfaVerified?: boolean
    mfaSessionToken?: string
    trustedDevice?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // Credentials Provider (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember Me', type: 'boolean' },
        mfaSessionToken: { label: 'MFA Session Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check per-email rate limit
          const emailRateLimit = await checkLoginPerAccountRateLimit(credentials.email)
          if (!emailRateLimit.success) {
            throw new AuthErrorException(AuthErrorCode.ACCOUNT_RATE_LIMIT_EXCEEDED);
          }

          // Consultar usuario por email
          const usuario = await executeQuerySingle<Usuario>(`
            SELECT
              id, uuid, email, password_hash, nombre, apellidos, telefono,
              avatar_url, rol, estado, email_verificado_at, ultimo_acceso,
              created_at, updated_at
            FROM usuarios
            WHERE email = ? AND deleted_at IS NULL
          `, [credentials.email])

          if (!usuario) {
            return null // Email no encontrado
          }

          // Validar estado del usuario
          if (usuario.estado === 'pendiente_verificacion') {
            throw new AuthErrorException(AuthErrorCode.ACCOUNT_PENDING_VERIFICATION);
          }

          if (usuario.estado === 'suspendido') {
            throw new AuthErrorException(AuthErrorCode.ACCOUNT_SUSPENDED);
          }

          if (usuario.estado === 'inactivo') {
            throw new AuthErrorException(AuthErrorCode.ACCOUNT_INACTIVE);
          }

          if (usuario.estado !== 'activo') {
            throw new AuthErrorException(AuthErrorCode.INVALID_ACCOUNT_STATE);
          }

          // Validar contraseña
          const passwordValid = await bcrypt.compare(credentials.password, usuario.password_hash)
          if (!passwordValid) {
            return null // Contraseña incorrecta
          }

          // Check if MFA is enabled for this user
          const mfaEnabled = await isMFAEnabled(usuario.id)

          // If MFA is enabled and no valid MFA session token is provided
          if (mfaEnabled) {
            // If we have a valid MFA session token, allow login
            if (credentials.mfaSessionToken) {
              const isValidMFASession = await verifyMFASessionToken(usuario.id, credentials.mfaSessionToken)
              if (isValidMFASession) {
                // Update last access
                await executeQuerySingle(
                  'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
                  [usuario.id]
                )

                return {
                  ...usuario,
                  rememberMe: credentials.remember === 'true',
                  mfaVerified: true,
                }
              }
            }

            // MFA required - return special response to trigger MFA flow
            const mfaSessionToken = generateMFASessionToken()
            await storeMFASessionToken(usuario.id, mfaSessionToken)

            throw new AuthErrorException(AuthErrorCode.MFA_REQUIRED, {
              mfaSessionToken,
              rememberMe: credentials.remember === 'true'
            });
          }

          // Update last access
          await executeQuerySingle(
            'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
            [usuario.id]
          )

          // Retornar usuario completo (User type includes password_hash)
          return {
            ...usuario,
            rememberMe: credentials.remember === 'true',
            mfaVerified: true,
          }

        } catch (error) {
          console.error('Error en authorize:', error)

          // Si es un error controlado (estado de cuenta), lanzarlo
          if (error instanceof Error) {
            throw error
          }

          return null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt' as const,
    // maxAge will be set dynamically based on remember me flag
  },

  // Configure secure cookies with explicit flags
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
      }
    },
  },

  callbacks: {
    async jwt({ token, user, trigger, account }: { token: JWT; user?: any; trigger?: string; account?: any }) {
      // Cuando el usuario inicia sesión, agregar datos personalizados al token
      if (trigger === 'signIn' && user) {
        token.id = user.id
        token.uuid = user.uuid
        token.rol = user.rol
        token.estado = user.estado
        token.nombre = user.nombre
        token.apellidos = user.apellidos
        token.avatar_url = user.avatar_url
        token.email = user.email // Map email to JWT token

        // Set remember me flag from credentials
        if (account?.provider === 'credentials') {
          token.rememberMe = user.rememberMe || false
          token.mfaVerified = user.mfaVerified || false
          token.mfaRequired = user.mfaRequired || false
          token.mfaSessionToken = user.mfaSessionToken
          token.trustedDevice = user.trustedDevice || false
        }
      }

      // Manejar OAuth providers
      if (account && user) {
        // Guardar tokens de OAuth si es necesario
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at

        // Para OAuth, el usuario ya viene del callback
        if (!token.id && user.id) {
          token.id = user.id
          token.uuid = user.uuid
          token.rol = user.rol
          token.estado = user.estado
          token.nombre = user.nombre
          token.apellidos = user.apellidos
          token.avatar_url = user.avatar_url
          token.email = user.email // Map email for OAuth users
          token.rememberMe = false // Default for OAuth users
          token.mfaVerified = true // OAuth users are considered MFA verified
        }
      }

      // Handle OAuth token refresh
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        // Check if token is near expiry (within 5 minutes)
        if (token.expiresAt && Date.now() >= (token.expiresAt * 1000 - 5 * 60 * 1000)) {
          try {
            const refreshedTokens = await refreshOAuthToken(account.provider, token.refreshToken as string)
            if (refreshedTokens) {
              token.accessToken = refreshedTokens.access_token
              token.refreshToken = refreshedTokens.refresh_token || token.refreshToken
              token.expiresAt = refreshedTokens.expires_at || Math.floor(Date.now() / 1000) + 3600

              // Update stored tokens in database if needed
              await updateOAuthTokens(user.id, refreshedTokens)
            }
          } catch (error) {
            console.error('Error refreshing OAuth token:', error)
            // Token refresh failed, user may need to re-authenticate
            // We don't throw here to avoid breaking the session
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      if (!session.user) session.user = {} as any
      session.user.id = token.id as number
      session.user.uuid = token.uuid as string
      session.user.rol = token.rol as Usuario['rol']
      session.user.estado = token.estado as Usuario['estado']
      session.user.nombre = token.nombre as string
      session.user.apellidos = token.apellidos as string | undefined
      session.user.avatar_url = token.avatar_url as string | undefined
      session.user.email = token.email as string
      session.user.accessToken = token.accessToken as string | undefined
      session.user.refreshToken = token.refreshToken as string | undefined
      session.user.expiresAt = token.expiresAt as number | undefined
      session.user.mfaRequired = token.mfaRequired as boolean | undefined
      session.user.mfaVerified = token.mfaVerified as boolean | undefined
      session.user.mfaSessionToken = token.mfaSessionToken as string | undefined
      session.user.trustedDevice = token.trustedDevice as boolean | undefined

      // Set session expiration based on remember me flag
      if (token.rememberMe) {
        session.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      } else {
        session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }

      return session
    },

    async signIn({ user, account, profile }) {
      // Manejar inicio de sesión con OAuth
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Verificar si el usuario ya existe en la base de datos
          const existingUser = await executeQuerySingle<Usuario>(
            'SELECT id, uuid FROM usuarios WHERE email = ? AND deleted_at IS NULL',
            [user.email]
          )

          if (!existingUser) {
            // Crear nuevo usuario con datos de OAuth usando insertAndGetId
            const insertId = await insertAndGetId(`
              INSERT INTO usuarios (
                email, nombre, apellidos, avatar_url, rol, estado,
                email_verificado_at, created_at, updated_at
              ) VALUES (?, ?, ?, ?, 'usuario', 'activo', NOW(), NOW(), NOW())
            `, [
              user.email || '',
              user.name?.split(' ')[0] || '',
              user.name?.split(' ').slice(1).join(' ') || '',
              user.image || ''
            ])

            // Obtener el ID y UUID del usuario recién creado
            const newUser = await executeQuerySingle<{ id: number; uuid: string }>(
              'SELECT id, uuid FROM usuarios WHERE id = ?',
              [insertId]
            )

            // Asignar datos al usuario para el JWT
            user.id = newUser.id
            user.uuid = newUser.uuid
            user.rol = 'usuario'
            user.estado = 'activo'
          } else {
            // Actualizar datos del usuario existente con información de OAuth
            await executeQuerySingle(
              'UPDATE usuarios SET nombre = ?, apellidos = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?',
              [
                user.name?.split(' ')[0] || '',
                user.name?.split(' ').slice(1).join(' ') || '',
                user.image || '',
                existingUser.id
              ]
            )

            // Asignar datos al usuario para el JWT incluyendo UUID
            user.id = existingUser.id
            user.uuid = existingUser.uuid
            user.rol = 'usuario'
            user.estado = 'activo'
          }
        } catch (error) {
          console.error('Error en OAuth signIn:', error)
          return false // Bloquear el inicio de sesión si hay error
        }
      }

      return true // Permitir el inicio de sesión
    },

    async redirect({ url, baseUrl }) {
      // Handle MFA redirect
      if (url.includes("/mfa/verify")) {
        return url;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/login', // Usar página de login personalizada
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Guardar tokens de OAuth si es necesario
      if (account) {
        // Aquí podrías guardar los tokens en la base de datos si es necesario
        // Por ejemplo, en una tabla de tokens OAuth
        console.log('OAuth sign in event:', { provider: account.provider, userId: user.id, rememberMe: user.rememberMe || false })
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }