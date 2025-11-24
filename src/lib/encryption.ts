// Funciones de encriptación AES-256-GCM
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

// La clave debe ser de 32 bytes (256 bits)
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY no está definida en las variables de entorno')
  }
  // Asegurarse de que la clave tenga 32 bytes
  return Buffer.from(key.padEnd(32, '0').slice(0, 32), 'utf8')
}

/**
 * Encripta un texto usando AES-256-GCM
 * @param text - Texto a encriptar
 * @returns String en formato: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
  if (!text) return ''

  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Formato: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Desencripta un texto usando AES-256-GCM
 * @param encryptedData - Texto encriptado en formato: iv:authTag:encrypted
 * @returns Texto desencriptado
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return ''

  try {
    const key = getKey()
    const parts = encryptedData.split(':')

    if (parts.length !== 3) {
      throw new Error('Formato de datos encriptados inválido')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Error al desencriptar:', error)
    throw new Error('Error al desencriptar los datos')
  }
}
