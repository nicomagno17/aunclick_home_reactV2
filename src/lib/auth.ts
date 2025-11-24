// Funciones de autenticación y hashing de contraseñas
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compara una contraseña con su hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado
 * @returns true si coinciden, false si no
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
