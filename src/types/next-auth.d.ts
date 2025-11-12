import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

// Extender la interfaz User de NextAuth con nuestros campos personalizados
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number
    uuid: string
    rol: 'usuario' | 'propietario_negocio' | 'moderador' | 'admin'
    estado: 'activo' | 'inactivo' | 'suspendido' | 'pendiente_verificacion'
    nombre: string
    apellidos?: string
    avatar_url?: string
  }

  interface Session extends DefaultSession {
    user: User & {
      id: number
      uuid: string
      rol: string
      estado: string
      nombre: string
      apellidos?: string
      avatar_url?: string
    }
  }
}

// Extender la interfaz JWT de NextAuth con nuestros campos personalizados
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: number
    uuid: string
    rol: 'usuario' | 'propietario_negocio' | 'moderador' | 'admin'
    estado: 'activo' | 'inactivo' | 'suspendido' | 'pendiente_verificacion'
    nombre: string
    apellidos?: string
    avatar_url?: string
  }
}