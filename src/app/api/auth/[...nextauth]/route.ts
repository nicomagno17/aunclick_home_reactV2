import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from 'bcrypt'
import { executeQuerySingle, insertAndGetId } from '@/lib/database'
import { JWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
import { checkLoginRateLimit, recordLoginFailure, recordLoginSuccess } from '@/lib/rate-limiting'
import {
  isMFAEnabled,
  verifyMFASessionToken,
  generateMFASessionToken,
  storeMFASessionToken,
  isTrustedDevice
} from '@/lib/mfa'
import { AuthErrorException, AuthErrorCode } from '@/lib/auth-errors'
import crypto from 'crypto'
import {
  encryptOAuthToken,
  decryptOAuthToken,
  generateOAuthState,
  validateOAuthState,
  revokeOAuthToken,
  validateOAuthScopes,
  logOAuthEvent,
  recordOAuthLoginAttempt,
  updateOAuthProviderStatus,
  getOAuthEncryptionStatus,
  OAuthProvider
} from '@/lib/oauth-security'
import { checkOAuthRateLimit } from '@/lib/rate-limiting'

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

// Verify OAuth encryption key on startup
const oauthEncryptionStatus = getOAuthEncryptionStatus()
if (!oauthEncryptionStatus.valid) {
  console.error('OAuth encryption key error:', oauthEncryptionStatus.error)
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`OAuth encryption key error: ${oauthEncryptionStatus.error}`)
  } else {
    console.warn('OAuth encryption will not work properly in development without a valid key')
  }
}

/**
 * Refresh OAuth tokens for Google and Facebook with retry logic
 */
async function refreshOAuthToken(provider: OAuthProvider, refreshToken: string): Promise<any> {
  const startTime = Date.now();
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let response: Response;
      let tokenUrl: string;
      let body: URLSearchParams;
      
      if (provider === 'google') {
        tokenUrl = 'https://oauth2.googleapis.com/token';
        body = new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        });
      } else if (provider === 'facebook') {
        tokenUrl = 'https://graph.facebook.com/oauth/access_token';
        body = new URLSearchParams({
          client_id: process.env.FACEBOOK_CLIENT_ID!,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        });
      } else {
        throw new Error(`Unsupported OAuth provider: ${provider}`);
      }

      response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      // Update provider status with success
      await updateOAuthProviderStatus(provider, true, responseTime);
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      };
      
    } catch (error) {
      console.error(`OAuth refresh attempt ${attempt + 1} failed for ${provider}:`, error);
      
      // If this is the last attempt, update provider status with failure
      if (attempt === 2) {
        const responseTime = Date.now() - startTime;
        await updateOAuthProviderStatus(provider, false, responseTime, error instanceof Error ? error.message : 'Unknown error');
        return null;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < 2) {
        const backoffMs = [1000, 2000, 4000][attempt];
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }
  
  return null;
}

/**
 * Update OAuth tokens in database with encryption
 */
