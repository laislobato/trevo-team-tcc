/**
 * SERVIÇO: senhas
 * ===============
 * A senha nunca é guardada como texto. Guardamos um "hash" feito com scrypt
 * (função do próprio Node, feita para ser lenta e difícil de quebrar),
 * junto com um "sal" aleatório diferente para cada senha.
 *
 * Formato guardado no banco:  scrypt$<sal em hex>$<hash em hex>
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const KEY_LENGTH = 64

export function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LENGTH)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

export function verifyPassword(password, stored) {
  const [method, saltHex, hashHex] = String(stored).split('$')
  if (method !== 'scrypt' || !saltHex || !hashHex) return false

  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  // Comparação em tempo constante (não revela onde a senha errou)
  return timingSafeEqual(expected, actual)
}
