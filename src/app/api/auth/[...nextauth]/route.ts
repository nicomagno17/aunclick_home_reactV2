import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { executeQuerySingle } from '@/lib/database'
import { JWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'

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
    user: Usuario & {
      id: number
      uuid: string
      rol: string
      estado: string
      nombre: string
      apellidos?: string
      avatar_url?: string
    }
  }

  interface User extends Usuario {}
}

declare module 'next-auth/jwt' {
  interface JWT extends Partial<Usuario> {}
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
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
            throw new Error('Tu cuenta está pendiente de verificación')
          }

          if (usuario.estado === 'suspendido') {
            throw new Error('Tu cuenta ha sido suspendida')
          }

          if (usuario.estado === 'inactivo') {
            throw new Error('Tu cuenta está inactiva')
          }

          if (usuario.estado !== 'activo') {
            throw new Error('Cuenta no válida')
          }

          // Validar contraseña
          const passwordValid = await bcrypt.compare(credentials.password, usuario.password_hash)
          if (!passwordValid) {
            return null // Contraseña incorrecta
          }

          // Actualizar último acceso
          await executeQuerySingle(
            'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
            [usuario.id]
          )

          // Retornar usuario sin password_hash
          const { password_hash, ...userWithoutPassword } = usuario
          return userWithoutPassword

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
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Cuando el usuario inicia sesión, agregar datos personalizados al token
      if (trigger === 'signIn' && user) {
        token.id = user.id
        token.uuid = user.uuid
        token.rol = user.rol
        token.estado = user.estado
        token.nombre = user.nombre
        token.apellidos = user.apellidos
        token.avatar_url = user.avatar_url
      }
      
      return token
    },

    async session({ session, token }) {
      // Pasar datos del token a la sesión del cliente
      if (token) {
        session.user.id = token.id
        session.user.uuid = token.uuid
        session.user.rol = token.rol
        session.user.estado = token.estado
        session.user.nombre = token.nombre
        session.user.apellidos = token.apellidos
        session.user.avatar_url = token.avatar_url
      }
      
      return session
    }
  },

  pages: {
    signIn: '/login', // Usar página de login personalizada
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export { authOptions }