async function updateOAuthTokens(userId: number, tokens: any, provider: OAuthProvider, providerUserId: string): Promise<void> {
  try {
    // Encrypt tokens before storing
    const encryptedAccessToken = encryptOAuthToken(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token ? encryptOAuthToken(tokens.refresh_token) : null;
    
    // Store encrypted tokens in database
    await executeQuerySingle(
      'UPDATE usuarios SET access_token = ?, refresh_token = ?, token_expires_at = ?, oauth_provider = ? WHERE id = ?',
      [
        JSON.stringify(encryptedAccessToken),
        encryptedRefreshToken ? JSON.stringify(encryptedRefreshToken) : null,
        new Date(tokens.expires_at * 1000),
        provider,
        userId
      ]
    );
    
    // Also store in oauth_connections table for better management
    await insertAndGetId(`
      INSERT INTO oauth_connections (
        user_id, provider, provider_user_id, access_token_encrypted,
        refresh_token_encrypted, token_expires_at, is_active, last_used
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())
      ON DUPLICATE KEY UPDATE
        access_token_encrypted = VALUES(access_token_encrypted),
        refresh_token_encrypted = VALUES(refresh_token_encrypted),
        token_expires_at = VALUES(token_expires_at),
        is_active = TRUE,
        last_used = NOW(),
        updated_at = NOW()
    `, [
      userId,
      provider,
      providerUserId, // Use the actual provider user ID
      JSON.stringify(encryptedAccessToken),
      encryptedRefreshToken ? JSON.stringify(encryptedRefreshToken) : null,
      new Date(tokens.expires_at * 1000)
    ]);
  } catch (error) {
    console.error('Error updating OAuth tokens:', error);
    throw error;
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
      authorization: {
        params: {}
      }
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
          // Check rate limit for login attempts
          const rateLimitResult = await checkLoginRateLimit(credentials.email, {
            userId: undefined, // No tenemos userId aún
            ip: undefined, // Se obtiene del middleware
          });

          if (!rateLimitResult.success) {
            // Registrar evento de seguridad
            await recordLoginFailure(credentials.email, {
              reason: 'rate_limit_exceeded',
              ip: undefined,
            });
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
            // Registrar intento de login con email no existente en Redis
            await recordLoginFailure(credentials.email, {
              reason: 'user_not_found',
              ip: undefined,
            });

            // Registrar en la tabla login_attempts
            try {
              await executeQuerySingle(`
                INSERT INTO login_attempts (
                  user_id, email, login_method, success, ip_address, user_agent,
                  failure_reason, created_at
                ) VALUES (NULL, ?, 'credentials', FALSE, NULL, NULL, 'user_not_found', NOW())
              `, [credentials.email]);
            } catch (dbError) {
              console.error('Error registrando intento de login con usuario no encontrado:', dbError);
            }

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
            // Registrar intento de login con contraseña incorrecta en Redis
            await recordLoginFailure(credentials.email, {
              reason: 'invalid_password',
              userId: usuario.id,
              ip: undefined,
            });

            // Registrar en la tabla login_attempts
            try {
              await executeQuerySingle(`
                INSERT INTO login_attempts (
                  user_id, email, login_method, success, ip_address, user_agent,
                  failure_reason, created_at
                ) VALUES (?, ?, 'credentials', FALSE, NULL, NULL, 'invalid_password', NOW())
              `, [usuario.id, credentials.email]);
            } catch (dbError) {
              console.error('Error registrando intento de login fallido:', dbError);
            }

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

          // Registrar login exitoso en Redis
          await recordLoginSuccess(credentials.email, {
            userId: usuario.id,
            method: 'credentials',
            ip: undefined,
          });

          // Registrar en la tabla login_attempts
          try {
            await executeQuerySingle(`
              INSERT INTO login_attempts (
                user_id, email, login_method, success, ip_address, user_agent, created_at
              ) VALUES (?, ?, 'credentials', TRUE, NULL, NULL, NOW())
            `, [usuario.id, credentials.email]);
          } catch (dbError) {
            console.error('Error registrando intento de login exitoso:', dbError);
          }

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

      // Handle OAuth token refresh - moved outside account dependency
      if (token.refreshToken && token.expiresAt) {
        const marginMinutes = parseInt(process.env.OAUTH_REFRESH_MARGIN_MINUTES || '5');
        
        // Check if token is near expiry
        if (Date.now() >= (token.expiresAt * 1000 - marginMinutes * 60 * 1000)) {
          try {
            // Determine provider from token or account
            const provider = (account?.provider as OAuthProvider) || 
                           (token as any).provider || 
                           'google'; // Default fallback
            
            const refreshedTokens = await refreshOAuthToken(provider, token.refreshToken);
            if (refreshedTokens) {
              token.accessToken = refreshedTokens.access_token;
              token.refreshToken = refreshedTokens.refresh_token || token.refreshToken;
              token.expiresAt = refreshedTokens.expires_at || Math.floor(Date.now() / 1000) + 3600;
              
              // Store provider in token for future refreshes
              (token as any).provider = provider;

              // Get provider user ID from database for this user and provider
              const oauthConnection = await executeQuerySingle<{ provider_user_id: string }>(
                'SELECT provider_user_id FROM oauth_connections WHERE user_id = ? AND provider = ? AND is_active = TRUE',
                [token.id, provider]
              );
              
              const providerUserId = oauthConnection?.provider_user_id || '';

              // Update stored tokens in database
              await updateOAuthTokens(token.id, refreshedTokens, provider, providerUserId)
            } else {
              // Refresh failed completely, try to revoke the token
              await revokeOAuthToken(provider, token.refreshToken);
              
              // Log the revocation
              await logOAuthEvent(token.id, 'oauth_unlinked', provider, {
                reason: 'token_refresh_failed'
              });
            }
          } catch (error) {
            console.error('Error refreshing OAuth token:', error)
            // Token refresh failed, user may need to re-authenticate
            // We don't throw here to avoid breaking the session
          }
        }
      }
      
      // Store provider in token when account is available (during initial sign-in)
      if (account && (account.provider === 'google' || account.provider === 'facebook')) {
        (token as any).provider = account.provider;
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

    async signIn({ user, account, profile, credentials }) {
      // Manejar inicio de sesión con OAuth
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const provider = account.provider as OAuthProvider;
        const startTime = Date.now();
        
        try {
        // Note: OAuth state validation would ideally happen in the callback
        // For now, we'll skip state validation here as NextAuth handles it internally
        // In a production environment, you might want to implement custom state handling
          
          // Check OAuth-specific rate limit
          const rateLimitResult = await checkOAuthRateLimit(user.email || '', {
            ip: undefined, // Will be set by middleware
            userId: undefined, // Not available yet
            provider: provider
          });

          if (!rateLimitResult.success) {
            // Record OAuth login attempt with rate limit failure
            await recordOAuthLoginAttempt(
              null,
              user.email || '',
              provider,
              false,
              undefined,
              undefined,
              'rate_limit_exceeded'
            );
            return false; // Block login due to rate limit
          }
          
          // Validate OAuth scopes
          if (profile && account.scope) {
            const receivedScopes = account.scope.split(' ');
            if (!validateOAuthScopes(receivedScopes, provider)) {
              console.error('Invalid OAuth scopes for', provider);
              await recordOAuthLoginAttempt(
                null,
                user.email || '',
                provider,
                false,
                undefined,
                undefined,
                'invalid_scopes'
              );
              return false;
            }
          }
          
          // Extract provider user ID from profile
          const providerUserId = profile?.sub || (profile as any)?.id || '';
          
          // Verificar si el usuario ya existe en la base de datos
          const existingUser = await executeQuerySingle<Usuario>(
            'SELECT id, uuid, email FROM usuarios WHERE email = ? AND deleted_at IS NULL',
            [user.email]
          )

          if (!existingUser) {
            // Crear nuevo usuario con datos de OAuth usando insertAndGetId
            const insertId = await insertAndGetId(`
              INSERT INTO usuarios (
                email, nombre, apellidos, avatar_url, rol, estado,
                email_verificado_at, oauth_provider, oauth_provider_id,
                ultimo_login_ip, ultimo_login_user_agent, created_at, updated_at
              ) VALUES (?, ?, ?, ?, 'usuario', 'activo', NOW(), ?, ?, INET6_ATON(?), ?, NOW(), NOW())
            `, [
              user.email || '',
              user.name?.split(' ')[0] || '',
              user.name?.split(' ').slice(1).join(' ') || '',
              user.image || '',
              provider,
              providerUserId,
              '', // IP address will be set by middleware
              '', // User agent will be set by middleware
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
            
            // Log OAuth linking event
            await logOAuthEvent(newUser.id, 'oauth_linked', provider, {
              providerUserId,
              isNewUser: true
            });
            
            // Record successful login attempt
            await recordOAuthLoginAttempt(newUser.id, user.email || '', provider, true);
            
          } else {
            // Actualizar datos del usuario existente con información de OAuth
            await executeQuerySingle(
              'UPDATE usuarios SET nombre = ?, apellidos = ?, avatar_url = ?, oauth_provider = ?, oauth_provider_id = ?, ultimo_login_ip = INET6_ATON(?), ultimo_login_user_agent = ?, updated_at = NOW() WHERE id = ?',
              [
                user.name?.split(' ')[0] || '',
                user.name?.split(' ').slice(1).join(' ') || '',
                user.image || '',
                provider,
                providerUserId,
                '', // IP address will be set by middleware
                '', // User agent will be set by middleware
                existingUser.id
              ]
            )

            // Asignar datos al usuario para el JWT incluyendo UUID
            user.id = existingUser.id
            user.uuid = existingUser.uuid
            user.rol = 'usuario'
            user.estado = 'activo'
            
            // Log OAuth linking event
            await logOAuthEvent(existingUser.id, 'oauth_linked', provider, {
              providerUserId,
              isNewUser: false
            });
            
            // Record successful login attempt
            await recordOAuthLoginAttempt(existingUser.id, user.email || '', provider, true);
          }
          
          // Update provider status with success
          const responseTime = Date.now() - startTime;
          await updateOAuthProviderStatus(provider, true, responseTime);
          
        } catch (error) {
          console.error('Error en OAuth signIn:', error);
          
          // Update provider status with failure
          const responseTime = Date.now() - startTime;
          await updateOAuthProviderStatus(provider, false, responseTime, error instanceof Error ? error.message : 'Unknown error');
          
          // Record failed login attempt
          await recordOAuthLoginAttempt(
            null,
            user.email || '',
            provider,
            false,
            undefined,
            undefined,
            'system_error'
          );
          
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
      if (account && (account.provider === 'google' || account.provider === 'facebook')) {
        try {
          const provider = account.provider as OAuthProvider;
          
          // Extract provider user ID from profile
          const providerUserId = profile?.sub || (profile as any)?.id || '';
          
          // Store OAuth tokens securely
          if (account.access_token) {
            const tokens = {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at
            };
            
            await updateOAuthTokens(user.id, tokens, provider, providerUserId);
          }
          
          console.log('OAuth sign in event:', {
            provider: account.provider,
            userId: user.id,
            providerUserId,
            rememberMe: user.rememberMe || false,
            isNewUser
          });
        } catch (error) {
          console.error('Error storing OAuth tokens in signIn event:', error);
          // Don't throw here to avoid breaking the sign-in flow
        }
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }